import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import { RegisterInput, LoginInput } from "./auth.schema";
import crypto from "crypto";

const generateTokens = (userId: string, email: string) => {
    const accessToken = jwt.sign({ userId, email }, env.JWT_ACCESS_SECRET, {
        expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as any,
    });

    const refreshTokenValue = crypto.randomBytes(40).toString("hex");
    const refreshTokenHash = crypto.createHash("sha256").update(refreshTokenValue).digest("hex");

    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 30); // 30 days

    return { accessToken, refreshTokenValue, refreshTokenHash, refreshTokenExpires };
};

export const register = async (input: RegisterInput) => {
    const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
    if (existingUser) throw Object.assign(new Error("Email already in use"), { statusCode: 409 });

    const password_hash = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
        data: {
            email: input.email,
            name: input.name,
            password_hash,
        },
    });

    const tokens = generateTokens(user.id.toString(), user.email);

    await prisma.refreshToken.create({
        data: {
            user_id: user.id,
            token_hash: tokens.refreshTokenHash,
            expires_at: tokens.refreshTokenExpires,
        },
    });

    return {
        user: { id: user.id.toString(), email: user.email, name: user.name },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshTokenValue,
    };
};

export const login = async (input: LoginInput) => {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw Object.assign(new Error("Invalid email or password"), { statusCode: 401 });

    const isPasswordValid = await bcrypt.compare(input.password, user.password_hash);
    if (!isPasswordValid) throw Object.assign(new Error("Invalid email or password"), { statusCode: 401 });

    const tokens = generateTokens(user.id.toString(), user.email);

    await prisma.refreshToken.create({
        data: {
            user_id: user.id,
            token_hash: tokens.refreshTokenHash,
            expires_at: tokens.refreshTokenExpires,
        },
    });

    return {
        user: { id: user.id.toString(), email: user.email, name: user.name },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshTokenValue,
    };
};

export const refresh = async (refreshTokenValue: string) => {
    const token_hash = crypto.createHash("sha256").update(refreshTokenValue).digest("hex");

    const tokenRecord = await prisma.refreshToken.findFirst({
        where: {
            token_hash,
            revoked_at: null,
            expires_at: { gt: new Date() },
        },
        include: { user: true },
    });

    if (!tokenRecord) {
        throw Object.assign(new Error("Invalid or expired refresh token"), { statusCode: 401 });
    }

    // Issue new access token
    const accessToken = jwt.sign(
        { userId: tokenRecord.user_id.toString(), email: tokenRecord.user.email },
        env.JWT_ACCESS_SECRET,
        { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as any }
    );

    return { accessToken };
};

export const logout = async (refreshTokenValue: string) => {
    if (!refreshTokenValue) return;
    const token_hash = crypto.createHash("sha256").update(refreshTokenValue).digest("hex");

    await prisma.refreshToken.updateMany({
        where: { token_hash },
        data: { revoked_at: new Date() },
    });
};
