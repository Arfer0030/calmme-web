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

export const psychologistService = {
  // Get all psychologists with profile pictures
  getAllPsychologists: async () => {
    try {
      const q = query(
        collection(db, "psychologists"),
        where("isAvailable", "==", true),
        orderBy("name", "asc")
      );

      const querySnapshot = await getDocs(q);
      const psychologists = [];

      // Get psychologists data
      for (const docSnapshot of querySnapshot.docs) {
        const psychologistData = { id: docSnapshot.id, ...docSnapshot.data() };

        // Get profile picture from users collection using userId
        if (psychologistData.userId) {
          const profilePicture = await psychologistService.getProfilePicture(
            psychologistData.userId
          );
          psychologistData.profilePicture = profilePicture;
        }

        psychologists.push(psychologistData);
      }

      return { success: true, data: psychologists };
    } catch (error) {
      console.error("Error getting psychologists:", error);
      return { success: false, error: error.message };
    }
  },

  // Get profile picture from users collection
  getProfilePicture: async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        return userData.profilePicture || null;
      } else {
        console.log("User document not found for userId:", userId);
        return null;
      }
    } catch (error) {
      console.error("Error getting profile picture:", error);
      return null;
    }
  },

  // Search psychologists by name with profile pictures
  searchPsychologists: async (searchTerm) => {
    try {
      const q = query(
        collection(db, "psychologists"),
        where("isAvailable", "==", true),
        orderBy("name", "asc")
      );

      const querySnapshot = await getDocs(q);
      const psychologists = [];

      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        if (data.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          const psychologistData = { id: docSnapshot.id, ...data };

          // Get profile picture
          if (psychologistData.userId) {
            const profilePicture = await psychologistService.getProfilePicture(
              psychologistData.userId
            );
            psychologistData.profilePicture = profilePicture;
          }

          psychologists.push(psychologistData);
        }
      }

      return { success: true, data: psychologists };
    } catch (error) {
      console.error("Error searching psychologists:", error);
      return { success: false, error: error.message };
    }
  },

  // Get psychologist by ID with profile picture
  getPsychologistById: async (psychologistId) => {
    try {
      const docRef = doc(db, "psychologists", psychologistId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const psychologistData = { id: docSnap.id, ...docSnap.data() };

        // Get profile picture
        if (psychologistData.userId) {
          const profilePicture = await psychologistService.getProfilePicture(
            psychologistData.userId
          );
          psychologistData.profilePicture = profilePicture;
        }

        return { success: true, data: psychologistData };
      } else {
        return { success: false, error: "Psychologist not found" };
      }
    } catch (error) {
      console.error("Error getting psychologist:", error);
      return { success: false, error: error.message };
    }
  },

  // Get schedules for a psychologist
  getPsychologistSchedules: async (psychologistId) => {
    try {
      const q = query(
        collection(db, "schedules"),
        where("psychologistId", "==", psychologistId)
      );

      const querySnapshot = await getDocs(q);
      const schedules = [];

      querySnapshot.forEach((doc) => {
        schedules.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, data: schedules };
    } catch (error) {
      console.error("Error getting schedules:", error);
      return { success: false, error: error.message };
    }
  },
};
