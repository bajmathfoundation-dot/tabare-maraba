import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBGerm6n6NeHyWVu7V-oP7nFLSH7vg8Avg",
  authDomain: "tabare-maraba.firebaseapp.com",
  projectId: "tabare-maraba",
  storageBucket: "tabare-maraba.firebasestorage.app",
  messagingSenderId: "204144494424",
  appId: "1:204144494424:web:82e1006399c1b94eb9c72d",
  measurementId: "G-50F5VT9W12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in your app
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
