import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebaseConfig";

export const registerUser = async ({ username, email, password }) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (username) {
            await updateProfile(user, { displayName: username });
        }

        return { success: true, user };
    } catch (error) {
        let errorMessage;
        switch (error.code) {
            case "auth/email-already-in-use":
                errorMessage = "Este correo electrónico ya está en uso";
                break;
            case "auth/invalid-email":
                errorMessage = "El formato del correo electrónico no es válido";
                break;
            case "auth/weak-password":
                errorMessage = "La contraseña es demasiado débil";
                break;
            default:
                errorMessage = error.message;
        }

        return { success: false, error: errorMessage };
    }
};


export const loginUser = async ({ email, password }) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        let errorMessage;
        switch (error.code) {
            case "auth/user-not-found":
                errorMessage = "Usuario no encontrado. Verifica el correo.";
                break;
            case "auth/invalid-credential":
                errorMessage = "Contraseña incorrecta.";
                break;
            case "auth/invalid-email":
                errorMessage = "El formato del correo no es válido.";
                break;
            default:
                errorMessage = error.message;
        }

        return { success: false, error: errorMessage };
    }
};

export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error) {
        let errorMessage;
        switch (error.code) {
            case "auth/user-not-found":
                errorMessage = "No se encontró un usuario con ese correo.";
                break;
            case "auth/invalid-email":
                errorMessage = "El correo electrónico no es válido.";
                break;
            default:
                errorMessage = error.message;
        }

        return { success: false, error: errorMessage };
    }
};
