"use client";
import { Suspense } from "react";
import AssessmentResultContent from "./AssessmentResultContent";

export default function AssessmentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <AssessmentResultContent />
    </Suspense>
  );
}
