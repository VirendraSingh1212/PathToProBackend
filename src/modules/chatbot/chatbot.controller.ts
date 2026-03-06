import { Request, Response } from "express";
import { generateAIReply } from "./chatbot.service";

export const chatWithBot = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== "string") {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const result = await generateAIReply(message);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Chatbot controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Chatbot server error",
        });
    }
};
