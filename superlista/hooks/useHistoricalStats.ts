import { supabase } from '../lib/supabase';

export interface HistoricalStats {
  totalAdded: number;
  totalCompleted: number;
  totalDeleted: number;
  completionRate: number;
}

export interface StatsAction {
  userId: string;
  actionType: 'added' | 'completed' | 'deleted_pending' | 'deleted_completed';
  itemName: string;
  itemQty: number;
  itemUnit: string;
  itemPlace: string;
  itemStatus: string;
}

export const useHistoricalStats = () => {
  
  // Registrar una acción en el historial
  const recordAction = async (action: StatsAction) => {
    try {
      console.log('📝 Recording action:', action);
      
      const { error } = await supabase
        .from('user_stats_history')
        .insert({
          user_id: action.userId,
          action_type: action.actionType,
          item_name: action.itemName,
          item_qty: action.itemQty,
          item_unit: action.itemUnit,
          item_place: action.itemPlace,
          item_status: action.itemStatus,
        });

      if (error) throw error;
      
      console.log('✅ Action recorded successfully');
    } catch (error) {
      console.error('❌ Error recording action:', error);
      throw error;
    }
  };

  // Obtener estadísticas históricas de un usuario
  const getUserHistoricalStats = async (userId: string): Promise<HistoricalStats> => {
    try {
      console.log('🔍 Getting historical stats for user:', userId);
      
      const { data, error } = await supabase
        .from('user_stats_history')
        .select('action_type')
        .eq('user_id', userId);

      if (error) throw error;

      const totalAdded = data?.filter(item => item.action_type === 'added').length || 0;
      const totalCompleted = data?.filter(item => item.action_type === 'completed').length || 0;
      const totalDeletedPending = data?.filter(item => item.action_type === 'deleted_pending').length || 0;
      const totalDeletedCompleted = data?.filter(item => item.action_type === 'deleted_completed').length || 0;
      
      // Mis Pedidos = Items agregados - Items eliminados pendientes (no completados)
      const totalPending = totalAdded - totalDeletedPending;
      
      const completionRate = totalPending > 0 
        ? Math.round((totalCompleted / totalPending) * 100) 
        : 0;

      const stats: HistoricalStats = {
        totalAdded: totalPending, // Mis Pedidos = Items agregados - Items eliminados pendientes
        totalCompleted,
        totalDeleted: totalDeletedPending + totalDeletedCompleted,
        completionRate,
      };

      console.log('📊 Historical stats calculated:', stats);
      
      return stats;
    } catch (error) {
      console.error('❌ Error getting historical stats:', error);
      throw error;
    }
  };

  // Obtener estadísticas usando la función SQL (más eficiente)
  const getUserHistoricalStatsSQL = async (userId: string): Promise<HistoricalStats> => {
    try {
      console.log('🔍 Getting historical stats via SQL for user:', userId);
      
      const { data, error } = await supabase
        .rpc('get_user_historical_stats', { user_uuid: userId });

      if (error) throw error;

      const result = data?.[0];
      const stats: HistoricalStats = {
        totalAdded: result?.total_added || 0,
        totalCompleted: result?.total_completed || 0,
        totalDeleted: result?.total_deleted || 0,
        completionRate: result?.completion_rate || 0,
      };

      console.log('📊 Historical stats from SQL:', stats);
      
      return stats;
    } catch (error) {
      console.error('❌ Error getting historical stats via SQL:', error);
      // Fallback al método manual si la función SQL no existe
      return getUserHistoricalStats(userId);
    }
  };

  return {
    recordAction,
    getUserHistoricalStats,
    getUserHistoricalStatsSQL,
  };
};
