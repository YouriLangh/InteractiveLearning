import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  updateUserProfile,
  getUserProfile,
  getAllStudents
} from '../controllers/user.controller';

const router = Router();

// Protected routes (require authentication)
router.use('/', authenticateToken as RequestHandler);

// User profile routes
router.get('/profile', getUserProfile as RequestHandler);
router.put('/profile', updateUserProfile as RequestHandler);

// Teacher-only routes
router.get('/students', getAllStudents as RequestHandler);

export default router; 