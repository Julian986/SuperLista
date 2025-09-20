import { useState } from 'react';
import { Alert } from 'react-native';
import { SupermarketItem, AddItemFormData } from '../types';

// Datos de ejemplo
const mockItems: SupermarketItem[] = [
  {
    id: '1',
    name: 'Leche entera',
    qty: 2,
    unit: 'L',
    place: 'Supermercado',
    status: 'Agotado',
    addedBy: 'María',
    addedAt: new Date('2024-03-15T10:30:00'),
    checked: false,
  },
  {
    id: '2',
    name: 'Pan integral',
    qty: 1,
    unit: 'paquete',
    place: 'Panadería',
    status: 'Disponible',
    addedBy: 'Juan',
    addedAt: new Date('2024-03-15T09:15:00'),
    checked: true,
  },
  {
    id: '3',
    name: 'Manzanas rojas',
    qty: 6,
    unit: 'unidad',
    place: 'Verdulería',
    status: 'Poco',
    addedBy: 'Ana',
    addedAt: new Date('2024-03-15T08:45:00'),
    checked: false,
  },
  {
    id: '4',
    name: 'Arroz integral',
    qty: 1,
    unit: 'kg',
    place: 'Almacén',
    status: 'Agotado',
    addedBy: 'Carlos',
    addedAt: new Date('2024-03-14T18:20:00'),
    checked: false,
  },
  {
    id: '5',
    name: 'Detergente',
    qty: 1,
    unit: 'botella',
    place: 'Supermercado',
    status: 'Disponible',
    addedBy: 'María',
    addedAt: new Date('2024-03-14T16:10:00'),
    checked: true,
  },
];

export const useSupermarketList = (userName?: string) => {
  const [items, setItems] = useState<SupermarketItem[]>(mockItems);

  // Función para formatear fecha y hora
  const formatDateTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return 'Ahora';
    } else if (diffMinutes < 60) {
      return `Hace ${diffMinutes}m`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours}h`;
    } else {
      return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    }
  };

  // Función para alternar el estado checked de un item
  const toggleItemChecked = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Función para eliminar un item con confirmación
  const deleteItem = (itemId: string, itemName: string) => {
    Alert.alert(
      'Eliminar item',
      `¿Estás seguro de que deseas eliminar "${itemName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setItems(prevItems => prevItems.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  // Función para eliminar un item sin confirmación (para el modal de detalles)
  const deleteItemDirectly = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Función para agregar un nuevo item
  const addItem = (formData: AddItemFormData) => {
    const newItem: SupermarketItem = {
      id: Date.now().toString(), // ID simple basado en timestamp
      name: formData.name.trim(),
      qty: formData.qty,
      unit: formData.unit,
      place: formData.place,
      status: formData.status,
      addedBy: userName || 'Usuario', // Usa el nombre del usuario o 'Usuario' por defecto
      addedAt: new Date(),
      checked: false,
    };

    setItems(prevItems => [newItem, ...prevItems]);
  };

  // Función para reordenar los items
  const reorderItems = (fromIndex: number, toIndex: number) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      const [removed] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, removed);
      return newItems;
    });
  };

  // Función para marcar un item como comprado
  const markAsBought = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, checked: true } : item
      )
    );
  };

  // Función para editar un item existente
  const editItem = (itemId: string, formData: AddItemFormData) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId 
          ? { 
              ...item, 
              name: formData.name.trim(),
              qty: formData.qty,
              unit: formData.unit,
              place: formData.place,
              status: formData.status,
            }
          : item
      )
    );
  };

  // Función para obtener items organizados (no comprados primero, comprados después)
  const getOrganizedItems = () => {
    const uncheckedItems = items.filter(item => !item.checked);
    const checkedItems = items.filter(item => item.checked);
    return { uncheckedItems, checkedItems };
  };

  return {
    items,
    setItems,
    formatDateTime,
    toggleItemChecked,
    deleteItem,
    deleteItemDirectly,
    addItem,
    editItem,
    reorderItems,
    markAsBought,
    getOrganizedItems,
  };
};
