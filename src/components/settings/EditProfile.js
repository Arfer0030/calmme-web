"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth";
import { profileService } from "../../services/profile";
import Image from "next/image";

export default function EditProfile({ userData: initialUserData }) {
  const router = useRouter();
  const { user } = useAuth();
  const [userData, setUserData] = useState(initialUserData);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    email: "",
    gender: "",
    dateOfBirth: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingEmailUpdate, setPendingEmailUpdate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const data = await authService.getCurrentUserData();
          setUserData(data);
          setFormData({
            username: data?.username || "",
            bio: data?.bio || "",
            email: data?.email || "",
            gender: data?.gender || "",
            dateOfBirth: data?.dateOfBirth || "",
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    if (!initialUserData) {
      fetchUserData();
    } else {
      setUserData(initialUserData);
      setFormData({
        username: initialUserData?.username || "",
        bio: initialUserData?.bio || "",
        email: initialUserData?.email || "",
        gender: initialUserData?.gender || "",
        dateOfBirth: initialUserData?.dateOfBirth || "",
      });
    }
  }, [user, initialUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderSelect = (gender) => {
    setFormData((prev) => ({
      ...prev,
      gender: gender,
    }));
  };

  const handleEmailVerification = async () => {
    if (!currentPassword) {
      setMessage("Please enter your current password to update email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await profileService.updateEmailWithAuth(
        user.uid,
        pendingEmailUpdate,
        currentPassword
      );

      if (result.success) {
        // Close password modal and show verification modal
        setShowPasswordModal(false);
        setShowVerificationModal(true);
        setCurrentPassword("");
        setMessage("");
      } else {
        setMessage("Error updating email: " + result.error);
      }
    } catch (error) {
      setMessage("Error updating email: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationComplete = async () => {
    setMessage("Logging out... Please login with your new email address.");

    // Wait 2 seconds then logout
    setTimeout(async () => {
      await profileService.logoutUser(user.uid);
      router.replace("/auth");
    }, 2000);
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      const changedFields = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== (userData?.[key] || "")) {
          changedFields[key] = formData[key];
        }
      });

      if (Object.keys(changedFields).length === 0) {
        setMessage("No changes to save");
        setLoading(false);
        return;
      }

      // Check if email is being updated
      if (changedFields.email) {
        setPendingEmailUpdate(changedFields.email);
        setShowPasswordModal(true);
        setLoading(false);
        return;
      }

      // Update other fields (non-email)
      const result = await profileService.updateProfile(
        user.uid,
        changedFields
      );

      if (result.success) {
        setMessage("Profile updated successfully!");
        const updatedData = await authService.getCurrentUserData();
        setUserData(updatedData);
      } else {
        setMessage("Error updating profile: " + result.error);
      }
    } catch (error) {
      setMessage("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:space-x-8 lg:space-x-12">
      <div className="md:w-1/3 mb-8 md:mb-0">
        <div className="text-center p-6 rounded-2xl sticky top-6">
          <div className="w-24 h-24 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
            {userData?.profilePicture ? (
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-16 h-16 text-white"
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
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            {userData?.username || "user123"}
          </h3>
          <p className="text-sm text-gray-500">available</p>
        </div>
      </div>

      <div className="md:w-2/3 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50"
            placeholder="Enter email"
          />
          <p className="text-xs text-gray-500 mt-1">
            Changing email will require password confirmation and email
            verification.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Gender
          </label>
          <div className="flex space-x-8">
            <button
              type="button"
              onClick={() => handleGenderSelect("male")}
              className={`flex flex-col items-center p-4 rounded-2xl transition-all w-full ${
                formData.gender === "male"
                  ? "bg-blue-100 ring-2 ring-blue-500"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mb-2">
                <Image
                  src="/images/ic_male.png"
                  alt="Male"
                  width={50}
                  height={50}
                />
              </div>
              <span className="text-sm font-medium">Male</span>
            </button>
            <button
              type="button"
              onClick={() => handleGenderSelect("female")}
              className={`flex flex-col items-center p-4 rounded-2xl transition-all w-full ${
                formData.gender === "female"
                  ? "bg-pink-100 ring-2 ring-pink-500"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div className="w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center mb-2">
                <Image
                  src="/images/ic_female.png"
                  alt="Female"
                  width={50}
                  height={50}
                />
              </div>
              <span className="text-sm font-medium">Female</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSaveChanges}
            disabled={loading}
            className="bg-b-ungu text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.includes("Error")
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Password Confirmation Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Email Update</h3>
            <p className="text-sm text-gray-600 mb-4">
              To update your email to <strong>{pendingEmailUpdate}</strong>,
              please enter your current password.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your current password"
              />
            </div>

            {message && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-200 text-sm">
                {message}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword("");
                  setPendingEmailUpdate("");
                  setMessage("");
                  setLoading(false);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailVerification}
                disabled={loading || !currentPassword}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Email"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
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
            </div>

            <h3 className="text-lg font-bold mb-4">Verification Email Sent!</h3>
            <p className="text-sm text-gray-600 mb-6">
              We've sent a verification email to{" "}
              <strong>{pendingEmailUpdate}</strong>. Please check your inbox and
              click the verification link to complete the email update.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> After clicking the verification
                link, you will be automatically logged out. Please login again
                with your new email address.
              </p>
            </div>

            <button
              onClick={handleVerificationComplete}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              I've Verified My Email - Logout Now
            </button>

            <p className="text-xs text-gray-500 mt-4">
              Didn't receive the email? Check your spam folder or try again
              later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
