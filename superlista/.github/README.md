# 🤖 GitHub Actions - EAS Update Automático

Este repositorio tiene configurado un workflow de GitHub Actions que publica actualizaciones automáticamente cuando haces push a las ramas `main` o `master`.

## 📋 Configuración Inicial (Ya completada)

- ✅ Instalado `expo-updates`
- ✅ Configurado `app.json` con URL de updates
- ✅ Configurado `eas.json` con canales
- ✅ Creado workflow de GitHub Actions

## 🔑 Configuración del Token (Necesaria)

### 1. Crear Token de Expo:

1. Ve a: https://expo.dev/accounts/juliancito92/settings/access-tokens
2. Haz clic en "Create Token"
3. Nombre: `GITHUB_ACTIONS_SUPERLISTA`
4. Copia el token (solo lo verás una vez)

### 2. Agregar Token a GitHub Secrets:

1. Ve a: `https://github.com/TU_USUARIO/TU_REPO/settings/secrets/actions`
2. Haz clic en "New repository secret"
3. **Name**: `EXPO_TOKEN`
4. **Secret**: Pega el token de Expo
5. Haz clic en "Add secret"

## 🚀 Cómo Funciona

### Workflow Automático:

El workflow se ejecuta cuando:
- Haces `push` a las ramas `main` o `master`
- Hay cambios en las carpetas: `app/`, `components/`, `contexts/`, `hooks/`, `lib/`, `utils/`, `types/`, `constants/`, `config/`

### Proceso:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

🤖 **GitHub Actions automáticamente**:
1. Detecta el push
2. Instala dependencias
3. Ejecuta `eas update --auto`
4. Publica los cambios al canal `preview`

👨‍👩‍👧‍👦 **Tus usuarios**:
- Reciben la actualización al abrir la app
- Sin necesidad de reinstalar
- Sin ninguna acción manual

## 📱 Primera Instalación (Una vez)

Después de configurar EAS Update, necesitas generar **UNA ÚLTIMA BUILD** con el sistema de updates:

```bash
eas build --platform android --profile preview
```

Distribuye este APK a tus usuarios. A partir de ahí, todas las actualizaciones serán automáticas.

## ⚠️ Notas Importantes

### Cambios que se actualizan automáticamente:
- ✅ Código TypeScript/JavaScript
- ✅ Componentes React
- ✅ Estilos
- ✅ Lógica de negocio
- ✅ Assets (imágenes, fuentes)

### Cambios que necesitan nueva build:
- ❌ Modificaciones en `app.json` (splash, iconos, permisos)
- ❌ Dependencias nativas nuevas
- ❌ Cambios en configuración de Android/iOS

## 🔧 Comandos Útiles

```bash
# Ver updates publicados
eas update:view

# Ver canales disponibles
eas channel:list

# Publicar update manualmente (opcional)
eas update --branch preview --message "Descripción"

# Ver logs del workflow en GitHub
# Ve a: Actions → EAS Update → Ver run más reciente
```

## 📊 Monitoreo

Para ver si el workflow funcionó:

1. Ve a la pestaña **Actions** en tu repositorio de GitHub
2. Busca el workflow **"EAS Update"**
3. Verifica que tenga un ✅ verde
4. Si hay errores (❌ rojo), haz clic para ver los logs

## 🎯 Resumen

- **Desarrollo normal**: Solo haz `git push` y todo se actualiza automáticamente
- **Sin recompilaciones**: Los usuarios no necesitan reinstalar la app
- **Actualizaciones rápidas**: Los cambios llegan en segundos/minutos
- **Totalmente gratuito**: EAS Update es gratis en el plan gratuito de Expo

---

**Proyecto**: SuperLista  
**Owner**: juliancito92  
**Channel**: preview  
**Configurado**: Octubre 2025

