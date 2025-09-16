import { Request, NextFunction, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { ZodType } from 'zod';

const validateRequest = (schema: ZodType) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });

    next();
  });
};

export default validateRequest;
