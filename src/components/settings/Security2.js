"use client";
import { useState } from "react";
import { profileService } from "../../services/profile";
import Image from "next/image";
import CustomDialog from "../CustomDialog";

export default function Security2({ isReauthenticated = false }) {
  const [formData, setFormData] = useState({
    newPassword: "",
    retypePassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    retype: false,
  });

  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showDialog = (title, message, type = "info") => {
    setDialog({
      isOpen: true,
      title,
      message,
      type,
    });
  };
  
  const closeDialog = () => {
    setDialog({
      isOpen: false,
      title: "",
      message: "",
      type: "info",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSaveChanges = async () => {
    if (!formData.newPassword || !formData.retypePassword) {
      setMessage("Please fill in all password fields");
      return;
    }

    if (formData.newPassword !== formData.retypePassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    if (!isReauthenticated) {
      setMessage("Please authenticate first in the Security tab");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await profileService.updatePassword(formData.newPassword);

      if (result.success) {
        setMessage("Password updated successfully!");
        setFormData({ newPassword: "", retypePassword: "" });
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage("Error updating password. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-10">
      <div className="space-y-6 md:flex md:items-start md:space-y-0 md:gap-16">
        {/* Bagian kiri Icon */}
        <div className="md:flex-shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
            <Image
              src="/images/pass_lock.png"
              alt="key icon"
              width={100}
              height={100}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Bagian Kanan Input */}
        <div className="flex-1 space-y-4">
          {/* Judul */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-800">
              New Password
            </h3>
          </div>

          {/* Input Password baru */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your new password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      showPasswords.new
                        ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Input Ulang Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retype your new password
            </label>
            <div className="relative">
              <input
                type={showPasswords.retype ? "text" : "password"}
                name="retypePassword"
                value={formData.retypePassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                placeholder="Retype new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("retype")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      showPasswords.retype
                        ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Tombol Save */}
          <div className="text-center pt-2 md:text-right">
            <button
              onClick={handleSaveChanges}
              disabled={loading || !isReauthenticated}
              className="w-full bg-b-ungu text-white px-8 py-3 rounded-lg font-medium hover:bg-h-ungu transition-colors disabled:opacity-50 disabled:cursor-not-allowed md:w-auto"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>

          {/* Alert */}
          {!isReauthenticated && (
            <div className="p-4 rounded-lg bg-yellow-100 text-yellow-700 border border-yellow-200 text-center text-sm md:text-left">
              Please authenticate first in the Security tab before changing your
              password.
            </div>
          )}

          {/* Pesan */}
          {message && (
            <div
              className={`p-4 rounded-lg text-center ${
                message.includes("successfully")
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