import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createDispute,
  getMyDisputes,
  clearMessages,
} from "../redux/parcel/disputeSlice";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchMyParcels } from "../redux/parcel/parcelSlice";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Disputes() {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    parcelId: "",
    complainant: "",
    defendant: "",
    reason: "",
    parcelLR: "",
  });
  const [selectedParcel, setSelectedParcel] = useState(null);

  const { myParcels = [] } = useSelector((state) => state.parcel);
  const {
    myDisputes = [],
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.disputes);

  useEffect(() => {
    dispatch(fetchMyParcels());
    dispatch(getMyDisputes());
  }, [dispatch]);

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => dispatch(clearMessages()), 4000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "parcelId") {
      const parcel = myParcels.find((p) => p._id === value);
      setSelectedParcel(parcel || null);
      setForm((prev) => ({ ...prev, parcelLR: parcel?.lrNumber || "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { parcelId, complainant, defendant, reason, parcelLR } = form;

    if (!parcelId || !complainant || !defendant || !reason || !parcelLR) {
      alert("Please fill in all fields.");
      return;
    }

    dispatch(createDispute(form));

    setForm({
      parcelId: "",
      complainant: "",
      defendant: "",
      reason: "",
      parcelLR: "",
    });
    setSelectedParcel(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">File a Parcel Dispute</h2>

      {error && <p className="text-red-600">{error}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="parcelId"
          value={form.parcelId}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        >
          <option value="">Select Parcel</option>
          {myParcels.map((parcel) => (
            <option key={parcel._id} value={parcel._id}>
              {parcel.lrNumber}
            </option>
          ))}
        </select>

        {selectedParcel?.latitude && selectedParcel?.longitude && (
          <div className="mb-4">
            <MapContainer
              center={[selectedParcel.latitude, selectedParcel.longitude]}
              zoom={16}
              style={{ height: "250px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <Marker
                position={[selectedParcel.latitude, selectedParcel.longitude]}
                icon={defaultIcon}
              >
                <Popup>{selectedParcel.location}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        <input
          type="text"
          name="complainant"
          placeholder="Complainant"
          value={form.complainant}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        />

        <input
          type="text"
          name="defendant"
          placeholder="Defendant"
          value={form.defendant}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        />

        <textarea
          name="reason"
          placeholder="Reason for Dispute"
          value={form.reason}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Filing..." : "Submit Dispute"}
        </button>
      </form>

      <h3 className="text-lg font-semibold mt-6">Your Disputes</h3>

      <div className="overflow-x-auto mt-2">
        <table className="w-full border text-sm text-left">
          <thead>
            <tr>
              <th className="border px-3 py-2">Parcel</th>
              <th className="border px-3 py-2">Complainant</th>
              <th className="border px-3 py-2">Defendant</th>
              <th className="border px-3 py-2">Reason</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {myDisputes.length > 0 ? (
              myDisputes.map((dispute) => (
                <tr key={dispute._id}>
                  <td className="border px-3 py-2">{dispute.parcelLR}</td>
                  <td className="border px-3 py-2">{dispute.complainant}</td>
                  <td className="border px-3 py-2">{dispute.defendant}</td>
                  <td className="border px-3 py-2">{dispute.reason}</td>
                  <td className="border px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dispute.status?.toLowerCase() === "resolved"
                          ? "bg-green-100 text-green-700"
                          : dispute.status?.toLowerCase() === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {dispute.status || "Pending"}
                    </span>
                  </td>
                  <td className="border px-3 py-2">
                    {new Date(dispute.dateFiled).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border px-3 py-2 text-center">
                  No disputes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
