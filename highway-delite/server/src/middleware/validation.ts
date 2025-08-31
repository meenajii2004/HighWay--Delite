import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { createError } from './errorHandler.js';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      req.body = validatedData.body;
      req.query = validatedData.query;
      req.params = validatedData.params;
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map(e => e.message).join(', ');
        next(createError(message, 400, 'VALIDATION_ERROR'));
      } else {
        next(error);
      }
    }
  };
};

// Common validation schemas
export const emailSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    dateOfBirth: z.string().optional(),
  }),
});

export const loginEmailSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

export const otpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

export const noteSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    content: z.string().min(1, 'Content is required').max(10000, 'Content too long'),
  }),
});

export const noteIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Note ID is required'),
  }),
});
