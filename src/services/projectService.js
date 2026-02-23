import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'projects';

export const getProjects = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting projects: ", error);
        throw error;
    }
};

export const addProject = async (projectData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...projectData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding project: ", error);
        throw error;
    }
};

export const updateProject = async (id, projectData) => {
    try {
        const projectRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(projectRef, projectData);
    } catch (error) {
        console.error("Error updating project: ", error);
        throw error;
    }
};

export const deleteProject = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting project: ", error);
        throw error;
    }
};
