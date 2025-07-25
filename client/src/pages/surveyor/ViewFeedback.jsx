import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { fetchFeedbackByParcelId } from "../../redux/parcel/surveyorSlice";

const ViewFeedback = () => {
  const { parcelId } = useParams();
  const dispatch = useDispatch();

  const {
  feedbackDetails: feedback,
  feedbackDetailsStatus: { loading, error }
} = useSelector((state) => state.surveyor);


  useEffect(() => {
    if (parcelId) {
      dispatch(fetchFeedbackByParcelId(parcelId));
    }
  }, [parcelId, dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Parcel Feedback</h1>

      {loading && <p>Loading feedback...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && feedback ? (
        <div className="bg-white shadow rounded p-6 border">
          <p className="text-gray-700">
            <span className="font-medium text-gray-800">Status:</span>{" "}
            {feedback.status}
          </p>
          <p className="mt-2 text-gray-700">
            <span className="font-medium text-gray-800">Submitted by:</span>{" "}
            {feedback.surveyor?.name || "Unknown"}
          </p>
          <p className="mt-2 text-gray-700">
            <span className="font-medium text-gray-800">Submitted on:</span>{" "}
            {moment(feedback.createdAt).format("MMMM Do YYYY, h:mm A")}
          </p>
          <hr className="my-4" />
          <p className="text-gray-800">
            <span className="font-medium">Comments:</span>
          </p>
          <p className="mt-1 text-gray-600 whitespace-pre-line">{feedback.comments}</p>

          {feedback.attachment && (
            <div className="mt-4">
              <p className="text-gray-800 font-medium">Attachment:</p>
              <a
                href={feedback.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                View File
              </a>
            </div>
          )}
        </div>
      ) : (
        !loading && <p>No feedback found for this parcel.</p>
      )}
    </div>
  );
};

export default ViewFeedback;
