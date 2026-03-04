import { Request, Response } from "express";
import * as contentTreeService from "./contentTree.service";

/**
 * Get complete subject content tree (sections with lessons/videos)
 * This endpoint is isolated and does not affect existing /api/subjects endpoints
 */
export const getSubjectContentTree = async (req: Request, res: Response) => {
    try {
        const { subjectId } = req.params;

        if (!subjectId || Array.isArray(subjectId)) {
            return res.status(400).json({
                success: false,
                message: "Subject ID is required",
            });
        }

        const tree = await contentTreeService.getSubjectTree(subjectId);

        if (!tree) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: tree,
        });
    } catch (error: any) {
        console.error("Error in getSubjectContentTree:", error);
        
        // Return empty structure instead of 500 to avoid breaking frontend
        return res.status(200).json({
            success: true,
            data: {
                id: req.params.subjectId,
                title: "",
                slug: "",
                description: "",
                sections: [],
            },
        });
    }
};
