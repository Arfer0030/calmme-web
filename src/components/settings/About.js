"use client";
import Image from "next/image";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="text-6xl font-script text-h-ungu mr-4">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={150}
              height={1150}
              className="object-contain"
              sizes="(max-width: 640px) 96px, 164px"
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-h-ungu mb-4">About Us</h1>
      </div>

      {/* about us */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
        <p className="text-gray-700 text-lg leading-relaxed text-center">
          CalmMe is a mental health app that provides a safe space to share
          stories, track moods, consult with psychologists, and makes mental
          well-being more accessible for everyone.
        </p>
      </div>

      {/* Why Choose */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-b-ungu mb-6">
          Why choose CalmMe?
        </h2>

        <div className="flex items-start mb-4">
          <span className="text-yellow-500 text-xl mr-3">⭐</span>
          <div>
            <span className="font-semibold text-gray-800">
              Trusted by 1000+ Users:
            </span>
            <span className="text-gray-700 ml-2">
              Our commitment to your well-being is at the core of everything we
              do. We strive to create an intuitive and supportive environment
              where you feel understood and empowered.
            </span>
          </div>
        </div>
      </div>

      {/* We can help */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-b-ungu mb-6">
          We can help with
        </h2>

        <p className="text-gray-700 mb-4">
          CalmMe offers resources and tools specifically designed to help you
          navigate and improve in areas such as:
        </p>

        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-b-ungu rounded-full mr-3"></span>
            Anxiety
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-b-ungu rounded-full mr-3"></span>
            Focus & Productivity
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-b-ungu rounded-full mr-3"></span>
            Sleep Improvement
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-b-ungu rounded-full mr-3"></span>
            Self-Esteem
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-b-ungu rounded-full mr-3"></span>
            And many more personalized insight
          </li>
        </ul>
      </div>

      {/* Key Features */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-b-ungu mb-6">
          Key Features of CalmMe
        </h2>

        <p className="text-gray-700 mb-4">
          Discover the powerful tools within CalmMe designed to support your
          mental health journey:
        </p>

        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-b-ungu rounded-full mr-3"></span>
            Meditate Time
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-b-ungu rounded-full mr-3"></span>
            Daily Mood Tracker
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-b-ungu rounded-full mr-3"></span>
            Self-Assessment
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-b-ungu rounded-full mr-3"></span>
            Consultation
          </li>
        </ul>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-b-ungu mb-6">
          Your Privacy & Security
        </h2>

        <p className="text-gray-700">
          We understand the sensitive nature of mental health. Your privacy and
          data security are our utmost priority. All your shared information is
          handled with the highest level of confidentiality and care.
        </p>
      </div>

      {/* Music By */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-b-ungu mb-6">Music By</h2>

        <p className="text-gray-700">Soothing Oasis</p>
      </div>

      {/* Pepole Behind CalmMe */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-b-ungu mb-6">
          The People Behind CalmMe
        </h2>

        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-b-ungu rounded-full mr-3"></span>
            <strong>Aufa Rafly</strong> - Project Manager, Team Leader,
            Programmer
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-b-ungu rounded-full mr-3"></span>
            <strong>Alvis Marcell</strong> - Frontend Developer, System Analyst,
            Programmer
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-b-ungu rounded-full mr-3"></span>
            <strong>Alya Dliya</strong> - UI/UX Designer, Product Owner,
            Business Analyst
          </li>
        </ul>
      </div>
    </div>
  );
}
