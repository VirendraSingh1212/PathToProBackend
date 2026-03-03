import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(
    cors({
        origin: env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import authRoutes from "./modules/auth/auth.routes";
import subjectRoutes from "./modules/subjects/subjects.routes";
import videoRoutes from "./modules/videos/videos.routes";
import progressRoutes from "./modules/progress/progress.routes";

// Define Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Configure Routes
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/progress", progressRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
