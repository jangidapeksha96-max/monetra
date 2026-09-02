import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAiNdAQVVEoybdWCZZLTIvTC5Nld0iwn9w",
  authDomain: "monetra-16689.firebaseapp.com",
  projectId: "monetra-16689",
  storageBucket: "monetra-16689.firebasestorage.app",
  messagingSenderId: "45648007995",
  appId: "1:45648007995:web:85e9e3ca2a2b7294229d1e",
  measurementId: "G-ND6YZPL0KM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;