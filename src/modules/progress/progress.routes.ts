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

// =====================================================
// NEW: Enhanced Progress Tracking Endpoints
// =====================================================

/**
 * GET /api/progress/subject/:subjectId
 * Fetch user's progress for a specific subject (used by resume feature)
 */
router.get("/subject/:subjectId", requireAuth, progressController.getUserSubjectProgress);

/**
 * POST /api/progress/mark-complete
 * Mark a lesson as complete and update progress
 */
router.post("/mark-complete", requireAuth, progressController.markLessonComplete);

/**
 * PUT /api/progress/last-lesson
 * Update the last watched lesson without marking complete
 */
router.put("/last-lesson", requireAuth, progressController.updateLastLesson);

export default router;
