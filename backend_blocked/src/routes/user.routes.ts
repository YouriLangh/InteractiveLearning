import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';

// Import controller functions
const {
  updateUserProfile,
  getUserProfile
} = require('../controllers/user.controller');

const router = Router();

// Protected routes (require authentication)
router.use(authenticateToken as any);

// Get user profile
router.get('/profile', getUserProfile);

// Update user profile
router.put('/profile', updateUserProfile);

export default router; 