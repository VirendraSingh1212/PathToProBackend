import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvs = [
    'PORT',
    'DATABASE_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'CORS_ORIGIN',
    'NODE_ENV',
] as const;

export const env = {
    PORT: process.env.PORT || '5000',
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || process.env.JWT_ACCESS_EXPIRY || '15m',
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || process.env.JWT_REFRESH_EXPIRY || '30d',
    CORS_ORIGIN: process.env.CORS_ORIGIN!,
    NODE_ENV: process.env.NODE_ENV || 'development',
    COOKIE_DOMAIN: process.env.REFRESH_TOKEN_DOMAIN || process.env.COOKIE_DOMAIN,
    REFRESH_TOKEN_DOMAIN: process.env.REFRESH_TOKEN_DOMAIN,
};

// Validate required environment variables
for (const key of requiredEnvs) {
    if (!process.env[key]) {
        console.error(`❌ Missing required environment variable: ${key}`);
        process.exit(1);
    }
}

export default env;
