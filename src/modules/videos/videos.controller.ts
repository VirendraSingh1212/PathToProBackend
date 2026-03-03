import { Request, Response, NextFunction } from "express";
import * as videosService from "./videos.service";

export const getVideoDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const video = await videosService.getVideoDetails(videoId as string, userId);
        res.status(200).json({ success: true, data: video });
    } catch (error: any) {
        if (error.code === 'P2023') {
            res.status(404).json({ success: false, message: "Video not found" });
            return;
        }
        next(error);
    }
};
