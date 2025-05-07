import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { getAllStudents } from '../controllers/user.controller';
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

// get all users
router.get('/students', getAllStudents);

export default router; 