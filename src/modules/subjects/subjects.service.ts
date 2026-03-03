import { prisma } from "../../config/prisma";

export const getPublishedSubjects = async () => {
    return prisma.subject.findMany({
        where: { is_published: true },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
        },
    });
};

export const getSubjectById = async (id: string) => {
    const subject = await prisma.subject.findUnique({
        where: { id },
        select: { id: true, title: true, slug: true, description: true },
    });
    if (!subject) throw Object.assign(new Error("Subject not found"), { statusCode: 404 });
    return subject;
};

export const getSubjectTree = async (subjectId: string, userId: string) => {
    // 1. Fetch entire subject structure ordered strictly
    const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
        select: {
            id: true,
            title: true,
            sections: {
                orderBy: { order_index: "asc" },
                select: {
                    id: true,
                    title: true,
                    order_index: true,
                    videos: {
                        orderBy: { order_index: "asc" },
                        select: {
                            id: true,
                            title: true,
                            order_index: true,
                        },
                    },
                },
            },
        },
    });

    if (!subject) throw Object.assign(new Error("Subject not found"), { statusCode: 404 });

    // 2. Fetch user progress for these videos
    const userProgress = await prisma.videoProgress.findMany({
        where: {
            user_id: BigInt(userId),
            video: { section: { subject_id: subjectId } },
        },
    });

    const progressMap = new Map<string, boolean>(userProgress.map((p: any) => [p.video_id, p.is_completed]));

    // 3. Flatten videos to calculate locking logic
    let previousVideoCompleted = true; // The first video is always unlocked

    const sectionsWithState = subject.sections.map((section: any) => {
        const videosWithState = section.videos.map((video: any) => {
            const isCompleted = progressMap.has(video.id) ? (progressMap.get(video.id) as boolean) : false;
            const locked = !previousVideoCompleted;

            // Update state for next video in the loop
            previousVideoCompleted = isCompleted;

            return {
                id: video.id,
                title: video.title,
                order_index: video.order_index,
                is_completed: isCompleted,
                locked,
            };
        });

        return {
            id: section.id,
            title: section.title,
            order_index: section.order_index,
            videos: videosWithState,
        };
    });

    return {
        id: subject.id,
        title: subject.title,
        sections: sectionsWithState,
    };
};
