import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAssignedParcels } from "../../redux/parcel/surveyorSlice";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#FACC15", "#4ADE80", "#A1A1AA"]; // yellow, green, gray

const SurveyorDashboard = () => {
  const dispatch = useDispatch();
  const { assignedParcels, loading } = useSelector((state) => state.surveyor);

  useEffect(() => {
    dispatch(fetchAssignedParcels());
  }, [dispatch]);

  const statusData = [
    {
      name: "Pending",
      value: assignedParcels.filter((p) => p.surveyStatus === "Pending").length,
    },
    {
      name: "Completed",
      value: assignedParcels.filter((p) => p.surveyStatus === "Completed").length,
    },
    {
      name: "Other",
      value: assignedParcels.filter(
        (p) => !["Pending", "Completed"].includes(p.surveyStatus)
      ).length,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Surveyor Dashboard
      </h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-gray-500 text-sm">Total Assigned Parcels</p>
          <p className="text-2xl font-semibold text-gray-800">{assignedParcels.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-gray-500 text-sm">Completed Surveys</p>
          <p className="text-2xl font-semibold text-green-600">
            {
              assignedParcels.filter((p) => p.surveyStatus === "Completed").length
            }
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-gray-500 text-sm">Pending Surveys</p>
          <p className="text-2xl font-semibold text-yellow-500">
            {
              assignedParcels.filter((p) => p.surveyStatus === "Pending").length
            }
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Survey Status Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Parcel Cards */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Assigned Parcels
        </h3>
        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : assignedParcels.length === 0 ? (
          <div className="text-center text-gray-500">
            No parcels have been assigned to you yet.
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {assignedParcels.map((parcel) => (
              <div
                key={parcel._id}
                className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Parcel Number</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {parcel.parcelNumber}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-500">Owner</p>
                  <p className="text-base text-gray-700">
                    {parcel.owner?.name || "N/A"}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      parcel.surveyStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : parcel.surveyStatus === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {parcel.surveyStatus}
                  </span>
                </div>

                <Link
                  to={`/surveyor/parcels/${parcel.lrNumber || parcel.parcelId}`}
                  className="inline-block mt-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                  ➜ Submit Feedback
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyorDashboard;
