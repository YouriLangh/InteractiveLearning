import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';

// Import controller functions
const {
  createAttempt,
  getAttempt,
  getAttemptsByExercise,
  getAttemptsByStudent,
  submitStudentAnswer
} = require('../controllers/exerciseAttempt.controller');

const router = Router();

// Protected routes (require authentication)
router.use(authenticateToken as any);

// Create new attempt
router.post('/', createAttempt);

// Get specific attempt
router.get('/:id', getAttempt);

// Get attempts by exercise
router.get('/exercise/:exerciseId', getAttemptsByExercise);

// Get attempts by student
router.get('/student/:studentId', getAttemptsByStudent);

// Submit student answer
router.put('/:id/answer', submitStudentAnswer);

export default router; 