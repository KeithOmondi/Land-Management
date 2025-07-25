import Parcel from "../models/parcelModel.js";
import TransferRequest from "../models/transferRequestModel.js";
import Dispute from "../models/disputeModel.js";
import { User } from "../models/userModel.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const parcelsOwned = await Parcel.countDocuments({ owner: userId });

    const pendingTransfers = await TransferRequest.countDocuments({
      requestedBy: userId,
      status: "pending",
    });

    const pendingTransferDetails = await TransferRequest.find({
      requestedBy: userId,
      status: "pending",
    }).populate("parcel", "lrNumber"); // <– This could throw if population fails

    const activeDisputes = await Dispute.countDocuments({
      filedBy: userId,
      status: "open",
    });

    const user = await User.findById(userId);

    const lastLogin = user?.lastLogin
      ? new Date(user.lastLogin).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";

    const notifications = [
      {
        id: 1,
        message: "Your parcel transfer request for plot KJD/456 has been approved.",
        type: "success",
      },
      {
        id: 2,
        message: "Action required: Verify your contact information in settings.",
        type: "warning",
      },
      {
        id: 3,
        message: "New update on land registration policies available.",
        type: "info",
      },
    ];

    res.status(200).json({
      parcelsOwned,
      pendingTransfers,
      pendingTransferDetails,
      activeDisputes,
      lastLogin,
      notifications,
    });
  } catch (error) {
    console.error("❌ Dashboard Error:", error); // Add this for terminal logs
    res.status(500).json({
      message: "Failed to load dashboard data",
      error: error.message,
    });
  }
};



