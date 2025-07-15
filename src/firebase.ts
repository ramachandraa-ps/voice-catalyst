import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBhA8JiV7X9PZeoAl4u8TrB8Jwyj-9DaiA",
  authDomain: "say2sell-bba9e.firebaseapp.com",
  projectId: "say2sell-bba9e",
  storageBucket: "say2sell-bba9e.appspot.com",
  messagingSenderId: "885006803118",
  appId: "1:885006803118:web:ab1de37d31a58971ec4d3f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app; 