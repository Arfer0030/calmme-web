"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth";
import Sidebar from "../../components/Sidebar";
import Image from "next/image";

export default function AssessmentIntroPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleStartTest = () => {
    router.push("/assessment/test");
  };

  const handleBack = () => {
    router.push("/home");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br  from-purple-100 via-blue-50 to-blue-200 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userData={userData}
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-white/50 rounded-lg transition-colors mr-4"
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

          <button
            onClick={handleBack}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors mr-4"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full">
            <h1 className="text-lg font-semibold text-gray-800">
              Self-Assessment Test
            </h1>
          </div>
        </div>

        {/* Content Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card-biru rounded-3xl p-8 text-white relative">
            {/* Decorative Brain Illustration */}
            <div className="absolute -bottom-17 -left-13 ">
              <Image
                src="/images/as-brain.png"
                alt="Brain Illustration"
                width={150}
                height={150}
              />
            </div>

            <div className="relative z-10 px-8">
              <h2 className="text-3xl font-bold mb-4 text-center">
                Let's Start Test!
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Be honest, be calm, and trust yourself. Self-awareness is
                <br />
                the first step to growth.
              </p>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-semibold">
                    1. Read the question carefully.
                  </span>
                  <div className="text-sm opacity-80 ml-4">
                    There are 7 questions that must be answered
                  </div>
                </div>

                <div>
                  <span className="font-semibold">
                    2. Reflect on your real experiences.
                  </span>
                  <div className="text-sm opacity-80 ml-4">
                    Think about how you've reacted, behaved, or felt in similar
                    situations in real life.
                  </div>
                </div>

                <div>
                  <span className="font-semibold">
                    3. Trust your first instinct.
                  </span>
                  <div className="text-sm opacity-80 ml-4">
                    Usually, your first reaction is the most accurate one. Don't
                    overthink.
                  </div>
                </div>

                <div>
                  <span className="font-semibold">
                    4. Choose the option that feels most true to you.
                  </span>
                  <div className="text-sm opacity-80 ml-4">
                    Pick the answer that best represents your usual thoughts,
                    feelings, or behavior even if it doesn't sound "ideal."
                  </div>
                </div>

                <div>
                  <span className="font-semibold">
                    5. Avoid choosing based on what you think is expected.
                  </span>
                  <div className="text-sm opacity-80 ml-4">
                    Be true to yourself. This assessment is for your own
                    growth—not for pleasing others.
                  </div>
                </div>

                <div>
                  <span className="font-semibold">
                    6. Stay relaxed and go at your own pace.
                  </span>
                  <div className="text-sm opacity-80 ml-4">
                    There's no time pressure. The goal is clarity, not speed.
                  </div>
                </div>
              </div>

              <div className="text-right mt-6">
                <span className="text-lg font-script">CalmMe</span>
              </div>
            </div>
          </div>

          {/* Start Test Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleStartTest}
              className="bg-b-ungu text-white px-12 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
