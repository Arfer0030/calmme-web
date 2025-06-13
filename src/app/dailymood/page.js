"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth";
import { moodService } from "../../services/mood";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import DashboardLayout from "@/components/DashboardLayout";

export default function DailyMoodPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [last7Days, setLast7Days] = useState([]);
  const [moodStats, setMoodStats] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("Week");
  const [loadingData, setLoadingData] = useState(true);

  // Pilihan mood yang tersedia
  const allMoods = [
    {
      id: "calm",
      label: "Calm",
      icon: "/images/mood/md_calm.png",
    },
    {
      id: "happy",
      label: "Happy",
      icon: "/images/mood/md_happy.png",
    },
    {
      id: "disappointed",
      label: "Disappointed",
      icon: "/images/mood/md_diss.png",
    },
    {
      id: "frustrated",
      label: "Frustrated",
      icon: "/images/mood/md_frustrated.png",
    },
    {
      id: "surprised",
      label: "Surprised",
      icon: "/images/mood/md_surprised.png",
    },
    { id: "sad", label: "Sad", emoji: "😢", icon: "/images/mood/md_sad.png" },
    {
      id: "bored",
      label: "Bored",
      icon: "/images/mood/md_bored.png",
    },
    {
      id: "worried",
      label: "Worried",
      icon: "/images/mood/md_worried.png",
    },
    {
      id: "angry",
      label: "Angry",
      icon: "/images/mood/md_angry.png",
    },
  ];

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
    const fetchMoodData = async () => {
      if (user) {
        setLoadingData(true);
        try {
          // Get streak
          const streakResult = await moodService.calculateStreak(user.uid);
          if (streakResult.success) {
            setStreak(streakResult.streak);
          }

          // Get 7 hari terakhir
          const last7DaysResult = await moodService.getLast7DaysMood(user.uid);
          if (last7DaysResult.success) {
            setLast7Days(last7DaysResult.data);
          }

          // Get mood stats
          const period = selectedPeriod.toLowerCase();
          const statsResult = await moodService.getMoodStats(user.uid, period);
          if (statsResult.success) {
            const completeMoodStats = allMoods.map((mood) => {
              const existingStat = statsResult.data.find(
                (stat) => stat.mood === mood.label.toLowerCase()
              );
              return {
                ...mood,
                count: existingStat ? existingStat.count : 0,
                percentage: existingStat ? existingStat.percentage : 0,
              };
            });
            setMoodStats(completeMoodStats);
          } else {
            const emptyStats = allMoods.map((mood) => ({
              ...mood,
              count: 0,
              percentage: 0,
            }));
            setMoodStats(emptyStats);
          }
        } catch (error) {
          console.error("Error fetching mood data:", error);
        } finally {
          setLoadingData(false);
        }
      }
    };

    fetchMoodData();
  }, [user, selectedPeriod]);

  const handleBack = () => {
    router.push("/home");
  };

  const moodColors = {
    calm: "bg-blue-200",
    happy: "bg-yellow-200",
    disappointed: "bg-purple-200",
    frustrated: "bg-red-200",
    surprised: "bg-orange-200",
    sad: "bg-gray-200",
    bored: "bg-green-200",
    worried: "bg-pink-200",
    excited: "bg-indigo-200",
    angry: "bg-red-400",
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
      title="Daily Mood Tracker"
      showBackButton
      onBackClick={() => router.push("/home")}
      backgroundColor="bg-gradient-to-b from-purple-200 via-gray-50 to-purple-200"
      contentClassName="p-0" 
    >
      <div className="p-4 gap-6">
        {/* Main Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Bagian Mood */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Mood</h2>
              <p className="text-lg text-gray-600 mb-6">{streak} Day Streak</p>

              {/* Bagian streak */}
              <div className="grid grid-cols-7 gap-3">
                {last7Days.map((day, index) => (
                  <div
                    key={index}
                    className="text-center bg-gradient-to-t from-purple-200 to-purple-50 rounded-2xl "
                  >
                    <div className="text-sm font-semibold text-gray-600 ">
                      {day.dayName}
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mb-1">
                      {day.dayNumber}
                    </div>

                    <div
                      className={`object-cover mx-auto flex flex-col items-center justify-center ${day.mood}`}
                    >
                      {day.mood ? (
                        <>
                          <img
                            src={
                              day.mood.moodId
                                ? allMoods.find((m) => m.id === day.mood.moodId)
                                    ?.icon || ""
                                : ""
                            }
                            alt={day.mood.moodLabel}
                            className="w-8 h-8 mb-1"
                          />
                          <span className="text-xs text-b-ungu mb-2">
                            {day.mood.moodLabel}
                          </span>
                        </>
                      ) : (
                        <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mood Chart */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Mood Chart
              </h2>

              {/* Pilihan Range Waktu */}
              <div className="flex justify-center mb-8 px-4">
                <div className="w-full max-w-md bg-tab-ungu rounded-full p-1 flex">
                  {["Week", "Month", "Year"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`flex-1 text-center px-6 py-2 rounded-full font-medium transition-all ${
                        selectedPeriod === period
                          ? "bg-b-ungu text-white shadow-md"
                          : "text-h-ungu"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Label sesuai pilihan range waktu */}
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                {selectedPeriod === "Week" && "Weekly Average"}
                {selectedPeriod === "Month" && "Monthly Average"}
                {selectedPeriod === "Year" && "Yearly Average"}
              </h3>

              {/* Chart */}
              <div className="space-y-4">
                {loadingData ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto py-2">
                    <div className="flex items-end justify-center space-x-2 sm:space-x-4 md:space-x-6 h-64 min-w-max px-4">
                      {moodStats.map((mood, index) => (
                        <div key={index} className="flex flex-col items-center">
                          {/* Label persentase */}
                          <div className="text-xs sm:text-sm text-gray-600 mb-2 h-6">
                            {mood.percentage > 0 ? `${mood.percentage}%` : ""}
                          </div>

                          {/* Bar */}
                          <div
                            className={`rounded-t-lg flex flex-col justify-end items-center relative transition-all duration-500 ${
                              moodColors[mood.id] || "bg-gray-300"
                            } w-6 sm:w-7 md:w-8`}
                            style={{
                              height: `${Math.max(mood.percentage * 1.8, 8)}px`,
                              minHeight: "8px",
                            }}
                          >
                            {/* Bar kosong */}
                            {mood.percentage === 0 && (
                              <div className="w-full h-full bg-gray-200 rounded-t-lg"></div>
                            )}
                          </div>

                          {/* Icon mod */}
                          <div className="mt-2">
                            <img
                              src={mood.icon || ""}
                              alt={mood.label}
                              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                            />
                          </div>

                          {/* Label mood */}
                          <div className="text-xs text-gray-600 mt-1 text-center w-12 sm:w-14 md:w-16 overflow-hidden">
                            {mood.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Date Range */}
              <div className="text-center mt-6">
                <span className="text-sm text-gray-500">
                  {selectedPeriod === "Week" && "Last 7 days"}
                  {selectedPeriod === "Month" && "Last 30 days"}
                  {selectedPeriod === "Year" && "Last 365 days"}
                </span>
              </div>
            </div>

            {/* Teks mmotivasi */}
            <div className="bg-purple-300 rounded-3xl p-6 text-center">
              <p className="text-lg font-medium text-purple-800 italic">
                "IT'S OKAY IF YOU..."
              </p>
              <p className="text-sm text-purple-600 mt-1">
                Don't know what to do next
              </p>
            </div>
          </div>
        </div>
      
    </DashboardLayout>
  );
}