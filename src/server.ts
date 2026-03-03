import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/db";

const PORT = env.PORT;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
        console.log("⏸️ HTTP server closed.");
        await prisma.$disconnect();
        console.log("💾 Database connection closed.");
        process.exit(0);
    });

    // Force shutdown if it takes too long
    setTimeout(() => {
        console.error("⚠️ Forcefully shutting down...");
        process.exit(1);
    }, 10000);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
