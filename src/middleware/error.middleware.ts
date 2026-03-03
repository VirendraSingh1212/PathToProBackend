import { Request, Response, NextFunction } from 'express';
import env from '../config/env';

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || err.status || 500;
    const isProd = env.NODE_ENV === 'production';
    const message = statusCode === 500 && isProd ? 'Something went wrong' : (err.message || 'Internal server error');

    // Log error internally (always log stack for debugging)
    console.error(`[Error] ${req.method} ${req.url}:`, err);

    res.status(statusCode).json({
        success: false,
        ...(statusCode === 500 && { error: 'Internal Server Error' }),
        message,
        ...(!isProd && { stack: err.stack }),
    });
};

export default errorMiddleware;
