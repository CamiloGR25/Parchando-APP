# PARCHANDO

**PARCHANDO** es una aplicación móvil desarrollada en React Native y Expo que permite a los usuarios:

* Registrarse e iniciar sesión (Firebase Auth)
* Recuperar contraseña
* Explorar y buscar eventos
* Filtrar por fecha, categorías y ubicaciones
* Crear eventos con fecha y hora (react-native-modal-datetime-picker)
* Subir y previsualizar imágenes para los eventos (expo-image-picker + Firebase Storage)
* Guardar eventos favoritos
* Ver los eventos creados por el usuario

---

## Tecnologías

* **React Native** con **Expo**
* **Firebase**:

  * Firestore: almacenamiento de datos de eventos y usuarios
  * Auth: autenticación de usuarios
  * Storage: carga de imágenes de eventos
* **Expo Image Picker** para selección de fotos
* **react-native-modal-datetime-picker** para selección de fecha y hora
* **Context API / Hooks** para manejo de estado

---

## Instalación y configuración

1. Clona el repositorio:

   ```bash
   git clone https://github.com/CamiloGR25/Parchando-APP
   cd Parchando
   ```

2. Instala dependencias:

   ```bash
   npm install
   # o
   yarn install
   ```

3. Configura Firebase:

   * Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
   * Habilita Authentication (Email/Password).
   * Crea una base de datos de Firestore.
   * Habilita Firebase Storage.
   * Copia la configuración de tu app web (apiKey, authDomain, projectId, storageBucket, etc.) y pégala en `src/service/firebaseConfig.js`:

     ```
    const firebaseConfig = {
       apiKey: "TU_API_KEY",
       authDomain: "TU_AUTH_DOMAIN",
       projectId: "TU_PROJECT_ID",
       storageBucket: "TU_STORAGE_BUCKET",
       messagingSenderId: "TU_MESSAGING_SENDER_ID",
       appId: "TU_APP_ID"
     };
     ```

4. Ejecuta la app:

   ```bash
   npx expo start
   ```

   * Escanea el código QR con Expo Go o abre un emulador Android/iOS.

---

## Estructura de carpetas

```
├── App.js
├── index.js
├── src/
│   ├── service/
│   │   ├── firebaseConfig.js
│   │   ├── metro.config.js
│   │   ├── ServiceAuth.js
│   │   ├── ServiceEvent.js
│   │   └── ServiceFavorites.js
│   ├── views/
│   │   ├── CreateEvent.js
│   │   ├── EventDetail.js
│   │   ├── Explore.js
│   │   ├── Favorites.js
│   │   ├── Login.js
│   │   ├── Main.js
│   │   ├── Menu.js
│   │   ├── MyEvents.js
│   │   ├── Recover.js
│   │   ├── Register.js
│   │   ├── Search.js
│   │   └── Start.js
│   └── data/categories.js
└── assets/
    └── img/Fondo.jpg
```

---

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.