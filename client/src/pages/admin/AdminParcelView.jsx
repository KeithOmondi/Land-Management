// AdminParcelView.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteParcel,
  fetchAllParcels,
  updateParcelStatus,
} from "../../redux/parcel/parcelSlice";

const AdminParcelView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { adminParcels = [], loading, error } = useSelector((state) => state.parcel);


  useEffect(() => {
    dispatch(fetchAllParcels());
  }, [dispatch]);

  const handleStatusChange = (id, status) => {
    dispatch(updateParcelStatus({ id, status }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this parcel?")) {
      dispatch(deleteParcel(id));
    }
  };

  const handleView = (id) => {
    navigate(`/admin/parcels/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/parcels/${id}/edit`);
  };

  if (loading) return <p>Loading parcels...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Parcels</h2>
      <table className="w-full border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Parcel ID</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Size</th>
            <th className="p-2 border">Owner</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {adminParcels.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No parcels found.
              </td>
            </tr>
          ) : (
            adminParcels.map((parcel) => (
              <tr key={parcel._id} className="border hover:bg-gray-50">
                <td className="p-2 border">{parcel._id}</td>
                <td className="p-2 border">{parcel.location}</td>
                <td className="p-2 border">{parcel.size}</td>
                <td className="p-2 border">{parcel.owner?.name || "N/A"}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      parcel.status?.toLowerCase() === "approved"
                        ? "bg-green-100 text-green-700"
                        : parcel.status?.toLowerCase() === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {parcel.status || "Pending"}
                  </span>
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleView(parcel._id)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(parcel._id)}
                    className="text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(parcel._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleStatusChange(parcel._id, "Approved")}
                    className="text-green-600 hover:underline"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(parcel._id, "Rejected")}
                    className="text-yellow-600 hover:underline"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminParcelView;
