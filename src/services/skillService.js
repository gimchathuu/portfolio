import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'skills';

export const getSkills = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc')); // Assuming 'order' field or just simple fetch
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting skills: ", error);
        throw error;
    }
};

export const addSkill = async (skillData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...skillData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding skill: ", error);
        throw error;
    }
};

export const updateSkill = async (id, skillData) => {
    try {
        const skillRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(skillRef, skillData);
    } catch (error) {
        console.error("Error updating skill: ", error);
        throw error;
    }
};

export const deleteSkill = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting skill: ", error);
        throw error;
    }
};
