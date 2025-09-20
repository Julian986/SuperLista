# Actualización de Supabase para Estadísticas Históricas

## Nueva Tabla: user_stats_history

Esta tabla registrará todas las acciones del usuario de forma permanente para mantener estadísticas históricas.

### Crear la tabla
```sql
CREATE TABLE user_stats_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  action_type TEXT NOT NULL, -- 'added', 'completed', 'deleted'
  item_name TEXT NOT NULL,
  item_qty INTEGER NOT NULL,
  item_unit TEXT NOT NULL,
  item_place TEXT NOT NULL,
  item_status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Habilitar RLS
```sql
ALTER TABLE user_stats_history ENABLE ROW LEVEL SECURITY;
```

### Políticas de seguridad
```sql
-- Permitir lectura a todos
CREATE POLICY "User stats history are viewable by everyone" ON user_stats_history FOR SELECT USING (true);

-- Permitir inserción a todos
CREATE POLICY "User stats history can be inserted by anyone" ON user_stats_history FOR INSERT WITH CHECK (true);
```

### Índices para mejor rendimiento
```sql
CREATE INDEX idx_user_stats_history_user_id ON user_stats_history(user_id);
CREATE INDEX idx_user_stats_history_action_type ON user_stats_history(action_type);
CREATE INDEX idx_user_stats_history_created_at ON user_stats_history(created_at);
```

## Funciones auxiliares

### Función para obtener estadísticas históricas de un usuario (ACTUALIZADA)
```sql
CREATE OR REPLACE FUNCTION get_user_historical_stats(user_uuid UUID)
RETURNS TABLE (
  total_added BIGINT,
  total_completed BIGINT,
  total_deleted BIGINT,
  completion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    -- Mis Pedidos = Items agregados - Items eliminados pendientes (no completados)
    (COUNT(*) FILTER (WHERE action_type = 'added') - 
     COUNT(*) FILTER (WHERE action_type = 'deleted_pending')) as total_added,
    COUNT(*) FILTER (WHERE action_type = 'completed') as total_completed,
    (COUNT(*) FILTER (WHERE action_type = 'deleted_pending') + 
     COUNT(*) FILTER (WHERE action_type = 'deleted_completed')) as total_deleted,
    CASE 
      WHEN (COUNT(*) FILTER (WHERE action_type = 'added') - 
            COUNT(*) FILTER (WHERE action_type = 'deleted_pending')) > 0 
      THEN ROUND(
        (COUNT(*) FILTER (WHERE action_type = 'completed')::NUMERIC / 
         (COUNT(*) FILTER (WHERE action_type = 'added') - 
          COUNT(*) FILTER (WHERE action_type = 'deleted_pending'))::NUMERIC) * 100, 
        2
      )
      ELSE 0 
    END as completion_rate
  FROM user_stats_history 
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;
```

## Uso en la aplicación

1. **Al agregar un item**: Registrar acción 'added'
2. **Al marcar como comprado**: Registrar acción 'completed' 
3. **Al eliminar un item**: Registrar acción 'deleted'

Las estadísticas se calculan sumando todas las acciones históricas del usuario.
