"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "../services/auth";
import Image from "next/image";

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
      icon: "/icons/ic_home.svg",
      path: "/home",
    },
    {
      id: "consultation",
      label: "Consultation",
      icon: "/icons/ic_consul.svg",
      path: "/consultation",
    },
    {
      id: "payment",
      label: "Payment History",
      icon: "/icons/ic_history.svg",
      path: "/payment-history",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "/icons/settings.svg",
      path: "/settings",
    },
  ];

  useEffect(() => {
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
      if (item.path === "/settings" && pathname === "/settings") {
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
        <div
          className="fixed inset-0 bg-black opacity-15 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-40 bg-sidebar shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pt-6 px-3 pb-2">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-script font-bold">CalmMe</div>
          </div>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                router.push(item.path);
                // Close sidebar setelah navigasi
                if (typeof onClose === "function") {
                  onClose();
                }
              }}
              className={`w-full flex flex-col items-center space-y-1 px-2 py-2 rounded-lg text-left transition-colors ${
                activeMenu === item.id
                  ? "text-h-ungu border-r-4 border-b-ungu bg-purple-50"
                  : "text-gray-600 hover:bg-purple-200"
              }`}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="font-medium text-sm text-center">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-15 h-15 bg-purple-200 rounded-full flex items-center justify-center overflow-hidden hover:scale-105 transition-transform cursor-pointer">
              {userData?.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  onClick={() => {
                    router.push("/settings");
                    onClose(); 
                  }}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  onClick={() => {
                    router.push("/settings");
                    onClose(); 
                  }}
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
