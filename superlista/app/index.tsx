import { useEffect } from 'react';
import { router } from 'expo-router';
import { useUser } from '../contexts/UserContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function InitialRedirect() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    console.log('🔄 InitialRedirect - useEffect triggered');
    console.log('📊 Current state:', { isLoading, user: user.name, isLoggedIn: user.isLoggedIn });
    
    if (!isLoading) {
      // Pequeño delay para asegurar que el estado se haya actualizado completamente
      const redirectTimer = setTimeout(() => {
        console.log('⏰ Redirect timer triggered');
        console.log('📊 Final state check:', { isLoading, user: user.name, isLoggedIn: user.isLoggedIn });
        
        if (user.isLoggedIn) {
          console.log('✅ User is logged in, redirecting to main app');
          console.log('🚀 Calling router.replace("/(tabs)")');
          router.replace('/(tabs)');
          console.log('✅ router.replace called successfully');
        } else {
          console.log('❌ User is not logged in, redirecting to login');
          console.log('🚀 Calling router.replace("/login")');
          router.replace('/login');
          console.log('✅ router.replace called successfully');
        }
      }, 100); // 100ms delay
      
      return () => clearTimeout(redirectTimer);
    } else {
      console.log('⏳ Still loading user data...');
    }
  }, [user.isLoggedIn, isLoading]);

  console.log('🎯 InitialRedirect render:', { isLoading, user: user.name, isLoggedIn: user.isLoggedIn });

  if (isLoading) {
    console.log('🔄 Showing loading screen');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  console.log('🚀 Loading completed, should redirect now');
  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
});
