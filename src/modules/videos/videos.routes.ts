import { Router } from "express";
import * as videosController from "./videos.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/:videoId", requireAuth, videosController.getVideoDetails);

export default router;
