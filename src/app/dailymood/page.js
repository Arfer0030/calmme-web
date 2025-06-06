"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth";
import { moodService } from "../../services/mood";
import Sidebar from "../../components/Sidebar";

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

          // Get last 7 days
          const last7DaysResult = await moodService.getLast7DaysMood(user.uid);
          if (last7DaysResult.success) {
            setLast7Days(last7DaysResult.data);
          }

          // Get mood stats
          const period = selectedPeriod.toLowerCase();
          const statsResult = await moodService.getMoodStats(user.uid, period);
          if (statsResult.success) {
            setMoodStats(statsResult.data);
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

  const moodIcons = {
    calm: "/images/mood/md_calm.png",
    happy: "/images/mood/md_happy.png",
    disappointed: "/images/mood/md_diss.png",
    frustrated: "/images/mood/md_frustrated.png",
    surprised: "/images/mood/md_surprised.png",
    sad: "/images/mood/md_sad.png",
    bored: "/images/mood/md_bored.png",
    worried: "/images/mood/md_worried.png",
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
    <div className="min-h-screen bg-purple-100 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userData={userData}
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex items-center justify-center mb-8 relative">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden absolute left-0 p-2 hover:bg-white/50 rounded-lg transition-colors"
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

          <div className="bg-purple-200 px-8 py-3 rounded-full">
            <h1 className="text-xl font-bold text-gray-800">
              Daily Mood Tracker
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Mood Section */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Mood</h2>
            <p className="text-lg text-gray-600 mb-6">{streak} Day Streak</p>

            {/* Last 7 Days */}
            <div className="grid grid-cols-7 gap-4">
              {last7Days.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm text-gray-600 mb-2">
                    {day.dayName}
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-3">
                    {day.dayNumber}
                  </div>

                  <div
                    className={`w-16 h-20 mx-auto rounded-2xl flex flex-col items-center justify-center ${
                      day.mood
                        ? moodColors[day.mood.moodId] || "bg-gray-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {day.mood ? (
                      <>
                        <img
                          src={moodIcons[day.mood.moodId] || ""}
                          alt={day.mood.moodLabel}
                          className="w-8 h-8 mb-1"
                        />
                        <span className="text-xs text-gray-700">
                          {day.mood.moodLabel}
                        </span>
                      </>
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mood Chart Section */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Mood Chart
            </h2>

            {/* Period Selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-purple-100 rounded-full p-1 flex">
                {["Week", "Month", "Year"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      selectedPeriod === period
                        ? "bg-purple-500 text-white shadow-md"
                        : "text-purple-600 hover:bg-purple-200"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Average Label */}
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Weekly Average
            </h3>

            {/* Chart */}
            <div className="space-y-4">
              {loadingData ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              ) : (
                <div className="flex items-end justify-center space-x-4 h-64">
                  {moodStats.length > 0
                    ? moodStats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center">
                          {/* Percentage Label */}
                          <div className="text-sm text-gray-600 mb-2">
                            {stat.percentage}%
                          </div>

                          {/* Bar */}
                          <div
                            className={`w-12 ${
                              moodColors[stat.mood] || "bg-gray-200"
                            } rounded-t-lg flex flex-col justify-end items-center relative`}
                            style={{
                              height: `${Math.max(stat.percentage * 2, 20)}px`,
                            }}
                          >
                            {/* Mood sections within bar */}
                            <div className="w-full h-full flex flex-col justify-end">
                              <div className="bg-blue-200 h-1/3 w-full"></div>
                              <div className="bg-yellow-200 h-1/2 w-full"></div>
                              <div className="bg-purple-200 h-1/4 w-full rounded-t-lg"></div>
                            </div>
                          </div>

                          {/* Mood Icon */}
                          <div className="mt-2">
                            <img
                              src={moodIcons[stat.mood] || ""}
                              alt={stat.mood}
                              className="w-8 h-8"
                            />
                          </div>
                        </div>
                      ))
                    : // Empty state with placeholder bars
                      Array.from({ length: 9 }).map((_, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="text-sm text-gray-400 mb-2">0%</div>
                          <div className="w-12 h-20 bg-gray-100 rounded-t-lg"></div>
                          <div className="mt-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                </div>
              )}
            </div>

            {/* Date Range */}
            <div className="text-center mt-6">
              <span className="text-sm text-gray-500">
                {selectedPeriod === "Week" && "May 18, 25 - Apr 18, 25"}
                {selectedPeriod === "Month" && "Last 30 days"}
                {selectedPeriod === "Year" && "Last 365 days"}
              </span>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="bg-purple-200 rounded-3xl p-6 text-center">
            <p className="text-lg font-medium text-purple-800 italic">
              "IT'S OKAY IF YOU..."
            </p>
            <p className="text-sm text-purple-600 mt-1">
              Can't know what to do next
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
