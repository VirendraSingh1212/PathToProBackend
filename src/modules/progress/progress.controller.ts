import { Request, Response, NextFunction } from "express";
import * as progressService from "./progress.service";

export const getVideoProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.params;
        const userId = req.user!.userId;
        const progress = await progressService.getVideoProgress(videoId as string, userId);
        res.status(200).json({ success: true, data: progress });
    } catch (error) {
        next(error);
    }
};

export const updateVideoProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.params;
        const userId = req.user!.userId;
        const progress = await progressService.upsertVideoProgress(videoId as string, userId, req.body);
        res.status(200).json({ success: true, data: progress });
    } catch (error: any) {
        if (error.code === 'P2023') {
            res.status(404).json({ success: false, message: "Video not found" });
            return;
        }
        next(error);
    }
};

export const getSubjectProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { subjectId } = req.params;
        const userId = req.user!.userId;
        const progress = await progressService.getSubjectProgress(subjectId as string, userId);
        res.status(200).json({ success: true, data: progress });
    } catch (error: any) {
        if (error.code === 'P2023') {
            res.status(404).json({ success: false, message: "Subject not found" });
            return;
        }
        next(error);
    }
};
