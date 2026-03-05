import { prisma } from "../../config/prisma";
import { pool } from "../../db";
import { UpdateProgressInput } from "./progress.schema";

export const getVideoProgress = async (videoId: string, userId: string) => {
    const progress = await prisma.videoProgress.findUnique({
        where: {
            user_id_video_id: {
                user_id: BigInt(userId),
                video_id: videoId,
            },
        },
        select: { last_position_seconds: true, is_completed: true },
    });

    return progress || { last_position_seconds: 0, is_completed: false };
};

export const upsertVideoProgress = async (videoId: string, userId: string, data: UpdateProgressInput) => {
    // Validate video exists and get duration
    const video = await prisma.video.findUnique({
        where: { id: videoId },
        select: { duration_seconds: true },
    });

    if (!video) throw Object.assign(new Error("Video not found"), { statusCode: 404 });

    let safePosition = data.last_position_seconds ?? 0;
    if (safePosition > video.duration_seconds) {
        safePosition = video.duration_seconds;
    }

    const isCompleted = data.is_completed ?? false;
    const completedAt = isCompleted ? new Date() : null;

    const progress = await prisma.videoProgress.upsert({
        where: {
            user_id_video_id: {
                user_id: BigInt(userId),
                video_id: videoId,
            },
        },
        update: {
            last_position_seconds: safePosition,
            ...(data.is_completed !== undefined && { is_completed: isCompleted }),
            ...(data.is_completed !== undefined && { completed_at: completedAt }),
        },
        create: {
            user_id: BigInt(userId),
            video_id: videoId,
            last_position_seconds: safePosition,
            is_completed: isCompleted,
            completed_at: completedAt,
        },
    });

    return {
        last_position_seconds: progress.last_position_seconds,
        is_completed: progress.is_completed,
    };
};

export const getSubjectProgress = async (subjectId: string, userId: string) => {
    // Get all videos in subject
    const allVideos = await prisma.video.findMany({
        where: { section: { subject_id: subjectId } },
        select: { id: true },
    });

    const totalVideos = allVideos.length;

    if (totalVideos === 0) {
        return { total_videos: 0, completed_videos: 0, percent_complete: 0, last_video_id: null };
    }

    // Get user's progress for these videos
    const userProgress = await prisma.videoProgress.findMany({
        where: {
            user_id: BigInt(userId),
            video: { section: { subject_id: subjectId } },
        },
        orderBy: { updated_at: "desc" }
    });

    const completedVideos = userProgress.filter((p: any) => p.is_completed).length;
    const percentComplete = Math.round((completedVideos / totalVideos) * 100);
    const lastVideoId = userProgress.length > 0 ? userProgress[0].video_id : null;

    return {
        total_videos: totalVideos,
        completed_videos: completedVideos,
        percent_complete: percentComplete,
        last_video_id: lastVideoId,
    };
};

// =====================================================
// NEW: Enhanced Subject Progress with Lesson Tracking
// =====================================================

/**
 * Get user's progress for a specific subject (for resume feature)
 */
export const getUserSubjectProgress = async (subjectId: string, userId: bigint) => {
    try {
        // Query the user_progress table directly using raw SQL
        const result = await pool.query(
            `SELECT * FROM user_progress 
             WHERE user_id = $1 AND subject_id = $2`,
            [userId, subjectId]
        );

        if (result.rows.length === 0) {
            return null;
        }

        const userProgress = result.rows[0];

        // Get total lessons count
        const totalLessonsResult = await pool.query(
            `SELECT COUNT(*) as total FROM lessons 
             WHERE section_id IN (
               SELECT id FROM sections WHERE subject_id = $1
             )`,
            [subjectId]
        );

        const totalLessons = parseInt(totalLessonsResult.rows[0]?.total || '0');
        const completedLessons = userProgress.completed_video_ids?.length || 0;

        return {
            subjectId: userProgress.subject_id,
            lastLessonId: userProgress.last_lesson_id,
            completedVideoIds: userProgress.completed_video_ids || [],
            progressPercent: userProgress.progress_percent,
            totalLessons,
            completedLessons,
        };
    } catch (error) {
        console.error('Error fetching user subject progress:', error);
        throw error;
    }
};

/**
 * Mark a lesson as complete and update progress
 */
export const markLessonComplete = async (subjectId: string, lessonId: string, userId: bigint) => {
    try {
        // Get current progress
        const currentProgress = await pool.query(
            `SELECT * FROM user_progress 
             WHERE user_id = $1 AND subject_id = $2`,
            [userId, subjectId]
        );

        let userProgress = currentProgress.rows[0];

        // Calculate total lessons in subject
        const totalLessonsResult = await pool.query(
            `SELECT COUNT(*) as total FROM lessons 
             WHERE section_id IN (
               SELECT id FROM sections WHERE subject_id = $1
             )`,
            [subjectId]
        );
        const totalLessons = parseInt(totalLessonsResult.rows[0]?.total || '0');

        if (!userProgress) {
            // Create new progress record
            const completedVideoIds = [lessonId];
            const progressPercent = totalLessons > 0 ? Math.round((1 / totalLessons) * 100) : 0;

            const result = await pool.query(
                `INSERT INTO user_progress 
                 (user_id, subject_id, last_lesson_id, completed_video_ids, progress_percent)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [userId, subjectId, lessonId, completedVideoIds, progressPercent]
            );
            userProgress = result.rows[0];
        } else {
            // Update existing progress
            const completedVideoIds = userProgress.completed_video_ids || [];
            
            // Add lesson if not already completed
            if (!completedVideoIds.includes(lessonId)) {
                completedVideoIds.push(lessonId);
            }

            const progressPercent = totalLessons > 0 
                ? Math.round((completedVideoIds.length / totalLessons) * 100)
                : 0;

            const result = await pool.query(
                `UPDATE user_progress 
                 SET completed_video_ids = $1, 
                     progress_percent = $2,
                     last_lesson_id = $3,
                     updated_at = NOW()
                 WHERE user_id = $4 AND subject_id = $5
                 RETURNING *`,
                [completedVideoIds, progressPercent, lessonId, userId, subjectId]
            );
            userProgress = result.rows[0];
        }

        return {
            subjectId: userProgress.subject_id,
            lessonId,
            progressPercent: userProgress.progress_percent,
            completedVideoIds: userProgress.completed_video_ids,
        };
    } catch (error) {
        console.error('Error marking lesson complete:', error);
        throw error;
    }
};

/**
 * Update last watched lesson without marking complete
 */
export const updateLastLesson = async (subjectId: string, lessonId: string, userId: bigint) => {
    try {
        const result = await pool.query(
            `INSERT INTO user_progress 
             (user_id, subject_id, last_lesson_id, completed_video_ids)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id, subject_id) 
             DO UPDATE SET 
               last_lesson_id = EXCLUDED.last_lesson_id,
               updated_at = NOW()
             RETURNING *`,
            [userId, subjectId, lessonId, []]
        );

        return {
            subjectId,
            lastLessonId: lessonId,
        };
    } catch (error) {
        console.error('Error updating last lesson:', error);
        throw error;
    }
};
