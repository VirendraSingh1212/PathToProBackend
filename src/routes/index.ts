import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import subjectRoutes from '../modules/subjects/subjects.routes';
import videoRoutes from '../modules/videos/videos.routes';
import progressRoutes from '../modules/progress/progress.routes';
import contentTreeRoutes from '../modules/contentTree/contentTree.routes';
import lessonProgressRoutes from './lessonProgress.routes';
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

// Module Routes
router.use('/auth', authRoutes);
router.use('/subjects', contentTreeRoutes);  // Register BEFORE subjects to match first
router.use('/subjects', subjectRoutes);
router.use('/videos', videoRoutes);
router.use('/progress', progressRoutes);
router.use('/lesson-progress', lessonProgressRoutes);

export default router;
