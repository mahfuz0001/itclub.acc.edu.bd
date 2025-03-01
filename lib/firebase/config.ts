import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// }

const firebaseConfig = {
  apiKey: "AIzaSyAhz7U_B6WHWnNbiekDT6KsV80tHeV7wno",
  authDomain: "accitc-1f636.firebaseapp.com",
  projectId: "accitc-1f636",
  storageBucket: "accitc-1f636.firebasestorage.app",
  messagingSenderId: "414570148161",
  appId: "1:414570148161:web:7fe7e26f4dabd9eb26b1c0",
  measurementId: "G-NQ5WRMDBM2",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
