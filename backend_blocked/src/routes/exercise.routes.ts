import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { teacherMiddleware } from '../middlewares/teacher.middleware';

// Import controller functions
const {
  createExercise,
  updateExercise,
  deleteExercise,
  getExercise,
  getExercisesByChapter,
  updateExerciseOrder,
  updateExerciseVisibility,
  updateExerciseStars
} = require('../controllers/exercise.controller');

const router = Router();

// Protected routes (require authentication)
router.use(authenticateToken as any);

// Public exercise routes
router.get('/:id', getExercise);
router.get('/chapter/:chapterId', getExercisesByChapter);

// Teacher-only routes
router.use(teacherMiddleware as any);
router.post('/', createExercise);
router.put('/:id', updateExercise);
router.delete('/:id', deleteExercise);
router.put('/:id/order', updateExerciseOrder);
router.put('/:id/visibility', updateExerciseVisibility);
router.put('/:id/stars', updateExerciseStars);

export default router; 