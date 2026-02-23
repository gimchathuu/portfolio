import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'certificates';

export const getCertificates = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting certificates: ", error);
        throw error;
    }
};

export const addCertificate = async (certData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...certData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding certificate: ", error);
        throw error;
    }
};

export const updateCertificate = async (id, certData) => {
    try {
        const certRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(certRef, certData);
    } catch (error) {
        console.error("Error updating certificate: ", error);
        throw error;
    }
};

export const deleteCertificate = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting certificate: ", error);
        throw error;
    }
};
