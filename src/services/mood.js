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
  startOfDay,
  endOfDay,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export const moodService = {
  // Save or update mood for today
  saveMood: async (userId, moodId, moodLabel) => {
    try {
      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
      );

      // Check if mood already exists for today
      const q = query(
        collection(db, "moods"),
        where("userId", "==", userId),
        where("date", ">=", Timestamp.fromDate(startOfToday)),
        where("date", "<=", Timestamp.fromDate(endOfToday))
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Update existing mood
        const existingDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "moods", existingDoc.id), {
          moodId,
          moodLabel,
          updatedAt: Timestamp.now(),
        });
        return { success: true, action: "updated" };
      } else {
        // Create new mood entry
        await addDoc(collection(db, "moods"), {
          userId,
          moodId,
          moodLabel,
          date: Timestamp.now(),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        return { success: true, action: "created" };
      }
    } catch (error) {
      console.error("Error saving mood:", error);
      return { success: false, error: error.message };
    }
  },

  // Get mood history for a user
  getMoodHistory: async (userId, days = 30) => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const q = query(
        collection(db, "moods"),
        where("userId", "==", userId),
        where("date", ">=", Timestamp.fromDate(startDate)),
        where("date", "<=", Timestamp.fromDate(endDate)),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);
      const moods = [];
      querySnapshot.forEach((doc) => {
        moods.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, data: moods };
    } catch (error) {
      console.error("Error getting mood history:", error);
      return { success: false, error: error.message };
    }
  },

  // Get last 7 days mood
  getLast7DaysMood: async (userId) => {
    try {
      const result = await moodService.getMoodHistory(userId, 7);
      if (result.success) {
        // Create array for last 7 days
        const last7Days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);

          const dayMood = result.data.find((mood) => {
            const moodDate = mood.date.toDate();
            return moodDate.toDateString() === date.toDateString();
          });

          last7Days.push({
            date: date,
            mood: dayMood || null,
            dayName: date.toLocaleDateString("en", { weekday: "short" }),
            dayNumber: date.getDate(),
          });
        }

        return { success: true, data: last7Days };
      }
      return result;
    } catch (error) {
      console.error("Error getting last 7 days mood:", error);
      return { success: false, error: error.message };
    }
  },

  // Calculate streak
  calculateStreak: async (userId) => {
    try {
      const result = await moodService.getMoodHistory(userId, 365); // Get full year
      if (result.success) {
        let streak = 0;
        const today = new Date();

        // Check consecutive days from today backwards
        for (let i = 0; i < 365; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);

          const dayMood = result.data.find((mood) => {
            const moodDate = mood.date.toDate();
            return moodDate.toDateString() === checkDate.toDateString();
          });

          if (dayMood) {
            streak++;
          } else {
            break;
          }
        }

        return { success: true, streak };
      }
      return result;
    } catch (error) {
      console.error("Error calculating streak:", error);
      return { success: false, error: error.message };
    }
  },

  // Get mood statistics for chart
  getMoodStats: async (userId, period = "week") => {
    try {
      let days;
      switch (period) {
        case "week":
          days = 7;
          break;
        case "month":
          days = 30;
          break;
        case "year":
          days = 365;
          break;
        default:
          days = 7;
      }

      const result = await moodService.getMoodHistory(userId, days);
      if (result.success) {
        const moodCounts = {};
        const totalMoods = result.data.length;

        result.data.forEach((mood) => {
          moodCounts[mood.moodLabel] = (moodCounts[mood.moodLabel] || 0) + 1;
        });

        const moodStats = Object.entries(moodCounts).map(([mood, count]) => ({
          mood,
          count,
          percentage:
            totalMoods > 0 ? Math.round((count / totalMoods) * 100) : 0,
        }));

        return { success: true, data: moodStats, total: totalMoods };
      }
      return result;
    } catch (error) {
      console.error("Error getting mood stats:", error);
      return { success: false, error: error.message };
    }
  },
};
