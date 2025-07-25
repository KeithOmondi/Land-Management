import mongoose from "mongoose";
import { nanoid } from "nanoid";

const disputeSchema = new mongoose.Schema({
  disputeId: {
    type: String,
    unique: true,
    default: () => `DSP-${nanoid(8)}`,
  },
  parcel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parcel",
    required: true,
  },
  parcelLR: {
    type: String,
    required: true,
  },
  complainant: {
    type: String, // Optional: can be derived from req.user.name or explicitly passed
  },
  defendant: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  filedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Resolved", "Rejected"],
    default: "Pending",
  },
  dateFiled: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Dispute", disputeSchema);
