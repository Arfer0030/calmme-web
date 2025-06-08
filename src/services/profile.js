import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export const profileService = {
  // Update user profile
  updateProfile: async (userId, profileData) => {
    try {
      const userRef = doc(db, "users", userId);
      const updateData = {
        ...profileData,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(userRef, updateData);
      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message };
    }
  },
};
