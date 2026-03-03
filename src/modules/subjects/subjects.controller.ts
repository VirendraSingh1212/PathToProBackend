import { Request, Response, NextFunction } from "express";
import * as subjectsService from "./subjects.service";

export const getSubjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subjects = await subjectsService.getPublishedSubjects();
        res.status(200).json({ success: true, data: subjects });
    } catch (error) {
        next(error);
    }
};

export const getSubjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const subject = await subjectsService.getSubjectById(id as string);
        res.status(200).json({ success: true, data: subject });
    } catch (error: any) {
        if (error.code === 'P2023') { // Prisma Malformed Object ID
            res.status(404).json({ success: false, message: "Subject not found" });
            return;
        }
        next(error);
    }
};

export const getSubjectTree = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const tree = await subjectsService.getSubjectTree(id as string, userId);
        res.status(200).json({ success: true, data: tree });
    } catch (error: any) {
        if (error.code === 'P2023') {
            res.status(404).json({ success: false, message: "Subject not found" });
            return;
        }
        next(error);
    }
};
