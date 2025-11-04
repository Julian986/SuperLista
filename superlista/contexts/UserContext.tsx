import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { registerForPushNotificationsAsync, saveNotificationToken, scheduleLocalNotification } from '../lib/notifications';

interface User {
  id: string;
  name: string;
  isLoggedIn: boolean;
  image?: string;
}

interface UserContextType {
  user: User;
  login: (name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, image?: string) => Promise<void>;
  isLoading: boolean;
  rememberUser: boolean;
  setRememberUser: (remember: boolean) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>({ id: '', name: '', isLoggedIn: false, image: undefined });
  const [isLoading, setIsLoading] = useState(true);
  const [rememberUser, setRememberUser] = useState(true);

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    loadUser();
  }, []);

  // Función de debug para verificar AsyncStorage
  const debugAsyncStorage = async () => {
    try {
      console.log('🔍 DEBUG: Checking AsyncStorage...');
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('📋 All AsyncStorage keys:', allKeys);
      
      for (const key of allKeys) {
        const value = await AsyncStorage.getItem(key);
        console.log(`📝 ${key}:`, value);
      }
    } catch (error) {
      console.error('❌ Debug error:', error);
    }
  };

  // Ejecutar debug al cargar
  useEffect(() => {
    debugAsyncStorage();
  }, []);

  // Registrar para notificaciones push
  const registerNotifications = async (userId: string) => {
    try {
      console.log('🔔 Registering for push notifications...');
      const token = await registerForPushNotificationsAsync();
      
      if (token) {
        console.log('✅ Push token obtained:', token);
        const success = await saveNotificationToken(userId, token);
        if (success) {
          console.log('✅ Notification token saved successfully');
        } else {
          console.log('⚠️ Could not save notification token');
        }
        // Notificación local de prueba para confirmar permisos OK
        await scheduleLocalNotification('🔔 Notificaciones activadas', 'Todo listo. Recibirás avisos cuando otros agreguen o compren productos.');
      } else {
        console.log('⚠️ Could not get push token');
        // Aunque no haya token (p.ej. simulador), intentamos mostrar una local para validar permisos
        await scheduleLocalNotification('🔔 Prueba de notificaciones', 'Si ves este mensaje, los permisos locales funcionan.');
      }
    } catch (error) {
      console.error('❌ Error registering notifications:', error);
    }
  };

  const loadUser = async () => {
    try {
      console.log('🔍 Loading user data...');
      
      // Verificar si el usuario quiere ser recordado
      const shouldRemember = await AsyncStorage.getItem('rememberUser');
      console.log('📝 Remember user value:', shouldRemember);
      
      const rememberValue = shouldRemember !== null ? shouldRemember === 'true' : true; // Por defecto true
      setRememberUser(rememberValue);
      console.log('✅ Remember user set to:', rememberValue);

      if (rememberValue) {
        const savedUser = await AsyncStorage.getItem('user');
        console.log('👤 Saved user data:', savedUser);
        
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            console.log('✅ Parsed user data:', userData);
            
            // Verificar que los datos sean válidos
            if (userData.id && userData.name && typeof userData.isLoggedIn === 'boolean') {
              console.log('🔧 Setting user state with:', userData);
              setUser({
                id: userData.id,
                name: userData.name,
                isLoggedIn: userData.isLoggedIn,
                image: userData.image || undefined
              });
              console.log('🎉 User loaded successfully:', userData.name);
              
              // Registrar notificaciones para el usuario
              registerNotifications(userData.id);
            } else {
              console.warn('⚠️ Invalid user data structure, clearing...');
              await AsyncStorage.removeItem('user');
            }
          } catch (parseError) {
            console.error('❌ Error parsing user data:', parseError);
            await AsyncStorage.removeItem('user');
          }
        } else {
          console.log('ℹ️ No saved user found');
        }
      } else {
        console.log('ℹ️ User chose not to be remembered');
      }
    } catch (error) {
      console.error('❌ Error loading user:', error);
    } finally {
      setIsLoading(false);
      console.log('🏁 Loading completed - isLoading set to false');
    }
  };

  const login = async (name: string) => {
    try {
      // Buscar o crear usuario en Supabase
      let { data: existingUser, error: searchError } = await supabase
        .from('users')
        .select('*')
        .eq('name', name.trim())
        .single();

      if (searchError && searchError.code !== 'PGRST116') {
        throw searchError;
      }

      let userId: string;
      
      if (existingUser) {
        // Usuario existe, usar su ID
        userId = existingUser.id;
      } else {
        // Crear nuevo usuario
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({ name: name.trim() })
          .select()
          .single();

        if (insertError) throw insertError;
        userId = newUser.id;
      }

      const userData = { 
        id: userId, 
        name: name.trim(), 
        isLoggedIn: true,
        image: undefined
      };

      // Guardar solo si el usuario quiere ser recordado
      if (rememberUser) {
        console.log('💾 Saving user data:', userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        console.log('✅ User data saved successfully');
      } else {
        console.log('ℹ️ User chose not to be remembered, not saving');
      }
      
      setUser(userData);
      console.log('🎉 User logged in:', userData.name);
      
      // Registrar notificaciones para el usuario
      registerNotifications(userId);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!rememberUser) {
        await AsyncStorage.removeItem('user');
      }
      setUser({ id: '', name: '', isLoggedIn: false, image: undefined });
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  const updateProfile = async (name: string, image?: string) => {
    try {
      console.log('🔄 Updating profile for user:', user.id);
      
      // Actualizar en Supabase
      const { error } = await supabase
        .from('users')
        .update({ name: name.trim() })
        .eq('id', user.id);

      if (error) throw error;

      // Actualizar estado local
      const updatedUser = {
        ...user,
        name: name.trim(),
        image: image
      };
      
      setUser(updatedUser);
      console.log('✅ Profile updated successfully');

      // Guardar en AsyncStorage si el usuario quiere ser recordado
      if (rememberUser) {
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('💾 Updated user data saved to AsyncStorage');
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      throw error;
    }
  };

  const handleSetRememberUser = async (remember: boolean) => {
    try {
      console.log('🔄 Setting remember user to:', remember);
      setRememberUser(remember);
      await AsyncStorage.setItem('rememberUser', remember.toString());
      console.log('✅ Remember user preference saved');
      
      // Si se desactiva recordar usuario, eliminar datos guardados
      if (!remember) {
        console.log('🗑️ Removing saved user data');
        await AsyncStorage.removeItem('user');
        console.log('✅ User data removed');
      }
    } catch (error) {
      console.error('❌ Error saving remember user preference:', error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateProfile,
      isLoading, 
      rememberUser, 
      setRememberUser: handleSetRememberUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
