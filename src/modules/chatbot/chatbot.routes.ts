import { Router } from "express";
import { chatWithBot } from "./chatbot.controller";

const router = Router();

router.post("/chat", chatWithBot);

export default router;
