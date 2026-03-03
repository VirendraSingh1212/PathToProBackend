import { CorsOptions } from 'cors';
import env from './env';

const allowedOrigins = [
    'http://localhost:3000',
    'https://path-to-pro-frontend.vercel.app',
    'https://path-to-pro-frontend-8kucfh94c-virendrasingh1212s-projects.vercel.app',
    env.CORS_ORIGIN,
].filter(Boolean) as string[];

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            console.warn(`[CORS] Rejected origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['set-cookie'],
};

export default corsOptions;
