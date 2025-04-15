
import { Request, Response, NextFunction } from 'express';

// Custom error class
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const message = err.message || 'Something went wrong';
  
  console.error(`[Error] ${statusCode} - ${message}`);
  if (statusCode === 500) {
    console.error(err.stack);
  }
  
  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

// Async handler to avoid try/catch blocks in controllers
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
