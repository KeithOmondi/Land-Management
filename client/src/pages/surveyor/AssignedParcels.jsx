import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignedParcels } from "../../redux/parcel/surveyorSlice";

const AssignedParcels = () => {
  const dispatch = useDispatch();
  const { assignedParcels = [], isLoading, error } = useSelector((state) => state.surveyor);

  useEffect(() => {
    dispatch(fetchAssignedParcels());
  }, [dispatch]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="mb-6 border-b pb-3">
        <h2 className="text-3xl font-bold text-gray-800">📍 Surveyor's Assigned Parcels</h2>
        <p className="text-sm text-gray-500 mt-1">
          Below is a list of land parcels assigned to you for survey.
        </p>
      </div>

      {isLoading && (
        <div className="text-blue-600 font-medium">Loading assigned parcels...</div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-md">
          🚫 Error: {error}
        </div>
      )}

      {!isLoading && assignedParcels.length === 0 && (
        <div className="text-gray-600 italic">No parcels have been assigned yet.</div>
      )}

      {!isLoading && assignedParcels.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">LR Number</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white text-sm divide-y divide-gray-100">
              {assignedParcels.map((parcel) => (
                <tr key={parcel.surveyId} className="hover:bg-blue-50 transition-all">
                  <td className="px-4 py-3">{parcel.lrNumber || parcel.parcelId}</td>
                  <td className="px-4 py-3">{parcel.owner?.name || parcel.owner?.email || "N/A"}</td>
                  <td className="px-4 py-3">{parcel.location || "Unknown"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        parcel.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {parcel.status}
                    </span>
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

export default AssignedParcels;
