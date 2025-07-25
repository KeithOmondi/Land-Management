import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDocuments } from "../../redux/parcel/documentSlice";

export default function AdminDocuments() {
  const dispatch = useDispatch();
  const { documents = [], loading, error } = useSelector((state) => state.documents || {});

  useEffect(() => {
    dispatch(getAllDocuments());
  }, [dispatch]);

  const handleView = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      alert("No file URL found.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Uploaded Documents</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto bg-white shadow rounded-lg border">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Document ID</th>
              <th className="px-6 py-3">Parcel LR</th>
              <th className="px-6 py-3">Owner</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Uploader</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Uploaded On</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{doc._id}</td>
                <td className="px-6 py-4">{doc.parcelLR || "N/A"}</td>
                <td className="px-6 py-4">{doc.parcelOwner || "N/A"}</td>
                <td className="px-6 py-4">{doc.type}</td>
                <td className="px-6 py-4">{doc.uploader || "N/A"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      doc.status === "Verified"
                        ? "bg-green-100 text-green-700"
                        : doc.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {doc.status || "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 space-x-3 text-sm">
                  <button>
                  <a
                    href={`http://localhost:8000${doc.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                
                  </button>
                  {doc.status === "Pending" && (
                    <>
                      <button className="text-green-600 hover:underline">Approve</button>
                      <button className="text-red-600 hover:underline">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
