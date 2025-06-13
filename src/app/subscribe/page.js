"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth";
import { subscriptionService } from "../../services/subscription";
import Sidebar from "../../components/Sidebar";
import CustomDialog from "../../components/CustomDialog";
import Image from "next/image";

export default function SubscribePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loadingCheck, setLoadingCheck] = useState(false);

  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const showDialog = (title, message, type = "info") => {
    setDialog({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeDialog = () => {
    setDialog({
      isOpen: false,
      title: "",
      message: "",
      type: "info",
    });
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const data = await authService.getCurrentUserData();
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleBuyNow = async () => {
    if (!selectedPlan) return;

    setLoadingCheck(true);

    try {
      if (selectedPlan === "basic") {
        const result = await subscriptionService.checkPendingAppointments(
          user.uid
        );
        if (result.success && result.data.length > 0) {
          const latestAppointment = result.data[0];
          const paymentResult =
            await subscriptionService.createConsultationPayment(
              user.uid,
              latestAppointment.id
            );

          if (paymentResult.success) {
            router.push(
              `/subscribe/payment?paymentId=${paymentResult.paymentId}&type=consultation`
            );
          } else {
            showDialog("Payment Error", paymentResult.error, "error");
          }
        } else {
          showDialog(
            "No Appointments Found",
            "No pending appointments found. Please book an appointment first.",
            "warning"
          );
        }
      } else if (selectedPlan === "plus") {
        const statusResult =
          await subscriptionService.checkUserSubscriptionStatus(user.uid);
        if (
          statusResult.success &&
          statusResult.subscriptionStatus === "active"
        ) {
          showDialog(
            "Active Subscription",
            "You already have an active subscription. Please wait until your current subscription expires before purchasing a new one.",
            "warning"
          );
          return;
        }

        const result = await subscriptionService.createSubscription(user.uid);
        if (result.success) {
          router.push(
            `/subscribe/payment?paymentId=${result.paymentId}&type=subscription`
          );
        } else {
          showDialog("Subscription Error", result.error, "error");
        }
      }
    } catch (error) {
      console.error("Error processing plan selection:", error);
      showDialog("Error", "An error occurred. Please try again.", "error");
    } finally {
      setLoadingCheck(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gradient-to-b from-purple-200 via-gray-100 to-purple-200 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-40" : "w-0"
        }`}
      >
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userData={userData}
        />
      </div>

      {/* Main konten */}
      <div className="flex-1 flex flex-col p-5 overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          {/* Container */}
          <div className="flex items-center mb-6">
            {/* Button */}
            <button
              onClick={handleToggleSidebar}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors z-10"
              aria-label={
                sidebarOpen ? "Close sidebar menu" : "Open sidebar menu"
              }
            >
              {sidebarOpen ? (
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            {/* Title */}
            <h1 className="flex-1 text-center text-2xl sm:text-3xl font-bold text-gray-800 px-2">
              Subscribe
            </h1>
            <div className="w-10" aria-hidden="true"></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="p-6">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-b-ungu rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div className="flex-1 h-1 bg-purple-300 mx-2"></div>
              <div className="w-8 h-8 bg-purple-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-bold">2</span>
              </div>
              <div className="flex-1 h-1 bg-purple-300 mx-2"></div>
              <div className="w-8 h-8 bg-purple-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-bold">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Konten */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Choose
            </h2>
            <p className="text-gray-600 mb-8">
              Unlock 1x or monthly consultations by subscribing now, and enjoy
              <br />
              exclusive sessions with top-rated psychologists.
            </p>

            {/* Card plan */}
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
              {/* Basic plan */}
              <div
                className={`bg-gradient-to-br from-purple-200 to-cyan-100 rounded-3xl p-6 cursor-pointer transition-all ${
                  selectedPlan === "basic"
                    ? "ring-4 ring-b-ungu scale-105"
                    : "hover:scale-105"
                }`}
                onClick={() => handlePlanSelect("basic")}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-b-ungu text-left">
                    BASIC
                  </h3>
                  <Image
                    src="/icons/ic_crown.png"
                    alt="Basic Plan Icon"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-b-ungu mb-1">
                    Rp 50.000,00 / consultation
                  </div>
                  <p className="text-sm text-b-ungu">
                    Enjoy 1x consultation access.
                  </p>
                </div>
              </div>

              {/* Plus plan */}
              <div
                className={`bg-gradient-to-br from-cyan-200 to-yellow-100 rounded-3xl p-6 cursor-pointer transition-all ${
                  selectedPlan === "plus"
                    ? "ring-4 ring-cyan-700 scale-105"
                    : "hover:scale-105"
                }`}
                onClick={() => handlePlanSelect("plus")}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-cyan-700">PLUS</h3>
                  <Image
                    src="/icons/ic_crown.png"
                    alt="Plus Plan Icon"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-cyan-700 mb-1">
                    Rp 275.000,00 / month
                  </div>
                  <p className="text-sm text-cyan-700">
                    Get 1 year of unlimited consultation access.
                  </p>
                </div>
              </div>
            </div>

            {/* Button Buy Now */}
            <button
              onClick={handleBuyNow}
              disabled={!selectedPlan || loadingCheck}
              className="bg-b-ungu text-white px-12 py-3 rounded-full font-semibold hover:bg-h-ungu transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingCheck ? "Processing..." : "BUY NOW"}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Dialog */}
      <CustomDialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        buttonText="OK"
      />
    </div>
  );
}
