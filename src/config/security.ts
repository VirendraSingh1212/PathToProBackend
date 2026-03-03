import jwt from 'jsonwebtoken';
import env from './env';
import { CookieOptions } from 'express';

export const generateAccessToken = (userId: string | bigint) => {
    return jwt.sign({ userId: userId.toString() }, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRY as any,
    });
};

export const generateRefreshToken = (userId: string | bigint) => {
    return jwt.sign({ userId: userId.toString() }, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRY as any,
    });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string };
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
};

export const getRefreshTokenCookieOptions = (): CookieOptions => {
    const isProduction = env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        secure: isProduction, // true in production (requires HTTPS)
        sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-domain in production
        domain: isProduction ? env.REFRESH_TOKEN_DOMAIN : undefined,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    };
};
