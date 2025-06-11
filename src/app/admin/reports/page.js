"use client";
import { useState } from "react";
import Image from "next/image";

export default function ReportsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const adminEmail = "help.calmme787@gmail.com";

  const reportTypes = [
    {
      id: "contact",
      title: "Contact Us",
      icon: "/icons/ic_contact.svg",
      subject: "Contact Us - CalmMe App",
    },
    {
      id: "feedback",
      title: "Give Feedback",
      icon: "/icons/ic_feedback.svg",
      subject: "Feedback - CalmMe App",
    },
    {
      id: "report",
      title: "Report an Issue",
      icon: "/icons/ic_report.svg",
      subject: "Report Issue - CalmMe App",
    },
    {
      id: "psychologist",
      title: "Psychologist Request",
      icon: "/icons/ic_psirequest.svg",
      subject: "Psychologist Request - CalmMe App",
    },
  ];

  const handleEmailCheck = (type) => {
    const emailUrl = `https://mail.google.com/mail/u/0/#search/to:${adminEmail}+subject:"${encodeURIComponent(
      type.subject
    )}"`;
    window.open(emailUrl, "_blank");
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Feedback</h1>
        <p className="text-gray-600">
          Manage user reports, feedback, and psychologist requests
        </p>
      </div>

      {/* Filter Tab */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {["all", ...reportTypes.map((t) => t.id)].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeFilter === filter
                    ? "border-b-ungu text-h-ungu"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {filter === "all"
                  ? "All Reports"
                  : reportTypes.find((t) => t.id === filter)?.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes
          .filter((type) => activeFilter === "all" || activeFilter === type.id)
          .map((type) => (
            <div
              key={type.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">
                  <Image
                    src={type.icon}
                    alt={type.title}
                    width={48}
                    height={48}
                    className="w-8 h-8"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {type.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Subject: {type.subject}
              </p>

              <button
                onClick={() => handleEmailCheck(type)}
                className="w-full bg-b-ungu text-white px-4 py-2 rounded-lg hover:bg-h-ungu transition-colors"
              >
                Check Emails
              </button>
            </div>
          ))}
      </div>

      {/* Instruksi */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          📧 Email Management Instructions
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click "Check Emails" to open Gmail with filtered results</li>
          <li>• Review emails with the specific subject line</li>
          <li>• Respond to urgent reports and feedback promptly</li>
          <li>
            • For psychologist requests, verify credentials before approval
            after that change the role
          </li>
        </ul>
      </div>
    </div>
  );
}
