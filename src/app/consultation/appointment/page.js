import { Suspense } from "react";
import AppointmentContent from "@/components/AppointmentContent";

export default function AppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-purple-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointment...</p>
          </div>
        </div>
      }
    >
      <AppointmentContent />
    </Suspense>
  );
}
