import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  where,
  Timestamp,
} from "firebase/firestore";
import { getAuth, updateUser, disableUser, enableUser } from "firebase/auth";
import { db } from "../lib/firebase";

export const userManagementService = {
  // Get all users for admin
  getAllUsers: async () => {
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));

      const querySnapshot = await getDocs(q);
      const users = [];

      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, data: users };
    } catch (error) {
      console.error("Error getting users:", error);
      return { success: false, error: error.message };
    }
  },

  // Update user role
  updateUserRole: async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
        updatedAt: Timestamp.now(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating user role:", error);
      return { success: false, error: error.message };
    }
  },

  // Disable user account
  disableUserAccount: async (userId, reason) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        disabled: true,
        disabledReason: reason,
        disabledAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error disabling user:", error);
      return { success: false, error: error.message };
    }
  },

  // Enable user account
  enableUserAccount: async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        disabled: false,
        disabledReason: null,
        disabledAt: null,
        updatedAt: Timestamp.now(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error enabling user:", error);
      return { success: false, error: error.message };
    }
  },

  // Search users
  searchUsers: async (searchTerm) => {
    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const users = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.email?.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          users.push({ id: doc.id, ...data });
        }
      });

      return { success: true, data: users };
    } catch (error) {
      console.error("Error searching users:", error);
      return { success: false, error: error.message };
    }
  },
};
