import app from './app';
import env from './config/env';
import prisma from './config/prisma';
import { Server } from 'http';

const port = env.PORT;

const server: Server = app.listen(port, async () => {
    console.log(`
  🚀 Server is running!
  📡 Port: ${port}
  🌍 Environment: ${env.NODE_ENV}
  `);

    try {
        await prisma.$connect();
        console.log('  ✅ Connected to PostgreSQL (Neon)');
    } catch (error) {
        console.error('  ❌ Database connection failed:', error);
        process.exit(1);
    }
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

    server.close(async () => {
        console.log('  🛑 HTTP server closed.');

        try {
            await prisma.$disconnect();
            console.log('  🔌 Prisma disconnected.');
            process.exit(0);
        } catch (error) {
            console.error('  ❌ Error during Prisma disconnection:', error);
            process.exit(1);
        }
    });

    // Force shutdown if it takes too long
    setTimeout(() => {
        console.error('  ⚠️ Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
    console.error('  ⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
    // Log but do not crash the server
});

process.on('uncaughtException', (error) => {
    console.error('  🚨 Uncaught Exception:', error);
    // Log but do not crash the server as per requirements
});
