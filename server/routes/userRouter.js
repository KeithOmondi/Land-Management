import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";
import { getAllUsers, getUserById, registerNewAdmin, updateUserProfile } from "../controller/userController.js";

const router = express.Router();

router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllUsers);
router.post(
  "/add/new-admin",
  isAuthenticated,
  isAuthorized("admin"),
  registerNewAdmin
);

router.put("/update-user/:id", isAuthenticated, isAuthorized("Admin"), updateUserProfile);
router.get("/get-user/:id", isAuthenticated, getUserById);


export default router;
