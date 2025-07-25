import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadDocument,
  fetchDocuments,
  clearMessages,
} from "../redux/parcel/documentSlice";
import { fetchMyParcels } from "../redux/parcel/parcelSlice";

export default function Documents() {
  const dispatch = useDispatch();

  const { myParcels: parcels = [], loading: parcelLoading } = useSelector(
    (state) => state.parcel
  );

  const { documents, loading, success, error } = useSelector(
    (state) => state.documents
  );

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    parcelId: "",
    dateIssued: "",
    file: null,
  });

  useEffect(() => {
    dispatch(fetchDocuments());
    dispatch(fetchMyParcels());
  }, [dispatch]);

  useEffect(() => {
    if (success || error) {
      setTimeout(() => dispatch(clearMessages()), 3000);
    }
  }, [success, error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("type", formData.type);
    data.append("parcelId", formData.parcelId);
    data.append("dateIssued", formData.dateIssued);
    data.append("file", formData.file);
    dispatch(uploadDocument(data));
    setFormData({
      name: "",
      type: "",
      parcelId: "",
      dateIssued: "",
      file: null,
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-8">
        <input
          type="text"
          name="name"
          placeholder="Document Name"
          value={formData.name}
          onChange={handleInputChange}
          className="border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="type"
          placeholder="Document Type"
          value={formData.type}
          onChange={handleInputChange}
          className="border px-3 py-2 rounded"
          required
        />

        <select
          name="parcelId"
          value={formData.parcelId}
          onChange={handleInputChange}
          className="border px-3 py-2 rounded"
          required
        >
          <option value="">-- Select Parcel --</option>
          {parcels.map((parcel) => (
            <option key={parcel._id} value={parcel._id}>
              {parcel.lrNumber}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="dateIssued"
          value={formData.dateIssued}
          onChange={handleInputChange}
          className="border px-3 py-2 rounded"
          required
        />

        <input
          type="file"
          name="file"
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={handleInputChange}
          className="border px-3 py-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {success && (
        <p className="text-green-600 bg-green-100 p-2 rounded">{success}</p>
      )}
      {error && <p className="text-red-600 bg-red-100 p-2 rounded">{error}</p>}

      <h2 className="text-xl font-semibold mb-2 mt-8">Uploaded Documents</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Parcel</th>
              <th className="p-2 border">Issued On</th>
              <th className="p-2 border">View</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No documents uploaded yet.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc._id} className="border-t">
                  <td className="p-2 border">{doc.name}</td>
                  <td className="p-2 border">{doc.type}</td>
                  <td className="p-2 border">
                    {doc.parcel?.lrNumber || "N/A"}
                  </td>
                  <td className="p-2 border">
                    {new Date(doc.dateIssued).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    <a
                    href={`http://localhost:8000${doc.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
