import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inisialisasi Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export default app;

  // Cari email dari username
export const getEmailByUsername = async (username) => {
  try {
    const q = query(
      collection(db, 'users'), 
      where('username', '==', username.toLowerCase())
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data().email;
    }
    return null;
  } catch (error) {
    console.error('Error finding user by username:', error);
    return null;
  }
};

// Cek username sudah ada
export const isUsernameExists = async (username) => {
  try {
    const q = query(
      collection(db, 'users'), 
      where('username', '==', username.toLowerCase())
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
};