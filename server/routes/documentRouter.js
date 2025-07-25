// server/routes/documentRoutes.js
import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  uploadDocument,
  getMyDocuments,
  deleteDocument,
  getAllDocuments,
} from "../controller/documentController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload", isAuthenticated, upload.single("file"), uploadDocument);
router.get("/my-documents", isAuthenticated, getMyDocuments);
router.delete("/:id", isAuthenticated, deleteDocument);

router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllDocuments);


export default router;
