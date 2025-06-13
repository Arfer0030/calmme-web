"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth";
import { subscriptionService } from "@/services/subscription";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";


export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [paymentType, setPaymentType] = useState("");

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
    } else {
      router.push("/subscribe");
    }
  }, [searchParams, router]);

  const paymentMethods = [
    {
      id: "bank",
      name: "Bank",
      icon: "/icons/ic_bank.png",
    },
    {
      id: "shopeepay",
      name: "Shopeepay",
      icon: "/icons/ic_spay.png",
    },
    {
      id: "dana",
      name: "Dana",
      icon: "/icons/ic_dana.png",
    },
  ];

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
  };

  const handleAdd = async () => {
    if (!selectedPayment || !paymentId) return;

    try {
      const result = await subscriptionService.updatePaymentMethod(
        paymentId,
        selectedPayment
      );
      if (result.success) {
        router.push(
          `/subscribe/confirmation?paymentId=${paymentId}&type=${paymentType}`
        );
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
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
              <div className="flex-1 h-1 bg-purple-300 mx-2"></div>
              <div className="w-8 h-8 bg-purple-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-bold">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
              Payment
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Select your payment method
            </p>

            {/* Metode payment */}
            <div className="space-y-4 mb-8">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handlePaymentSelect(method.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                    selectedPayment === method.id
                      ? "bg-white shadow-lg ring-2 ring-purple-500"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      <Image
                        src={method.icon}
                        alt={method.name}
                        width={40}
                        height={20}
                        className="w-12 h-5 object-contain"
                      />
                    </div>
                    <span className="font-medium text-b-ungu">
                      {method.name}
                    </span>
                  </div>
                  <svg
                    className="w-6 h-6 text-b-ungu"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>

            {/* Button Add */}
            <div className="text-center">
              <button
                onClick={handleAdd}
                disabled={!selectedPayment}
                className="bg-b-ungu text-white px-12 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ADD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
