import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AddItemFormData, PLACES, UNITS, STATUSES, SupermarketItem } from '../types';

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: (formData: AddItemFormData) => void;
  onEditItem?: (itemId: string, formData: AddItemFormData) => void;
  editingItem?: SupermarketItem | null;
  mode?: 'add' | 'edit';
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

export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  onAddItem,
  onEditItem,
  editingItem,
  mode = 'add',
}) => {
  const insets = useSafeAreaInsets();
  
  const [formData, setFormData] = useState<AddItemFormData>({
    name: '',
    qty: 1,
    unit: 'unidad',
    place: 'Supermercado',
    status: 'Agotado',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Efecto para cargar datos cuando se está editando
  React.useEffect(() => {
    if (mode === 'edit' && editingItem) {
      setFormData({
        name: editingItem.name,
        qty: editingItem.qty,
        unit: editingItem.unit,
        place: editingItem.place,
        status: editingItem.status,
      });
    } else {
      // Resetear formulario para modo agregar
      setFormData({
        name: '',
        qty: 1,
        unit: 'unidad',
        place: 'Supermercado',
        status: 'Agotado',
      });
    }
    setErrors({});
  }, [mode, editingItem, visible]);

  // Función para validar el formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.qty || formData.qty < 1) {
      newErrors.qty = 'La cantidad debe ser al menos 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      if (mode === 'edit' && editingItem && onEditItem) {
        onEditItem(editingItem.id, formData);
      } else {
        onAddItem(formData);
      }
      // Resetear el formulario
      setFormData({
        name: '',
        qty: 1,
        unit: 'unidad',
        place: 'Supermercado',
        status: 'Agotado',
      });
      setErrors({});
      onClose();
    }
  };

  // Función para cerrar el modal y resetear
  const handleClose = () => {
    setFormData({
      name: '',
      qty: 1,
      unit: 'unidad',
      place: 'Supermercado',
      status: 'Agotado',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {mode === 'edit' ? 'Modificar Producto' : 'Agregar Producto'}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Campo Nombre */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del producto *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Ej: Leche entera, Pan integral..."
              placeholderTextColor="#999"
              autoCapitalize="words"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Campo Cantidad */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cantidad *</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityButton, formData.qty <= 1 && styles.quantityButtonDisabled]}
                onPress={() => {
                  if (formData.qty > 1) {
                    setFormData({ ...formData, qty: formData.qty - 1 });
                  }
                }}
                disabled={formData.qty <= 1}
              >
                <Ionicons name="remove" size={20} color={formData.qty <= 1 ? "#999" : "#4CAF50"} />
              </TouchableOpacity>
              <TextInput
                style={styles.quantityInput}
                value={formData.qty.toString()}
                onChangeText={(text) => {
                  const qty = parseInt(text) || 0;
                  setFormData({ ...formData, qty: qty });
                }}
                keyboardType="numeric"
                textAlign="center"
                placeholder="1"
              />
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setFormData({ ...formData, qty: formData.qty + 1 })}
              >
                <Ionicons name="add" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
            {errors.qty && <Text style={styles.errorText}>{errors.qty}</Text>}
          </View>

          {/* Campo Unidad */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Unidad *</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.unitsContainer}
            >
              {UNITS.map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={[
                    styles.unitChip,
                    formData.unit === unit && styles.unitChipSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, unit })}
                >
                  <Text
                    style={[
                      styles.unitChipText,
                      formData.unit === unit && styles.unitChipTextSelected,
                    ]}
                  >
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Campo Lugar */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lugar *</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.placesContainer}
            >
              {PLACES.map((place) => (
                <TouchableOpacity
                  key={place}
                  style={[
                    styles.placeChip,
                    formData.place === place && styles.placeChipSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, place })}
                >
                  <Text
                    style={[
                      styles.placeChipText,
                      formData.place === place && styles.placeChipTextSelected,
                    ]}
                  >
                    {place.charAt(0).toUpperCase() + place.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Campo Estado */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado *</Text>
            <View style={styles.statusContainer}>
              {STATUSES.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusChip,
                    formData.status === status && styles.statusChipSelected,
                    { borderColor: getStatusColor(status) }
                  ]}
                  onPress={() => setFormData({ ...formData, status })}
                >
                  <View style={[
                    styles.statusIndicator,
                    { backgroundColor: getStatusColor(status) }
                  ]} />
                  <Text
                    style={[
                      styles.statusChipText,
                      formData.status === status && styles.statusChipTextSelected,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Botones de acción */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
            <Ionicons 
              name={mode === 'edit' ? 'checkmark' : 'add'} 
              size={20} 
              color="#FFFFFF" 
            />
            <Text style={styles.addButtonText}>
              {mode === 'edit' ? 'Guardar' : 'Agregar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quantityButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
  },
  quantityButtonDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.5,
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginHorizontal: 16,
  },
  placesContainer: {
    marginTop: 8,
  },
  placeChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  placeChipSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  placeChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  placeChipTextSelected: {
    color: '#FFFFFF',
  },
  unitsContainer: {
    marginTop: 8,
  },
  unitChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  unitChipSelected: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  unitChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  unitChipTextSelected: {
    color: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statusChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusChipSelected: {
    backgroundColor: '#F5F5F5',
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statusChipTextSelected: {
    color: '#212121',
    fontWeight: '700',
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
