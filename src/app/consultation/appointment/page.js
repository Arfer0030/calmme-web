"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { authService } from "../../../services/auth";
import { psychologistService } from "../../../services/psychologist";
import Sidebar from "../../../components/Sidebar";

export default function AppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const psychologistId = searchParams.get("id");

  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [psychologist, setPsychologist] = useState(null);
  const [schedules, setSchedules] = useState([]);
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
    const fetchData = async () => {
      if (!psychologistId) {
        router.push("/consultation");
        return;
      }

      setLoadingData(true);
      try {
        const result = await psychologistService.getPsychologistById(
          psychologistId
        );
        if (result.success) {
          setPsychologist(result.data);
          const scheduleResult =
            await psychologistService.getPsychologistSchedules(psychologistId);
          if (scheduleResult.success) {
            setSchedules(scheduleResult.data);
          }
        } else {
          router.push("/consultation");
        }
      } catch (error) {
        console.error("Error loading appointment data:", error);
        router.push("/consultation");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [psychologistId, router]);

  const handleBack = () => {
    router.back();
  };

  const handleMakeAppointment = () => {
    alert("Go to CalmMe app to make an appointment");
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !psychologist) return null;

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userData={userData}
      />

      {/* Main Konten */}
      <div className="flex-1 flex overflow-hidden">
        {/* Bagian kiri informasi*/}
        <div className="w-2/3 p-6 overflow-y-auto scrollbar-hide">
          {/* Header */}
          <div className="flex items-center mb-6">
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
          </div>

          {/* Visit Time */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">
              Visit Time
            </h2>
            <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">
              {psychologist.name}
            </h3>
            <p className="text-gray-600 text-sm text-center">
              {psychologist.specialization &&
              psychologist.specialization.length > 0
                ? psychologist.specialization.join(", ")
                : "General Clinical Psychologist"}
            </p>
          </div>

          {/* About */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">About</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {psychologist.description ||
                `${psychologist.name} is a General Clinical Psychologist that ready to help you mantain your mental health.`}
            </p>
          </div>

          {/* Working Hours */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Working Hours
            </h3>
            {schedules.length === 0 ? (
              <p className="text-gray-600 text-sm">No schedule available</p>
            ) : (
              <div className="space-y-1">
                {schedules.map((schedule) => {
                  const availableSlots =
                    schedule.timeSlots?.filter((slot) => slot.isAvailable) ||
                    [];
                  if (availableSlots.length === 0) return null;

                  const startTime = availableSlots[0].startTime;
                  const endTime =
                    availableSlots[availableSlots.length - 1].endTime;

                  return (
                    <p key={schedule.id} className="text-gray-700 text-sm">
                      <span className="capitalize font-medium">
                        {schedule.dayOfWeek}
                      </span>
                      : {startTime} - {endTime}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {psychologist.education || "-"}
                </div>
                <div className="text-xs text-gray-600">Education</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {psychologist.experience || "-"}
                </div>
                <div className="text-xs text-gray-600">Experience</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {psychologist.license ? "SIPP" : null}
                </div>
                <div className="text-xs text-gray-600">License</div>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="bg-blue-200 rounded-2xl p-4 text-center">
            <button
              onClick={handleMakeAppointment}
              className="text-purple-600 font-medium hover:text-purple-700 transition-colors text-sm "
            >
              Go to CalmMe app to make an appointment
            </button>
          </div>
        </div>

        {/* Bagian kanan Image */}
        <div className="w-1/2 relative bg-radial from-purple-200 to-white flex flex-col items-center justify-center">
          {/* Teks */}
          <div className="text-center mb-8 mt-20">
            <h1 className="text-2xl font-bold text-purple-600 mb-2">
              Get Appointment
            </h1>
            <p className="text-lg text-purple-500">Easy and Fast</p>
          </div>

        {/* Gambar */}
          {psychologist.profilePicture ? (
            <div className="w-full h-full relative">
              <img
                src={psychologist.profilePicture}
                alt={psychologist.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              {/* Fallback */}
              <div className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-purple-200 to-purple-300">
                <div className="text-center">
                  <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-32 h-32 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Default */
            <div className="w-full h-full flex items-center justify-center">
              {" "}
              <div className="text-center">
                <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-32 h-32 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
