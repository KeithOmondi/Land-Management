import express from "express";
import {
  createDispute,
  getMyDisputes,
  withdrawDispute,
  getAllDisputes,         // ✅ Admin route
  updateDisputeStatus     // ✅ Admin route
} from "../controller/disputeController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ User Routes
router.post("/create", isAuthenticated, createDispute);
router.get("/mine", isAuthenticated, getMyDisputes);
router.delete("/:id", isAuthenticated, withdrawDispute);

// ✅ Admin Routes
router.get("/admin/all", isAuthenticated, isAuthorized("Admin"), getAllDisputes);
router.put("/admin/:id/status", isAuthenticated, isAuthorized("Admin"), updateDisputeStatus);

export default router;
