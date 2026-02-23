import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDg_-xt-PK-sPTUQzc9fic_4_Tp15GVtxs",
    authDomain: "portfolioadmin-7fff5.firebaseapp.com",
    projectId: "portfolioadmin-7fff5",
    storageBucket: "portfolioadmin-7fff5.firebasestorage.app",
    messagingSenderId: "680407070022",
    appId: "1:680407070022:web:b0a9d86860b0d0762ee147"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
