import express from "express";
import {
  createParcel,
  deleteParcel,
  getAllParcels,
  getMyParcels,
  getParcelById,
  updateParcel,
  updateParcelStatus,
} from "../controller/parcelController.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create parcel
router.post("/create-parcel", isAuthenticated, createParcel);

// Get all parcels (admin)
router.get(
  "/get-all-parcel",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllParcels
);

// Get parcel by ID (admin)
router.get(
  "/get-parcel/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  getParcelById
);

// Get logged-in user's parcels
router.get("/mine", isAuthenticated, getMyParcels);

// Update parcel (generic)
router.put("/update-parcel/:id", isAuthenticated, updateParcel);

// Delete parcel (admin)
router.delete(
  "/delete-parcel/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteParcel
);

// Approve or reject parcel (admin)
router.put(
  "/status/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  updateParcelStatus
);

export default router;
