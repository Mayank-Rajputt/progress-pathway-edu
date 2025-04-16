
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserModel } from '../models/userModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';
import { z } from 'zod';

const router = express.Router();

// All routes are protected and require admin access
router.use(protect);
router.use(authorize('admin'));

// Get all users
router.get('/', asyncHandler(async (req, res) => {
  const users = await UserModel.find().select('-password').sort('name');
  
  res.json({
    success: true,
    count: users.length,
    data: users
  });
}));

// Get users by role
router.get('/role/:role', asyncHandler(async (req, res) => {
  const { role } = req.params;
  
  // Validate role
  if (!['admin', 'department_admin', 'teacher', 'student', 'parent'].includes(role)) {
    throw new ApiError(400, 'Invalid role');
  }
  
  const users = await UserModel.find({ role }).select('-password').sort('name');
  
  res.json({
    success: true,
    count: users.length,
    data: users
  });
}));

// Get user by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id).select('-password');
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  res.json({
    success: true,
    data: user
  });
}));

// Update user schema
const updateUserSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  role: z.enum(['admin', 'department_admin', 'teacher', 'student', 'parent']).optional(),
  department: z.string().optional(),
  phoneNumber: z.string().optional(),
  profileImage: z.string().optional(),
  isMainAdmin: z.boolean().optional(),
});

// Update user
router.put('/:id', asyncHandler(async (req, res) => {
  // Validate input
  const validatedData = updateUserSchema.parse(req.body);
  
  // Find user
  const user = await UserModel.findById(req.params.id);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  // Prevent modification of main admin except by themselves
  if (user.isMainAdmin && !req.user.isMainAdmin) {
    throw new ApiError(403, 'Only the main admin can modify the main admin account');
  }
  
  // Update fields
  if (validatedData.name) user.name = validatedData.name;
  
  // Only update email if changed and not already taken
  if (validatedData.email && validatedData.email !== user.email) {
    const emailExists = await UserModel.findOne({ email: validatedData.email });
    if (emailExists) {
      throw new ApiError(400, 'Email already in use');
    }
    user.email = validatedData.email;
  }
  
  if (validatedData.role) {
    // Only main admin can change roles to/from admin
    if ((user.role === 'admin' || validatedData.role === 'admin') && !req.user.isMainAdmin) {
      throw new ApiError(403, 'Only the main admin can change admin roles');
    }
    user.role = validatedData.role;
  }
  
  if (validatedData.department !== undefined) user.department = validatedData.department;
  if (validatedData.phoneNumber !== undefined) user.phoneNumber = validatedData.phoneNumber;
  if (validatedData.profileImage !== undefined) user.profileImage = validatedData.profileImage;
  
  // Only main admin can change isMainAdmin status
  if (validatedData.isMainAdmin !== undefined && req.user.isMainAdmin) {
    user.isMainAdmin = validatedData.isMainAdmin;
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
      isMainAdmin: updatedUser.isMainAdmin
    }
  });
}));

// Delete user
router.delete('/:id', asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  // Prevent deletion of main admin
  if (user.isMainAdmin) {
    throw new ApiError(403, 'Cannot delete the main admin account');
  }
  
  // Prevent admin deletion by non-main admin
  if (user.role === 'admin' && !req.user.isMainAdmin) {
    throw new ApiError(403, 'Only the main admin can delete admin accounts');
  }
  
  await user.deleteOne();
  
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
}));

// Reset user password
const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

router.put('/:id/reset-password', asyncHandler(async (req, res) => {
  // Validate input
  const validatedData = resetPasswordSchema.parse(req.body);
  
  // Find user
  const user = await UserModel.findById(req.params.id);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  // Prevent password reset of main admin by non-main admin
  if (user.isMainAdmin && !req.user.isMainAdmin) {
    throw new ApiError(403, 'Only the main admin can reset the main admin password');
  }
  
  // Update password
  user.password = validatedData.newPassword;
  await user.save();
  
  res.json({
    success: true,
    message: 'Password reset successfully'
  });
}));

export default router;
