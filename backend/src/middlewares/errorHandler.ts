import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

export function errorHandler(err: Error | ApiError, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : 'Internal Server Error';

  res.status(status).json({
    status: 'error',
    message,
    details: err instanceof ApiError ? err.details : undefined
  });
}
