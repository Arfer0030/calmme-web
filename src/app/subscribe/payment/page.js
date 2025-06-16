import { Suspense } from "react";
import PaymentContent from "@/components/PaymentContent";

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-purple-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment...</p>
          </div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
