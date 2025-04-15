
import { Request, Response } from 'express';
import { StudentIssueModel } from '../models/studentIssueModel';
import { UserModel } from '../models/userModel';
import { StudentModel } from '../models/studentModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';
import { z } from 'zod';

// Validation schemas
const createIssueSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(['academic', 'technical', 'facilities', 'other']),
  attachments: z.array(z.string()).optional()
});

const updateIssueSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'resolved', 'rejected']).optional(),
  assignedTo: z.string().optional(),
  resolution: z.string().optional()
});

// Create student issue
export const createStudentIssue = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = createIssueSchema.parse(req.body);
  
  // Only students can create issues
  if (req.user.role !== 'student') {
    throw new ApiError(403, 'Only students can create issues');
  }
  
  // Find student's department
  const student = await StudentModel.findOne({ userId: req.user._id });
  
  if (!student) {
    throw new ApiError(404, 'Student profile not found');
  }
  
  // Create issue
  const issue = await StudentIssueModel.create({
    studentId: req.user._id,
    department: student.department,
    ...validatedData
  });
  
  res.status(201).json({
    success: true,
    message: 'Issue created successfully',
    data: issue
  });
});

// Get all issues
export const getAllIssues = asyncHandler(async (req: Request, res: Response) => {
  const { status, category, department } = req.query;
  
  // Build filter
  const filter: any = {};
  
  // Apply filter for student - only show their issues
  if (req.user.role === 'student') {
    filter.studentId = req.user._id;
  }
  
  // Apply filter for department admins - only show their department's issues
  if (req.user.role === 'department_admin' && req.user.department) {
    filter.department = req.user.department;
  } 
  // Apply department filter if specified (for admins)
  else if (department && req.user.role === 'admin') {
    filter.department = department;
  }
  
  // Apply status filter if provided
  if (status && ['pending', 'in_progress', 'resolved', 'rejected'].includes(status as string)) {
    filter.status = status;
  }
  
  // Apply category filter if provided
  if (category && ['academic', 'technical', 'facilities', 'other'].includes(category as string)) {
    filter.category = category;
  }
  
  // Get issues
  const issues = await StudentIssueModel.find(filter)
    .populate('studentId', 'name email')
    .populate('assignedTo', 'name email role')
    .sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: issues.length,
    data: issues
  });
});

// Get issue by ID
export const getIssueById = asyncHandler(async (req: Request, res: Response) => {
  const issue = await StudentIssueModel.findById(req.params.id)
    .populate('studentId', 'name email')
    .populate('assignedTo', 'name email role');
  
  if (!issue) {
    throw new ApiError(404, 'Issue not found');
  }
  
  // Check if user has permission to view this issue
  if (req.user.role === 'student' && issue.studentId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to view this issue');
  }
  
  // Check department access for department admins
  if (req.user.role === 'department_admin' && 
      req.user.department && 
      issue.department !== req.user.department) {
    throw new ApiError(403, 'You do not have permission to view issues from other departments');
  }
  
  res.json({
    success: true,
    data: issue
  });
});

// Update issue
export const updateIssue = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = updateIssueSchema.parse(req.body);
  
  // Find issue
  const issue = await StudentIssueModel.findById(req.params.id);
  
  if (!issue) {
    throw new ApiError(404, 'Issue not found');
  }
  
  // Students can only view their own issues, not update them
  if (req.user.role === 'student') {
    throw new ApiError(403, 'Students cannot update issues');
  }
  
  // Check department access for department admins
  if (req.user.role === 'department_admin' && 
      req.user.department && 
      issue.department !== req.user.department) {
    throw new ApiError(403, 'You do not have permission to update issues from other departments');
  }
  
  // If assignedTo is provided, verify it's a valid teacher or admin
  if (validatedData.assignedTo) {
    const assignedUser = await UserModel.findById(validatedData.assignedTo);
    
    if (!assignedUser || !['admin', 'department_admin', 'teacher'].includes(assignedUser.role)) {
      throw new ApiError(400, 'Issues can only be assigned to admins or teachers');
    }
    
    // Department admins can only assign to users in their department
    if (req.user.role === 'department_admin' && 
        req.user.department && 
        assignedUser.department !== req.user.department) {
      throw new ApiError(403, 'You can only assign issues to users in your department');
    }
  }
  
  // Update issue
  Object.assign(issue, validatedData);
  await issue.save();
  
  res.json({
    success: true,
    message: 'Issue updated successfully',
    data: issue
  });
});

// Delete issue
export const deleteIssue = asyncHandler(async (req: Request, res: Response) => {
  const issue = await StudentIssueModel.findById(req.params.id);
  
  if (!issue) {
    throw new ApiError(404, 'Issue not found');
  }
  
  // Only admins and department admins can delete issues
  if (!['admin', 'department_admin'].includes(req.user.role)) {
    throw new ApiError(403, 'You do not have permission to delete issues');
  }
  
  // Check department access for department admins
  if (req.user.role === 'department_admin' && 
      req.user.department && 
      issue.department !== req.user.department) {
    throw new ApiError(403, 'You do not have permission to delete issues from other departments');
  }
  
  // Fix: Use deleteOne() instead of remove() as remove() is deprecated
  await StudentIssueModel.deleteOne({ _id: issue._id });
  
  res.json({
    success: true,
    message: 'Issue deleted successfully'
  });
});
