// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyANxGrUQfB8s-J8LTrNvq0XHsWmp3M9ynA",
  authDomain: "realtime2025-998d8.firebaseapp.com",
  databaseURL: "https://realtime2025-998d8-default-rtdb.firebaseio.com",
  projectId: "realtime2025-998d8",
  storageBucket: "realtime2025-998d8.firebasestorage.app",
  //storageBucket: "realtime2025-998d8.appspot.com",
  messagingSenderId: "752746460964",
  appId: "1:752746460964:web:d3b16a63131436224d65b1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Inicializa Auth con AsyncStorage para que persista el login
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Para subir/descargar imágenes
const storage = getStorage(app);

export { app, db, auth, storage };