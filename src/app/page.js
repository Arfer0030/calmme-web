"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/home");
      } else {
        router.replace("/auth");
      }
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-200">
        <div className="text-center">
          <div className="inline-block bg-yellow-200 rounded-3xl p-6 mb-4">
            <div className="text-4xl font-bold text-purple-600">CalmMe</div>
            <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mt-2 relative animate-pulse">
              <div className="absolute inset-2 bg-purple-300 rounded-full"></div>
            </div>
          </div>
          <p className="text-purple-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}
