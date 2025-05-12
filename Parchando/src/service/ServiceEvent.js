import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";


export const ServiceCreateEvent = async (userId, eventData) => {
    try {
        const docRef = await addDoc(collection(db, "users", userId, "myevents"), {
            ...eventData,
            createdAt: Timestamp.now(),
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getUserEvents = async (userId) => {
    try {
        const snapshot = await getDocs(collection(db, "users", userId, "myevents"));
        const eventos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return { success: true, data: eventos };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getGeneralEvents = async () => {
    try {
        const snapshot = await getDocs(collection(db, "eventos")); 
        const eventosGenerales = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return { success: true, data: eventosGenerales };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

