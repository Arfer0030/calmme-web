import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export const authService = {
  // Login dengan email
  loginWithEmail: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login dengan username
  loginWithUsername: async (username, password) => {
    try {
      const email = await authService.getEmailByUsername(username);
      if (!email) {
        return { success: false, error: "Username not found" };
      }
      return await authService.loginWithEmail(email, password);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Register user baru
  register: async (userData) => {
    try {
      // Cek username unik
      const usernameExists = await authService.isUsernameExists(
        userData.username
      );
      if (usernameExists) {
        return { success: false, error: "Username already exists" };
      }

      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Simpan ke Firestore
      const userMap = {
        username: userData.username.toLowerCase(),
        email: userData.email,
        gender: "",
        dateOfBirth: "",
        role: "user",
        subscriptionStatus: "inactive",
        subscriptionStartDate: "",
        subscriptionEndDate: "",
        emailVerified: false,
        profilePicture: "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userMap);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get email dari username
  getEmailByUsername: async (username) => {
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username.toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data().email;
      }
      return null;
    } catch (error) {
      console.error("Error finding user by username:", error);
      return null;
    }
  },

  // Check username 
  isUsernameExists: async (username) => {
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username.toLowerCase())
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking username:", error);
      return false;
    }
  },

  // Get user data saat ini
  getCurrentUserData: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  },
};
