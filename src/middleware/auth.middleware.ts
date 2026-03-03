import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../config/security';

export interface LMSAuthRequest extends Request {
    lmsUser?: {
        userId: string;
    };
}

export const authMiddleware = (
    req: LMSAuthRequest,
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

        req.lmsUser = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired access token',
        });
    }
};

export default authMiddleware;
