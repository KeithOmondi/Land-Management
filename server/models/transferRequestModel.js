// models/transferRequestModel.js
import mongoose from "mongoose";

const transferRequestSchema = new mongoose.Schema({
  parcel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parcel",
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Active"],
    default: "Pending",
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("TransferRequest", transferRequestSchema);
