// Importaciones necesarias
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, browserLocalPersistence, getReactNativePersistence } from "firebase/auth";
import { Platform } from "react-native";

// Configuración
const firebaseConfig = {
    apiKey: "AIzaSyB3RSwCBIiqstPaYWdqmwT3JzeFkVOdyGk",
    authDomain: "parchando-abb40.firebaseapp.com",
    projectId: "parchando-abb40",
    storageBucket: "parchando-abb40.firebasestorage.app",
    messagingSenderId: "1016879957228",
    appId: "1:1016879957228:web:0d49ae205a855ae62a11c9",
    measurementId: "G-WW523TM3BR"
};

// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Inicializa auth según plataforma
let auth;

if (Platform.OS === 'web') {
    auth = getAuth(app);
    auth.setPersistence(browserLocalPersistence);
} else {
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
}

export { app, db, auth };
