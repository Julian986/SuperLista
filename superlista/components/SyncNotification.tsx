import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SyncNotificationProps {
  lastSync: Date | null;
  isVisible: boolean;
}

export const SyncNotification: React.FC<SyncNotificationProps> = ({ 
  lastSync, 
  isVisible 
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Ocultar después de 3 segundos
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 3000);
    }
  }, [isVisible, fadeAnim]);

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) {
      return 'Ahora';
    } else if (diffSeconds < 3600) {
      return `Hace ${Math.floor(diffSeconds / 60)}m`;
    } else {
      return `Hace ${Math.floor(diffSeconds / 3600)}h`;
    }
  };

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Ionicons name="sync" size={16} color="#4CAF50" />
      <Text style={styles.text}>
        {lastSync ? `Sincronizado ${formatLastSync(lastSync)}` : 'Sincronizando...'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});
