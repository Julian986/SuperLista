import { supabase } from '../lib/supabase';

// Función para probar la conexión con Supabase
export const testSupabaseConnection = async () => {
  try {
    console.log('🔌 Probando conexión con Supabase...');
    
    // Probar conexión básica
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Error de conexión:', error);
      return false;
    }

    console.log('✅ Conexión exitosa con Supabase!');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return false;
  }
};

// Función para crear un usuario de prueba
export const createTestUser = async (name: string) => {
  try {
    console.log(`👤 Creando usuario de prueba: ${name}`);
    
    const { data, error } = await supabase
      .from('users')
      .insert({ name })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creando usuario:', error);
      return null;
    }

    console.log('✅ Usuario creado:', data);
    return data;
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    return null;
  }
};
