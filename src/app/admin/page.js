"use client";
import { useState, useEffect } from "react";
import { userManagementService } from "@/services/userManagement";

export default function UserManagementPage({ userData }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [newRole, setNewRole] = useState("");
  const [disableReason, setDisableReason] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await userManagementService.getAllUsers();
      if (result.success) {
        setUsers(result.data);
        setFilteredUsers(result.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || "user");
    setModalType("role");
    setShowModal(true);
  };

  const handleDisableUser = (user) => {
    setSelectedUser(user);
    setDisableReason("");
    setModalType("disable");
    setShowModal(true);
  };

  const handleEnableUser = async (user) => {
    try {
      const result = await userManagementService.enableUserAccount(user.id);
      if (result.success) {
        setMessage("User enabled successfully!");
        fetchUsers();
      } else {
        setMessage("Error enabling user: " + result.error);
      }
    } catch (error) {
      setMessage("Error enabling user: " + error.message);
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleModalSubmit = async () => {
    if (!selectedUser) return;

    try {
      let result;

      if (modalType === "role") {
        result = await userManagementService.updateUserRole(
          selectedUser.id,
          newRole
        );
        if (result.success) {
          setMessage("User role updated successfully!");
        }
      } else if (modalType === "disable") {
        if (!disableReason.trim()) {
          setMessage("Please provide a reason for disabling the user");
          return;
        }
        result = await userManagementService.disableUserAccount(
          selectedUser.id,
          disableReason
        );
        if (result.success) {
          setMessage("User disabled successfully!");
        }
      }

      if (!result.success) {
        setMessage("Error: " + result.error);
      }

      setShowModal(false);
      fetchUsers();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "psychologist":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Mangement User
          </h1>
          <p className="text-gray-600">
            Manage user role and disable user
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={fetchUsers}
            className="bg-b-ungu text-white px-4 py-2 rounded-lg hover:bg-h-ungu transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes("Error")
              ? "bg-red-100 text-red-700 border border-red-200"
              : "bg-green-100 text-green-700 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Tabel User */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-600 font-medium">
                              {user.username?.charAt(0).toUpperCase() || "U"}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.disabled
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.disabled ? "Disabled" : "Active"}
                      </span>
                      {user.disabled && user.disabledReason && (
                        <div className="text-xs text-gray-500 mt-1">
                          Reason: {user.disabledReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt?.toDate?.()?.toLocaleDateString() ||
                        "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleRoleChange(user)}
                        className="text-b-ungu hover:text-purple-900"
                      >
                        Change Role
                      </button>
                      {user.disabled ? (
                        <button
                          onClick={() => handleEnableUser(user)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Enable
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDisableUser(user)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Disable
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog Change Role */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {modalType === "role"
                ? "Change User Role"
                : "Disable User Account"}
            </h3>

            {modalType === "role" ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Change role for: <strong>{selectedUser?.username}</strong>
                </p>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="psychologist">Psychologist</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Disable account for: <strong>{selectedUser?.username}</strong>
                </p>
                <textarea
                  value={disableReason}
                  onChange={(e) => setDisableReason(e.target.value)}
                  placeholder="Reason for disabling (required)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            )}

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {modalType === "role" ? "Update Role" : "Disable User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
