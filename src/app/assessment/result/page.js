"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import TopBar from "@/components/TopBar";

export default function AssessmentResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState("");

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
    const scoreParam = searchParams.get("score");
    const scoreValue = parseInt(scoreParam) || 0;
    setScore(scoreValue);

    if (scoreValue <= 4) {
      setResult("Minimal Anxiety");
    } else if (scoreValue <= 9) {
      setResult("Mild Anxiety");
    } else if (scoreValue <= 14) {
      setResult("Moderate Anxiety");
    } else {
      setResult("Severe Anxiety");
    }
  }, [searchParams]);

  const handleBack = () => {
    router.push("/home");
  };

  const handleDownload = () => {
    router.push("/home");
  };

  const handleMeditate = () => {
    router.push("/meditate");
  };

  const handleConsultation = () => {
    router.push("/consultation");
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
    <div className="h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-purple-200 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userData={userData}
      />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-x-auto">
        {/* Top Bar */}
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          onBackClick={handleBack}
          title="Self-Assessment Test"
        />

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-yellow-300 h-2 rounded-full">
            <div className="bg-yellow-400 h-2 rounded-full w-full"></div>
            <div className="text-right pr-1">
              <span className="text-sm text-yellow-600 font-medium">
                Test Result
              </span>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Result Card */}
          <div className="bg-gradient-to-r from-card-biru to-blue-900 rounded-3xl p-8 text-white relative">
            {/* Gambar karakter */}
            <div className="absolute -left-2.5 bottom-5">
              <Image
                src="/images/as-girl.png"
                alt="Character 1"
                width={127}
                height={120}
              />
            </div>

            <div className="absolute -right-2 bottom-3">
              <Image
                src="/images/as-boy.png"
                alt="Character 2"
                width={90}
                height={90}
              />
            </div>

            <div className="text-center relative z-10">
              <h2 className="text-3xl font-bold mb-4">Your Result :</h2>
              <div className="text-6xl font-bold mb-2">{score}</div>
              <div className="text-2xl font-semibold mb-4">{result}</div>

              <div className="text-center text-gray-400">
                <span className="font-script text-lg">CalmMe</span>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="text-center">
            <button
              onClick={handleDownload}
              className="bg-b-ungu text-white px-8 py-3 rounded-full font-semibold hover:bg-h-ungu transition-all transform hover:scale-105 shadow-lg"
            >
              Back To Home
            </button>
          </div>

          {/* Rekomendasi */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              We have some recommendations for you😊!!
            </h3>
          </div>

          {/* Card rkeomendasi */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Rekomendasi meditate */}
            <div
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 relative overflow-hidden group hover:scale-105 transition-transform cursor-pointer"
              onClick={handleMeditate}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🎵</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Meditate Time
                  </h4>
                </div>
                <svg
                  className="w-6 h-6 text-purple-500"
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
              </div>

              <p className="text-gray-600 text-sm mb-4">
                Take a moment to relax and clear your mind with guided
                meditation tailored to your current mental state.
              </p>

              <div className="text-xs text-gray-500">
                🎧 Access short audio/video meditation sessions (5-10 minutes)
              </div>
            </div>

            {/* Rekomendasi konsul */}
            <div
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 relative overflow-hidden group hover:scale-105 transition-transform cursor-pointer"
              onClick={handleConsultation}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🗣</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Consultation with the Best Psychologists
                  </h4>
                </div>
                <svg
                  className="w-6 h-6 text-purple-500"
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
              </div>

              <p className="text-gray-600 text-sm mb-4">
                Get professional support and guidance from qualified
                psychologists to support your mental well-being.
              </p>

              <div className="text-xs text-gray-500 flex flex-col gap-1">
                <span>
                  🌟 Trusted by many clients and mental health communities
                </span>
                <span>
                  📅 Private consultations available via chat, call, or video
                  call
                </span>
                <span>🔒 100% confidential and judgment-free support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
