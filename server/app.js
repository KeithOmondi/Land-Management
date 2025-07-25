import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path"
import { connectDB } from "./db/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";
import parcelRouter from "./routes/parcelRouter.js"
import transferRouter from "./routes/transferRouter.js"
import disputeRouter from "./routes/disputeRouter.js"
import documentRouter from "./routes/documentRouter.js"
import dashboardRouter from "./routes/dashboardRouter.js"
import adminDashboardRouter from "./routes/adminDashboardRouter.js"
import surveyRouter from "./routes/surveyRouter.js";

export const app = express();
dotenv.config({ path: "./config/.env" });

// ✅ CORS setup (adjust FRONTEND_URL if needed)
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// ✅ Debug log: remove later in production
app.use((req, res, next) => {
  console.log("📥 Incoming request:");
  console.log("🔗 URL:", req.originalUrl);
  console.log("📦 Body:", req.body);
  next();
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// ✅ Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/parcel", parcelRouter);
app.use("/api/v1/transfer", transferRouter);
app.use("/api/v1/disputes", disputeRouter);
app.use("/api/v1/documents", documentRouter);
app.use("/api/v1/user-dashboard", dashboardRouter);
app.use("/api/v1/dashboard", adminDashboardRouter)
app.use("/api/v1/surveys", surveyRouter);






removeUnverifiedAccounts();
// ✅ DB connection
connectDB();

// ✅ Global error handler
app.use(errorMiddleware);
