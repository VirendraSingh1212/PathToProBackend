import { Router } from "express";
import * as progressController from "./progress.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { updateProgressSchema } from "./progress.schema";

const router = Router();

// Video level progress
router.get("/videos/:videoId", requireAuth, progressController.getVideoProgress);
router.post("/videos/:videoId", requireAuth, validate(updateProgressSchema), progressController.updateVideoProgress);

// Subject level progress
router.get("/subjects/:subjectId", requireAuth, progressController.getSubjectProgress);

export default router;
