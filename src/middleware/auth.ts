import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

export interface AuthRequest extends Request {
  userId?: string;
  role?: 'student' | 'admin';
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('No token provided'));
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.role !== 'admin') {
    return next(new ForbiddenError('Only admins can access this resource'));
  }
  next();
};

export const studentOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.role !== 'student') {
    return next(new ForbiddenError('Only students can access this resource'));
  }
  next();
};
