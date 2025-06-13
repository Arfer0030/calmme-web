"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { authService } from "../../../services/auth";
import { subscriptionService } from "../../../services/subscription";
import Sidebar from "../../../components/Sidebar";

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [processing, setProcessing] = useState(true);

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

  useEffect(() => {
    const paymentIdParam = searchParams.get("paymentId");
    const typeParam = searchParams.get("type");

    if (paymentIdParam && typeParam) {
      setPaymentId(paymentIdParam);
      setPaymentType(typeParam);

      // Complete payment automatically
      completePayment(paymentIdParam);
    } else {
      router.push("/subscribe");
    }
  }, [searchParams, router]);

  const completePayment = async (paymentId) => {
    try {
      setProcessing(true);
      const result = await subscriptionService.completePayment(paymentId);
      if (result.success) {
        setTimeout(() => {
          setProcessing(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error completing payment:", error);
      setProcessing(false);
    }
  };

  const handleViewOrder = () => {
    router.push("/payment-history");
  };

  const handleGetStarted = () => {
    router.push("/home");
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
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userData={userData}
      />

      {/* Main konten */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden absolute left-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
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
          </button>

          <div className="bg-purple-200 px-8 py-2 rounded-full">
            <h1 className="text-2xl font-bold text-gray-800">Subscribe</h1>
          </div>
        </div>

        {/* Progress bar */}
        <div className="p-6">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-b-ungu rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div className="flex-1 h-1 bg-b-ungu mx-2"></div>
              <div className="w-8 h-8 bg-b-ungu rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div className="flex-1 h-1 bg-b-ungu mx-2"></div>
              <div className="w-8 h-8 bg-b-ungu rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Confirmation
            </h2>

            {processing ? (
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 bg-gray-300 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Processing...
                </h3>
                <p className="text-gray-600">
                  Please wait while we process your payment.
                </p>
              </div>
            ) : (
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-purple-600 mb-2">
                  Successful!
                </h3>
                <p className="text-gray-600 mb-8">
                  Your{" "}
                  {paymentType === "subscription"
                    ? "subscription"
                    : "consultation payment"}{" "}
                  is active now.
                </p>

                {/* Button viorder & get started */}
                <div className="space-y-4 flex flex-col items-center">
                  <button
                    onClick={handleViewOrder}
                    className="w-full max-w-xs border-1 border-b-ungu bg-purple-200 text-purple-700 px-8 py-3 rounded-full font-semibold hover:bg-purple-300 transition-colors"
                  >
                    View your order
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="w-full max-w-xs bg-b-ungu text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
