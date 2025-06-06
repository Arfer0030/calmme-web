"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { authService } from "../../../services/auth";
import Sidebar from "../../../components/Sidebar";

export default function AssessmentTestPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

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

  const questions = [
    "Feeling restless, anxious, or extremely tense",
    "Unable to stop or control worry",
    "Worrying too much about things",
    "Hard to relax",
    "Very restless making it hard to sit still",
    "Being easily irritated or irritable",
    "Feeling afraid as if something terrible might happen",
  ];

  const options = [
    { label: "Never", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half the days", value: 2 },
    { label: "Nearly every days", value: 3 },
  ];

  const handleAnswer = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const totalScore = Object.values(answers).reduce(
        (sum, value) => sum + value,
        0
      );
      router.push(`/assessment/result?score=${totalScore}`);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      router.back();
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-blue-200 flex">
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

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-yellow-100 h-2 rounded-full">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-right mt-2">
            <span className="text-sm text-yellow-600 font-medium">
              Test Questions
            </span>
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-8">
          <div className="space-y-8">
            <div className="bg-yellow-50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {currentQuestion + 1}. {questions[currentQuestion]}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(currentQuestion, option.value)}
                    className={`p-4 rounded-2xl text-center font-medium transition-all ${
                      answers[currentQuestion] === option.value
                        ? "bg-gray-500 text-white shadow-lg scale-105"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={answers[currentQuestion] === undefined}
                className="px-6 py-3 bg-b-ungu text-white rounded-full font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion === questions.length - 1
                  ? "Finish Test"
                  : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
