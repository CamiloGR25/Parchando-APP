// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyB3RSwCBIiqstPaYWdqmwT3JzeFkVOdyGk",
    authDomain: "parchando-abb40.firebaseapp.com",
    projectId: "parchando-abb40",
    storageBucket: "parchando-abb40.firebasestorage.app",
    messagingSenderId: "1016879957228",
    appId: "1:1016879957228:web:0d49ae205a855ae62a11c9",
    measurementId: "G-WW523TM3BR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Obtiene y exporta la instancia de auth
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export { app, db, auth };