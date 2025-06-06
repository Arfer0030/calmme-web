"use client";

export default function TopBar({
  onMenuClick,
  onBackClick,
  title,
  showBackButton = true,
  showMenuButton = true,
  className = "",
}) {
  return (
    <div className={`flex items-center mb-8 ${className}`}>
      {/* Button buka sidebar */}
      {showMenuButton && (
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors mr-4"
          aria-label="Open sidebar menu"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Back Button */}
      {showBackButton && (
        <button
          onClick={onBackClick}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors mr-4"
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
      <div className="w-full flex justify-center">
        <div className="bg-gradient-to-r from-purple-100 to-purple-300 backdrop-blur-sm px-6 py-2 rounded-full">
          <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        </div>
      </div>
    </div>
  );
}
