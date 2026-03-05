import { Router } from 'express';
import * as lessonProgressController from '../../controllers/progress.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

/**
 * Lesson Progress Tracking Routes (NEW)
 * These are additive - existing video progress routes remain unchanged
 */

// Mark lesson as complete
router.post('/complete', requireAuth, lessonProgressController.markLessonComplete);

// Get course progress for a subject
router.get('/:subjectId', requireAuth, lessonProgressController.getCourseProgress);

// Check if specific lesson is completed
router.get('/check/:lessonId', requireAuth, lessonProgressController.checkLessonStatus);

// Reset lesson progress
router.delete('/reset/:lessonId', requireAuth, lessonProgressController.resetLessonProgress);

// Get overall progress stats across all subjects
router.get('/stats/all', requireAuth, lessonProgressController.getAllProgressStats);

export default router;
