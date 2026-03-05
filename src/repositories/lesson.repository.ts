import { pool } from "../db";

/**
 * Get all lessons for a specific section
 */
export async function getLessonsBySection(sectionId: string) {
  const result = await pool.query(
    `
    SELECT
      id,
      title,
      video_url,
      duration,
      position,
      is_preview
    FROM lessons
    WHERE section_id = $1
    ORDER BY position ASC
    `,
    [sectionId]
  );

  return result.rows;
}

/**
 * Get a single lesson by ID
 */
export async function getLessonById(lessonId: string) {
  const result = await pool.query(
    `
    SELECT
      id,
      title,
      video_url,
      duration,
      position,
      is_preview,
      created_at
    FROM lessons
    WHERE id = $1
    `,
    [lessonId]
  );

  return result.rows[0] || null;
}
