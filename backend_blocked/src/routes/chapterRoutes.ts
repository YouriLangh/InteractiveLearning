import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { teacherMiddleware } from '../middlewares/teacher.middleware';

// Import controller functions
const {
  createChapter,
  updateChapter,
  deleteChapter,
  getChapter,
  getChaptersByCategory,
<<<<<<< HEAD
  updateChapterOrder
=======
  updateChapterOrder,
  getAllChapters, // <-- NEW
>>>>>>> Fahim2
} = require('../controllers/chapter.controller');

const router = Router();

// Protected routes (require authentication)
router.use(authenticateToken as any);

<<<<<<< HEAD
=======
// ✅ NEW PUBLIC ROUTE → Get all chapters with exercises (no category filter)
router.get('/', getAllChapters);
>>>>>>> Fahim2
// Public chapter routes
router.get('/:id', getChapter);
router.get('/category/:categoryId', getChaptersByCategory);

// Teacher-only routes
router.use(teacherMiddleware as any);
router.post('/', createChapter);
router.put('/:id', updateChapter);
router.delete('/:id', deleteChapter);
router.put('/:id/order', updateChapterOrder);

<<<<<<< HEAD
export default router; 
=======
export default router;
>>>>>>> Fahim2
