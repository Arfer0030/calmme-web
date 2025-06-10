"use client";
import { useRouter } from "next/navigation";

export default function Membership() {
  const router = useRouter();

  const handleLetsGo = () => {
    router.push("/subscribe");
  };

  return (
    <div className="max-w-2xl mx-auto justify-center items-center p-6">
      {/* Card */}
      <div className="bg-gradient-to-br from-purple-200 via-blue-100 to-cyan-100 rounded-3xl p-8 shadow-lg text-center">
        {/* Title */}
        <h2 className="font-script text-3xl font-bold text-gray-800 mb-6">
          One Step Closer
        </h2>

        {/* Deskripsi */}
        <p className="text-lg font-semibold text-b-ungu mb-8 leading-relaxed">
          Let's check out our subscription
          <br />
          plans to get full access to all
          <br />
          features. Ready to go?
        </p>

        {/* Button */}
        <button
          onClick={handleLetsGo}
          className="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white px-12 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
}
