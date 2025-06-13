"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { usePathname, useRouter } from "next/navigation";

const DashboardLayout = ({
  children,
  title,
  showBackButton = true,
  onBackClick,
  backgroundColor = "bg-white",
  contentClassName = "",
}) => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const pathname = usePathname();
  const router = useRouter();

  const getTitleFromPath = (path) => {
    if (path === "/meditate") return "Meditate";
    if (path.startsWith("/assessment")) return "Assessment";
    if (path === "/assessment/test") return "Test";
    if (path === "/assessment/result") return "Result";
    if (path === "/dailymood") return "Daily Mood";
    return title || "Dashboard";
  };

  const pageTitle = title || getTitleFromPath(pathname);

  // Toggle function untuk buka/tutup sidebar
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await authService.getCurrentUserData();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (loading || !user) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-40" : "w-0"
        }`}
      >
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userData={userData}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 ${backgroundColor} min-h-screen overflow-hidden`}
      >
        <div className="px-4 pt-4 lg:px-6">
          <TopBar
            key={pathname}
            title={pageTitle}
            onMenuClick={handleToggleSidebar} // Gunakan toggle function
            onBackClick={onBackClick || (() => router.back())}
            showMenuButton={true}
            showBackButton={showBackButton}
            sidebarOpen={sidebarOpen} // Pass status sidebar ke TopBar
          />
        </div>

        <main
          className={`flex-1 overflow-y-auto px-4 pb-4 lg:px-6 lg:pb-6 ${contentClassName}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
