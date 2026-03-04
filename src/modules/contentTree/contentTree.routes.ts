import { Router } from "express";
import { getSubjectContentTree } from "./contentTree.controller";

const router = Router();

/**
 * Content Tree Routes
 * These routes are additive and do not modify existing /api/subjects behavior
 */

// Get complete subject content tree (sections with lessons/videos)
router.get("/:subjectId/tree", getSubjectContentTree);

export default router;
