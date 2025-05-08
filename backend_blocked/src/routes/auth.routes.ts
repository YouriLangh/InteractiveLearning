import express from 'express';
import { signup, login } from '../controllers/auth.controller';

const router = express.Router();

// Wrapper to handle async errors
<<<<<<< HEAD
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/signup', asyncHandler(signup));
=======
const asyncHandler = (fn: Function) => 
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Signup → using name + code + role
router.post('/signup', asyncHandler(signup));

// Login → using name + code
>>>>>>> Fahim2
router.post('/login', asyncHandler(login));

export default router;
