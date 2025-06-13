import {
  doc,
  updateDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export const userService = {
  // Update profile user
  updateProfile: async (userId, profileData) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        ...profileData,
        updatedAt: Timestamp.now(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      }
      return { success: false, error: "User not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update subscription
  updateSubscription: async (userId, subscriptionData) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        subscriptionStatus: subscriptionData.status,
        subscriptionStartDate: subscriptionData.startDate,
        subscriptionEndDate: subscriptionData.endDate,
        updatedAt: Timestamp.now(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Cari email dari username
  getEmailByUsername: async (username) => {
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username.toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return userDoc.data().email;
      }
      return null;
    } catch (error) {
      console.error("Error finding user by username:", error);
      return null;
    }
  },

  // Cek username sudah ada
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
};
