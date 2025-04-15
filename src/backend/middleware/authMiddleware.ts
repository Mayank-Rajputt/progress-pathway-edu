
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';
import { ApiError, asyncHandler } from './errorMiddleware';

// Extended request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Protect routes middleware
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  
  // Check if token exists in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    throw new ApiError(401, 'Not authorized, no token');
  }
  
  try {
    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // Get user from database
    const user = await UserModel.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new ApiError(401, 'User not found');
    }
    
    // Set user in request
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Not authorized, token failed');
  }
});

// Role-based access control middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authorized');
    }
    
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `Role (${req.user.role}) is not authorized to access this resource`);
    }
    
    // Special case for main admin
    if (req.user.role === 'admin' && req.user.isMainAdmin) {
      return next(); // Main admin can access everything
    }
    
    next();
  };
};

// Department-based access control middleware
export const authorizeForDepartment = (paramName: string = 'departmentId') => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authorized');
    }
    
    // Main admin can access any department
    if (req.user.role === 'admin' && req.user.isMainAdmin) {
      return next();
    }
    
    // Get department from request parameter
    const departmentId = req.params[paramName];
    
    if (!departmentId) {
      return next(); // No department specified, continue
    }
    
    // For department admins, check if they have access to this department
    if (req.user.role === 'department_admin') {
      if (req.user.department !== departmentId) {
        throw new ApiError(403, 'You do not have access to this department');
      }
    }
    
    next();
  });
};
