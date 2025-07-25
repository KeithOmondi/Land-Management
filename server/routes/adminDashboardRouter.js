import express from "express";
import {
  getAdminDashboardStats,
} from "../controller/adminDashboardController.js";
///import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/admin",
  isAuthenticated,
  isAuthorized("Admin"),
  getAdminDashboardStats
);


export default router;
