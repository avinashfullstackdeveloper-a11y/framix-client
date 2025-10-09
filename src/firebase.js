import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCoJf6h89OPF37uuh1OZ4GXmPgP_sKCZ3M",
  authDomain: "webapp-9aa54.firebaseapp.com",
  projectId: "webapp-9aa54",
  storageBucket: "webapp-9aa54.firebasestorage.app",
  messagingSenderId: "438947888282",
  appId: "1:438947888282:web:03a3b27a493ea4b7813323",
  measurementId: "G-EPT13Q48ED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exports
export const auth = getAuth(app);
export const db = getFirestore(app);