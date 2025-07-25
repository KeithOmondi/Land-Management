import Dispute from "../models/disputeModel.js";
import Parcel from "../models/parcelModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

// 🔢 Generate dispute ID (fallback if nanoid not used in model)
const generateDisputeId = () => `DSP-${Date.now()}`;

// 🆕 Create dispute
export const createDispute = catchAsyncErrors(async (req, res, next) => {
  const { parcelId, defendant, reason, parcelLR, complainant } = req.body;

  if (!parcelId || !defendant || !reason) {
    return next(new ErrorHandler("Parcel ID, defendant, and reason are required", 400));
  }

  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    return next(new ErrorHandler("Parcel not found", 404));
  }

  const dispute = await Dispute.create({
    parcel: parcel._id,
    parcelLR: parcel.lrNumber || parcelLR,
    complainant: complainant || req.user.name,
    defendant,
    reason,
    filedBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Dispute filed successfully",
    dispute,
  });
});

// 👤 Get current user's disputes
export const getMyDisputes = catchAsyncErrors(async (req, res) => {
  const disputes = await Dispute.find({ filedBy: req.user._id })
    .populate("parcel", "lrNumber")
    .sort({ dateFiled: -1 });

  res.status(200).json({
    success: true,
    disputes: disputes.map((d) => ({
      _id: d._id,
      disputeId: d.disputeId,
      parcelId: d.parcel?._id,
      parcelLR: d.parcelLR,
      complainant: d.complainant,
      defendant: d.defendant,
      reason: d.reason,
      status: d.status,
      dateFiled: d.dateFiled?.toISOString().split("T")[0],
    })),
  });
});

// 🛠️ Admin: Get all disputes
export const getAllDisputes = catchAsyncErrors(async (req, res) => {
  const disputes = await Dispute.find()
    .populate("parcel", "lrNumber")
    .populate("filedBy", "name")
    .sort({ dateFiled: -1 });

  res.status(200).json({
    success: true,
    disputes: disputes.map((d) => ({
      _id: d._id,
      disputeId: d.disputeId,
      parcelId: d.parcel?._id,
      parcelLR: d.parcelLR,
      complainant: d.filedBy?.name || d.complainant || "Unknown",
      defendant: d.defendant,
      reason: d.reason,
      status: d.status,
      dateFiled: d.dateFiled?.toISOString().split("T")[0],
    })),
  });
});

// ✅ Admin: Update dispute status
// PUT /api/v1/disputes/admin/:id/status
export const updateDisputeStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return next(new ErrorHandler("Status is required", 400));
  }

  const updatedDispute = await Dispute.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: false, // ✅ Skip required field validation
    }
  );

  if (!updatedDispute) {
    return next(new ErrorHandler("Dispute not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Dispute status updated successfully",
    dispute: updatedDispute,
  });
});


// ❌ User: Withdraw own dispute
export const withdrawDispute = catchAsyncErrors(async (req, res, next) => {
  const dispute = await Dispute.findById(req.params.id);

  if (!dispute) {
    return next(new ErrorHandler("Dispute not found", 404));
  }

  if (!dispute.filedBy.equals(req.user._id)) {
    return next(new ErrorHandler("Unauthorized to withdraw this dispute", 403));
  }

  await dispute.deleteOne();

  res.status(200).json({
    success: true,
    message: "Dispute withdrawn successfully",
  });
});
