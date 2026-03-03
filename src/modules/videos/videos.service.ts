import { prisma } from "../../config/db";

export const getVideoDetails = async (videoId: string, userId: string) => {
    // 1. Fetch current video to get its context within the subject
    const currentVideo = await prisma.video.findUnique({
        where: { id: videoId },
        include: { section: true },
    });

    if (!currentVideo) {
        throw Object.assign(new Error("Video not found"), { statusCode: 404 });
    }

    const subjectId = currentVideo.section.subject_id;

    // 2. Fetch all videos in the subject, globally ordered, to determine adjacency and lock status
    const allSubjectVideos = await prisma.video.findMany({
        where: { section: { subject_id: subjectId } },
        orderBy: [
            { section: { order_index: "asc" } },
            { order_index: "asc" },
        ],
        select: { id: true, title: true },
    });

    const currentIndex = allSubjectVideos.findIndex((v: { id: string }) => v.id === videoId);
    const previousVideo = currentIndex > 0 ? allSubjectVideos[currentIndex - 1] : null;
    const nextVideo = currentIndex < allSubjectVideos.length - 1 ? allSubjectVideos[currentIndex + 1] : null;

    // 3. Check locking logic
    let locked = false;
    let unlock_reason = null;

    if (previousVideo) {
        const previousProgress = await prisma.videoProgress.findUnique({
            where: {
                user_id_video_id: {
                    user_id: BigInt(userId),
                    video_id: previousVideo.id,
                },
            },
        });

        if (!previousProgress || !previousProgress.is_completed) {
            locked = true;
            unlock_reason = `Please complete the previous video: ${previousVideo.title}`;
        }
    }

    return {
        id: currentVideo.id,
        title: currentVideo.title,
        description: currentVideo.description,
        youtube_url: currentVideo.youtube_url,
        duration_seconds: currentVideo.duration_seconds,
        previous_video_id: previousVideo?.id || null,
        next_video_id: nextVideo?.id || null,
        locked,
        unlock_reason,
    };
};
