import { Request, Response } from "express";
import { generateChatbotResponse } from "./chatbot.service";

export const chatWithBot = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const reply = await generateChatbotResponse(message);

        return res.status(200).json({
            success: true,
            data: {
                reply,
            },
        });
    } catch (error) {
        console.error("Chatbot error:", error);

        return res.status(500).json({
            success: false,
            message: "Chatbot service error",
        });
    }
};
