import { Request, Response, NextFunction } from 'express';
import env from '../config/env';

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal server error';

    // Log error internally
    console.error(`[Error] ${req.method} ${req.url}:`, {
        message: err.message,
        stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    });

    res.status(statusCode).json({
        success: false,
        message,
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorMiddleware;
