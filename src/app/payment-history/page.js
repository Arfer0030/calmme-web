"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth";
import { paymentService } from "../../services/payment";
import Sidebar from "../../components/Sidebar";
import PaymentCard from "../../components/PaymentCard";

export default function PaymentHistoryPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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

  useEffect(() => {
    const fetchPayments = async () => {
      if (user) {
        setLoadingPayments(true);
        try {
          const result = await paymentService.getUserPayments(user.uid);
          if (result.success) {
            setPayments(result.data);
          }
        } catch (error) {
          console.error("Error fetching payments:", error);
        } finally {
          setLoadingPayments(false);
        }
      }
    };

    fetchPayments();
  }, [user]);

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
    <div className="flex h-screen bg-purple-100 overflow-hidden">
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
      <div className="flex-1 flex flex-col overflow-hidden overflow-x-auto">
        {/* Header */}
        <div className="bg-gradient-to-b from-purple-200 to-white backdrop-blur-sm shadow-sm p-6">
          <div className="flex items-center">
            {/* Button */}
            <button
              onClick={handleToggleSidebar}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors z-10"
              aria-label={
                sidebarOpen ? "Close sidebar menu" : "Open sidebar menu"
              }
            >
              {sidebarOpen ? (
                // Icon close
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
                // Icon open
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

            <h1 className="text-2xl pl-4 font-bold text-gray-800">
              Order History
            </h1>
          </div>
        </div>

        {/* Card histori payment user */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {loadingPayments ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-purple-300 rounded-3xl p-6 animate-pulse"
                  >
                    <div className="h-6 bg-purple-400 rounded mb-4"></div>
                    <div className="h-4 bg-purple-400 rounded mb-2"></div>
                    <div className="h-4 bg-purple-400 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {payments.map((payment) => (
                  <PaymentCard key={payment.id} payment={payment} />
                ))}
              </div>
            )}

            {!loadingPayments && payments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">
                  No payment history found.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
