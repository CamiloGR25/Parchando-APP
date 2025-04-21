import { db } from './firebaseConfig';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

export const addToFavorites = async (uid, event) => {
    const ref = doc(db, `users/${uid}/favorites`, event.id);
    await setDoc(ref, event);
};

export const removeFromFavorites = async (uid, eventId) => {
    const ref = doc(db, `users/${uid}/favorites`, eventId);
    await deleteDoc(ref);
};

export const isFavorite = async (uid, eventId) => {
    const ref = doc(db, `users/${uid}/favorites`, eventId);
    const docSnap = await getDoc(ref);
    return docSnap.exists();
};
