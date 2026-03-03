import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("🔥 Error:", err);

    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: err.issues,
        });
        return;
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
