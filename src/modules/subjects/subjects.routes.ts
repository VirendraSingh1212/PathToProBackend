import { Router } from "express";
import * as subjectsController from "./subjects.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", subjectsController.getSubjects);
router.get("/:id", subjectsController.getSubjectById);
router.get("/:id/tree", requireAuth, subjectsController.getSubjectTree);

export default router;
