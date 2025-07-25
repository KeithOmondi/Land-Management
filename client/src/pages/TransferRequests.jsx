// components/TransferForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  createTransferRequest,
  clearMessages,
  getMyTransferRequests,
} from "../redux/parcel/transferSlice";
import { fetchMyParcels } from "../redux/parcel/parcelSlice";

const TransferRequest = () => {
  const [receiverName, setReceiverName] = useState("");
  const [selectedParcel, setSelectedParcel] = useState("");

  const dispatch = useDispatch();
  const { myParcels = [] } = useSelector((state) => state.parcel);
  const { transfers = [], loading, message, error } = useSelector(
    (state) => state.transfer
  );

  useEffect(() => {
    dispatch(fetchMyParcels());
    dispatch(getMyTransferRequests());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(getMyTransferRequests());
      dispatch(clearMessages());
      setReceiverName("");
      setSelectedParcel("");
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [message, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedParcel || !receiverName)
      return toast.error("All fields required");

    dispatch(
      createTransferRequest({ parcelId: selectedParcel, receiverName })
    );
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Initiate Parcel Transfer</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Parcel
          </label>
          <select
            value={selectedParcel}
            onChange={(e) => setSelectedParcel(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="">-- Choose Parcel --</option>
            {myParcels.map((parcel) => (
              <option key={parcel._id} value={parcel._id}>
                {parcel.lrNumber || parcel.location}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Receiver Name
          </label>
          <input
            type="text"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            placeholder="e.g. John Doe"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Request Transfer"}
        </button>
      </form>

      {/* Transfer Requests Table */}
      <h3 className="text-lg font-semibold mb-2">My Transfer Requests</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Parcel</th>
              <th className="p-2 border">Receiver</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Requested On</th>
            </tr>
          </thead>
          <tbody>
            {transfers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No transfer requests yet.
                </td>
              </tr>
            ) : (
              transfers.map((transfer) => (
                <tr key={transfer._id} className="text-sm text-gray-800">
                  <td className="p-2 border">
                    {transfer.parcel?.lrNumber || transfer.parcel?.location || "N/A"}
                  </td>
                  <td className="p-2 border">{transfer.receiverName || "N/A"}</td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transfer.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : transfer.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {transfer.status}
                    </span>
                  </td>
                  <td className="p-2 border">
                    {transfer.requestedAt
                      ? new Date(transfer.requestedAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransferRequest;
