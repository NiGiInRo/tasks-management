import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

type ValidationTarget = 'body' | 'params';

export function validate(schema: ZodSchema, target: ValidationTarget = 'body'): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      res.status(400).json({
        error: 'Validation error',
        details: result.error.flatten(),
      });
      return;
    }

    req[target] = result.data;
    next();
  };
}