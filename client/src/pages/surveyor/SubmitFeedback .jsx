import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAssignedParcels,
  submitFeedback,
  resetFeedbackStatus,
} from "../../redux/parcel/surveyorSlice";
import { toast } from "react-toastify"; // 👈 Import toast

const SubmitFeedback = () => {
  const dispatch = useDispatch();

  const { assignedParcels, isLoading, error, feedbackSubmitStatus } =
    useSelector((state) => state.surveyor);

  const [selectedParcelId, setSelectedParcelId] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    dispatch(fetchAssignedParcels());
  }, [dispatch]);

  useEffect(() => {
    if (feedbackSubmitStatus.success) {
      toast.success("✅ Feedback submitted successfully!");
    } else if (feedbackSubmitStatus.error) {
      toast.error(`❌ ${feedbackSubmitStatus.error}`);
    }

    if (feedbackSubmitStatus.success || feedbackSubmitStatus.error) {
      const timeout = setTimeout(() => {
        dispatch(resetFeedbackStatus());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [feedbackSubmitStatus, dispatch]);

  useEffect(() => {
    if (feedbackSubmitStatus.success) {
      setSelectedParcelId("");
      setFeedback("");
      dispatch(fetchAssignedParcels());
    }
  }, [feedbackSubmitStatus.success, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedParcelId || !feedback.trim()) {
      toast.warning("⚠️ Please select a parcel and enter feedback.");
      dispatch(resetFeedbackStatus());
      return;
    }
    dispatch(submitFeedback({ surveyId: selectedParcelId, feedback }));
  };

  const selectedParcel = assignedParcels.find(
    (p) => p.surveyId === selectedParcelId
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        📝 Submit Feedback
      </h2>

      {isLoading && (
        <p className="text-blue-500 mb-4">Loading assigned parcels...</p>
      )}
      {error && (
        <p className="text-red-600 mb-4">Error loading parcels: {error}</p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 mb-10">
        {/* Parcel Select */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Assigned Parcel
          </label>
          <select
            value={selectedParcelId}
            onChange={(e) => setSelectedParcelId(e.target.value)}
            disabled={
              isLoading ||
              assignedParcels.length === 0 ||
              feedbackSubmitStatus.loading
            }
            className="w-full border rounded px-3 py-2 text-gray-700"
          >
            <option value="">-- Select Parcel --</option>
            {assignedParcels.map((parcel) => (
              <option key={parcel.surveyId} value={parcel.surveyId}>
                {parcel.lrNumber || "No LR Number"} —{" "}
                {parcel.location || "Unknown Location"} ({parcel.status})
              </option>
            ))}
          </select>
        </div>

        {/* Feedback Input */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Feedback
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="4"
            placeholder="Write your feedback about this parcel survey..."
            className="w-full border rounded px-3 py-2 text-gray-700"
            disabled={
              isLoading ||
              feedbackSubmitStatus.loading ||
              selectedParcel?.status === "Completed"
            }
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            isLoading ||
            feedbackSubmitStatus.loading ||
            selectedParcel?.status === "Completed"
          }
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {feedbackSubmitStatus.loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>

      {/* 🗂 Feedback Table */}
      <div>
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          📋 Submitted Feedbacks
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">LR Number</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {assignedParcels.map((parcel) => (
                <tr key={parcel.surveyId || parcel._id}>
                  <td className="px-4 py-2 border">
                    {parcel.lrNumber || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {parcel.location || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">{parcel.status}</td>
                  <td className="px-4 py-2 border">
                    {parcel.feedback || (
                      <span className="text-gray-400 italic">
                        No feedback
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {assignedParcels.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center px-4 py-4 text-gray-500 italic"
                  >
                    No assigned parcels found.
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

export default SubmitFeedback;
