"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth";
import ProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/Sidebar";
import HomeContent from "../../components/HomeContent";

export default function UserHomePage() {
  // Ubah nama function
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

          // Redirect admin to admin dashboard
          if (data?.role === "admin") {
            router.replace("/admin");
            return;
          }

          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoadingUserData(false);
        }
      }
    };

    fetchUserData();
  }, [user, router]);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userData={userData}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <HomeContent
            userData={userData}
            loadingUserData={loadingUserData}
            onMenuClick={() => setSidebarOpen(true)}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
