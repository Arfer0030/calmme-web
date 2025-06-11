"use client";
import Image from "next/image";

export default function Help({ userData }) {
  const adminEmail = "help.calmme787@gmail.com";

  const helpOptions = [
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

  const handleHelpOption = (option) => {
    let body = "";

    if (option.id === "psychologist") {
      body = `Hi CalmMe Support Team,
  
  I would like to register as a psychologist on CalmMe.
  
  User: ${userData?.username || "Unknown User"}
  Email: ${userData?.email || "Not provided"}
  
  Please find my details below:
  - Name with Master's Degree: 
  - NIK:
  - Member Number of HIMPSI:
  - Magister Education:
  - (Attach Scan of SIPP (Surat Izin Praktik Psikologi))
  
  Thank you for your assistance.
  
  Best regards,
  ${userData?.username || "CalmMe User"}`;
    } else {
      body = `Hi CalmMe Support Team,
  
  I am contacting you regarding: ${option.title}
  
  User: ${userData?.username || "Unknown User"}
  Email: ${userData?.email || "Not provided"}
  
  Please describe your issue or feedback below:
  [Write your message here]
  
  Thank you for your assistance.
  
  Best regards,
  ${userData?.username || "CalmMe User"}`;
    }

    const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(
      option.subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };
  

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Card */}
      <div className="bg-card-ungu rounded-3xl p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            👋 Hey {userData?.username || "user123"} we're here to help!
          </h2>
        </div>

        {/* Help Opsi */}
        <div className="space-y-4">
          {helpOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleHelpOption(option)}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-2 hover:bg-white/30 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12  rounded-xl flex items-center justify-center text-white`}
                  >
                    <span className="text-xl">
                      <Image
                        src={option.icon}
                        alt={option.title}
                        width={48}
                        height={48}
                        className="w-8 h-8"
                      />
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className=" font-semibold text-gray-800">
                    {option.title}
                  </h3>
                </div>

                {/* Arrow Icon */}
                <svg
                  className="w-6 h-6 text-gray-600 group-hover:text-gray-800 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          We typically respond within 24-48 hours during business days.
        </p>
      </div>
    </div>
  );
}
