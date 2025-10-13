import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// Configuración de cómo se mostrarán las notificaciones cuando la app está en foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Solicita permisos de notificaciones al usuario
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4CAF50',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permisos de notificaciones denegados');
      return null;
    }
    
    try {
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'a3328c66-1062-4527-b70d-8a1924c9a3b9',
      })).data;
    } catch (error) {
      console.error('Error al obtener token de push:', error);
    }
  } else {
    console.log('Debe usar un dispositivo físico para notificaciones push');
  }

  return token;
}

/**
 * Guarda el token de notificación del usuario en Supabase
 */
export async function saveNotificationToken(userId: string, token: string) {
  try {
    const { error } = await supabase
      .from('notification_tokens')
      .upsert({
        user_id: userId,
        token: token,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (error) {
      console.error('Error al guardar token de notificación:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error al guardar token:', error);
    return false;
  }
}

/**
 * Obtiene todos los tokens de notificación excepto el del usuario actual
 */
export async function getOtherUsersTokens(excludeUserId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('notification_tokens')
      .select('token')
      .neq('user_id', excludeUserId);

    if (error) {
      console.error('Error al obtener tokens:', error);
      return [];
    }

    return data?.map(item => item.token) || [];
  } catch (error) {
    console.error('Error al obtener tokens:', error);
    return [];
  }
}

/**
 * Envía una notificación push a múltiples usuarios
 */
export async function sendPushNotification(
  tokens: string[],
  title: string,
  body: string,
  data?: any
) {
  const messages = tokens.map(token => ({
    to: token,
    sound: 'default',
    title: title,
    body: body,
    data: data || {},
    priority: 'high',
    channelId: 'default',
  }));

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error al enviar notificación push:', error);
    return null;
  }
}

/**
 * Notifica cuando se agrega un nuevo item a la lista
 */
export async function notifyItemAdded(
  currentUserId: string,
  userName: string,
  itemName: string
) {
  try {
    const tokens = await getOtherUsersTokens(currentUserId);
    
    if (tokens.length === 0) {
      console.log('No hay otros usuarios para notificar');
      return;
    }

    await sendPushNotification(
      tokens,
      '🛒 Nuevo producto agregado',
      `${userName} agregó "${itemName}" a la lista`,
      { type: 'item_added', itemName, userName }
    );
  } catch (error) {
    console.error('Error al notificar item agregado:', error);
  }
}

/**
 * Notifica cuando se marca un item como comprado
 */
export async function notifyItemCompleted(
  currentUserId: string,
  userName: string,
  itemName: string
) {
  try {
    const tokens = await getOtherUsersTokens(currentUserId);
    
    if (tokens.length === 0) {
      console.log('No hay otros usuarios para notificar');
      return;
    }

    await sendPushNotification(
      tokens,
      '✅ Producto comprado',
      `${userName} marcó "${itemName}" como comprado`,
      { type: 'item_completed', itemName, userName }
    );
  } catch (error) {
    console.error('Error al notificar item completado:', error);
  }
}

/**
 * Envía una notificación local (solo en el dispositivo actual)
 */
export async function scheduleLocalNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // null = inmediatamente
  });
}

