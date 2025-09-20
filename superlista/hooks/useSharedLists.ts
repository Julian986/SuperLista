import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SupermarketItem, AddItemFormData } from '../types';
import { useHistoricalStats } from './useHistoricalStats';

export const useSharedLists = (userId: string, userName: string) => {
  const [items, setItems] = useState<SupermarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { recordAction } = useHistoricalStats();

  // Cargar items de la base de datos
  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          lists!inner(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convertir datos de Supabase al formato de SupermarketItem
      const formattedItems: SupermarketItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        unit: item.unit,
        place: item.place,
        status: item.status,
        addedBy: item.added_by,
        addedAt: new Date(item.created_at),
        checked: item.checked,
      }));

      setItems(formattedItems);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar items al montar el componente
  useEffect(() => {
    if (userId) {
      loadItems();
    }
  }, [userId]);

  // Suscribirse a cambios en tiempo real (cuando esté disponible)
  useEffect(() => {
    if (!userId) return;

    // Por ahora, recargar datos cada 30 segundos
    const interval = setInterval(() => {
      loadItems();
    }, 30000); // 30 segundos

    return () => {
      clearInterval(interval);
    };
  }, [userId]);

  // Función para agregar un item
  const addItem = async (formData: AddItemFormData) => {
    try {
      // Obtener la lista por defecto
      const { data: defaultList, error: listError } = await supabase
        .from('lists')
        .select('id')
        .eq('name', 'Lista Principal')
        .single();

      if (listError) throw listError;

      const { data, error } = await supabase
        .from('items')
        .insert({
          list_id: defaultList.id,
          name: formData.name.trim(),
          qty: formData.qty,
          unit: formData.unit,
          place: formData.place,
          status: formData.status,
          added_by: userName,
          checked: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Agregar el item localmente
      const newItem: SupermarketItem = {
        id: data.id,
        name: data.name,
        qty: data.qty,
        unit: data.unit,
        place: data.place,
        status: data.status,
        addedBy: data.added_by,
        addedAt: new Date(data.created_at),
        checked: data.checked,
      };

      setItems(prevItems => [newItem, ...prevItems]);

      // Registrar acción histórica
      try {
        await recordAction({
          userId,
          actionType: 'added',
          itemName: formData.name.trim(),
          itemQty: formData.qty,
          itemUnit: formData.unit,
          itemPlace: formData.place,
          itemStatus: formData.status,
        });
      } catch (error) {
        console.error('❌ Error recording add action:', error);
        // No lanzar error para no interrumpir el flujo principal
      }
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  // Función para editar un item
  const editItem = async (itemId: string, formData: AddItemFormData) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({
          name: formData.name.trim(),
          qty: formData.qty,
          unit: formData.unit,
          place: formData.place,
          status: formData.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId);

      if (error) throw error;

      // Actualizar localmente
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
    } catch (error) {
      console.error('Error editing item:', error);
      throw error;
    }
  };

  // Función para eliminar un item
  const deleteItem = async (itemId: string) => {
    try {
      // Obtener el item antes de eliminarlo para registrar la acción
      const item = items.find(i => i.id === itemId);
      
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      // Eliminar localmente
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));

      // Registrar acción histórica diferenciando si estaba completado o no
      if (item) {
        try {
          // Si el item estaba completado, no afecta "Mis Pedidos"
          // Si el item NO estaba completado, sí afecta "Mis Pedidos"
          const actionType = item.checked ? 'deleted_completed' : 'deleted_pending';
          
          await recordAction({
            userId,
            actionType,
            itemName: item.name,
            itemQty: item.qty,
            itemUnit: item.unit,
            itemPlace: item.place,
            itemStatus: item.status,
          });
          
          console.log('📝 Recorded delete action:', { 
            itemName: item.name, 
            wasCompleted: item.checked, 
            actionType 
          });
        } catch (error) {
          console.error('❌ Error recording delete action:', error);
          // No lanzar error para no interrumpir el flujo principal
        }
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  };

  // Función para alternar el estado checked
  const toggleItemChecked = async (itemId: string) => {
    try {
      const item = items.find(i => i.id === itemId);
      if (!item) return;

      console.log('🔄 Toggling item:', { itemId, currentChecked: item.checked, addedBy: item.addedBy });

      const { error } = await supabase
        .from('items')
        .update({
          checked: !item.checked,
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId);

      if (error) throw error;

      // Actualizar localmente
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      );

      // Registrar acción histórica solo cuando se marca como comprado (checked = true)
      if (!item.checked) { // Si estaba desmarcado y ahora se marca
        try {
          await recordAction({
            userId,
            actionType: 'completed',
            itemName: item.name,
            itemQty: item.qty,
            itemUnit: item.unit,
            itemPlace: item.place,
            itemStatus: item.status,
          });
        } catch (error) {
          console.error('❌ Error recording complete action:', error);
          // No lanzar error para no interrumpir el flujo principal
        }
      }

      console.log('✅ Item toggled successfully:', { itemId, newChecked: !item.checked });
    } catch (error) {
      console.error('Error toggling item:', error);
      throw error;
    }
  };

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

  // Función para obtener items organizados
  const getOrganizedItems = () => {
    const uncheckedItems = items.filter(item => !item.checked);
    const checkedItems = items.filter(item => item.checked);
    return { uncheckedItems, checkedItems };
  };

  // Función para obtener estadísticas del usuario
  const getUserStats = () => {
    console.log('🔍 Getting user stats for:', { userId, userName });
    console.log('📋 All items:', items.map(item => ({ 
      name: item.name, 
      checked: item.checked, 
      addedBy: item.addedBy 
    })));
    
    // Filtrar items por el nombre actual del usuario
    const userItems = items.filter(item => item.addedBy === userName);
    const completedItems = userItems.filter(item => item.checked).length;
    const pendingItems = userItems.filter(item => !item.checked).length;
    const totalItems = userItems.length;
    const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    console.log('📊 User Stats Result:', {
      userId,
      userName,
      totalItems,
      completedItems,
      pendingItems,
      completionRate,
      userItems: userItems.map(item => ({ name: item.name, checked: item.checked, addedBy: item.addedBy }))
    });

    return {
      totalItems,
      completedItems,
      pendingItems,
      completionRate,
    };
  };

  return {
    items,
    isLoading,
    addItem,
    editItem,
    deleteItem,
    toggleItemChecked,
    formatDateTime,
    getOrganizedItems,
    refreshItems: loadItems,
    getUserStats,
  };
};
