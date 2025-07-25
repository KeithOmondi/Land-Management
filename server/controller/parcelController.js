import Parcel from "../models/parcelModel.js";
import Document from "../models/Document.js"; // ✅ REQUIRED for .populate("documents")
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { sendEmail } from "../utils/sendMail.js";

// Create parcel
export const createParcel = catchAsyncErrors(async (req, res, next) => {
  const { titleDeed, location, size, lrNumber } = req.body;

  if (!titleDeed || !location || !size || !lrNumber) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const parcel = await Parcel.create({
    titleDeed,
    location,
    size: Number(size),
    lrNumber,
    owner: req.user._id,
  });

  // Send email to parcel owner (the logged-in user)
  try {
    await sendEmail({
      email: req.user.email, // Assuming req.user has email field
      subject: `Parcel Created: ${parcel.lrNumber}`,
      html: `
        <p>Dear ${req.user.name || "User"},</p>
        <p>Your parcel with LR Number <strong>${parcel.lrNumber}</strong> has been successfully created.</p>
        <p>Current status: <strong>${parcel.status || "Pending"}</strong></p>
        <p>We will notify you when there are updates.</p>
        <p>Best regards,<br/>Your Company</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send email to parcel owner:", error);
    // Optionally: Do not block parcel creation if email fails
  }

  res.status(201).json({
    success: true,
    parcel,
  });
});

// Get all parcels (admin)
export const getAllParcels = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(new ErrorHandler("Admins only", 403));
  }

  const parcels = await Parcel.find()
    .populate("owner", "name email")
    .populate("documents");

  res.status(200).json({ success: true, parcels });
});

// Get current user's parcels
export const getMyParcels = catchAsyncErrors(async (req, res, next) => {
  const parcels = await Parcel.find({ owner: req.user._id }).populate(
    "documents"
  );
  res.status(200).json({ success: true, parcels });
});

// Get parcel by ID (admin)
export const getParcelById = catchAsyncErrors(async (req, res, next) => {
  const parcel = await Parcel.findById(req.params.id).populate("documents");
  if (!parcel) return next(new ErrorHandler("Parcel not found", 404));

  res.status(200).json({ success: true, parcel });
});

// Update parcel
export const updateParcel = catchAsyncErrors(async (req, res, next) => {
  const updates = { ...req.body };
  if (updates.size) updates.size = Number(updates.size);

  const parcel = await Parcel.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!parcel) return next(new ErrorHandler("Parcel not found", 404));

  res.status(200).json({ success: true, parcel });
});

// Delete parcel
export const deleteParcel = catchAsyncErrors(async (req, res, next) => {
  const parcel = await Parcel.findByIdAndDelete(req.params.id);
  if (!parcel) return next(new ErrorHandler("Parcel not found", 404));

  res
    .status(200)
    .json({ success: true, message: "Parcel deleted successfully" });
});

// Approve or Reject parcel
export const updateParcelStatus = catchAsyncErrors(async (req, res, next) => {
  const parcel = await Parcel.findById(req.params.id);
  if (!parcel) return next(new ErrorHandler("Parcel not found", 404));

  parcel.status = req.body.status;
  await parcel.save();

  res.status(200).json({ success: true, parcel });
});
