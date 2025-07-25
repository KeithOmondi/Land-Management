import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createParcel, fetchMyParcels } from "../redux/parcel/parcelSlice";
import { useEffect, useState } from "react";

// 🟡 NEW: Leaflet imports
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Parcels() {
  const dispatch = useDispatch();
  const {
    myParcels: parcels = [],
    loading,
    error,
  } = useSelector((state) => state.parcel);

  const [formData, setFormData] = useState({
    titleDeed: "",
    lrNumber: "",
    location: "",
    size: "",
  });

  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);

  useEffect(() => {
    dispatch(fetchMyParcels());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createParcel(formData));
    await dispatch(fetchMyParcels());
    setFormData({ titleDeed: "", lrNumber: "", location: "", size: "" });
  };

  const handleViewMap = (parcel) => {
    setSelectedParcel(parcel);
    setShowMapModal(true);
  };

  const closeModal = () => {
    setShowMapModal(false);
    setSelectedParcel(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        My Land Parcels
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white border rounded-xl shadow p-6 mb-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="titleDeed"
            placeholder="Title Deed"
            value={formData.titleDeed}
            onChange={handleChange}
            className="border px-4 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="lrNumber"
            placeholder="LR Number"
            value={formData.lrNumber}
            onChange={handleChange}
            className="border px-4 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="border px-4 py-2 rounded w-full"
            required
          />
          <input
            type="number"
            name="size"
            placeholder="Size (Ha)"
            value={formData.size}
            onChange={handleChange}
            className="border px-4 py-2 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Parcel
        </button>
      </form>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        {loading ? (
          <p className="p-4 text-gray-600">Loading parcels...</p>
        ) : error ? (
          <p className="p-4 text-red-600">Error: {error}</p>
        ) : parcels.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">No parcels added yet.</p>
        ) : (
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border">Title Deed</th>
                <th className="p-3 border">LR Number</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Size (Ha)</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr
                  key={parcel._id || index}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{parcel.titleDeed}</td>
                  <td className="p-3 border">{parcel.lrNumber}</td>
                  <td className="p-3 border">{parcel.location}</td>
                  <td className="p-3 border">{parcel.size}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        parcel.status?.toLowerCase() === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {parcel.status || "Pending"}
                    </span>
                  </td>
                  <td className="p-3 border text-center space-x-3">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleViewMap(parcel)}
                    >
                      View on Map
                    </button>
                    <Link
                      to="/transfers"
                      className="text-indigo-600 hover:underline"
                    >
                      Transfer
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Map Modal */}
      {showMapModal && selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-4 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">
              Parcel: {selectedParcel.titleDeed} — {selectedParcel.location}
            </h2>

            {/* 🌍 Real Leaflet map */}
            <div className="w-full h-64">
              <MapContainer
                center={[0.0236, 37.9062]} // Default center (Kenya)
                zoom={6}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[0.0236, 37.9062]}>
                  <Popup>
                    {selectedParcel.titleDeed} <br />
                    {selectedParcel.location}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
