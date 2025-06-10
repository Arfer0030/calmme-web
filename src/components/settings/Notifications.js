"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Notifications() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [preferences, setPreferences] = useState({
    dailyMood: true,
    weeklyAssessment: false,
    meditation: true,
  });

  useEffect(() => {
    if ("Notification" in window) {
      const permission = Notification.permission === "granted";
      setIsNotificationsEnabled(permission);
    }

    const savedNotificationState = localStorage.getItem("notificationsEnabled");
    const savedPreferences = localStorage.getItem("notificationPreferences");

    if (savedNotificationState !== null) {
      setIsNotificationsEnabled(savedNotificationState === "true");
    }

    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error("Error parsing preferences:", error);
      }
    }
  }, []);

  const handleToggleNotifications = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications");
      return;
    }

    if (isNotificationsEnabled) {
      setIsNotificationsEnabled(false);
      localStorage.setItem("notificationsEnabled", "false");
    } else {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setIsNotificationsEnabled(true);
          localStorage.setItem("notificationsEnabled", "true");

          new Notification("CalmMe Notifications", {
            body: "You will now receive notifications from CalmMe! 😊",
            icon: "/favicon.ico",
          });
        } else {
          setIsNotificationsEnabled(false);
          localStorage.setItem("notificationsEnabled", "false");
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }
  };

  const handlePreferenceToggle = (preferenceKey) => {
    const newPreferences = {
      ...preferences,
      [preferenceKey]: !preferences[preferenceKey],
    };

    setPreferences(newPreferences);
    localStorage.setItem(
      "notificationPreferences",
      JSON.stringify(newPreferences)
    );
  };

  const ToggleSwitch = ({ isEnabled, onToggle, size = "normal" }) => {
    const sizeClasses = size === "small" ? "h-6 w-12" : "h-12 w-24";
    const circleClasses = size === "small" ? "h-5 w-5" : "h-10 w-10";
    const translateClasses =
      size === "small"
        ? isEnabled
          ? "translate-x-6"
          : "translate-x-0.5"
        : isEnabled
        ? "translate-x-12"
        : "translate-x-1";

    return (
      <button
        onClick={onToggle}
        className={`relative inline-flex ${sizeClasses} items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
          isEnabled ? "bg-purple-500" : "bg-gray-300"
        }`}
      >
        {/* Toggle Circle */}
        <span
          className={`inline-block ${circleClasses} transform rounded-full bg-white shadow-lg transition-transform duration-300 ${translateClasses}`}
        />

        {/* Toggle Text */}
        {size === "normal" && (
          <>
            <span
              className={`absolute text-sm font-medium transition-opacity duration-300 ${
                isEnabled
                  ? "left-2 text-white opacity-100"
                  : "left-2 text-white opacity-0"
              }`}
            >
              ON
            </span>

            <span
              className={`absolute text-sm font-medium transition-opacity duration-300 ${
                !isEnabled
                  ? "right-2 text-gray-600 opacity-100"
                  : "right-2 text-gray-600 opacity-0"
              }`}
            >
              OFF
            </span>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="max-w-2xl mx-auto justify-center items-center p-6 space-y-8">
      {/* Notif Card */}
      <div className="bg-gradient-to-br from-purple-200 via-blue-100 to-cyan-100 rounded-3xl p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center">
              <Image
                src="/images/notif_phone.png"
                alt="Notification Phone"
                width={100}
                height={100}
                className="w-full h-auto"
              />
            </div>

            {/* Text */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Turn on web notifications, so you don't miss your updates
                <span className="text-yellow-500">😊</span>
                <span className="text-red-500">!!</span>
              </h3>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="ml-6">
            <ToggleSwitch
              isEnabled={isNotificationsEnabled}
              onToggle={handleToggleNotifications}
            />
          </div>
        </div>

        {/* Status Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isNotificationsEnabled
              ? "Web notifications are enabled. You'll receive updates about your mental health journey."
              : "Enable notifications to stay updated with your mental health progress and reminders."}
          </p>
        </div>
      </div>

      {/* Tambahan Notif Settings */}
      {isNotificationsEnabled && (
        <div className="mt-8 space-y-6">
          <h4 className="text-lg font-semibold text-gray-800">
            Notification Preferences
          </h4>

          <div className="space-y-4">
            {/* Mood Reminder */}
            <div
              className="flex items-center justify-between p-4 bg-white/50 rounded-2xl hover:bg-white/70 transition-colors cursor-pointer"
              onClick={() => handlePreferenceToggle("dailyMood")}
            >
              <div>
                <h5 className="font-medium text-gray-800">
                  Daily Mood Check-in
                </h5>
                <p className="text-sm text-gray-600">
                  Remind me to track my mood daily
                </p>
              </div>
              <ToggleSwitch
                isEnabled={preferences.dailyMood}
                onToggle={() => handlePreferenceToggle("dailyMood")}
                size="small"
              />
            </div>

            {/* Assessment Reminder */}
            <div
              className="flex items-center justify-between p-4 bg-white/50 rounded-2xl hover:bg-white/70 transition-colors cursor-pointer"
              onClick={() => handlePreferenceToggle("weeklyAssessment")}
            >
              <div>
                <h5 className="font-medium text-gray-800">Weekly Assessment</h5>
                <p className="text-sm text-gray-600">
                  Remind me to take weekly mental health assessments
                </p>
              </div>
              <ToggleSwitch
                isEnabled={preferences.weeklyAssessment}
                onToggle={() => handlePreferenceToggle("weeklyAssessment")}
                size="small"
              />
            </div>

            {/* Meditation Reminder */}
            <div
              className="flex items-center justify-between p-4 bg-white/50 rounded-2xl hover:bg-white/70 transition-colors cursor-pointer"
              onClick={() => handlePreferenceToggle("meditation")}
            >
              <div>
                <h5 className="font-medium text-gray-800">
                  Meditation Reminders
                </h5>
                <p className="text-sm text-gray-600">
                  Remind me to meditate and practice mindfulness
                </p>
              </div>
              <ToggleSwitch
                isEnabled={preferences.meditation}
                onToggle={() => handlePreferenceToggle("meditation")}
                size="small"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
