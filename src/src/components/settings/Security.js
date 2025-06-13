"use client";
import { useState } from "react";
import Security1 from "./Security1";
import Security2 from "./Security2";

export default function Security() {
  const [isReauthenticated, setIsReauthenticated] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleReauthSuccess = () => {
    setIsReauthenticated(true);
    setShowChangePassword(true); 
  };

  const handleBackToAuth = () => {
    setShowChangePassword(false);
    setIsReauthenticated(false);
  };

  return (
    <div className="space-y-6">
      {!showChangePassword ? (
        // Reauth
        <Security1 onReauthSuccess={handleReauthSuccess} />
      ) : (
        // NeW Password
        <div>
          <Security2 isReauthenticated={isReauthenticated} />
        </div>
      )}
    </div>
  );
}
