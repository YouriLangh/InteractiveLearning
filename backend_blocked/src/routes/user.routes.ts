import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
<<<<<<< HEAD

=======
import { getAllStudents } from '../controllers/user.controller';
>>>>>>> Fahim2
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

<<<<<<< HEAD
=======
// get all users
router.get('/students', getAllStudents);

>>>>>>> Fahim2
export default router; 