import { doc, updateDoc, Timestamp } from "firebase/firestore";
import {
  verifyBeforeUpdateEmail,
  sendEmailVerification,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { db, auth } from "../lib/firebase";

export const profileService = {
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

  updateEmailWithAuth: async (userId, newEmail, currentPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      if (currentPassword) {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
      }

      await verifyBeforeUpdateEmail(user, newEmail);

      await profileService.updateProfile(userId, {
        pendingEmail: newEmail, 
        emailVerified: false, 
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating email:", error);
      let errorMessage = error.message;

      if (error.code === "auth/requires-recent-login") {
        errorMessage =
          "Please re-authenticate by entering your current password.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use by another account.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect current password.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage =
          "Email update operation not allowed. Please contact support.";
      }
      return { success: false, error: errorMessage };
    }
  },

  syncEmailToFirestore: async (userId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      const currentAuthEmail = user.email;

      await profileService.updateProfile(userId, {
        email: currentAuthEmail,
        emailVerified: user.emailVerified,
        pendingEmail: null, 
      });

      return { success: true };
    } catch (error) {
      console.error("Error syncing email to Firestore:", error);
      return { success: false, error: error.message };
    }
  },

  logoutUser: async (userId = null) => {
    try {
      if (userId) {
        await profileService.syncEmailToFirestore(userId);
      }
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      return { success: false, error: error.message };
    }
  },

  reauthenticateUser: async (currentPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      return { success: true };
    } catch (error) {
      console.error("Error re-authenticating user:", error);
      let errorMessage = error.message;
      
      if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      }
      
      return { success: false, error: errorMessage };
    }
  },

  updatePassword: async (newPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      await updatePassword(user, newPassword);
      return { success: true };
    } catch (error) {
      console.error("Error updating password:", error);
      let errorMessage = error.message;
      
      if (error.code === "auth/requires-recent-login") {
        errorMessage = "Please re-authenticate first before changing password.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }
      
      return { success: false, error: errorMessage };
    }
  },
};
