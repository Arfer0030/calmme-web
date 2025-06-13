"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth";
import EditProfile from "../../components/settings/EditProfile";
import Security from "../../components/settings/Security";
import Notifications from "@/components/settings/Notifications";  
import Membership from "@/components/settings/Membership";
import Help from "@/components/settings/Help";
import About from "@/components/settings/About"
import DashboardLayout from "@/components/DashboardLayout";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Edit Profile");
  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const data = await authService.getCurrentUserData();
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const tabs = [
    "Edit Profile",
    "Security",
    "Notifications",
    "Membership",
    "Help",
    "About",
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Edit Profile":
        return <EditProfile userData={userData} />;
      case "Security":
        return <Security />;
      case "Notifications":
        return (
          <Notifications userData={userData} />
        );
      case "Membership":
        return (
          <Membership/>
        );
      case "Help":
        return (
          <Help userData={userData} />
        );
      case "About":
        return (
          <About/>
        );
      default:
        return <EditProfile userData={userData} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout
      title="Settings"
      showBackButton
      onBackClick={() => router.push("/home")}
      backgroundColor="bg-gradient-to-b from-purple-100 via-white to-purple-100 to-95% "
      contentClassName="p-0"
    >
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 flex overflow-hidden ">
          <div className="flex-1 flex flex-col overflow-hidden ">
            <div className="backdrop-blur-sm border-gray-200 px-4 sm:px-6 py-4">
              {/* Tab Navigasi */}
              <div className="flex justify-center">
                <div className="flex space-x-6 sm:space-x-8 md:space-x-12 overflow-x-auto scrollbar-hide">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab
                          ? "border-h-ungu text-h-ungu"
                          : "border-transparent text-b-ungu hover:text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Tab konten */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}