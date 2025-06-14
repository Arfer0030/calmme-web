"use client";
import { useState, useEffect } from "react";
import { authService } from "../services/auth";

export default function EmailVerificationDialog({
  isOpen,
  onClose,
  userEmail,
  onVerificationSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && isVerified) {
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
  }, [isOpen, onClose, isVerified]);

  const handleCheckVerification = async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await authService.checkEmailVerificationStatus();

      if (result.success && result.verified) {
        setIsVerified(true);
        setMessage(
          "Email verified successfully! You can now access all features."
        );
      } else {
        setMessage(
          "Email not verified yet. Please check your inbox and click the verification link."
        );
      }
    } catch (error) {
      setMessage("Error checking verification status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await authService.resendEmailVerification();
      if (result.success) {
        setMessage(
          "Verification email sent successfully! Please check your inbox."
        );
      } else {
        setMessage(result.error || "Failed to send verification email.");
      }
    } catch (error) {
      setMessage("Error sending verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (isVerified) {
      onVerificationSuccess();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-40 transition-opacity" />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all">
        {/* Content */}
        <div className="p-6 text-center">
          {/* Icon */}
          <div
            className={`w-20 h-20 ${
              isVerified ? "bg-green-100" : "bg-yellow-100"
            } rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            {isVerified ? (
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
            ) : (
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
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {isVerified ? "Email Verified!" : "Verify Your Email"}
          </h3>

          {/* Message */}
          <div className="text-gray-600 mb-6 leading-relaxed">
            {isVerified ? (
              <p>
                Your email has been successfully verified. You can now access
                all features of CalmMe.
              </p>
            ) : (
              <div>
                <p className="mb-3">We've sent a verification email to:</p>
                <p className="font-semibold text-purple-600 mb-3">
                  {userEmail}
                </p>
                <p>
                  Please check your inbox and click the verification link to
                  activate your account.
                </p>
              </div>
            )}
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : message.includes("not verified")
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            {isVerified ? (
              <button
                onClick={handleContinue}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Continue to CalmMe
              </button>
            ) : (
              <>
                <button
                  onClick={handleCheckVerification}
                  disabled={loading}
                  className="w-full bg-b-ungu hover:bg-h-ungu text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Checking..." : "I've Verified My Email"}
                </button>

                <button
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="w-full border border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Resend Verification Email"}
                </button>
              </>
            )}
          </div>

          {/* Text */}
          {!isVerified && (
            <div className="mt-4 text-xs text-gray-500">
              <p>
                Didn't receive the email? Check your spam folder or click
                resend.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
