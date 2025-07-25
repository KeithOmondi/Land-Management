import express from "express";
import {
  assignSurveyor,
  getMySurveys,
  getAllSurveys,
  submitFeedback,
  loginSurveyor,
  logoutSurveyor,
  getFeedbackByParcelId,
  getUnassignedParcels,
  getAllSurveyors,
} from "../controller/surveyController.js";

import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";
import { createSurveyor } from "../controller/adminDashboardController.js";

const router = express.Router();

// 🔐 Auth routes for Surveyors
router.post("/login", loginSurveyor);
router.get("/logout", logoutSurveyor);

// 🔹 Admin routes
router.post(
  "/assign/:parcelId",
  isAuthenticated,
  isAuthorized("Admin"),
  assignSurveyor
);
router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllSurveys);

// 🔹 Surveyor routes
router.get("/my-surveys", isAuthenticated, getMySurveys);
router.put("/:id/feedback", isAuthenticated, submitFeedback);
router.get(
  "/parcel/:parcelId/feedback",
  isAuthenticated, // protect route
  isAuthorized("Admin"),
  getFeedbackByParcelId
);

router.get("/unassigned-parcels", isAuthenticated, isAuthorized("Admin"), getUnassignedParcels);

// 👥 Fetch all surveyors (Admin only)
router.get(
  "/surveyors",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllSurveyors
);

router.post(
  "/create-surveyor",
  isAuthenticated,
  isAuthorized("Admin"),
  createSurveyor
)


export default router;
