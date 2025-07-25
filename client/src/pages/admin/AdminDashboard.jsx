import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { fetchAdminDashboard } from "../../redux/parcel/adminDashboardSlice";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📊 Admin Dashboard
        </h1>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && data && (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Parcels", value: data.totalParcels },
                { label: "Users", value: data.totalUsers },
                { label: "Disputes", value: data.totalDisputes },
                { label: "Transfers", value: data.totalTransfers },
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-xl shadow text-center">
                  <h3 className="text-xl font-bold text-indigo-600">{item.value}</h3>
                  <p className="text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Parcels Chart */}
            <div className="bg-white rounded-xl shadow p-6 mb-10">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                📦 Recent Parcels (Last 5)
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data.recentParcels.map((p) => ({
                    id: p._id,
                    date: new Date(p.createdAt).toLocaleDateString(),
                  }))}
                >
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="id" name="Parcel ID" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Users Table */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">👥 Recent Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-sm text-gray-600 border-b">
                      <th className="py-2">Name</th>
                      <th className="py-2">Email</th>
                      <th className="py-2">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentUsers.map((user) => (
                      <tr key={user._id} className="text-sm text-gray-700 border-b">
                        <td className="py-2">{user.name || "N/A"}</td>
                        <td className="py-2">{user.email}</td>
                        <td className="py-2">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
