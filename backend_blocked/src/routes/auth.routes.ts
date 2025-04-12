import express from 'express';
import { signup, login } from '../controllers/auth.controller';

const router = express.Router();

// Wrapper to handle async errors
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));

export default router;
