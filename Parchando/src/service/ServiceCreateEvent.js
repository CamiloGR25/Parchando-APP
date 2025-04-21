import { collection, addDoc, Timestamp } from "firebase/firestore";
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
