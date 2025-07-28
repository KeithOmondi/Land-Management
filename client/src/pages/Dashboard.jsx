import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../redux/parcel/dashboardSlice";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard() {
  const dispatch = useDispatch();

  const {
    parcelsOwned,
    pendingTransfers,
    activeDisputes,
    lastLogin,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  // Sample data for the chart — replace with your real data!
  const sampleChartData = [
    { name: "Parcels Owned", value: parcelsOwned },
    { name: "Pending Transfers", value: pendingTransfers },
    { name: "Active Disputes", value: activeDisputes },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center">
          Welcome Back 👋
        </h1>

        {loading && (
          <p className="text-center text-gray-500 text-lg">
            Loading dashboard...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        )}

        {!loading && !error && (
          <>
            {/* Overview Section */}
            <Section title="Your Land Overview">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Parcels Owned" value={parcelsOwned} icon="🏡" />
                <StatCard
                  title="Pending Transfers"
                  value={pendingTransfers}
                  icon="🔄"
                />
                <StatCard
                  title="Active Disputes"
                  value={activeDisputes}
                  icon="⚖️"
                />
                <StatCard
                  title="Last Login"
                  value={lastLogin || "N/A"}
                  icon="📅"
                />
              </div>
            </Section>

            {/* New Charts Section */}
            <Section title="Your Data Insights">
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={sampleChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Section>

            {/* Quick Actions */}
            <Section title="Quick Actions">
              <div className="flex flex-wrap gap-6">
                <ActionButton
                  label="View My Parcels"
                  icon="🗺️"
                  color="blue"
                  to="/user/parcels"
                />
                <ActionButton
                  label="File New Dispute"
                  icon="📝"
                  color="purple"
                  to="/user/disputes"
                />
                <ActionButton
                  label="Download Documents"
                  icon="📥"
                  color="teal"
                  to="/user/documents"
                />
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

/* Reusable Components */

const Section = ({ title, children }) => (
  <section>
    <h2 className="text-2xl font-bold text-gray-700 mb-6">{title}</h2>
    {children}
  </section>
);

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 text-center hover:shadow-lg transition-all">
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="text-base font-medium text-gray-600">{title}</h3>
    <p className="text-3xl font-bold text-indigo-700 mt-1">{value}</p>
  </div>
);

const ActionButton = ({ label, color = "blue", icon, to }) => {
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    teal: "bg-teal-600 hover:bg-teal-700",
  };

  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center px-6 py-5 w-48 text-white rounded-xl shadow-md transform hover:scale-105 transition-all ${colorClasses[color]}`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <span className="text-base font-medium text-center">{label}</span>
    </Link>
  );
};
