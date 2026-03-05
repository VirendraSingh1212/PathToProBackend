import { Request, Response, NextFunction } from "express";
import * as progressService from "./progress.service";

export const getVideoProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.params;
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const progress = await progressService.getVideoProgress(videoId as string, userId);
        res.status(200).json({ success: true, data: progress });
    } catch (error) {
        next(error);
    }
};

export const updateVideoProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.params;
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
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
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
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

// =====================================================
// NEW: Enhanced Progress Tracking Endpoints
// =====================================================

/**
 * GET /api/progress/subject/:subjectId
 * Fetch user's progress for a specific subject (used by resume feature)
 */
export const getUserSubjectProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subjectId = Array.isArray(req.params.subjectId) 
            ? req.params.subjectId[0] 
            : req.params.subjectId;
        const userId = BigInt(req.user?.userId || 0);
        
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const progress = await progressService.getUserSubjectProgress(subjectId, userId);

        if (!progress) {
            return res.json({ success: true, data: null });
        }

        res.json({
            success: true,
            data: progress,
        });
    } catch (error) {
        console.error('Error fetching subject progress:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch progress',
        });
        next(error);
    }
};

/**
 * POST /api/progress/mark-complete
 * Mark a lesson as complete and update progress
 */
export const markLessonComplete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subjectId = Array.isArray(req.body.subjectId) 
            ? req.body.subjectId[0] 
            : req.body.subjectId;
        const lessonId = Array.isArray(req.body.lessonId) 
            ? req.body.lessonId[0] 
            : req.body.lessonId;
        const userId = BigInt(req.user?.userId || 0);

        if (!subjectId || !lessonId) {
            res.status(400).json({
                success: false,
                message: 'subjectId and lessonId are required',
            });
            return;
        }

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const result = await progressService.markLessonComplete(subjectId, lessonId, userId);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Error marking lesson complete:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark lesson as complete',
        });
        next(error);
    }
};

/**
 * PUT /api/progress/last-lesson
 * Update the last watched lesson without marking complete
 */
export const updateLastLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subjectId = Array.isArray(req.body.subjectId) 
            ? req.body.subjectId[0] 
            : req.body.subjectId;
        const lessonId = Array.isArray(req.body.lessonId) 
            ? req.body.lessonId[0] 
            : req.body.lessonId;
        const userId = BigInt(req.user?.userId || 0);

        if (!subjectId || !lessonId) {
            res.status(400).json({
                success: false,
                message: 'subjectId and lessonId are required',
            });
            return;
        }

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const result = await progressService.updateLastLesson(subjectId, lessonId, userId);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Error updating last lesson:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update last lesson',
        });
        next(error);
    }
};
