"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
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
          setUserData(data);

          // Redirect non-admin users
          if (data?.role !== "admin") {
            router.replace("/home");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          router.replace("/auth");
        }
      }
    };

    fetchUserData();
  }, [user, router]);

  if (loading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (userData.role !== "admin") {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Admin Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userData={userData}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
