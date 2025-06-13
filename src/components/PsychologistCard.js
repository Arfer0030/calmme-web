"use client";
import { useState, useEffect } from "react";
import { psychologistService } from "../services/psychologist";
import { useRouter } from "next/navigation";

export default function PsychologistCard({ psychologist, onAppointment }) {
  const [schedules, setSchedules] = useState([]);
  const [availableTime, setAvailableTime] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const result = await psychologistService.getPsychologistSchedules(
          psychologist.id
        );
        if (result.success) {
          setSchedules(result.data);
          const days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ];
          const currentDay = days[new Date().getDay()];

          const todaySchedule = result.data.find(
            (schedule) => schedule.dayOfWeek.toLowerCase() === currentDay
          );

          if (todaySchedule && todaySchedule.timeSlots) {
            const availableSlots = todaySchedule.timeSlots.filter(
              (slot) => slot.isAvailable
            );
            if (availableSlots.length > 0) {
              const firstSlot = availableSlots[0];
              setAvailableTime(`${firstSlot.startTime} - ${firstSlot.endTime}`);
            } else {
              setAvailableTime("No available slots today");
            }
          } else {
            setAvailableTime("Schedule not available");
          }
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setAvailableTime("Schedule not available");
      }
    };

    fetchSchedules();
  }, [psychologist.id]);

  return (
    <div className="bg-gradient-to-r from-purple-200 via-blue-100 to-cyan-100 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        {/* bagian kiri pp dan teks*/}
        <div className="flex items-center space-x-4">
          {/* Profile picture psikolog */}
          <div className="relative">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
              {psychologist.profilePicture ? (
                <img
                  src={psychologist.profilePicture}
                  alt={psychologist.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
              ) : null}

              {/* Default Avatar */}
              <svg
                className={`w-12 h-12 text-purple-600 ${
                  psychologist.profilePicture ? "hidden" : "block"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>

          {/* Informasi nama, spesialisasi, schedule */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {psychologist.name}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              {psychologist.specialization &&
              psychologist.specialization.length > 0
                ? psychologist.specialization.join(", ")
                : "General Clinical Psychologist"}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{availableTime}</span>
            </div>
          </div>
        </div>

        {/* bagian kanan, appointment button */}
        <div >
          <button
            onClick={() =>
              router.push(`/consultation/appointment?id=${psychologist.id}`)
            }
            className="bg-b-ungu hover:bg-h-ungu text-white px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
