import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SupermarketItem } from '../types';
import { getPluralizedUnit } from '../utils/pluralization';

interface ItemDetailModalProps {
  visible: boolean;
  item: SupermarketItem | null;
  formatDateTime: (date: Date) => string;
  onClose: () => void;
  onMarkAsBought: (itemId: string) => void;
  onModify: (item: SupermarketItem) => void;
  onDelete: (itemId: string, itemName: string) => void;
}

// Función para obtener el color del estado
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Agotado':
      return '#F44336'; // Rojo
    case 'Poco':
      return '#FF9800'; // Naranja
    case 'Disponible':
      return '#4CAF50'; // Verde
    default:
      return '#757575'; // Gris por defecto
  }
};

// Función para obtener los colores del gradiente según el estado
const getStatusGradientColors = (status: string): [string, string] => {
  switch (status) {
    case 'Agotado':
      return ['#F44336', '#D32F2F']; // Rojo
    case 'Poco':
      return ['#FF9800', '#F57C00']; // Naranja
    case 'Disponible':
      return ['#4CAF50', '#45a049']; // Verde
    default:
      return ['#757575', '#616161']; // Gris por defecto
  }
};

// Función para obtener el texto del estado
const getStatusText = (status: string): string => {
  switch (status) {
    case 'Agotado':
      return 'Agotado';
    case 'Poco':
      return 'Poco Stock';
    case 'Disponible':
      return 'Disponible';
    default:
      return status;
  }
};

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  visible,
  item,
  formatDateTime,
  onClose,
  onMarkAsBought,
  onModify,
  onDelete,
}) => {
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      // Animación de entrada
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Resetear animaciones
      slideAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleMarkAsBought = () => {
    if (!item) return;
    // Cierre instantáneo del modal
    onMarkAsBought(item.id);
  };

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
                opacity: fadeAnim,
              },
            ]}
          >
          {/* Header con gradiente según el estado */}
          <LinearGradient
            colors={getStatusGradientColors(item.status)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modalHeader}
          >
            <View style={styles.headerContent}>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: getStatusColor(item.status) }
                ]} />
                <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Contenido principal */}
          <View style={styles.modalContent}>
            {/* Información del producto */}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productQuantity}>
                {getPluralizedUnit(item.qty, item.unit)}
              </Text>
              <Text style={styles.productPlace}>📍 {item.place}</Text>
            </View>

            {/* Información del usuario */}
            <View style={styles.userInfo}>
              <View style={styles.userRow}>
                <Ionicons name="person-circle" size={20} color="#757575" />
                <Text style={styles.userText}>Agregado por {item.addedBy}</Text>
              </View>
              <View style={styles.userRow}>
                <Ionicons name="time" size={20} color="#757575" />
                <Text style={styles.userText}>{formatDateTime(item.addedAt)}</Text>
              </View>
            </View>

            {/* Botones de acción */}
            <View style={styles.actionsContainer}>
              {/* Botón Comprado - Solo visible si NO está comprado */}
              {!item.checked && (
                <TouchableOpacity
                  style={styles.boughtButton}
                  onPress={handleMarkAsBought}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#4CAF50', '#45a049']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                    <Text style={styles.boughtButtonText}>¡Comprado!</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {/* Indicador de ya comprado */}
              {item.checked && (
                <View style={styles.alreadyBoughtContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text style={styles.alreadyBoughtText}>¡Ya está comprado!</Text>
                </View>
              )}

              {/* Botones secundarios */}
              <View style={styles.secondaryButtons}>
                {/* Botón Modificar - Solo visible si NO está comprado */}
                {!item.checked && (
                  <TouchableOpacity
                    style={styles.modifyButton}
                    onPress={() => onModify(item)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="create" size={20} color="#FF9800" />
                    <Text style={styles.modifyButtonText}>Modificar</Text>
                  </TouchableOpacity>
                )}

                {/* Botón Eliminar - Siempre disponible */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => onDelete(item.id, item.name)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash" size={20} color="#F44336" />
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: width * 0.9,
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalContent: {
    padding: 24,
  },
  productInfo: {
    marginBottom: 24,
    alignItems: 'center',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 8,
  },
  productQuantity: {
    fontSize: 18,
    color: '#757575',
    fontWeight: '500',
    marginBottom: 8,
  },
  productPlace: {
    fontSize: 16,
    color: '#9E9E9E',
    fontWeight: '400',
  },
  userInfo: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
    fontWeight: '500',
  },
  actionsContainer: {
    gap: 12,
  },
  boughtButton: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  boughtButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  alreadyBoughtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#E8F5E8',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  alreadyBoughtText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 8,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modifyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF9800',
    backgroundColor: '#FFF8E1',
  },
  modifyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
    marginLeft: 6,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F44336',
    marginLeft: 6,
  },
});
