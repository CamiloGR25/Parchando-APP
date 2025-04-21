import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const ServiceCreateEvent = async (eventData) => {
    try {
        const docRef = await addDoc(collection(db, "eventos"), {
            ...eventData,
            createdAt: Timestamp.now(),
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getEvents = async () => {
    try {
        const snapshot = await getDocs(collection(db, "eventos"));
        const eventos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return { success: true, data: eventos };
    } catch (error) {
        return { success: false, error: error.message };
    }
};


