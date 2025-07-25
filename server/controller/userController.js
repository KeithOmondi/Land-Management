import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

// ✅ Get All Verified Users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  
  try {
    const users = await User.find({ accountVerified: true }).select(
      "name email role isActive createdAt"
    );

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return next(new ErrorHandler("Failed to fetch users", 500));
  }
});

// ✅ Register New Admin
export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.avatar) {
    return next(new ErrorHandler("Please upload an image", 400));
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }

  const existingAdmin = await User.findOne({ email, accountVerified: true, role: "admin" });
  if (existingAdmin) {
    return next(new ErrorHandler("User already registered", 400));
  }

  if (password.length < 8 || password.length > 20) {
    return next(new ErrorHandler("Password must be between 8 and 20 characters", 400));
  }

  const avatar = req.files.avatar;
  const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("Invalid image format", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
    folder: "MILLICENT_LIBRARY_SYSTEM",
  });

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    return next(new ErrorHandler("Cloudinary upload failed", 500));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    role: "admin",
    accountVerified: true,
  });

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    admin,
  });
});

export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;
  const updates = req.body;

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
});


// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Private/Admin or Self
export const getUserById = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({ success: true, user });
});



