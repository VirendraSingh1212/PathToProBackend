import { pool } from "../db";
import { convertToEmbed } from "../utils/youtube";

/**
 * Get the complete content tree for a subject
 * Returns sections with lessons and YouTube embed URLs
 */
export async function getSubjectTree(subjectId: string) {
  // Fetch sections for the subject
  const sections = await pool.query(
    `
    SELECT id, title, order_index as position
    FROM sections
    WHERE subject_id = $1
    ORDER BY order_index ASC
    `,
    [subjectId]
  );

  if (sections.rows.length === 0) {
    return null;
  }

  const formattedSections = [];

  // Fetch lessons for each section
  for (const section of sections.rows) {
    const lessons = await pool.query(
      `
      SELECT id, title, video_url, duration, position, is_preview
      FROM lessons
      WHERE section_id = $1
      ORDER BY position ASC
      `,
      [section.id]
    );

    formattedSections.push({
      id: section.id,
      title: section.title,
      position: section.position,
      lessons: lessons.rows.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        videoUrl: convertToEmbed(lesson.video_url),
        duration: lesson.duration,
        position: lesson.position,
        isPreview: lesson.is_preview,
      })),
    });
  }

  // Fetch subject details
  const subject = await pool.query(
    `
    SELECT id, title, slug, description
    FROM subjects
    WHERE id = $1
    `,
    [subjectId]
  );

  return {
    id: subject.rows[0]?.id,
    title: subject.rows[0]?.title,
    slug: subject.rows[0]?.slug,
    description: subject.rows[0]?.description,
    sections: formattedSections,
  };
}
