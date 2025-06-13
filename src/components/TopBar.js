"use client";

export default function TopBar({
  onMenuClick,
  onBackClick,
  title,
  showBackButton = true,
  showMenuButton = true,
  className = "",
  sidebarOpen = false, 
}) {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Button toggle */}
      {showMenuButton && (
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors mr-4 z-10"
          aria-label={sidebarOpen ? "Close sidebar menu" : "Open sidebar menu"}
        >
          {sidebarOpen ? (
            // Icon close
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Icon open
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      )}

      {/* Back Button */}
      {showBackButton && (
        <button
          onClick={onBackClick}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors mr-4 z-10"
          aria-label="Go back"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Judul Page */}
      <div className="w-full flex justify-between items-start">
        <div className="px-6 py-2 rounded-full">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>
      </div>
    </div>
  );
}
