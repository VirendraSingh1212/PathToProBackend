import express from 'express';
import { Router } from 'express';
import env from '../config/env';

const router = Router();

// Health endpoint for Render health checks
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

export default router;
