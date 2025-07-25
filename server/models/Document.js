import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  parcel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parcel",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Document", documentSchema);
