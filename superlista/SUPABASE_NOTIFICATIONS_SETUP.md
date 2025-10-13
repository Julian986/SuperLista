# 🔔 Configuración de Notificaciones en Supabase

## Paso 1: Crear Tabla de Tokens de Notificación

Ve al **SQL Editor** en tu dashboard de Supabase y ejecuta este SQL:

```sql
-- Crear tabla para almacenar tokens de notificaciones push
CREATE TABLE IF NOT EXISTS notification_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Crear índice para búsquedas rápidas por user_id
CREATE INDEX IF NOT EXISTS idx_notification_tokens_user_id 
ON notification_tokens(user_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE notification_tokens ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden insertar/actualizar su propio token
CREATE POLICY "Los usuarios pueden gestionar su token" 
ON notification_tokens
FOR ALL
USING (true)
WITH CHECK (true);

-- Política: Todos pueden leer todos los tokens (necesario para enviar notificaciones)
CREATE POLICY "Todos pueden leer tokens" 
ON notification_tokens
FOR SELECT
USING (true);

-- Comentarios para documentación
COMMENT ON TABLE notification_tokens IS 'Almacena los tokens de notificaciones push de cada usuario';
COMMENT ON COLUMN notification_tokens.user_id IS 'ID del usuario (referencia a la tabla users)';
COMMENT ON COLUMN notification_tokens.token IS 'Token de Expo Push Notifications';
COMMENT ON COLUMN notification_tokens.updated_at IS 'Última vez que se actualizó el token';
```

## Paso 2: Verificar la Tabla

Ejecuta este SQL para verificar que la tabla se creó correctamente:

```sql
SELECT * FROM notification_tokens;
```

Debería devolver 0 filas (la tabla está vacía al inicio).

## Paso 3: Probar la Inserción

Prueba insertar un token de prueba:

```sql
-- Reemplaza 'USER_ID_AQUI' con un ID de usuario real de tu tabla users
INSERT INTO notification_tokens (user_id, token)
VALUES (
  (SELECT id FROM users LIMIT 1),
  'ExponentPushToken[test-token-123]'
)
ON CONFLICT (user_id) 
DO UPDATE SET 
  token = EXCLUDED.token,
  updated_at = NOW();

-- Ver el resultado
SELECT * FROM notification_tokens;
```

## Paso 4: Limpiar Datos de Prueba

Después de probar, limpia los datos de prueba:

```sql
DELETE FROM notification_tokens WHERE token LIKE 'ExponentPushToken[test%';
```

## 🎯 ¿Cómo Funciona?

1. **Registro**: Cuando un usuario abre la app, se registra para notificaciones y se guarda su token
2. **Almacenamiento**: El token se guarda en `notification_tokens` vinculado a su `user_id`
3. **Envío**: Cuando alguien agrega/compra un item, la app:
   - Obtiene los tokens de todos los demás usuarios
   - Envía notificaciones push a esos tokens
4. **Recepción**: Los otros usuarios reciben la notificación incluso si la app está cerrada

## 📱 Tipos de Notificaciones Implementadas

- ✅ **Item Agregado**: "🛒 [Usuario] agregó [Producto] a la lista"
- ✅ **Item Comprado**: "✅ [Usuario] marcó [Producto] como comprado"

## 🔧 Mantenimiento

### Limpiar tokens antiguos (opcional):

```sql
-- Eliminar tokens no actualizados en más de 30 días
DELETE FROM notification_tokens 
WHERE updated_at < NOW() - INTERVAL '30 days';
```

### Ver estadísticas:

```sql
-- Cuántos usuarios tienen notificaciones activas
SELECT COUNT(*) as usuarios_con_notificaciones 
FROM notification_tokens;

-- Ver qué usuarios tienen tokens
SELECT 
  u.name,
  nt.token,
  nt.updated_at
FROM notification_tokens nt
JOIN users u ON u.id = nt.user_id
ORDER BY nt.updated_at DESC;
```

## ⚠️ Importante

- Los tokens se actualizan automáticamente cada vez que el usuario abre la app
- Un usuario solo puede tener un token activo (constraint UNIQUE)
- Si un usuario desinstala la app, su token permanece en la BD pero será inválido
- Los tokens expirados no causan problemas, solo no se entregan las notificaciones

---

**Configurado**: Octubre 2025  
**Proyecto**: SuperLista

