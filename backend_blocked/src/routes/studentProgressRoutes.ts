import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  getStudentFullProgress,
  getStudentProgress,
  updateStudentProgress,
  getStudentSuccessRate
} from '../controllers/studentProgress.controller';

const router = Router();

// Protected routes (require authentication)
router.use('/', authenticateToken as RequestHandler);

// Get student progress for a specific chapter
router.get('/:studentId/chapter/:chapterId', getStudentProgress as RequestHandler);

// Get full student progress (all chapters)
router.get('/:studentId', getStudentFullProgress as RequestHandler);

// Get student success rate
router.get('/:studentId/success-rate', getStudentSuccessRate as RequestHandler);

// Update student progress for a specific chapter
router.put('/:studentId/chapter/:chapterId', updateStudentProgress as RequestHandler);

export default router; 