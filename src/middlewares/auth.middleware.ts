import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthPayload {
    userId: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ success: false, message: "Unauthorized: Missing Token" });
            return;
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload;

        req.user = decoded;
        next();
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            res.status(401).json({ success: false, message: "Unauthorized: Token Expired" });
            return;
        }
        res.status(401).json({ success: false, message: "Unauthorized: Invalid Token" });
    }
};
