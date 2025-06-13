"use client";
import { useState, useEffect } from "react";
import { userManagementService } from "../../services/userManagement";
import Image from "next/image";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    disabledUsers: 0,
    psychologists: 0,
    pendingReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const result = await userManagementService.getAllUsers();
      if (result.success) {
        const users = result.data;
        setStats({
          totalUsers: users.length,
          activeUsers: users.filter((u) => !u.disabled).length,
          disabledUsers: users.filter((u) => u.disabled).length,
          psychologists: users.filter((u) => u.role === "psychologist").length,
          pendingReports: 0, // This would come from reports service
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of CalmMe platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Image
                src="/icons/ic_totaluser.svg"
                alt="User Management Icon"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats.totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Image
                src="/icons/ic_active.svg"
                alt="Active User Icon"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats.activeUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Image
                src="/icons/ic_psychologist.svg"
                alt="Psychologist Icon"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Psychologists</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats.psychologists}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Image
                src="/icons/ic_disable.svg"
                alt="User Disable Icon"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Disabled Users
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats.disabledUsers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => (window.location.href = "/admin/usermanagement")}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <h3 className="font-medium text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-600">
              View and manage user accounts
            </p>
          </button>

          <button
            onClick={() => (window.location.href = "/admin/reports")}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <h3 className="font-medium text-gray-900">Review Reports</h3>
            <p className="text-sm text-gray-600">
              Check user reports and feedback
            </p>
          </button>

          <button
            onClick={() => (window.location.href = "/admin/psychologists")}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <h3 className="font-medium text-gray-900">Psychologist Requests</h3>
            <p className="text-sm text-gray-600">
              Review psychologist applications
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
