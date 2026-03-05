import { Router } from "express";
import { getSubjectTreeController } from "../controllers/subject.controller";

const router = Router();

/**
 * GET /api/subjects/:subjectId/tree
 * Returns complete subject content tree with sections and lessons
 */
router.get("/subjects/:subjectId/tree", getSubjectTreeController);

export default router;
