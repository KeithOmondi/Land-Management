import Survey from "../models/surveyModel.js";
import Parcel from "../models/parcelModel.js";
import { User } from "../models/userModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendMail.js";

/* ============================================================================
   🔐 Surveyor Authentication
============================================================================ */

// Login Surveyor
export const loginSurveyor = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorHandler("Please provide both email and password", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || user.role !== "Surveyor") {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  if (!user.verified) {
    return res.status(403).json({
      success: false,
      message: "Your account has not been verified by the admin.",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    surveyor: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// Logout Surveyor
export const logoutSurveyor = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

/* ============================================================================
   📋 Survey Actions (Admin + Surveyor)
============================================================================ */

// 🔹 Assign Surveyor to Parcel (Admin Only)
export const assignSurveyor = catchAsyncErrors(async (req, res, next) => {
  const { parcelId } = req.params;
  const { surveyorId } = req.body;

  // Find parcel and populate owner data
  const parcel = await Parcel.findById(parcelId).populate("owner");
  if (!parcel) return next(new ErrorHandler("Parcel not found", 404));

  // Find surveyor user
  const surveyor = await User.findById(surveyorId);
  if (!surveyor || surveyor.role !== "Surveyor") {
    return next(new ErrorHandler("Invalid surveyor", 400));
  }

  // Check if survey already assigned
  const existingSurvey = await Survey.findOne({ parcel: parcelId });
  if (existingSurvey) {
    return next(
      new ErrorHandler("Survey already assigned for this parcel", 400)
    );
  }

  // Create survey
  const survey = await Survey.create({
    parcel: parcelId,
    surveyor: surveyorId,
    owner: parcel.owner._id,
  });

  // Send email notification to parcel owner
  try {
    await sendEmail({
      email: parcel.owner.email, // <-- key is email, not to
      subject: `Surveyor Assigned to Your Parcel ${parcel.lrNumber}`,
      html: `
        <p>Dear ${parcel.owner.name},</p>
        <p>Your parcel <strong>${parcel.lrNumber}</strong> has been assigned to surveyor <strong>${surveyor.name}</strong>.</p>
        <p>The surveyor will contact you soon to schedule a call.</p>
        <p>Best regards,<br/>Your Company</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send email to parcel owner:", error);
  }

  res.status(201).json({
    success: true,
    message: `Surveyor assigned to parcel ${parcel.lrNumber}`,
    survey,
  });
});

// 🔹 Get Surveys Assigned to Logged-in Surveyor
export const getMySurveys = catchAsyncErrors(async (req, res) => {
  const surveys = await Survey.find({ surveyor: req.user._id })
    .populate({
      path: "parcel",
      populate: {
        path: "owner",
        select: "name email",
      },
    })
    .lean();

  const transformed = surveys.map((s) => ({
    _id: s._id, // survey ID
    status: s.status,
    feedback: s.feedback,
    assignedAt: s.assignedAt,
    parcel: {
      _id: s.parcel?._id,
      lrNumber: s.parcel?.lrNumber,
      location: s.parcel?.location,
      status: s.parcel?.status,
      owner: s.parcel?.owner,
    },
  }));

  res.status(200).json({ success: true, surveys: transformed });
});

// 🔹 Submit Feedback (Surveyor Only)
export const submitFeedback = catchAsyncErrors(async (req, res, next) => {
  const { feedback } = req.body;
  const { id } = req.params;

  const survey = await Survey.findById(id);
  if (!survey) return next(new ErrorHandler("Survey not found", 404));

  if (survey.surveyor.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to update this survey", 403));
  }

  survey.feedback = feedback;
  survey.status = "Completed";
  survey.completedAt = Date.now();

  await survey.save();

  res.status(200).json({
    success: true,
    message: "Feedback submitted",
    survey,
  });
});

// 🔹 Admin - Get All Surveys
export const getAllSurveys = catchAsyncErrors(async (req, res) => {
  const surveys = await Survey.find()
    .populate("parcel", "lrNumber location titleDeed status")
    .populate("surveyor", "name email")
    .populate("owner", "name email")
    .lean();

  res.status(200).json({ success: true, surveys });
});

// Submit Feedback (Surveyor Only)

// 🔍 Get Feedback by Parcel ID (Admin or Surveyor)
export const getFeedbackByParcelId = catchAsyncErrors(
  async (req, res, next) => {
    const { parcelId } = req.params;

    const survey = await Survey.findOne({ parcel: parcelId })
      .populate("surveyor", "name email")
      .populate("parcel", "lrNumber location")
      .lean();

    if (!survey) {
      return next(new ErrorHandler("No survey found for this parcel", 404));
    }

    if (!survey.feedback) {
      return res.status(200).json({
        success: true,
        message: "No feedback available for this parcel yet.",
        feedback: null,
      });
    }

    res.status(200).json({
      success: true,
      feedback: {
        status: survey.status,
        comments: survey.feedback,
        surveyor: survey.surveyor,
        parcel: survey.parcel,
        createdAt: survey.completedAt,
      },
    });
  }
);

// 🔍 Get Unassigned Parcels (Admin Only)
export const getUnassignedParcels = catchAsyncErrors(async (req, res) => {
  // Get all parcels already assigned in surveys
  const assignedSurveys = await Survey.find().select("parcel");
  const assignedParcelIds = assignedSurveys.map((s) => s.parcel.toString());

  // Fetch parcels that are NOT assigned
  const unassignedParcels = await Parcel.find({
    _id: { $nin: assignedParcelIds },
  });

  res.status(200).json({
    success: true,
    parcels: unassignedParcels,
  });
});


// 🔍 Get All Surveyors (Admin only)
export const getAllSurveyors = catchAsyncErrors(async (req, res, next) => {
  const surveyors = await User.find({ role: "Surveyor" }).select("_id name email");

  res.status(200).json({
    success: true,
    surveyors,
  });
});



