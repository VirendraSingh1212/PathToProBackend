import * as progressRepo from '../repositories/progress.repository';
import { pool } from '../db';

/**
 * Complete a lesson for the authenticated user
 */
export async function completeLesson(
    userId: string,
    lessonId: string,
    subjectId: string
) {
    return await progressRepo.markLessonComplete(userId, lessonId, subjectId);
}

/**
 * Get comprehensive course progress for a user in a subject
 * Includes completed lessons, total lessons, and percentage
 */
export async function getCourseProgress(
    userId: string,
    subjectId: string
) {
    // Get completed lessons
    const completedLessons = await progressRepo.getCompletedLessons(
        userId,
        subjectId
    );

    // Get total lessons in the subject (from sections -> lessons hierarchy)
    const totalLessonsQuery = `
        SELECT COUNT(l.id) as total
        FROM lessons l
        JOIN sections s ON l.section_id = s.id
        WHERE s.subject_id = $1
    `;

    const totalResult = await pool.query(totalLessonsQuery, [subjectId]);
    const totalLessons = Number(totalResult.rows[0]?.total || 0);

    // Calculate progress percentage
    const progressPercent =
        totalLessons === 0
            ? 0
            : Math.round((completedLessons.length / totalLessons) * 100);

    return {
        completedLessons,
        totalLessons,
        progressPercent,
    };
}

/**
 * Check if a specific lesson is completed
 */
export async function checkLessonCompletion(
    userId: string,
    lessonId: string
) {
    return await progressRepo.isLessonCompleted(userId, lessonId);
}

/**
 * Reset lesson progress (mark as incomplete)
 */
export async function resetLesson(
    userId: string,
    lessonId: string
) {
    return await progressRepo.resetLessonProgress(userId, lessonId);
}

/**
 * Get overall progress across all subjects
 */
export async function getAllSubjectProgress(userId: string) {
    return await progressRepo.getUserProgressStats(userId);
}
