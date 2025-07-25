import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateDisputeStatus,
  clearMessages,
  getAllDisputes,
} from "../../redux/parcel/disputeSlice";

export default function AdminDisputes() {
  const dispatch = useDispatch();
  const {
    allDisputes = [],
    loading,
    error,
    success,
    message,
  } = useSelector((state) => state.disputes || {});

  useEffect(() => {
    dispatch(getAllDisputes());
  }, [dispatch]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => dispatch(clearMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleStatusChange = (id, status) => {
    dispatch(updateDisputeStatus({ id, status }));
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center select-none">
        ⚖️ Property Disputes Overview
      </h1>

      {/* Status Messages */}
      {loading && (
        <p className="flex items-center justify-center gap-3 text-blue-600 text-lg mb-6 select-none">
          <svg
            className="animate-spin h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-80"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading disputes...
        </p>
      )}
      {error && (
        <p className="max-w-xl mx-auto mb-6 px-5 py-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow select-none">
          🚨 Error: {message || error}
        </p>
      )}
      {success && (
        <p className="max-w-xl mx-auto mb-6 px-5 py-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow select-none">
          ✅ Success: {message}
        </p>
      )}

      {/* No Disputes Message */}
      {allDisputes.length === 0 && !loading && !error ? (
        <p className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-md text-gray-600 text-center select-none">
          No disputes available at the moment. Everything’s calm! 🧘‍♂️
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-300 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-100">
              <tr>
                {[
                  "#",
                  "Dispute ID",
                  "Parcel LR",
                  "Complainant",
                  "Defendant",
                  "Reason",
                  "Status",
                  "Filed On",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider ${
                      head === "Actions" ? "text-right" : ""
                    }`}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allDisputes.map((d, i) => (
                <tr
                  key={d._id}
                  className="hover:bg-indigo-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {i + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {d.disputeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {d.parcelLR || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {d.complainant || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {d.defendant || "N/A"}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-700">
                    {d.reason || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        d.status === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : d.status === "Resolved"
                          ? "bg-green-200 text-green-900"
                          : d.status === "Rejected"
                          ? "bg-red-200 text-red-900"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(d.dateFiled).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button
                      onClick={() => handleStatusChange(d._id, "Resolved")}
                      disabled={d.status === "Resolved"}
                      className={`px-3 py-1 rounded-md font-semibold transition-colors duration-200 ${
                        d.status === "Resolved"
                          ? "bg-green-300 text-green-800 cursor-not-allowed opacity-60"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                      aria-label={`Resolve dispute ${d.disputeId}`}
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleStatusChange(d._id, "Rejected")}
                      disabled={d.status === "Rejected"}
                      className={`px-3 py-1 rounded-md font-semibold transition-colors duration-200 ${
                        d.status === "Rejected"
                          ? "bg-red-300 text-red-800 cursor-not-allowed opacity-60"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                      aria-label={`Reject dispute ${d.disputeId}`}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
