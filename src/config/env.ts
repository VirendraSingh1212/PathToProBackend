import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default("5000").transform(Number),
    DATABASE_URL: z.string().min(1),
    JWT_ACCESS_SECRET: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
    REFRESH_TOKEN_EXPIRES_IN: z.string().default("30d"),
    CORS_ORIGIN: z.string().default("http://localhost:3000"),
    COOKIE_DOMAIN: z.string().default("localhost"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    process.exit(1);
}

export const env = _env.data;
