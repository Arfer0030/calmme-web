"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/auth";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleUserRedirect = async () => {
      if (!loading) {
        if (user) {
          try {
            // Fetch user data to check role
            const userData = await authService.getCurrentUserData();

            // Redirect based on role
            if (userData?.role === "admin") {
              router.replace("/admin");
            } else {
              router.replace("/home");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            router.replace("/auth");
          }
        } else {
          router.replace("/auth");
        }
      }
    };

    handleUserRedirect();
  }, [user, loading, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}
