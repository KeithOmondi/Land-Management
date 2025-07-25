import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { fetchFeedbackByParcelId } from "../../redux/parcel/surveyorSlice";

const AdminSurveyorFeedback = () => {
  const { parcelId } = useParams();
  const dispatch = useDispatch();

  const {
    feedbackDetails: feedback,
    feedbackDetailsStatus: { loading, error },
  } = useSelector((state) => state.surveyor);

  useEffect(() => {
    if (parcelId) {
      dispatch(fetchFeedbackByParcelId(parcelId));
    }
  }, [parcelId, dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Survey Feedback</h1>

      {loading && <p className="text-gray-500">Loading feedback...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && feedback ? (
        <div className="bg-white shadow rounded p-6 border border-gray-200">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Parcel ID</p>
            <p className="text-lg text-gray-800 font-medium">{feedback.parcel?._id}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">Survey Status</p>
            <p className="text-base text-indigo-700 font-semibold">
              {feedback.status || "Not specified"}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">Submitted by</p>
            <p className="text-base text-gray-700">
              {feedback.surveyor?.name || "Unknown"}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">Date Submitted</p>
            <p className="text-base text-gray-700">
              {moment(feedback.createdAt).format("MMMM Do YYYY, h:mm A")}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">Comments</p>
            <p className="text-gray-800 whitespace-pre-line">{feedback.comments || "N/A"}</p>
          </div>

          {feedback.attachment && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Attachment</p>
              <a
                href={feedback.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                View Attached File
              </a>
            </div>
          )}
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-600">
            No feedback found for this parcel.
          </p>
        )
      )}
    </div>
  );
};

export default AdminSurveyorFeedback;
