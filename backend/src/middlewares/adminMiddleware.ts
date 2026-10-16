import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (user.role !== 'ADMIN' && user.role !== 'OWNER') {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }

  next();
}
