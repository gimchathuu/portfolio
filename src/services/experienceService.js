import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'experience';

export const getExperiences = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('startDate', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting experiences: ", error);
        throw error;
    }
};

export const addExperience = async (experienceData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...experienceData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding experience: ", error);
        throw error;
    }
};

export const updateExperience = async (id, experienceData) => {
    try {
        const experienceRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(experienceRef, experienceData);
    } catch (error) {
        console.error("Error updating experience: ", error);
        throw error;
    }
};

export const deleteExperience = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting experience: ", error);
        throw error;
    }
};
