import Parcel from "../models/parcelModel.js";
import Dispute from "../models/disputeModel.js";
import TransferRequest from "../models/transferRequestModel.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";


// ✅ Create Surveyor Account (Admin Only)
export const createSurveyor = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // 🔍 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👷 Create surveyor
    const newSurveyor = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "Surveyor",      
      accountVerified: true, // Automatically verify surveyor accounts
    });

    res.status(201).json({
      success: true,
      message: "Surveyor account created successfully.",
      surveyor: {
        _id: newSurveyor._id,
        name: newSurveyor.name,
        email: newSurveyor.email,
        phone: newSurveyor.phone,
        role: newSurveyor.role,
      },
    });
  } catch (error) {
    console.error("Create Surveyor Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating surveyor.",
      error: error.message,
    });
  }
};

export const getAdminDashboardStats = async (req, res) => {
  try {
    const totalParcels = await Parcel.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalDisputes = await Dispute.countDocuments();
    const totalTransfers = await TransferRequest.countDocuments();

    const recentParcels = await Parcel.find().sort({ createdAt: -1 }).limit(5);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalParcels,
        totalUsers,
        totalDisputes,
        totalTransfers,
        recentParcels,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
