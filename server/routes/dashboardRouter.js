import express from "express";
import { getDashboardData } from "../controller/dashboardController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected dashboard data
router.get("/user-dashboard", isAuthenticated, getDashboardData);

export default router;
