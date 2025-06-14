"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth";
import Image from "next/image";
import DashboardLayout from "@/components/DashboardLayout";

export default function AssessmentIntroPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);

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
    <DashboardLayout
      title="Self-Assessment Test"
      showBackButton
      onBackClick={handleBack}
      backgroundColor="bg-gradient-to-br from-purple-100 via-blue-50 to-blue-200"
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card-biru rounded-3xl p-5 sm:p-6 md:p-8 text-white relative">
          {/* Gambar brain */}
          <div className="absolute -bottom-17 -left-13 hidden md:block">
            <Image
              src="/images/as-brain.png"
              alt="Brain image"
              width={140}
              height={140}
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
              Let's Start Test!
            </h2>
            <p className="text-base sm:text-lg mb-6 opacity-90 text-center sm:text-left">
              Be honest, be calm, and trust yourself. Self-awareness is
              <br />
              the first step to growth.
            </p>

            <div className="space-y-4 text-sm sm:text-base">
              {[
                {
                  title: "1. Read the question carefully.",
                  desc: "There are 7 questions that must be answered",
                },
                {
                  title: "2. Reflect on your real experiences.",
                  desc:
                    "Think about how you've reacted, behaved, or felt in similar situations in real life.",
                },
                {
                  title: "3. Trust your first instinct.",
                  desc:
                    "Usually, your first reaction is the most accurate one. Don't overthink.",
                },
                {
                  title: "4. Choose the option that feels most true to you.",
                  desc:
                    'Pick the answer that best represents your usual thoughts, feelings, or behavior even if it doesn\'t sound "ideal."',
                },
                {
                  title: "5. Avoid choosing based on what you think is expected.",
                  desc:
                    "Be true to yourself. This assessment is for your own growth—not for pleasing others.",
                },
                {
                  title: "6. Stay relaxed and go at your own pace.",
                  desc:
                    "There's no time pressure. The goal is clarity, not speed.",
                },
              ].map((item, index) => (
                <div key={index}>
                  <span className="font-semibold">{item.title}</span>
                  <div className="text-sm opacity-80 ml-4">{item.desc}</div>
                </div>
              ))}
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
    </DashboardLayout>
  );
}
