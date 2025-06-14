import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  reload,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { profileService } from "./profile";

export const authService = {
  // Login dengan email
  loginWithEmail: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await reload(userCredential.user);

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

  // Register user baru dengan email verification
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

      await sendEmailVerification(userCredential.user);

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

      return {
        success: true,
        user: userCredential.user,
        message:
          "Account created successfully! Please check your email for verification.",
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check email verification status
  checkEmailVerificationStatus: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return { success: false, error: "No user signed in" };

      await reload(user);

      if (user.emailVerified) {
        // Update status di Firestore
        await authService.updateEmailVerificationStatus(user.uid, true);
        return { success: true, verified: true };
      }

      return { success: true, verified: false };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update email verification status
  updateEmailVerificationStatus: async (userId, isVerified) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        emailVerified: isVerified,
        updatedAt: Timestamp.now(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating email verification status:", error);
      return { success: false, error: error.message };
    }
  },

  // Resend email verification
  resendEmailVerification: async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "No user signed in" };
      }

      await sendEmailVerification(user);
      return {
        success: true,
        message: "Verification email sent successfully!",
      };
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
      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.email !== user.email) {
          await profileService.syncEmailToFirestore(user.uid);
          const updatedDoc = await getDoc(doc(db, "users", user.uid));
          return updatedDoc.exists() ? updatedDoc.data() : null;
        }

        return userData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  },
};
