import { Request, Response, NextFunction } from 'express';

export const teacherMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'TEACHER') {
    return res.status(403).json({ message: 'Access denied. Teachers only.' });
  }
  next();
}; 