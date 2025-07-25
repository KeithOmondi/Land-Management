import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/auth/authSlice";

const UserManagement = () => {
  const dispatch = useDispatch();

  const {
    users = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.auth || {});

  // ✅ Fetch only if users not already loaded
  useEffect(() => {
    if (users.length === 0) {
      dispatch(getAllUsers());
    }
  }, [dispatch, users.length]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">👤 User Management</h1>

      {/* ✅ Error message */}
      {error && (
        <p className="text-red-600 font-medium mb-4">❌ {error}</p>
      )}

      {/* ✅ Loading message */}
      {loading ? (
        <p className="text-blue-600">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow border">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-600">
              <tr>
                <th className="px-6 py-3">User ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Registered</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{user._id}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-GB")
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3 text-sm">
                    <button className="text-blue-600 hover:underline">View</button>
                    <button className="text-indigo-600 hover:underline">Edit</button>
                    <button className="text-red-600 hover:underline">Disable</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
