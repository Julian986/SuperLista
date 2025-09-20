import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import { useUserStats } from '../../hooks/useUserStats';
import { EditProfileModal } from '../../components/EditProfileModal';

const { width, height } = Dimensions.get('window');

export default function PerfilScreen() {
  const { user, updateProfile } = useUser();
  const { stats: userStats, isLoading, refreshStats } = useUserStats(user.id, user.name);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  // Obtener estadísticas reales del usuario
  const completionRate = userStats.completionRate;

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async (newName: string, newImage?: string) => {
    try {
      await updateProfile(newName, newImage);
      // Refrescar estadísticas después de actualizar el perfil
      await refreshStats();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

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
            <Ionicons name="person" size={28} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Mi Perfil</Text>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Contenido Principal */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            // Estado de carga
            <View style={styles.loadingState}>
              <Ionicons name="sync" size={64} color="#4CAF50" />
              <Text style={styles.loadingTitle}>Cargando estadísticas...</Text>
              <Text style={styles.loadingSubtitle}>
                Obteniendo datos de tus compras
              </Text>
            </View>
          ) : (
            <>
              {/* Información del Usuario */}
              <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {user.image ? (
                <Image source={{ uri: user.image }} style={styles.avatarImage} />
              ) : (
                <LinearGradient
                  colors={['#00E0FF', '#E000FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarText}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </LinearGradient>
              )}
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.userName}>{user.name}</Text>
            
            <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
              <Ionicons name="create" size={16} color="#4CAF50" />
              <Text style={styles.editProfileText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>

          {/* Gráfico Circular Principal */}
          <View style={styles.chartSection}>
            <View style={styles.chartContainer}>
              {/* Gráfico Circular Gigante */}
              <View style={styles.megaCircularChart}>
                {/* Círculo de fondo */}
                <View style={styles.megaChartBackground}>
                  {/* Progreso principal */}
                  <View style={[styles.megaChartProgress, { 
                    transform: [{ rotate: `${(completionRate / 100) * 360}deg` }] 
                  }]} />
                  
                  {/* Progreso secundario (más sutil) */}
                  <View style={[styles.megaChartSecondary, { 
                    transform: [{ rotate: `${((completionRate + 20) / 100) * 360}deg` }] 
                  }]} />
                </View>
                
                {/* Contenido central */}
                <View style={styles.megaChartInner}>
                  <Text style={styles.megaChartPercentage}>{completionRate}%</Text>
                  <Text style={styles.megaChartLabel}>Completado</Text>
                  <View style={styles.megaChartStats}>
                    <Text style={styles.megaChartNumber}>{userStats.completedItems}</Text>
                    <Text style={styles.megaChartSlash}>/</Text>
                    <Text style={styles.megaChartTotal}>{userStats.totalItems}</Text>
                  </View>
                </View>
                
                {/* Partículas decorativas */}
                <View style={styles.chartParticle1}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                </View>
                <View style={styles.chartParticle2}>
                  <Ionicons name="star" size={8} color="#FF6B6B" />
                </View>
                <View style={styles.chartParticle3}>
                  <Ionicons name="star" size={10} color="#4ECDC4" />
                </View>
                <View style={styles.chartParticle4}>
                  <Ionicons name="star" size={6} color="#45B7D1" />
                </View>
              </View>
              
              {/* Información adicional */}
              <View style={styles.chartInfo}>
                <Text style={styles.chartTitle}></Text>
                <Text style={styles.chartSubtitle}>
                  {userStats.completedItems} items completados de {userStats.totalItems} total
                </Text>
              </View>
            </View>
          </View>

            {/* Tarjetas de Estadísticas */}
            <View style={styles.statsGrid}>
              {/* Items Completados */}
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.statNumber}>{userStats.completedItems}</Text>
                <Text style={styles.statLabel}>Mis Compras</Text>
              </View>

              {/* Items Pendientes */}
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="time" size={24} color="#FF9800" />
                </View>
                <Text style={styles.statNumber}>{userStats.pendingItems}</Text>
                <Text style={styles.statLabel}>Mis Pedidos</Text>
              </View>

            </View>

            </>
          )}

        </ScrollView>

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
            
            <TouchableOpacity 
              style={styles.navItem} 
              activeOpacity={0.7}
              onPress={() => router.push('/explore')}
            >
              <Ionicons name="list" size={24} color="#9E9E9E" />
              <Text style={styles.navLabel}>Mis Listas</Text>
            </TouchableOpacity>
            
            <View style={styles.navItem}>
              <Ionicons name="person" size={24} color="#4CAF50" />
              <Text style={[styles.navLabel, styles.navLabelActive]}>Perfil</Text>
            </View>
          </View>
        </SafeAreaView>
        
        {/* Modal de Edición de Perfil */}
        <EditProfileModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          currentName={user.name}
          currentImage={user.image}
          onSave={handleSaveProfile}
        />
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
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  settingsButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // ===== SECCIÓN DE PERFIL =====
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 20,
  },
  userEmail: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 20,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 6,
  },

  // ===== DASHBOARD =====
  dashboardSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  mainStatsCard: {
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mainStatsGradient: {
    borderRadius: 16,
    padding: 20,
  },
  mainStatsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainStatsLeft: {
    flex: 1,
  },
  mainStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  mainStatsSubtitle: {
    fontSize: 14,
    color: '#E8F5E8',
  },
  mainStatsRight: {
    alignItems: 'flex-end',
  },
  mainStatsPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  mainStatsProgress: {
    width: 80,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  mainStatsProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  
  // ===== GRÁFICO CIRCULAR GIGANTE =====
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  megaCircularChart: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  megaChartBackground: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 20,
    borderColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  megaChartProgress: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 20,
    borderColor: '#4CAF50',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  megaChartSecondary: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 20,
    borderColor: '#E8F5E8',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  megaChartInner: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F8F9FA',
  },
  megaChartPercentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  megaChartLabel: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
    marginBottom: 8,
  },
  megaChartStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  megaChartNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  megaChartSlash: {
    fontSize: 16,
    color: '#BDBDBD',
    marginHorizontal: 4,
  },
  megaChartTotal: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
  },
  chartInfo: {
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
    textAlign: 'center',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Partículas decorativas
  chartParticle1: {
    position: 'absolute',
    top: 20,
    right: 30,
    transform: [{ rotate: '15deg' }],
  },
  chartParticle2: {
    position: 'absolute',
    top: 60,
    left: 20,
    transform: [{ rotate: '-20deg' }],
  },
  chartParticle3: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    transform: [{ rotate: '45deg' }],
  },
  chartParticle4: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    transform: [{ rotate: '-30deg' }],
  },
  
  // ===== GRÁFICO CIRCULAR ANTERIOR (MANTENER PARA COMPATIBILIDAD) =====
  circularChart: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularChartBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circularChartProgress: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  circularChartInner: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularChartPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  // ===== GRID DE ESTADÍSTICAS =====
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    width: (width - 80) / 2,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },

  // ===== LOGROS =====
  achievementsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  achievementUnlocked: {
    opacity: 1,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },

  // ===== CONFIGURACIÓN =====
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#212121',
    marginLeft: 16,
    fontWeight: '500',
  },

  // ===== NAVEGACIÓN INFERIOR =====
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
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 16,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
  },
});
