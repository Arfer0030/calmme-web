import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
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
};
