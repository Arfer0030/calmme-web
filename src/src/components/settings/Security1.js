"use client";
import { useState } from "react";
import { profileService } from "../../services/profile";
import Image from "next/image"; 

export default function Security1({ onReauthSuccess }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleReauth = async () => {
    if (!currentPassword) {
      setMessage("Please enter your current password");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await profileService.reauthenticateUser(currentPassword);

      if (result.success) {
        setIsAuthenticated(true);
        setMessage(
          "Authentication successful! You can now change your password."
        );
        if (onReauthSuccess) onReauthSuccess();
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-10">
      <div className="space-y-6 md:flex md:items-start md:space-y-0 md:gap-16">
        {/* Icon kiri */}
        <div className="md:flex-shrink-0">
          <div className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center md:mx-0 md:w-32 md:h-32">
            <Image
              src="/images/pass_key.png"
              alt="key imageIcon"
              width={100}
              height={100}
              className="w-full h-auto"
            />
          </div>
        </div>
  
        {/* Bagian Kanan */}
        <div className="flex-1 space-y-4">
          {/* Judul */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Current Password
            </h3>
          </div>
  
          {/* Input Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                placeholder="••••••••"
                disabled={isAuthenticated}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
  
          {/* Tombol */}
          <div className="text-center pt-2 md:text-right">
            <button
              onClick={handleReauth}
              disabled={loading || isAuthenticated}
              className="w-full bg-b-ungu text-white px-8 py-3 rounded-lg font-medium hover:bg-h-ungu transition-colors disabled:opacity-50 disabled:cursor-not-allowed md:w-auto"
            >
              {loading
                ? "Authenticating..."
                : isAuthenticated
                ? "Authenticated ✓"
                : "Change Password"}
            </button>
          </div>
  
          {/* Pesan */}
          {message && (
            <div
              className={`p-4 rounded-lg text-center ${
                message.includes("successful")
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}