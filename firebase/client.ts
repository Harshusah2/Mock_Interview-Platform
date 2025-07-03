import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWcguiHV98xqFF1NiiMc5pxlDSAXGrFQ4",
  authDomain: "aiinterviewiq.firebaseapp.com",
  projectId: "aiinterviewiq",
  storageBucket: "aiinterviewiq.firebasestorage.app",
  messagingSenderId: "132357315648",
  appId: "1:132357315648:web:71412b18844b2681ced3a5",
  measurementId: "G-60FZHGP02H"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);