import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useStatsRefresh } from '../contexts/StatsContext';
import { useHistoricalStats, HistoricalStats } from './useHistoricalStats';

interface UserStats {
  totalItems: number;
  completedItems: number;
  pendingItems: number;
  completionRate: number;
}

export const useUserStats = (userId: string, userName: string) => {
  const [stats, setStats] = useState<UserStats>({
    totalItems: 0,
    completedItems: 0,
    pendingItems: 0,
    completionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { refreshTrigger } = useStatsRefresh();
  const { getUserHistoricalStatsSQL } = useHistoricalStats();

  const loadUserStats = async () => {
    try {
      console.log('🔍 Loading historical user stats for:', { userId, userName });
      
      // Obtener estadísticas históricas
      const historicalStats = await getUserHistoricalStatsSQL(userId);
      
      // Convertir a formato UserStats
      const newStats: UserStats = {
        totalItems: historicalStats.totalAdded, // Total de items agregados históricamente
        completedItems: historicalStats.totalCompleted, // Total de items completados históricamente
        pendingItems: historicalStats.totalAdded, // Mis Pedidos = Total de items agregados históricamente
        completionRate: historicalStats.completionRate,
      };

      console.log('📊 Historical stats converted:', {
        userId,
        userName,
        historicalStats,
        newStats,
        explanation: {
          totalItems: 'Total de items agregados históricamente',
          completedItems: 'Total de items completados históricamente (Mis Compras)',
          pendingItems: 'Total de items agregados históricamente (Mis Pedidos)',
          completionRate: 'Porcentaje de completado'
        }
      });

      setStats(newStats);
    } catch (error) {
      console.error('❌ Error loading historical user stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar estadísticas al montar o cuando cambie el userId
  useEffect(() => {
    if (userId && userName) {
      loadUserStats();
    }
  }, [userId]); // Solo depende del userId, no del userName

  // Recargar estadísticas cuando se dispare el refreshTrigger
  useEffect(() => {
    if (refreshTrigger > 0 && userId && userName) {
      loadUserStats();
    }
  }, [refreshTrigger]);

  // Recargar estadísticas cada 30 segundos para mantener sincronización
  useEffect(() => {
    if (!userId || !userName) return;

    const interval = setInterval(() => {
      loadUserStats();
    }, 30000); // 30 segundos

    return () => {
      clearInterval(interval);
    };
  }, [userId, userName]);

  return {
    stats,
    isLoading,
    refreshStats: loadUserStats,
  };
};
