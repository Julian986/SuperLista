import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUser } from '../contexts/UserContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const { login, rememberUser, setRememberUser } = useUser();

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre de usuario');
      return;
    }

    if (username.trim().length < 2) {
      Alert.alert('Error', 'El nombre debe tener al menos 2 caracteres');
      return;
    }

    try {
      await login(username.trim());
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor. Intenta nuevamente.');
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
        
        {/* Header con gradiente */}
        <LinearGradient
          colors={['#4CAF50', '#45a049']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Ionicons name="cart" size={32} color="#FFFFFF" />
            <Text style={styles.headerTitle}>SuperLista</Text>
          </View>
        </LinearGradient>

        {/* Contenido Principal */}
        <View style={styles.content}>
          {/* Mensaje de Bienvenida */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>¡Bienvenido a SuperLista!</Text>
            <Text style={styles.welcomeSubtitle}>
              Tu aplicación para gestionar las compras familiares
            </Text>
          </View>

          {/* Formulario de Login */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre de Usuario</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nombre de usuario"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            {/* Opción de Recordar Usuario */}
            <View style={styles.rememberContainer}>
              <View style={styles.rememberContent}>
                <Ionicons name="person-circle-outline" size={20} color="#4CAF50" />
                <Text style={styles.rememberText}>Recordar mi usuario</Text>
              </View>
              <Switch
                value={rememberUser}
                onValueChange={setRememberUser}
                trackColor={{ false: '#E0E0E0', true: '#E8F5E8' }}
                thumbColor={rememberUser ? '#4CAF50' : '#FFFFFF'}
              />
            </View>

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginButtonGradient}
              >
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                <Text style={styles.loginButtonText}>Ingresar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Información adicional */}
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              Comienza a crear y gestionar tus listas de compras
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formSection: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
    marginLeft: 4,
    display: 'none',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  rememberContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    fontSize: 16,
    color: '#424242',
    marginLeft: 8,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  infoSection: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    lineHeight: 20,
  },
});
