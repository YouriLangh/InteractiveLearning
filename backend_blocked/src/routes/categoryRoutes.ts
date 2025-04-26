import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { teacherMiddleware } from '../middlewares/teacher.middleware';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  updateCategoryOrder
} from '../controllers/category.controller';

const router = Router();

// Protected routes (require authentication)
router.use(authenticateToken as any);

// Public category routes
router.get('/', getCategories);

// Teacher-only routes
router.use(teacherMiddleware as any);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.put('/:id/order', updateCategoryOrder);

export default router; 