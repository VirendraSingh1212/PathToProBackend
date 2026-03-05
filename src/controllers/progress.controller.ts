import { Request, Response } from 'express';
import * as progressService from '../services/progress.service';

/**
 * Mark a lesson as complete
 * POST /api/progress/complete
 */
export const markLessonComplete = async (req: Request, res: Response) => {
    try {
        // Get user ID from authenticated request
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        const { lessonId, subjectId } = req.body;

        // Validate required fields
        if (!lessonId || !subjectId) {
            return res.status(400).json({
                success: false,
                message: 'lessonId and subjectId are required',
            });
        }

        // Mark lesson as complete
        const result = await progressService.completeLesson(
            userId,
            lessonId,
            subjectId
        );

        return res.status(200).json({
            success: true,
            message: 'Lesson marked as complete',
            data: result,
        });
    } catch (error: any) {
        console.error('Progress completion error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update lesson progress',
            error: error.message,
        });
    }
};

/**
 * Get course progress for a specific subject
 * GET /api/progress/:subjectId
 */
export const getCourseProgress = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        const { subjectId } = req.params;

        if (!subjectId || Array.isArray(subjectId)) {
            return res.status(400).json({
                success: false,
                message: 'Subject ID is required',
            });
        }

        const progress = await progressService.getCourseProgress(userId, subjectId);

        return res.status(200).json({
            success: true,
            data: progress,
        });
    } catch (error: any) {
        console.error('Progress fetch error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch course progress',
            error: error.message,
        });
    }
};

/**
 * Check if a specific lesson is completed
 * GET /api/progress/check/:lessonId
 */
export const checkLessonStatus = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        const { lessonId } = req.params;

        if (!lessonId || Array.isArray(lessonId)) {
            return res.status(400).json({
                success: false,
                message: 'Lesson ID is required',
            });
        }

        const status = await progressService.checkLessonCompletion(userId, lessonId);

        return res.status(200).json({
            success: true,
            data: status,
        });
    } catch (error: any) {
        console.error('Lesson status check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to check lesson status',
            error: error.message,
        });
    }
};

/**
 * Reset lesson progress (mark as incomplete)
 * DELETE /api/progress/reset/:lessonId
 */
export const resetLessonProgress = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        const { lessonId } = req.params;

        if (!lessonId || Array.isArray(lessonId)) {
            return res.status(400).json({
                success: false,
                message: 'Lesson ID is required',
            });
        }

        const success = await progressService.resetLesson(userId, lessonId);

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Progress record not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lesson progress reset successfully',
        });
    } catch (error: any) {
        console.error('Lesson reset error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to reset lesson progress',
            error: error.message,
        });
    }
};

/**
 * Get overall progress across all subjects
 * GET /api/progress/stats
 */
export const getAllProgressStats = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        const stats = await progressService.getAllSubjectProgress(userId);

        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error: any) {
        console.error('Overall progress fetch error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch overall progress',
            error: error.message,
        });
    }
};
