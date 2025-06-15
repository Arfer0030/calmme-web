"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/auth";
import Image from "next/image";

export default function AdminSidebar({ isOpen, onClose, userData }) {
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

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <Image
          src="/icons/ic_dashboard.svg"
          alt="Dashboard Icon"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
      path: "/admin",
    },
    {
      id: "users",
      label: "User Management",
      icon: (
        <Image
          src="/icons/ic_group.svg"
          alt="User Management Icon"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
      path: "/admin/usermanagement",
    },
    {
      id: "reports",
      label: "Reports & Feedback",
      icon: (
        <Image
          src="/icons/ic_reports.svg"
          alt="Reports Icon"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
      path: "/admin/reports",
    },
  ];

  useEffect(() => {
    const currentMenuItem = menuItems.find((item) => item.path === pathname);
    setActiveMenu(currentMenuItem ? currentMenuItem.id : "");
  }, [pathname]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sideba */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-script font-bold text-b-ungu">
              CalmMe
            </div>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
              Admin
            </span>
          </div>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                router.push(item.path);
                if (typeof onClose === "function") {
                  onClose();
                }
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeMenu === item.id
                  ? "bg-purple-50 text-h-ungu border-l-4 border-b-ungu"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
              {userData?.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <svg
                  className="w-6 h-6 text-purple-600"
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
            <div>
              <p className="text-sm font-medium text-gray-900">
                {userData?.username || "Admin"}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
