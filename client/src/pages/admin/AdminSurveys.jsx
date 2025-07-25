import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { fetchAllSurveys } from "../../redux/parcel/surveyorSlice";

const Surveys = () => {
  const dispatch = useDispatch();
  const {
  allSurveys: surveys,
  allSurveysStatus: { loading, error },
} = useSelector((state) => state.surveyor);


  useEffect(() => {
    dispatch(fetchAllSurveys());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Surveys</h1>

      {loading && <p>Loading surveys...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && surveys?.length === 0 && <p>No surveys found.</p>}

      {!loading && surveys?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                <th className="px-4 py-2 border-b">LR Number</th>
                <th className="px-4 py-2 border-b">Location</th>
                <th className="px-4 py-2 border-b">Surveyor</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Feedback</th>
                <th className="px-4 py-2 border-b">Assigned</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey) => (
                <tr key={survey._id} className="text-sm text-gray-800 hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{survey.parcel?.lrNumber || "N/A"}</td>
                  <td className="px-4 py-2 border-b">{survey.parcel?.location || "N/A"}</td>
                  <td className="px-4 py-2 border-b">{survey.surveyor?.name || "N/A"}</td>
                  <td className="px-4 py-2 border-b">{survey.status}</td>
                  <td className="px-4 py-2 border-b">
                    {survey.feedback ? (
                      <span className="text-green-700">{survey.feedback}</span>
                    ) : (
                      <span className="text-gray-400">Not submitted</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {moment(survey.assignedAt).format("LLL")}
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

export default Surveys;
