# Parchando

**Parchando** es una aplicación móvil construida con React Native y Expo para descubrir, crear y gestionar eventos locales.

---

## Características Principales

* 📝 **Registro y autenticación:** Inicio de sesión y registro integrado con Firebase Auth.
* 📅 **Selección de fecha y hora:** UI nativa con `react-native-modal-datetime-picker`.
* 📸 **Carga de imágenes sin Firebase Storage:** Las imágenes se convierten a Base64 y se guardan directamente en Firestore.
* 🔍 **Búsqueda y filtros:** Busca eventos por título, categoría y filtros de tendencias.
* ⭐ **Favoritos:** Guarda eventos favoritos en Firestore.
* 📂 **Mis eventos:** Crea y gestiona tus propios eventos.
* 🔧 **Uso de Context API y hooks de React:** Manejo eficiente del estado.

---

## Tecnologías

* **React Native** con **Expo**
* **Firebase** (Auth, Firestore)
* **DateTimePickerModal** para selección de fecha/hora
* **Expo ImagePicker** + **expo-image-manipulator** + **expo-file-system** para captura, compresión y Base64
* **React Navigation** para navegación entre pantallas
* **@expo/vector-icons** para íconos

---

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/CamiloGR25/Parchando-APP
   cd parchando
   ```

2. Instala dependencias:

   ```bash
   npm install
   # o yarn install
   ```

3. Configura Firebase:

   * Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
   * Habilita **Authentication** (Email/Password).
   * Crea una **Cloud Firestore** en modo de prueba.
   * Copia tu configuración en `service/firebaseConfig.js`.

4. Inicia la aplicación:

   ```bash
   npx expo start
   ```

---

## Configuración de imágenes sin Storage

Para evitar añadir costos de Firebase Storage, las imágenes ahora se guardan como Base64 dentro del documento de Firestore:

1. Cuando el usuario selecciona o captura una imagen, se redimensiona y comprime con `expo-image-manipulator`.
2. Se lee el archivo resultante con `expo-file-system` y se convierte a Base64.
3. El `string` Base64 se almacena en el campo `image` del documento de evento.

> **Nota:** Asegúrate de no exceder \~1.5MB en Base64 para mantener el rendimiento.

---

## Estructura de Carpetas

   ```
   ├── App.js                       # Punto de entrada
   ├── index.js
   ├── src/
   │   ├── service/                 # Lógica de servicios (Auth, Firestore)
   │   │   ├── firebaseConfig.js    # Configuración de Firebase
   │   │   ├── metro.config.js
   │   │   ├── ServiceAuth.js
   │   │   ├── ServiceEvent.js
   │   │   └── ServiceFavorites.js
   │   ├── views/                   # Pantallas de la aplicación
   │   │   ├── ChangePassword.js
   │   │   ├── CreateEvent.js
   │   │   ├── EventDetail.js
   │   │   ├── Explore.js
   │   │   ├── Favorites.js
   │   │   ├── Login.js
   │   │   ├── Main.js
   │   │   ├── ManageAccount.js
   │   │   ├── Menu.js
   │   │   ├── MyEvents.js
   │   │   ├── PasswordSecurity.js
   │   │   ├── Recover.js
   │   │   ├── Register.js
   │   │   ├── Search.js
   │   │   ├── Start.js
   │   │   └── UserProfile.js
   │   └── data/categories.js       # Datos estáticos (ej. categorías)
   └── assets/
      └── img/Fondo.jpg
   ```

---

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.