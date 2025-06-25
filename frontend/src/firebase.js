// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBL8cyRNyX-vCIM1E--GtBF7hLT1n3tfTE",
  authDomain: "ecommerce-website-e8eaa.firebaseapp.com",
  projectId: "ecommerce-website-e8eaa",
  storageBucket: "ecommerce-website-e8eaa.firebasestorage.app",
  messagingSenderId: "678733371659",
  appId: "1:678733371659:web:ba12740b7a6a49e909ea0e",
  measurementId: "G-7PCQ20P714"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
