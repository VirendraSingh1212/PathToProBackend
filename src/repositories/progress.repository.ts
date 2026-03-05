import { pool } from '../db';

/**
 * Mark a lesson as complete for a user
 * Uses UPSERT (ON CONFLICT) to handle duplicate entries
 */
export async function markLessonComplete(
    userId: string,
    lessonId: string,
    subjectId: string
) {
    const query = `
        INSERT INTO user_progress
        (user_id, lesson_id, subject_id, completed, completed_at)
        VALUES ($1, $2, $3, true, NOW())
        ON CONFLICT (user_id, lesson_id)
        DO UPDATE SET 
            completed = true, 
            completed_at = NOW()
        RETURNING id, completed, completed_at
    `;

    const result = await pool.query(query, [userId, lessonId, subjectId]);
    return result.rows[0];
}

/**
 * Get all completed lessons for a user in a subject
 */
export async function getCompletedLessons(
    userId: string,
    subjectId: string
) {
    const query = `
        SELECT lesson_id, completed_at
        FROM user_progress
        WHERE user_id = $1
        AND subject_id = $2
        AND completed = true
        ORDER BY completed_at ASC
    `;

    const result = await pool.query(query, [userId, subjectId]);
    return result.rows.map((row) => ({
        lessonId: row.lesson_id,
        completedAt: row.completed_at,
    }));
}

/**
 * Check if a specific lesson is completed
 */
export async function isLessonCompleted(
    userId: string,
    lessonId: string
) {
    const query = `
        SELECT completed, completed_at
        FROM user_progress
        WHERE user_id = $1
        AND lesson_id = $2
    `;

    const result = await pool.query(query, [userId, lessonId]);
    
    if (result.rows.length === 0) {
        return { completed: false, completedAt: null };
    }

    return {
        completed: result.rows[0].completed,
        completedAt: result.rows[0].completed_at,
    };
}

/**
 * Reset lesson completion (mark as incomplete)
 */
export async function resetLessonProgress(
    userId: string,
    lessonId: string
) {
    const query = `
        UPDATE user_progress
        SET completed = false, completed_at = NULL
        WHERE user_id = $1
        AND lesson_id = $2
        RETURNING id
    `;

    const result = await pool.query(query, [userId, lessonId]);
    return (result.rowCount ?? 0) > 0;
}

/**
 * Get progress statistics for a user across all subjects
 */
export async function getUserProgressStats(userId: string) {
    const query = `
        SELECT 
            subject_id,
            COUNT(*) FILTER (WHERE completed = true) as completed_count,
            COUNT(*) as total_count,
            ROUND(
                (COUNT(*) FILTER (WHERE completed = true)::numeric / COUNT(*)::numeric) * 100, 
                2
            ) as progress_percent
        FROM (
            SELECT DISTINCT ON (up.subject_id, up.lesson_id) 
                up.subject_id, 
                up.lesson_id, 
                up.completed
            FROM user_progress up
            WHERE up.user_id = $1
        ) as distinct_lessons
        GROUP BY subject_id
    `;

    const result = await pool.query(query, [userId]);
    return result.rows.map((row) => ({
        subjectId: row.subject_id,
        completedCount: parseInt(row.completed_count),
        totalCount: parseInt(row.total_count),
        progressPercent: parseFloat(row.progress_percent),
    }));
}
