import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';

// Import controller functions
const {
  getStudentFullProgress,
  getStudentProgress,
  updateStudentProgress
} = require('../controllers/studentProgress.controller');

const router = Router();

// Protected routes (require authentication)
router.use(authenticateToken as any);

// Get student progress
router.get('/:studentId/chapter/:chapterId', getStudentProgress);

// Update student progress
router.put('/:studentId/chapter/:chapterId', updateStudentProgress);

router.get('/:studentId', getStudentFullProgress);


export default router; 