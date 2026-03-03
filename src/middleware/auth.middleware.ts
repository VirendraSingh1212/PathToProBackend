import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../config/security';

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token required',
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired access token',
        });
    }
};

export const requireAuth = authMiddleware;

export default authMiddleware;
