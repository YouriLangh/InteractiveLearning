import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { teacherMiddleware } from '../middlewares/teacher.middleware';
import {
  createChapter,
  updateChapter,
  deleteChapter,
  getChapter,
  getAllChapters,
  updateChapterOrder
} from '../controllers/chapter.controller';

const router = Router();

// Protected routes (require authentication)
router.use('/', authenticateToken as RequestHandler);

// Public routes (authenticated users)
router.get('/', getAllChapters as RequestHandler);
router.get('/:id', getChapter as RequestHandler);

// Teacher-only routes
router.use('/', teacherMiddleware as RequestHandler);
router.post('/', createChapter as RequestHandler);
router.put('/:id', updateChapter as RequestHandler);
router.delete('/:id', deleteChapter as RequestHandler);
router.put('/:id/order', updateChapterOrder as RequestHandler);

export default router; 