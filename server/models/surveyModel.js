import mongoose from "mongoose";

const surveySchema = new mongoose.Schema(
  {
    parcel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parcel",
      required: [true, "Parcel reference is required"],
    },
    surveyor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Surveyor reference is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner reference is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt & updatedAt
  }
);

// Optional: Indexes for faster queries
surveySchema.index({ parcel: 1, surveyor: 1 }, { unique: true });

const Survey = mongoose.model("Survey", surveySchema);
export default Survey;
