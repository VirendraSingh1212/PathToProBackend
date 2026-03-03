import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { env } from "../../config/env";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict" as const,
    domain: env.COOKIE_DOMAIN === "localhost" ? undefined : env.COOKIE_DOMAIN,
    path: "/api/auth/refresh",
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.register(req.body);

        res.cookie("refreshToken", result.refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            user: result.user,
            accessToken: result.accessToken,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.login(req.body);

        res.cookie("refreshToken", result.refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            user: result.user,
            accessToken: result.accessToken,
        });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshTokenValue = req.cookies?.refreshToken;
        if (!refreshTokenValue) {
            res.status(401).json({ success: false, message: "No refresh token provided" });
            return;
        }

        const result = await authService.refresh(refreshTokenValue);

        res.status(200).json({
            success: true,
            accessToken: result.accessToken,
        });
    } catch (error) {
        res.clearCookie("refreshToken", COOKIE_OPTIONS);
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshTokenValue = req.cookies?.refreshToken;
        if (refreshTokenValue) {
            await authService.logout(refreshTokenValue);
        }

        res.clearCookie("refreshToken", COOKIE_OPTIONS);
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
};
