import { prisma } from "../../config/prisma";

/**
 * Get the complete content tree for a subject
 * Returns sections with their lessons (or videos if lessons don't exist)
 * Ordered by position/order_index
 */
export const getSubjectTree = async (subjectId: string) => {
    try {
        // Fetch subject with sections and lessons
        const subject = await prisma.subject.findUnique({
            where: { id: subjectId },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                sections: {
                    orderBy: { order_index: "asc" },
                    select: {
                        id: true,
                        title: true,
                        order_index: true,
                        lessons: {
                            orderBy: { position: "asc" },
                            select: {
                                id: true,
                                title: true,
                                video_url: true,
                                duration: true,
                                position: true,
                                is_preview: true,
                            },
                        },
                        // Fallback to videos if no lessons exist
                        videos: {
                            orderBy: { order_index: "asc" },
                            select: {
                                id: true,
                                title: true,
                                youtube_url: true,
                                order_index: true,
                                duration_seconds: true,
                            },
                        },
                    },
                },
            },
        });

        if (!subject) {
            return null;
        }

        // Transform sections to include either lessons or videos
        const sectionsWithContent = subject.sections.map((section: any) => {
            const hasLessons = section.lessons && section.lessons.length > 0;
            
            if (hasLessons) {
                // Use lessons structure
                return {
                    id: section.id,
                    title: section.title,
                    position: section.order_index,
                    lessons: section.lessons.map((lesson: any) => ({
                        id: lesson.id,
                        title: lesson.title,
                        videoUrl: lesson.video_url,
                        duration: lesson.duration,
                        position: lesson.position,
                        isPreview: lesson.is_preview,
                    })),
                };
            } else {
                // Fallback to videos structure
                return {
                    id: section.id,
                    title: section.title,
                    position: section.order_index,
                    lessons: section.videos.map((video: any) => ({
                        id: video.id,
                        title: video.title,
                        videoUrl: video.youtube_url,
                        duration: video.duration_seconds,
                        position: video.order_index,
                        isPreview: false,
                    })),
                };
            }
        });

        return {
            id: subject.id,
            title: subject.title,
            slug: subject.slug,
            description: subject.description,
            sections: sectionsWithContent,
        };
    } catch (error) {
        console.error(`Error fetching subject tree for ${subjectId}:`, error);
        throw error;
    }
};
