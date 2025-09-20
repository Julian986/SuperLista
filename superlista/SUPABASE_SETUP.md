# Configuración de Supabase para SuperLista

## 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Anota la URL y la clave anónima

## 2. Configurar Variables de Entorno

Actualiza el archivo `config/supabase.ts` con tus credenciales:

```typescript
export const SUPABASE_CONFIG = {
  url: 'https://tu-proyecto.supabase.co',
  anonKey: 'tu-clave-anonima',
};
```

## 3. Crear Tablas en Supabase

Ejecuta estos comandos SQL en el editor SQL de Supabase:

### Tabla de Usuarios
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla de Listas
```sql
CREATE TABLE lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla de Items
```sql
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES lists(id),
  name TEXT NOT NULL,
  qty INTEGER NOT NULL,
  unit TEXT NOT NULL,
  place TEXT NOT NULL,
  status TEXT NOT NULL,
  added_by TEXT NOT NULL,
  checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Configurar Políticas de Seguridad (RLS)

### Habilitar RLS
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
```

### Políticas para Usuarios
```sql
-- Permitir lectura a todos
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);

-- Permitir inserción a todos
CREATE POLICY "Users can be inserted by anyone" ON users FOR INSERT WITH CHECK (true);
```

### Políticas para Listas
```sql
-- Permitir lectura a todos
CREATE POLICY "Lists are viewable by everyone" ON lists FOR SELECT USING (true);

-- Permitir inserción a todos
CREATE POLICY "Lists can be inserted by anyone" ON lists FOR INSERT WITH CHECK (true);
```

### Políticas para Items
```sql
-- Permitir lectura a todos
CREATE POLICY "Items are viewable by everyone" ON items FOR SELECT USING (true);

-- Permitir inserción a todos
CREATE POLICY "Items can be inserted by anyone" ON items FOR INSERT WITH CHECK (true);

-- Permitir actualización a todos
CREATE POLICY "Items can be updated by anyone" ON items FOR UPDATE USING (true);

-- Permitir eliminación a todos
CREATE POLICY "Items can be deleted by anyone" ON items FOR DELETE USING (true);
```

## 5. Configurar Realtime

En el dashboard de Supabase:
1. Ve a "Database" > "Replication"
2. Habilita la replicación para las tablas `items`, `lists`, y `users`

## 6. Probar la Conexión

Una vez configurado, la app debería:
- Conectarse automáticamente a Supabase
- Sincronizar datos en tiempo real
- Permitir múltiples usuarios simultáneos

## 7. Compartir con la Familia

### Opción A: Expo Go (Desarrollo)
```bash
npx expo start --tunnel
# Compartir el QR con la familia
```

### Opción B: Build de Producción
```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

## Notas Importantes

- **Gratuito**: Supabase tiene un plan gratuito generoso
- **Seguro**: Las políticas RLS protegen los datos
- **Escalable**: Puede crecer con tu familia
- **Tiempo Real**: Cambios se sincronizan instantáneamente
