import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SupermarketItem } from '../types';
import { getPluralizedUnit } from '../utils/pluralization';

interface SupermarketItemCardProps {
  item: SupermarketItem;
  formatDateTime: (date: Date) => string;
  onToggleChecked: (itemId: string) => void;
  onDelete: (itemId: string, itemName: string) => void;
  onItemPress: (item: SupermarketItem) => void;
  onDrag?: () => void;
  isActive?: boolean;
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

export const SupermarketItemCard: React.FC<SupermarketItemCardProps> = ({
  item,
  formatDateTime,
  onToggleChecked,
  onDelete,
  onItemPress,
  onDrag,
  isActive = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        isActive && styles.itemContainerActive,
      ]}
      onPress={() => onItemPress(item)}
      onLongPress={onDrag}
      delayLongPress={200}
      activeOpacity={0.8}
    >
      {/* Contenido principal del item */}
      <View style={styles.itemContent}>
        {/* Checkbox */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onToggleChecked(item.id);
          }}
          style={styles.checkboxContainer}
        >
          <Ionicons
            name={item.checked ? 'checkbox' : 'square-outline'}
            size={24}
            color={item.checked ? '#4CAF50' : '#757575'}
          />
        </TouchableOpacity>

        {/* Información del item */}
        <View style={styles.itemInfo}>
          <View style={styles.itemMainInfo}>
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor(item.status) }
              ]} />
            </View>
            <Text
              style={[
                styles.itemName,
                item.checked && styles.itemNameChecked,
              ]}
            >
              {item.name}
            </Text>
            <Text style={styles.itemQuantity}>
              {getPluralizedUnit(item.qty, item.unit)}
            </Text>
          </View>
          
          <View style={styles.itemSecondaryInfo}>
            <Text style={styles.itemMeta}>
              {item.addedBy} • {formatDateTime(item.addedAt)}
            </Text>
            <Text style={styles.itemPlace}>{item.place}</Text>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // ===== ITEMS =====
  itemContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemContainerActive: {
    elevation: 8,
    shadowOpacity: 0.3,
    transform: [{ scale: 1.02 }],
    backgroundColor: '#F8F9FA',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  itemSecondaryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusContainer: {
    marginRight: 8,
    marginTop: 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  itemPlace: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '400',
  },
  itemMeta: {
    fontSize: 12,
    color: '#757575',
    flex: 1,
  },
});
