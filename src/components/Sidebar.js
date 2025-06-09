"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "../services/auth";

export default function Sidebar({ isOpen, onClose, userData }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState("");

  const handleSignOut = async () => {
    try {
      await authService.logout();
      router.replace("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Daftar item menu
  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      path: "/home",
    },
    {
      id: "consultation",
      label: "Consultation",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      path: "/consultation",
    },
    {
      id: "payment",
      label: "Payment History",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      path: "/payment-history",
    },
  ];

  // Update active menu berdasarkan pathname
  useEffect(() => {
    // Cek apakah pathname cocok dengan salah satu menu item
    const currentMenuItem = menuItems.find((item) => {
      if (item.path === "/home" && pathname === "/home") {
        return true;
      }
      if (
        item.id === "consultation" &&
        (pathname === "/consultation" || pathname.startsWith("/consultation"))
      ) {
        return true;
      }
      if (item.path === "/payment-history" && pathname === "/payment-history") {
        return true;
      }
      return false;
    });
    
    setActiveMenu(currentMenuItem ? currentMenuItem.id : "");
  }, [pathname]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-60 bg-sidebar shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Teks app */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-script font-bold">CalmMe</div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                router.push(item.path);
                if (typeof onClose === "function" && window.innerWidth < 1024) {
                  onClose();
                }
              }}
              className={`w-full flex flex-col items-center space-y-1 px-4 py-3 rounded-lg text-left transition-colors ${
                activeMenu === item.id
                  ? "text-h-ungu border-r-4 border-b-ungu bg-purple-50"
                  : "text-gray-600 hover:bg-purple-200"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-18 h-18 bg-purple-200 rounded-full flex items-center justify-center overflow-hidden hover:scale-105 transition-transform cursor-pointer">
              {userData?.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  onClick={() => router.push("/settings")}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  onClick={() => router.push("/settings")}
                  className="w-8 h-8 text-purple-600 cursor-pointer"
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
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                {userData?.username || "User"}
              </p>
              {/* Tombol sign out */}
              <button
                onClick={handleSignOut}
                className="text-xs text-gray-500 hover:text-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
