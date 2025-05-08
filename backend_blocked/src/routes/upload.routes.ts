import express from 'express';
import { solve } from '../controllers/upload.controller';

const router = express.Router();

// Wrapper to handle async errors
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/solve', asyncHandler(solve));

export default router;
