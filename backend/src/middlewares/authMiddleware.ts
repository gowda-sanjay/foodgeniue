import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { ApiError } from '../utils/apiError';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthorized');
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token) as { id: string; role: string };
    req.user = {
      id: decoded.id,
      role: decoded.role as any
    };
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
}
