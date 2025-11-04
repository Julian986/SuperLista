import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function MisListasScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
        
        {/* Header */}
        <LinearGradient
          colors={['#4CAF50', '#45a049']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Ionicons name="list" size={28} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Mis Listas</Text>
            <View style={styles.headerSpacer} />
          </View>
        </LinearGradient>

        {/* Contenido Principal */}
        <View style={styles.content}>
          {/* Elemento Central Misterioso */}
          <View style={styles.mysteryContainer}>
            {/* Círculo Principal con Efecto de Pulso */}
            <View style={styles.pulseContainer}>
              <View style={styles.pulseRing1} />
              <View style={styles.pulseRing2} />
              <View style={styles.pulseRing3} />
              <LinearGradient
                colors={['#00E0FF', '#E000FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mysteryIcon}
              >
                <Ionicons name="lock-closed" size={40} color="#FFFFFF" />
              </LinearGradient>
            </View>

            {/* Partículas Flotantes Sutiles */}
            <View style={styles.floatingParticle1}>
              <Ionicons name="ellipse" size={4} color="#00E0FF" />
            </View>
            <View style={styles.floatingParticle2}>
              <Ionicons name="ellipse" size={3} color="#E000FF" />
            </View>
            <View style={styles.floatingParticle3}>
              <Ionicons name="ellipse" size={5} color="#00E0FF" />
            </View>
            <View style={styles.floatingParticle4}>
              <Ionicons name="ellipse" size={2} color="#E000FF" />
            </View>
            <View style={styles.floatingParticle5}>
              <Ionicons name="ellipse" size={3} color="#00E0FF" />
            </View>
          </View>

          {/* Texto Misterioso */}
          <View style={styles.mysteryTextContainer}>
            <Text style={styles.mysteryTitle}>Algo increíble</Text>
            <Text style={styles.mysteryTitle}>está por llegara...</Text>
            
            <View style={styles.mysterySubtitleContainer}>
              <Text style={styles.mysterySubtitle}>
                Pronto descubrirás
              </Text>
              <Text style={styles.mysterySubtitle}>
                nuevas posibilidades
              </Text>
            </View>
          </View>

          {/* Indicador de Carga Misterioso */}
          <View style={styles.loadingIndicator}>
            <View style={styles.loadingDot1} />
            <View style={styles.loadingDot2} />
            <View style={styles.loadingDot3} />
          </View>

          {/* Mensaje Final Suspensivo */}
          <View style={styles.suspenseContainer}>
            <Text style={styles.suspenseText}>
              Mantente atento...
            </Text>
          </View>
        </View>

        {/* Barra Inferior de Navegación */}
        <SafeAreaView edges={['bottom']} style={styles.bottomNavWrapper}>
          <View style={styles.bottomNavigation}>
            <TouchableOpacity 
              style={styles.navItem} 
              activeOpacity={0.7}
              onPress={() => router.push('/')}
            >
              <Ionicons name="home" size={24} color="#9E9E9E" />
              <Text style={styles.navLabel}>Inicio</Text>
            </TouchableOpacity>
            
            <View style={styles.navItem}>
              <Ionicons name="list" size={24} color="#4CAF50" />
              <Text style={[styles.navLabel, styles.navLabelActive]}>Mis Listas</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.navItem} 
              activeOpacity={0.7}
              onPress={() => router.push('/profile')}
            >
              <Ionicons name="person" size={24} color="#9E9E9E" />
              <Text style={styles.navLabel}>Perfil</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // ===== CONTENEDOR MISTERIOSO =====
  mysteryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    position: 'relative',
  },
  
  // ===== EFECTO DE PULSO =====
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseRing1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(0, 224, 255, 0.1)',
  },
  pulseRing2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(224, 0, 255, 0.15)',
  },
  pulseRing3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(0, 224, 255, 0.2)',
  },
  mysteryIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#00E0FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  
  // ===== PARTÍCULAS FLOTANTES =====
  floatingParticle1: {
    position: 'absolute',
    top: 30,
    right: 50,
    opacity: 0.6,
  },
  floatingParticle2: {
    position: 'absolute',
    top: 80,
    left: 40,
    opacity: 0.4,
  },
  floatingParticle3: {
    position: 'absolute',
    bottom: 60,
    right: 30,
    opacity: 0.7,
  },
  floatingParticle4: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    opacity: 0.5,
  },
  floatingParticle5: {
    position: 'absolute',
    top: 50,
    left: 20,
    opacity: 0.3,
  },
  
  // ===== TEXTO MISTERIOSO =====
  mysteryTextContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  mysteryTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#212121',
    textAlign: 'center',
    opacity: 0.8,
    letterSpacing: 1,
  },
  mysterySubtitleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  mysterySubtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    opacity: 0.6,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  
  // ===== INDICADOR DE CARGA =====
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  loadingDot1: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E0FF',
    marginHorizontal: 4,
    opacity: 0.7,
  },
  loadingDot2: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E000FF',
    marginHorizontal: 4,
    opacity: 0.5,
  },
  loadingDot3: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E0FF',
    marginHorizontal: 4,
    opacity: 0.3,
  },
  
  // ===== MENSAJE SUSPENSIVO =====
  suspenseContainer: {
    alignItems: 'center',
  },
  suspenseText: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    opacity: 0.5,
    fontWeight: '300',
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  bottomNavWrapper: {
    backgroundColor: '#FFFFFF',
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});