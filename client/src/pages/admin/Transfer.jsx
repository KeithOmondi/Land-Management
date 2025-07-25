import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTransferRequests,
  approveTransferRequest,
  rejectTransferRequest,
  clearMessages,
} from "../../redux/parcel/transferSlice";
import { toast } from "react-toastify";

export default function Transfer() {
  const dispatch = useDispatch();
  const { transfers, loading, error, message } = useSelector((state) => state.transfer);

  const [selectedTransfer, setSelectedTransfer] = useState(null);

  // Fetch transfers on mount
  useEffect(() => {
    dispatch(getAllTransferRequests());
  }, [dispatch]);

  // Show toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessages());
    }
  }, [error, message, dispatch]);

  // Approve
  const handleApprove = async (id) => {
    try {
      await dispatch(approveTransferRequest(id)).unwrap();
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  // Reject
  const handleReject = async (id) => {
    try {
      await dispatch(rejectTransferRequest(id)).unwrap();
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Transfer Requests</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : transfers.length === 0 ? (
        <p className="text-gray-600">No transfer requests found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Parcel</th>
                <th className="px-6 py-3">Sender</th>
                <th className="px-6 py-3">Receiver</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Requested On</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((tx) => (
                <tr key={tx._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{tx.parcel?.lrNumber || "N/A"}</td>
                  <td className="px-6 py-4">{tx.requestedBy?.name || "Unknown"}</td>
                  <td className="px-6 py-4">{tx.receiverName || "Unknown"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        tx.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : tx.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(tx.createdAt || tx.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 space-x-2 text-sm">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedTransfer(tx)}
                    >
                      View
                    </button>
                    {tx.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(tx._id)}
                          disabled={loading}
                          className="text-green-600 hover:underline disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(tx._id)}
                          disabled={loading}
                          className="text-red-600 hover:underline disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== Modal for View Details ===== */}
      {selectedTransfer && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
              onClick={() => setSelectedTransfer(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Transfer Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Parcel:</strong> {selectedTransfer.parcel?.lrNumber || "N/A"}</p>
              <p><strong>Sender:</strong> {selectedTransfer.requestedBy?.name || "Unknown"}</p>
              <p><strong>Receiver:</strong> {selectedTransfer.receiverName || "Unknown"}</p>
              <p><strong>Status:</strong> {selectedTransfer.status}</p>
              <p><strong>Created:</strong> {new Date(selectedTransfer.createdAt).toLocaleString()}</p>
              {selectedTransfer.message && (
                <p><strong>Message:</strong> {selectedTransfer.message}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
