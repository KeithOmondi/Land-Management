// ===== documentModel.js =====
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Document name is required"],
  },
  type: {
    type: String,
    enum: ["Title Deed", "Transfer Agreement", "Dispute Resolution", "Tax Certificate"],
    required: [true, "Document type is required"],
  },
  parcel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parcel",
    required: [true, "Parcel reference is required"],
  },
  dateIssued: {
    type: Date,
    default: Date.now,
  },
  fileUrl: {
    type: String,
    required: [true, "File URL is required"],
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model("myDocument", documentSchema);