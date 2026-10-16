import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';
import { ApiError } from '../utils/apiError';

export function validateRequest(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!result.success) {
      throw new ApiError(400, 'Validation failed', result.error.flatten());
    }

    const parsed = result.data as { body: unknown; query: unknown; params: unknown };
    req.body = parsed.body as any;
    req.query = parsed.query as any;
    req.params = parsed.params as any;
    next();
  };
}
