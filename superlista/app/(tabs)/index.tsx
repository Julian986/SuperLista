import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

// Componentes personalizados
import { SupermarketItemCard } from '../../components/SupermarketItemCard';
import { AddItemModal } from '../../components/AddItemModal';
import { ItemDetailModal } from '../../components/ItemDetailModal';
import { ListDivider } from '../../components/ListDivider';
import { SimpleConfetti } from '../../components/SimpleConfetti';

// Hook personalizado
import { useSharedLists } from '../../hooks/useSharedLists';
import { useUser } from '../../contexts/UserContext';
import { useStatsRefresh } from '../../contexts/StatsContext';

// Tipos
import { AddItemFormData, SupermarketItem } from '../../types';

// ===== COMPONENTE PRINCIPAL =====
export default function SuperListaHome() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SupermarketItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragData, setDragData] = useState<any[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Hook del usuario
  const { user } = useUser();
  const { triggerRefresh } = useStatsRefresh();
  
  // Hook personalizado para manejar la lista compartida
  const {
    items,
    isLoading,
    addItem,
    editItem,
    deleteItem,
    toggleItemChecked,
    formatDateTime,
    getOrganizedItems,
    refreshItems,
  } = useSharedLists(user.id, user.name);

  // Función para manejar agregar nuevo item
  const handleAddNewItem = () => {
    setIsAddModalVisible(true);
  };

  // Función para manejar el cierre del modal
  const handleCloseModal = () => {
    setIsAddModalVisible(false);
  };

  // Función para manejar la adición de un item
  const handleAddItem = (formData: AddItemFormData) => {
    addItem(formData);
  };

  // Función para manejar el click en un item
  const handleItemPress = (item: SupermarketItem) => {
    setSelectedItem(item);
    setIsDetailModalVisible(true);
  };

  // Función para cerrar el modal de detalles
  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedItem(null);
  };

  // Función para marcar como comprado
  const handleMarkAsBought = (itemId: string) => {
    toggleItemChecked(itemId);
    setShowConfetti(true);
    // Cerrar modal instantáneamente
    setIsDetailModalVisible(false);
    setSelectedItem(null);
    // Disparar refresh de estadísticas
    triggerRefresh();
  };

  // Función para manejar el fin del confetti
  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  // Función para modificar un item
  const handleModifyItem = (item: SupermarketItem) => {
    setSelectedItem(item);
    setIsDetailModalVisible(false);
    setIsEditModalVisible(true);
  };

  // Función para cerrar el modal de edición
  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedItem(null);
  };

  // Función para manejar la edición de un item
  const handleEditItem = (itemId: string, formData: AddItemFormData) => {
    editItem(itemId, formData);
    handleCloseEditModal();
  };

  // Función para eliminar un item desde el modal de detalles
  const handleDeleteFromModal = (itemId: string, itemName: string) => {
    deleteItem(itemId);
    handleCloseDetailModal();
  };

  // ===== RENDERIZADO DE CADA ITEM =====
  const renderItem = ({ item, drag, isActive }: RenderItemParams<SupermarketItem>) => {
    return (
      <SupermarketItemCard
        item={item}
        formatDateTime={formatDateTime}
        onToggleChecked={toggleItemChecked}
        onDelete={handleDeleteFromModal}
        onItemPress={handleItemPress}
        onDrag={drag}
        isActive={isActive}
      />
    );
  };

  // ===== RENDERIZADO DE LA LISTA ORGANIZADA =====
  const getOrganizedData = () => {
    // Si estamos arrastrando, usar los datos del drag para evitar reorganización
    if (isDragging && dragData.length > 0) {
      return dragData;
    }
    
    const { uncheckedItems, checkedItems } = getOrganizedItems();
    const data: any[] = [];
    
    // Agregar items no comprados
    uncheckedItems.forEach(item => {
      data.push({ type: 'item', data: item });
    });
    
    // Agregar divider si hay items comprados
    if (checkedItems.length > 0 && uncheckedItems.length > 0) {
      data.push({ type: 'divider', data: { text: 'Comprado' } });
    }
    
    // Agregar items comprados
    checkedItems.forEach(item => {
      data.push({ type: 'item', data: item });
    });
    
    return data;
  };

  const renderOrganizedItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
    if (item.type === 'divider') {
      return <ListDivider text={item.data.text} />;
    }
    
    return (
      <SupermarketItemCard
        item={item.data}
        formatDateTime={formatDateTime}
        onToggleChecked={toggleItemChecked}
        onDelete={handleDeleteFromModal}
        onItemPress={handleItemPress}
        onDrag={drag}
        isActive={isActive}
      />
    );
  };

  // ===== RENDER PRINCIPAL =====
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
          <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
          
          <View style={styles.mainContainer}>
                    {/* ===== HEADER ===== */}
                    <View style={styles.header}>
                      <Ionicons name="cart" size={28} color="#FFFFFF" />
                      <Text style={styles.headerTitle}>SuperLista</Text>
                      <TouchableOpacity 
                        style={styles.refreshButton}
                        onPress={() => {
                          // Recargar datos manualmente
                          if (refreshItems) refreshItems();
                        }}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="refresh" size={24} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>

                    {/* Marcador visual para confirmar EAS Update */}
                    <View style={styles.updateMarkerBar} />

                    {/* ===== CONTENIDO PRINCIPAL ===== */}
                    <View style={styles.content}>
                      {isLoading ? (
                        // Estado de carga
                        <View style={styles.loadingState}>
                          <Ionicons name="sync" size={64} color="#4CAF50" />
                          <Text style={styles.loadingTitle}>Conectando...</Text>
                          <Text style={styles.loadingSubtitle}>
                            Sincronizando con la base de datos
                          </Text>
                        </View>
                      ) : items.length === 0 ? (
                        // Estado vacío
                        <View style={styles.emptyState}>
                          <Ionicons name="basket-outline" size={64} color="#BDBDBD" />
                          <Text style={styles.emptyTitle}>Lista vacía</Text>
                          <Text style={styles.emptySubtitle}>
                            Agrega tu primer item presionando el botón +
                          </Text>
                        </View>
                      ) : (
                        // Lista organizada con separación visual y drag & drop
                        <DraggableFlatList
                          data={getOrganizedData()}
                          renderItem={renderOrganizedItem}
                          keyExtractor={(item, index) => 
                            item.type === 'divider' ? `divider-${index}` : item.data.id
                          }
                          onDragBegin={() => {
                            setIsDragging(true);
                          }}
                          onDragEnd={({ data }) => {
                            // Guardar los datos del drag para transición suave
                            setDragData(data);
                            
                            // Procesar el nuevo orden manteniendo la separación por estado
                            const itemsOnly = data
                              .filter(item => item.type === 'item')
                              .map(item => item.data);
                            
                            // Separar por estado checked
                            const newUnchecked = itemsOnly.filter(item => !item.checked);
                            const newChecked = itemsOnly.filter(item => item.checked);
                            
                            // Crear el nuevo array manteniendo el orden dentro de cada sección
                            const reorderedItems = [...newUnchecked, ...newChecked];
                            
                            // Actualizar el estado con un pequeño delay para transición suave
                            setTimeout(() => {
                              setIsDragging(false);
                              setDragData([]);
                            }, 100);
                          }}
                          contentContainerStyle={styles.listContainer}
                          showsVerticalScrollIndicator={false}
                        />
                      )}

              {/* ===== BOTÓN FLOTANTE (FAB) CON GRADIENTE MÁGICO ===== */}
              <TouchableOpacity
                style={styles.fab}
                onPress={handleAddNewItem}
                activeOpacity={0.8}
              >
                      <LinearGradient
                        colors={['#00E0FF', '#E000FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.fabGradient}
                      >
                  <Ionicons name="add" size={28} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

                    {/* ===== MODAL PARA AGREGAR ITEMS ===== */}
                    <AddItemModal
                      visible={isAddModalVisible}
                      onClose={handleCloseModal}
                      onAddItem={handleAddItem}
                    />

                    {/* ===== MODAL DE DETALLES DEL ITEM ===== */}
                    <ItemDetailModal
                      visible={isDetailModalVisible}
                      item={selectedItem}
                      formatDateTime={formatDateTime}
                      onClose={handleCloseDetailModal}
                      onMarkAsBought={handleMarkAsBought}
                      onModify={handleModifyItem}
                      onDelete={handleDeleteFromModal}
                    />

                    {/* ===== MODAL DE EDICIÓN ===== */}
                    <AddItemModal
                      visible={isEditModalVisible}
                      onClose={handleCloseEditModal}
                      onAddItem={handleAddItem}
                      onEditItem={handleEditItem}
                      editingItem={selectedItem}
                      mode="edit"
                    />

            {/* ===== BARRA INFERIOR DE NAVEGACIÓN ===== */}
            <SafeAreaView edges={['bottom']} style={styles.bottomNavWrapper}>
              <View style={styles.bottomNavigation}>
                <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
                  <Ionicons name="home" size={24} color="#4CAF50" />
                  <Text style={[styles.navLabel, styles.navLabelActive]}>Inicio</Text>
                </TouchableOpacity>
                
                        <TouchableOpacity 
                          style={styles.navItem} 
                          activeOpacity={0.7}
                          onPress={() => router.push('/explore')}
                        >
                          <Ionicons name="list" size={24} color="#9E9E9E" />
                          <Text style={styles.navLabel}>Mis Listas</Text>
                        </TouchableOpacity>
                
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
          </View>
        </SafeAreaView>
      </SafeAreaProvider>

      {/* Confetti Simple */}
      <SimpleConfetti
        visible={showConfetti}
        onComplete={handleConfettiComplete}
      />
    </GestureHandlerRootView>
  );
}

// ===== ESTILOS =====
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // ===== CONTENEDOR PRINCIPAL =====
  container: {
    flex: 1,
    backgroundColor: '#4CAF50', // Color del SafeArea superior
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // ===== HEADER =====
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    width: 40, // Para balancear el icono del carrito
  },
  refreshButton: {
    padding: 4,
  },
  updateMarkerBar: {
    height: 4,
    backgroundColor: '#8A2BE2', // violeta (blueviolet)
  },

  // ===== CONTENIDO =====
  content: {
    flex: 1,
    position: 'relative',
  },

          // ===== LISTA =====
          listContainer: {
            paddingTop: 8,
            paddingBottom: 100, // Espacio para FAB y navegación
          },
          scrollContainer: {
            flex: 1,
          },
          scrollContent: {
            paddingBottom: 100, // Espacio para FAB y navegación
          },

  // ===== ESTADO VACÍO =====
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#424242',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
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

  // ===== BOTÓN FLOTANTE =====
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#00E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
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
});