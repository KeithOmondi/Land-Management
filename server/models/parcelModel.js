import mongoose from "mongoose";

const parcelSchema = new mongoose.Schema(
  {
    titleDeed: {
      type: String,
      required: true,
    },
    lrNumber: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Active"],
      default: "Pending",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    surveyor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // we assume surveyors are also in the User collection
      default: null,
    },
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Parcel", parcelSchema);
