"use client";
import { authService } from "../services/auth";
import { validation } from "../utils/validation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    loginIdentifier: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        let result;

        if (validation.isValidEmail(formData.loginIdentifier)) {
          // Login dengan email
          result = await authService.loginWithEmail(
            formData.loginIdentifier,
            formData.password
          );
        } else {
          // Login dengan username
          result = await authService.loginWithUsername(
            formData.loginIdentifier,
            formData.password
          );
        }

        if (result.success) {
          router.replace("/home");
        } else {
          setError(result.error);
        }
      } else {
        // Register Logic menggunakan authService

        // Validasi input
        if (!validation.isValidUsername(formData.username)) {
          setError(
            "Username must be at least 3 characters and contain only letters, numbers, and underscores"
          );
          return;
        }

        if (!validation.isValidEmail(formData.email)) {
          setError("Please enter a valid email address");
          return;
        }

        if (!validation.isValidPassword(formData.password)) {
          setError("Password must be at least 6 characters long");
          return;
        }

        const result = await authService.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          router.replace("/home");
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden">
      {/* bagian kiri (logo) */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative z-10 py-8">
        <div className="text-center">
          {/* bg logo */}
          <div className="relative mb-8">
            <div className="w-80 h-72 sm:w-72 sm:h-64 md:w-80 md:h-72 relative">
              <Image
                src="/images/bg-logo.png"
                alt="Logo Background"
                fill
                className=" object-cover z-10"
                sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
              />
              {/* logo */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <div className="w-24 h-24 sm:w-32 sm:h-32 mb-2 sm:mb-4 relative">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={150}
                    height={150}
                    className="object-contain"
                    sizes="(max-width: 640px) 96px, 164px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bagian kanan (form) */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-4 sm:p-8">
        {/* background */}
        <div className="absolute inset-y-0 left-0 w-full h-full">
          <Image
            src="/images/bg-form.png"
            alt="Form Background"
            fill
            className="object-cover"
          />
        </div>

        {/* card form */}
        <div className="relative z-20 w-full max-w-md p-6 sm:p-8 rounded-xl ">
          {/* teks welcome */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="font-monserrat font-bold text-xl sm:text-2xl text-gray-800 mb-1 sm:mb-2">
              Welcome to
            </h1>
            <h2 className="font-script font-bold text-3xl sm:text-4xl text-b-ungu mb-6 sm:mb-8">
              CalmMe
            </h2>

            {/* button tab */}
            <div className="flex bg-gray-100 backdrop-blur-sm rounded-full p-1 mb-6 sm:mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all ${
                  isLogin
                    ? "bg-b-ungu text-white shadow-lg"
                    : "text-b-ungu hover:text-h-ungu "
                }`}
              >
                Log in
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all ${
                  !isLogin
                    ? "bg-b-ungu text-white shadow-lg"
                    : "text-b-ungu hover:text-h-ungu"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100/90 backdrop-blur-sm border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* username field buat register */}
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {/* user icon */}
                  <svg
                    className="h-5 w-5 text-black"
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
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500 transition-all"
                  required={!isLogin}
                />
              </div>
            )}

            {/* email/usn field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {/* email icon */}
                <svg
                  className="h-5 w-5 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <input
                type={isLogin ? "text" : "email"}
                name={isLogin ? "loginIdentifier" : "email"}
                value={isLogin ? formData.loginIdentifier : formData.email}
                onChange={handleChange}
                placeholder={isLogin ? "Username or Email" : "Email"}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500 transition-all"
                required
              />
            </div>

            {/* pasword field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {/* icon lock */}
                <svg
                  className="h-5 w-5 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-white transition-colors"
              >
                {/* eye icon */}
                <svg
                  className="h-5 w-5 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      showPassword
                        ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    }
                  />
                </svg>
              </button>
            </div>

            {/* submit button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-b-ungu hover:bg-h-ungu text-white py-4 rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </div>
                ) : isLogin ? (
                  "Log In"
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
