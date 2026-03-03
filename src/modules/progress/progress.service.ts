import { prisma } from "../../config/db";
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
