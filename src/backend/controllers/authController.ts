import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';
import { z } from 'zod';

// Generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d'
  });
};

// Validate registration input
const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'department_admin', 'teacher', 'student', 'parent']),
  department: z.string().optional(),
  phoneNumber: z.string().optional(),
});

// Register user
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    console.log("Registration request received:", { ...req.body, password: '******' });
    
    // Validate input
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const userExists = await UserModel.findOne({ email: validatedData.email });
    
    if (userExists) {
      console.log("User already exists with email:", validatedData.email);
      throw new ApiError(400, 'User already exists with this email address');
    }
    
    // If registering as admin or department_admin, require an existing admin to be logged in
    // Skip this check during development/testing
    if ((validatedData.role === 'admin' || validatedData.role === 'department_admin') && 
        (!req.user || req.user.role !== 'admin')) {
      // Only enforce this in production to allow for initial setup
      if (process.env.NODE_ENV === 'production') {
        console.log("Unauthorized attempt to create admin account");
        throw new ApiError(403, 'Only existing admins can create admin accounts');
      }
    }
    
    // Create user
    const user = await UserModel.create({
      ...validatedData,
      status: 'active', // Ensure status is set
      collegeId: req.user?.collegeId || 'default' // Set collegeId
    });
    
    console.log("User created successfully:", user._id);
    
    // If user was created successfully
    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          phoneNumber: user.phoneNumber,
          profileImage: user.profileImage,
          token: generateToken(user._id.toString())
        }
      });
    } else {
      throw new ApiError(400, 'Invalid user data');
    }
  } catch (error) {
    console.error("Error in user registration:", error);
    
    if (error instanceof z.ZodError) {
      // Handle validation errors
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new ApiError(400, `Validation error: ${errorMessages}`);
    }
    
    // Re-throw other errors for the errorHandler middleware to catch
    throw error;
  }
});

// Login schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Login user
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  // Validate input
  const validatedData = loginSchema.parse(req.body);
  
  // Find user
  const user = await UserModel.findOne({ email: validatedData.email });
  
  // Check if user exists and password matches
  if (user && await user.matchPassword(validatedData.password)) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        token: generateToken(user._id.toString())
      }
    });
  } else {
    throw new ApiError(401, 'Invalid email or password');
  }
});

// Get user profile
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  // User is already attached to req by the protect middleware
  const user = await UserModel.findById(req.user._id).select('-password');
  
  if (user) {
    res.json({
      success: true,
      data: user
    });
  } else {
    throw new ApiError(404, 'User not found');
  }
});

// Update profile schema
const updateProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  profileImage: z.string().optional(),
  phoneNumber: z.string().optional(),
  department: z.string().optional(),
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  // Validate input
  const validatedData = updateProfileSchema.parse(req.body);
  
  // Find user
  const user = await UserModel.findById(req.user._id);
  
  if (user) {
    // Update user fields
    user.name = validatedData.name || user.name;
    
    // Only allow email change if not already taken
    if (validatedData.email && validatedData.email !== user.email) {
      const emailExists = await UserModel.findOne({ email: validatedData.email });
      if (emailExists) {
        throw new ApiError(400, 'Email already in use');
      }
      user.email = validatedData.email;
    }
    
    if (validatedData.profileImage !== undefined) {
      user.profileImage = validatedData.profileImage;
    }
    
    if (validatedData.phoneNumber !== undefined) {
      user.phoneNumber = validatedData.phoneNumber;
    }
    
    if (validatedData.department !== undefined) {
      user.department = validatedData.department;
    }
    
    // Save user
    const updatedUser = await user.save();
    
    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        phoneNumber: updatedUser.phoneNumber,
        profileImage: updatedUser.profileImage,
      }
    });
  } else {
    throw new ApiError(404, 'User not found');
  }
});

// Update password schema
const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// Update password
export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  // Validate input
  const validatedData = updatePasswordSchema.parse(req.body);
  
  // Find user
  const user = await UserModel.findById(req.user._id);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  // Check if current password matches
  if (!(await user.matchPassword(validatedData.currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect');
  }
  
  // Update password
  user.password = validatedData.newPassword;
  await user.save();
  
  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});

// Create an admin user if none exists (used during initial setup)
export const createInitialAdmin = async () => {
  try {
    const adminExists = await UserModel.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const admin = await UserModel.create({
        name: 'Admin User',
        email: 'admin@school.com',
        password: 'admin123',
        role: 'admin',
        isMainAdmin: true
      });
      
      console.log('Initial admin user created:', admin.email);
    }
  } catch (error) {
    console.error('Error creating initial admin:', error);
  }
};
