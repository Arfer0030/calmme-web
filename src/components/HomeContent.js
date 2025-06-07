"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { moodService } from "../services/mood";
import { useAuth } from "../hooks/useAuth";

export default function HomeContent({
  userData,
  loadingUserData,
  onMenuClick,
}) {
  const [greeting, setGreeting] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const router = useRouter();

  // Tambahkan di dalam component HomeContent
  const { user } = useAuth();

  // Update handleMoodSelect function
  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood.id);

    if (user) {
      try {
        const result = await moodService.saveMood(
          user.uid,
          mood.id,
          mood.label
        );
        if (result.success) {
          console.log(`Mood ${result.action} successfully`);
        }
      } catch (error) {
        console.error("Error saving mood:", error);
      }
    }
  };

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Good Morning");
      } else if (hour < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 600000); // Update every hour

    return () => clearInterval(interval);
  }, []);

  const moods = [
    { id: "calm", label: "calm", iconSrc: "/images/mood/md_calm.png" },
    { id: "happy", label: "happy", iconSrc: "/images/mood/md_happy.png" },
    {
      id: "disappointed",
      label: "disappointed",
      iconSrc: "/images/mood/md_diss.png",
    },
    {
      id: "frustrated",
      label: "frustrated",
      iconSrc: "/images/mood/md_frustrated.png",
    },
    {
      id: "surprised",
      label: "surprised",
      iconSrc: "/images/mood/md_surprised.png",
    },
    { id: "sad", label: "sad", iconSrc: "/images/mood/md_sad.png" },
    { id: "bored", label: "bored", iconSrc: "/images/mood/md_bored.png" },
    { id: "worried", label: "worried", iconSrc: "/images/mood/md_worried.png" },
  ];

  const categories = [
    {
      id: "meditate",
      title: "Meditate Time",
      iconSrc: "/images/ct-meditate.png",
      color: "bg-gradient-to-b from-gray-100 to-blue-100",
      description: "Find your inner peace",
      path: "/meditate",
    },
    {
      id: "assessment",
      title: "Self-Assessment Test",
      iconSrc: "/images/ct-assesment.png",
      color: "bg-gradient-to-b from-gray-100 to-purple-100",
      description: "Check your mental health",
      path: "/assessment",
    },
    {
      id: "daily mood",
      title: "Daily Mood Tracker",
      iconSrc: "/images/ct-dailymood.png",
      color: "bg-gradient-to-b from-gray-100 to-yellow-100",
      description: "Track your daily emotions",
      path: "/dailymood",
    },
    {
      id: "consultation",
      title: "Consultation",
      iconSrc: "/images/ct-consul.png",
      color: "bg-gradient-to-b from-gray-100 to-blue-100",
      description: "Get professional help",
      path: "/consultation",
    },
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-b from-purple-200 to-white shadow-sm px-6 py-4 pb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
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
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {greeting},{" "}
                {loadingUserData ? "Loading..." : userData?.username || "User"}!
              </h1>
            </div>
          </div>

          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <Image
              src="/icons/ic-notification.svg"
              alt="Notifications"
              width={25}
              height={25}
              className="object-contain"
            />
          </button>
        </div>
        {/* Pilihan mood */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4 text-center">
            How are you today?
          </h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide px-6 py-6">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood)}
                className={`flex-shrink-0 flex flex-col items-center space-y-2 p-4 rounded-2xl transition-all ${
                  selectedMood === mood.id
                    ? `${mood.color} ring-2 ring-b-ungu scale-105`
                    : `${mood.color} hover:scale-105`
                }`}
              >
                <div className="relative w-25 h-15">
                  <Image
                    src={mood.iconSrc}
                    alt={mood.label}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <span className="text-sm font-medium text-h-ungu capitalize">
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </section>
      </header>

      {/* Main content */}
      <main className="p-6 space-y-8 bg-white mt-[-32px] rounded-tl-3xl rounded-tr-3xl shadow-lg">
        {/* Bagian For you */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">For You</h2>
          <div className="bg-gradient-to-bl from-purple-100 via-blue-100 to-yellow-100 rounded-2xl p-6 relative ">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-bold px-2 py-1 rounded-full">
                  GO PREMIUM
                </span>
                <span className="text-2xl">👑</span>
              </div>
              <h3 className="text-xl font-bold text-red-900 mb-4 flex flex-col">
                <span>Upgrade to premium to get more profit</span>
                <span>now !</span>
              </h3>
              <button className="border px-4 py-2 rounded-full font-medium transition-colors">
                Learn more →
              </button>
            </div>
            <div className="absolute right-10 -top-6">
              <Image
                src="/images/ct-consul.png"
                alt="For You"
                width={140}
                height={130}
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
              See all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => router.push(category.path)}
                className={`${category.color} rounded-2xl p-6 text-left hover:scale-105 transition-transform group`}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <Image
                      src={category.iconSrc}
                      alt={category.title}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
