import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export const paymentService = {
  // Get semua payment yg success
  getUserPayments: async (userId) => {
    try {
      const q = query(
        collection(db, "payments"),
        where("userId", "==", userId),
        where("status", "==", "success"),
      );

      const querySnapshot = await getDocs(q);
      const payments = [];

      querySnapshot.forEach((doc) => {
        payments.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, data: payments };
    } catch (error) {
      console.error("Error getting payments:", error);
      return { success: false, error: error.message };
    }
  },

  // Get payment dari id
  getPaymentById: async (paymentId) => {
    try {
      const docRef = doc(db, "payments", paymentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: "Payment not found" };
      }
    } catch (error) {
      console.error("Error getting payment:", error);
      return { success: false, error: error.message };
    }
  },
};
