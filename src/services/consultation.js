import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export const consultationService = {
  // Buat konsultasi baru
  createConsultation: async (consultationData) => {
    try {
      const docRef = await addDoc(collection(db, "consultations"), {
        ...consultationData,
        status: "pending",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get konsultasi by user
  getUserConsultations: async (userId) => {
    try {
      const q = query(
        collection(db, "consultations"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const consultations = [];
      querySnapshot.forEach((doc) => {
        consultations.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: consultations };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update status konsultasi
  updateConsultationStatus: async (consultationId, status) => {
    try {
      await updateDoc(doc(db, "consultations", consultationId), {
        status,
        updatedAt: Timestamp.now(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
