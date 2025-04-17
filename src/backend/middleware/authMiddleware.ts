
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';
import { ApiError, asyncHandler } from './errorMiddleware';

// Extended request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      collegeId?: string;
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
    
    // Check if user is active
    if (user.status !== 'active') {
      throw new ApiError(401, 'Account is inactive or blocked. Please contact administrator');
    }
    
    // Set user and collegeId in request
    req.user = user;
    req.collegeId = user.collegeId;
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
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

// College-based access control middleware
export const authorizeForCollege = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.collegeId) {
    throw new ApiError(401, 'Not authorized');
  }

  // Extract collegeId from request params or query
  const requestedCollegeId = 
    req.params.collegeId || 
    req.query.collegeId || 
    req.body.collegeId || 
    null;
  
  // If no specific college is requested, use the user's college
  if (!requestedCollegeId) {
    // Ensure body has collegeId for create operations
    if (req.method === 'POST' && !req.body.collegeId) {
      req.body.collegeId = req.collegeId;
    }
    return next();
  }
  
  // Check if user has access to the requested college
  if (requestedCollegeId !== req.collegeId && !req.user.isMainAdmin) {
    throw new ApiError(403, 'You do not have access to this college');
  }
  
  next();
});

// Log user activity
export const logActivity = (action: string, module: string) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Original response methods
    const originalSend = res.send;
    const originalJson = res.json;
    const originalStatus = res.status;
    
    // Override status method
    res.status = function(code) {
      res.statusCode = code;
      return res;
    };
    
    // Override send method
    res.send = function(body) {
      logUserActivity(req, res, action, module, body);
      return originalSend.call(this, body);
    };
    
    // Override json method
    res.json = function(body) {
      logUserActivity(req, res, action, module, body);
      return originalJson.call(this, body);
    };
    
    next();
  });
};

// Helper function to log user activity
async function logUserActivity(req: Request, res: Response, action: string, module: string, responseBody: any) {
  if (!req.user) return;
  
  try {
    const { ActivityLogModel } = require('../models/activityLogModel');
    
    // Determine success or failure based on status code
    const status = res.statusCode < 400 ? 'success' : 'failure';
    
    // Get resource information
    const resourceId = req.params.id || '';
    const resourceType = module.endsWith('s') ? module.slice(0, -1) : module;
    
    // Prepare log details
    let details = `${req.user.name} performed ${action} on ${module}`;
    if (resourceId) {
      details += ` with ID ${resourceId}`;
    }
    
    // Create activity log
    await ActivityLogModel.create({
      userId: req.user._id,
      action,
      details,
      ip: req.ip,
      userAgent: req.headers['user-agent'] || 'Unknown',
      module,
      resourceId,
      resourceType,
      collegeId: req.collegeId,
      status,
      metadata: {
        method: req.method,
        url: req.originalUrl,
        params: req.params,
        query: req.query,
        responseStatus: res.statusCode,
        responseSuccess: status === 'success'
      }
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}
