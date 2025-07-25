// routes/transferRoutes.js
import express from "express";
import {
  createTransferRequest,
  getMyTransferRequests,
  cancelTransferRequest,
  rejectTransferRequest,
  getAllTransferRequests,
  approveTransfer,
} from "../controller/transferRequestController.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Create a new transfer request
router.post("/request", isAuthenticated, createTransferRequest);

// ✅ Get all transfer requests by the logged-in user
router.get("/mine", isAuthenticated, getMyTransferRequests);

// ✅ Cancel a specific transfer request by ID
router.delete("/cancel/:id", isAuthenticated, cancelTransferRequest);

// ✅ Admin: Get all transfer requests
router.get(
  "/all",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllTransferRequests
);

// ✅ Admin: Approve a transfer request
router.patch(
  "/approve/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  approveTransfer
);

// ✅ Admin: Reject a transfer request
router.patch(
  "/reject/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  rejectTransferRequest
);

export default router;
