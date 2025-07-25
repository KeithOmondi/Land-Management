import TransferRequest from "../models/transferRequestModel.js";
import Parcel from "../models/parcelModel.js";
import { User } from "../models/userModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";

// ✅ Create a new transfer request
export const createTransferRequest = catchAsyncErrors(async (req, res, next) => {
  const { parcelId, receiverName } = req.body;

  if (!parcelId || !receiverName) {
    return next(new ErrorHandler("Parcel ID and Receiver Name are required", 400));
  }

  const parcel = await Parcel.findById(parcelId);
  if (!parcel) return next(new ErrorHandler("Parcel not found", 404));

  if (!parcel.owner.equals(req.user._id)) {
    return next(new ErrorHandler("You are not the owner of this parcel", 403));
  }

  const transfer = await TransferRequest.create({
    parcel: parcelId,
    receiverName,
    requestedBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Transfer request created successfully",
    transfer,
  });
});

// ✅ Get all transfer requests made by the logged-in user
export const getMyTransferRequests = catchAsyncErrors(async (req, res, next) => {
  const transfers = await TransferRequest.find({ requestedBy: req.user._id })
    .populate("parcel", "lrNumber owner")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, transfers });
});

// ✅ Approve a transfer request
// ✅ In transferController.js
export const approveTransfer = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const transfer = await TransferRequest.findById(id);
  if (!transfer) {
    return next(new ErrorHandler("Transfer request not found", 404));
  }

  transfer.status = "Approved";
  await transfer.save();

  res.status(200).json({
    success: true,
    message: "Transfer approved successfully",
  });
});


export const rejectTransfer = catchAsyncErrors(async (req, res, next) => {
  const transfer = await TransferRequest.findById(req.params.id);
  if (!transfer) return next(new ErrorHandler("Transfer not found", 404));

  transfer.status = "Rejected";
  await transfer.save();

  res.status(200).json({ success: true, message: "Transfer rejected" });
});


// ✅ Reject a transfer request
export const rejectTransferRequest = catchAsyncErrors(async (req, res, next) => {
  const request = await TransferRequest.findById(req.params.id);
  if (!request) return next(new ErrorHandler("Transfer request not found", 404));

  if (request.status !== "Pending") {
    return next(new ErrorHandler("Transfer request already processed", 400));
  }

  request.status = "Rejected";
  await request.save();

  const updatedRequest = await TransferRequest.findById(req.params.id)
    .populate("parcel", "lrNumber")
    .populate("requestedBy", "name");

  res.status(200).json({
    success: true,
    message: "Transfer request rejected",
    transfer: updatedRequest,
  });
});

// ✅ Get all transfer requests (Admin)
export const getAllTransferRequests = catchAsyncErrors(async (req, res, next) => {
  const transfers = await TransferRequest.find()
    .populate("parcel", "lrNumber owner")
    .populate("requestedBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, transfers });
});

// ✅ Cancel a transfer request (only requester can do this)
export const cancelTransferRequest = catchAsyncErrors(async (req, res, next) => {
  const request = await TransferRequest.findById(req.params.id);
  if (!request) return next(new ErrorHandler("Transfer request not found", 404));

  if (!request.requestedBy.equals(req.user._id)) {
    return next(new ErrorHandler("Not authorized to cancel this request", 403));
  }

  await request.deleteOne();

  res.status(200).json({
    success: true,
    message: "Transfer request cancelled successfully",
  });
});
