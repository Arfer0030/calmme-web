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
  limit,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export const subscriptionService = {
  // Cek status subscription user
  checkUserSubscriptionStatus: async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          success: true,
          subscriptionStatus: userData.subscriptionStatus || "inactive",
        };
      } else {
        return { success: false, error: "User not found" };
      }
    } catch (error) {
      console.error("Error checking user subscription status:", error);
      return { success: false, error: error.message };
    }
  },

  // Cek pending appointment
  checkPendingAppointments: async (userId) => {
    try {
      const q = query(
        collection(db, "appointments"),
        where("userId", "==", userId),
        where("paymentStatus", "==", "pending"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const appointments = [];
      querySnapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, data: appointments };
    } catch (error) {
      console.error("Error checking pending appointments:", error);
      return { success: false, error: error.message };
    }
  },

  // Buat consultaion payment (basic)
  createConsultationPayment: async (userId, appointmentId) => {
    try {
      const paymentData = {
        userId: userId,
        appointmentId: appointmentId,
        type: "consultation",
        status: "pending",
        paymentMethod: "",
        subscriptionId: null,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "payments"), paymentData);
      await updateDoc(docRef, {
        paymentId: docRef.id,
      });

      return { success: true, id: docRef.id, paymentId: docRef.id };
    } catch (error) {
      console.error("Error creating consultation payment:", error);
      return { success: false, error: error.message };
    }
  },

  // Buat susbcription payment (PLUS)
  createSubscription: async (userId) => {
    try {
      const userStatusResult =
        await subscriptionService.checkUserSubscriptionStatus(userId);
      if (
        userStatusResult.success &&
        userStatusResult.subscriptionStatus === "active"
      ) {
        return {
          success: false,
          error:
            "You already have an active subscription. Please wait until your current subscription expires before purchasing a new one.",
        };
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const subscriptionData = {
        userId: userId,
        status: "", // Empty status initially
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
        paymentMethod: "",
        createdAt: Timestamp.now(),
      };

      const subDocRef = await addDoc(
        collection(db, "subscriptions"),
        subscriptionData
      );
      const subscriptionId = subDocRef.id;

      await updateDoc(subDocRef, {
        subscriptionId: subscriptionId,
      });

      const paymentData = {
        userId: userId,
        appointmentId: null,
        type: "subscription",
        status: "pending",
        paymentMethod: "",
        subscriptionId: subscriptionId,
        createdAt: Timestamp.now(),
      };

      const paymentDocRef = await addDoc(
        collection(db, "payments"),
        paymentData
      );
      const paymentId = paymentDocRef.id;

      await updateDoc(paymentDocRef, {
        paymentId: paymentId,
      });

      return {
        success: true,
        subscriptionId: subscriptionId,
        paymentId: paymentId,
        subscriptionDocId: subDocRef.id,
        paymentDocId: paymentDocRef.id,
      };
    } catch (error) {
      console.error("Error creating subscription:", error);
      return { success: false, error: error.message };
    }
  },

  // Update metode payment
  updatePaymentMethod: async (paymentId, paymentMethod) => {
    try {
      const q = query(
        collection(db, "payments"),
        where("paymentId", "==", paymentId)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const paymentDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "payments", paymentDoc.id), {
          paymentMethod: paymentMethod,
        });

        const paymentData = paymentDoc.data();
        if (paymentData.type === "subscription" && paymentData.subscriptionId) {
          const subQ = query(
            collection(db, "subscriptions"),
            where("subscriptionId", "==", paymentData.subscriptionId)
          );

          const subQuerySnapshot = await getDocs(subQ);
          if (!subQuerySnapshot.empty) {
            const subDoc = subQuerySnapshot.docs[0];
            await updateDoc(doc(db, "subscriptions", subDoc.id), {
              paymentMethod: paymentMethod,
            });
          }
        }

        return { success: true };
      } else {
        return { success: false, error: "Payment not found" };
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
      return { success: false, error: error.message };
    }
  },

  // Finalisasi payment
  completePayment: async (paymentId) => {
    try {
      const q = query(
        collection(db, "payments"),
        where("paymentId", "==", paymentId)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const paymentDoc = querySnapshot.docs[0];
        const paymentData = paymentDoc.data();

        await updateDoc(doc(db, "payments", paymentDoc.id), {
          status: "success",
        });

        if (paymentData.type === "consultation") {
          if (paymentData.appointmentId) {
            await updateDoc(
              doc(db, "appointments", paymentData.appointmentId),
              {
                paymentStatus: "paid",
              }
            );
          }
        } else if (paymentData.type === "subscription") {
          if (paymentData.subscriptionId) {
            const subQ = query(
              collection(db, "subscriptions"),
              where("subscriptionId", "==", paymentData.subscriptionId)
            );

            const subQuerySnapshot = await getDocs(subQ);
            if (!subQuerySnapshot.empty) {
              const subDoc = subQuerySnapshot.docs[0];
              await updateDoc(doc(db, "subscriptions", subDoc.id), {
                status: "active",
              });
            }
          }

          await updateDoc(doc(db, "users", paymentData.userId), {
            subscriptionStatus: "active",
            subscriptionStartDate: Timestamp.now(),
            subscriptionEndDate: (() => {
              const endDate = new Date();
              endDate.setMonth(endDate.getMonth() + 1);
              return Timestamp.fromDate(endDate);
            })(),
            updatedAt: Timestamp.now(),
          });

          const appointmentsQ = query(
            collection(db, "appointments"),
            where("userId", "==", paymentData.userId),
            where("paymentStatus", "==", "pending")
          );

          const appointmentsSnapshot = await getDocs(appointmentsQ);
          const updatePromises = appointmentsSnapshot.docs.map(
            (appointmentDoc) =>
              updateDoc(doc(db, "appointments", appointmentDoc.id), {
                paymentStatus: "paid",
              })
          );

          await Promise.all(updatePromises);
        }

        return { success: true };
      } else {
        return { success: false, error: "Payment not found" };
      }
    } catch (error) {
      console.error("Error completing payment:", error);
      return { success: false, error: error.message };
    }
  },
};
