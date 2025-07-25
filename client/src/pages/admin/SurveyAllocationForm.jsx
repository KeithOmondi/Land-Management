import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  assignSurveyor,
  fetchSurveyors,
  fetchUnassignedParcels,
  fetchAllSurveys,
  resetAssignStatus,
} from "../../redux/parcel/surveyorSlice";
import { toast } from "react-toastify";

const SurveyAllocationForm = () => {
  const dispatch = useDispatch();

  const { unassignedParcels, surveyors, assignStatus, allSurveys } = useSelector(
    (state) => state.surveyor
  );

  const [selectedParcelId, setSelectedParcelId] = useState("");
  const [selectedSurveyorId, setSelectedSurveyorId] = useState("");

  useEffect(() => {
    dispatch(fetchUnassignedParcels());
    dispatch(fetchSurveyors());
    dispatch(fetchAllSurveys());
    dispatch(resetAssignStatus());
  }, [dispatch]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedParcelId || !selectedSurveyorId) return;

    try {
      await dispatch(assignSurveyor({ parcelId: selectedParcelId, surveyorId: selectedSurveyorId })).unwrap();
      toast.success("✅ Surveyor assigned successfully");

      setSelectedParcelId("");
      setSelectedSurveyorId("");

      dispatch(fetchUnassignedParcels());
      dispatch(fetchAllSurveys());
    } catch (error) {
      toast.error(`❌ Assignment failed: ${error}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Assign Surveyor to Parcel</h2>

      <form onSubmit={handleAssign} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select Parcel:</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={selectedParcelId}
            onChange={(e) => setSelectedParcelId(e.target.value)}
            required
          >
            <option value="">-- Choose Parcel --</option>
            {unassignedParcels?.map((parcel) => (
              <option key={parcel._id} value={parcel._id}>
                {parcel.lrNumber} ({parcel.location})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Select Surveyor:</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={selectedSurveyorId}
            onChange={(e) => setSelectedSurveyorId(e.target.value)}
            required
          >
            <option value="">-- Choose Surveyor --</option>
            {surveyors && surveyors.length > 0 ? (
              surveyors.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name || s.email}
                </option>
              ))
            ) : (
              <option disabled value="">
                No surveyors available
              </option>
            )}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
          disabled={assignStatus.loading}
        >
          {assignStatus.loading ? "Assigning..." : "Assign Surveyor"}
        </button>
      </form>

      {/* ✅ Allocated Parcels Table */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-2">Allocated Parcels</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Parcel</th>
                <th className="border px-4 py-2">Surveyor</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Assigned Date</th>
              </tr>
            </thead>
            <tbody>
              {allSurveys?.length > 0 ? (
                allSurveys.map((s) => (
                  <tr key={s._id} className="border-t">
                    <td className="border px-4 py-2">{s.parcel?.lrNumber || "N/A"}</td>
                    <td className="border px-4 py-2">{s.surveyor?.name || s.surveyor?.email}</td>
                    <td className="border px-4 py-2">{s.status}</td>
                    <td className="border px-4 py-2">
                      {s.assignedAt
                        ? new Date(s.assignedAt).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No parcels assigned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SurveyAllocationForm;
