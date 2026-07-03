// Authentication
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Firestore
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  arrayUnion,
  orderBy,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAtGc0sejNUZ3acPxoPUw6EhJf_dg7wZnc",
    authDomain: "helplytics-ai-68f36.firebaseapp.com",
    projectId: "helplytics-ai-68f36",
    storageBucket: "helplytics-ai-68f36.firebasestorage.app",
    messagingSenderId: "335089201340",
    appId: "1:335089201340:web:1559b0f5dd140ce3cee0b9",
    measurementId: "G-CE71REDNS3"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export {
  auth,
  db,
  provider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  arrayUnion,
  orderBy,
  onSnapshot,
};