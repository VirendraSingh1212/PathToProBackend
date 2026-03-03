import { Router } from "express";
import * as subjectsController from "./subjects.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", subjectsController.getSubjects);
router.get("/:id", subjectsController.getSubjectById);
router.get("/:id/tree", requireAuth, subjectsController.getSubjectTree);
router.get("/:id/first-video", requireAuth, subjectsController.getFirstVideo);

export default router;
