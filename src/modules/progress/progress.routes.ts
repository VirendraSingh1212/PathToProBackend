import { Router } from "express";
import * as progressController from "./progress.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { updateProgressSchema } from "./progress.schema";

const router = Router();

// Video level progress (EXISTING - DO NOT MODIFY)
router.get("/videos/:videoId", requireAuth, progressController.getVideoProgress);
router.post("/videos/:videoId", requireAuth, validate(updateProgressSchema), progressController.updateVideoProgress);

// Subject level progress (EXISTING - DO NOT MODIFY)
router.get("/subjects/:subjectId", requireAuth, progressController.getSubjectProgress);

export default router;
