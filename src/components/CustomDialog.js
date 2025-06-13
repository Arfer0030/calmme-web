"use client";
import { useEffect } from "react";

export default function CustomDialog({
  isOpen,
  onClose,
  title,
  message,
  type = "info", 
  buttonText = "OK",
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; 
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case "warning":
        return {
          icon: (
            <svg
              className="w-12 h-12 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.865-.833-2.635 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          ),
          bgColor: "bg-gray-200",
          buttonColor: "bg-b-ungu hover:bg-h-ungu",
        };
      case "error":
        return {
          icon: (
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          bgColor: "bg-red-100",
          buttonColor: "bg-red-500 hover:bg-red-600",
        };
      case "success":
        return {
          icon: (
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          bgColor: "bg-green-100",
          buttonColor: "bg-green-500 hover:bg-green-600",
        };
      default:
        return {
          icon: (
            <svg
              className="w-12 h-12 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          bgColor: "bg-blue-100",
          buttonColor: "bg-blue-500 hover:bg-blue-600",
        };
    }
  };

  const { icon, bgColor, buttonColor } = getIconAndColor();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-20 transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all">
        {/* Content */}
        <div className="p-6 text-center">
          {/* Icon */}
          <div
            className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            {icon}
          </div>

          {/* Title */}
          {title && (
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          )}

          {/* Pesan */}
          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

          {/* Button */}
          <button
            onClick={onClose}
            className={`w-full ${buttonColor} text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
