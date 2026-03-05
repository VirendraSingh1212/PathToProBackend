import { Request, Response } from "express";
import { getSubjectTree } from "../services/course.service";

/**
 * Get complete subject content tree (sections + lessons)
 */
export const getSubjectTreeController = async (
  req: Request,
  res: Response
) => {
  try {
    const subjectId = Array.isArray(req.params.subjectId) 
      ? req.params.subjectId[0] 
      : req.params.subjectId;

    const tree = await getSubjectTree(subjectId);

    if (!tree) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.json({
      success: true,
      data: tree,
    });
  } catch (error) {
    console.error("Error fetching course tree:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subject content",
    });
  }
};
