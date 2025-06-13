"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/auth";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      if (!loading) {
        if (!user) {
          router.replace("/auth");
          return;
        }

        if (adminOnly) {
          try {
            const userData = await authService.getCurrentUserData();
            if (userData?.role !== "admin") {
              router.replace("/home");
              return;
            }
          } catch (error) {
            console.error("Error checking admin access:", error);
            router.replace("/auth");
          }
        }
      }
    };

    checkAccess();
  }, [user, loading, router, adminOnly]);

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

  if (!user) {
    return null;
  }

  return children;
}
