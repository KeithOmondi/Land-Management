import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { fetchAllParcels } from "../../redux/parcel/parcelSlice";
import { getAllUsers } from "../../redux/auth/authSlice";
import { getAllTransferRequests } from "../../redux/parcel/transferSlice";
import { getAllDisputes } from "../../redux/parcel/disputeSlice";
import { getAllDocuments } from "../../redux/parcel/documentSlice";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const Reports = () => {
  const dispatch = useDispatch();

  // Extract auth state
  const { user, isAuthenticated, loading: authLoading } = useSelector(
    (state) => state.auth || {}
  );

  // Other slices
  const { adminParcels = [], loading: parcelsLoading, error: parcelsError } =
    useSelector((state) => state.parcel || {});
  const { users = [] } = useSelector((state) => state.auth || {});
  const { transfers = [] } = useSelector((state) => state.transfer || {});
  const { allDisputes = [] } = useSelector((state) => state.disputes || {});
  const { documents = [] } = useSelector((state) => state.documents || {});

  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Load reports if admin
  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAllParcels());
      dispatch(getAllUsers());
      dispatch(getAllTransferRequests());
      dispatch(getAllDisputes());
      dispatch(getAllDocuments());
    }
  }, [dispatch, isAdmin]);

  // Prepare chart data
  const chartData = useMemo(
    () => [
      { name: "Parcels", value: adminParcels.length },
      { name: "Users", value: users.length },
      { name: "Transfers", value: transfers.length },
      { name: "Disputes", value: allDisputes.length },
      { name: "Documents", value: documents.length },
    ],
    [adminParcels, users, transfers, allDisputes, documents]
  );

  // Handle access control
  if (isAuthenticated && user && !isAdmin) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Access denied. Only admins can view reports.
      </div>
    );
  }

  // Wait for user to load or parcels
  if (!user || !isAuthenticated || authLoading || parcelsLoading) {
    return (
      <div className="p-6 text-center text-blue-600 font-semibold">
        Loading reports...
      </div>
    );
  }

  // Show error
  if (parcelsError) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Error loading reports: {parcelsError}
      </div>
    );
  }

  // Render reports
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 System Reports</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow">Parcels: {adminParcels.length}</div>
        <div className="bg-green-100 p-4 rounded shadow">Users: {users.length}</div>
        <div className="bg-yellow-100 p-4 rounded shadow">Transfers: {transfers.length}</div>
        <div className="bg-red-100 p-4 rounded shadow">Disputes: {allDisputes.length}</div>
        <div className="bg-purple-100 p-4 rounded shadow">Documents: {documents.length}</div>
      </div>

      {/* Pie chart */}
      <div className="w-full h-96">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Reports;
