"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth";
import { psychologistService } from "../../services/psychologist";
import Sidebar from "../../components/Sidebar";
import PsychologistCard from "../../components/PsychologistCard";

export default function ConsultationPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [psychologists, setPsychologists] = useState([]);
  const [filteredPsychologists, setFilteredPsychologists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingPsychologists, setLoadingPsychologists] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const data = await authService.getCurrentUserData();
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchPsychologists = async () => {
      setLoadingPsychologists(true);
      try {
        const result = await psychologistService.getAllPsychologists();
        if (result.success) {
          setPsychologists(result.data);
          setFilteredPsychologists(result.data);
        }
      } catch (error) {
        console.error("Error fetching psychologists:", error);
      } finally {
        setLoadingPsychologists(false);
      }
    };

    fetchPsychologists();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPsychologists(psychologists);
    } else {
      const filtered = psychologists.filter((psychologist) =>
        psychologist.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPsychologists(filtered);
    }
  }, [searchTerm, psychologists]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAppointment = (psychologist) => {
    router.push(`/consultation/appointment?id=${psychologist.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-purple-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userData={userData}
      />

      {/* Main konten */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden absolute top-6 left-6 p-2 hover:bg-white/50 rounded-lg transition-colors"
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

            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Let's find your psychologist!
            </h1>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Search psychologist"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-3 pr-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 placeholder-gray-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Card psikolog */}
          <div className="max-w-6xl mx-auto">
            {loadingPsychologists ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white/80 rounded-3xl p-6 animate-pulse"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-20 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPsychologists.map((psychologist) => (
                  <PsychologistCard
                    key={psychologist.id}
                    psychologist={psychologist}
                    onAppointment={handleAppointment}
                  />
                ))}
              </div>
            )}

            {!loadingPsychologists && filteredPsychologists.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">
                  {searchTerm
                    ? "No psychologists found matching your search."
                    : "No psychologists available."}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
