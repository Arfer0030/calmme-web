"use client";
import { useState } from "react";
import Security1 from "./Security1";
import Security2 from "./Security2";

export default function Security() {
  const [isReauthenticated, setIsReauthenticated] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleReauthSuccess = () => {
    setIsReauthenticated(true);
    setShowChangePassword(true); // Otomatis pindah ke Security2
  };

  const handleBackToAuth = () => {
    setShowChangePassword(false);
    setIsReauthenticated(false);
  };

  return (
    <div className="space-y-6">
      {!showChangePassword ? (
        // Tampilkan Security1 (Authentication)
        <Security1 onReauthSuccess={handleReauthSuccess} />
      ) : (
        // Tampilkan Security2 (Change Password) dengan tombol back
        <div>
          <Security2 isReauthenticated={isReauthenticated} />
        </div>
      )}
    </div>
  );
}
