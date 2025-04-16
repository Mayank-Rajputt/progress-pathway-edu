
import { Request, Response } from 'express';
import { StudentIssueModel } from '../models/studentIssueModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';
import { z } from 'zod';

// Validate student issue input
const studentIssueSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.enum(['academic', 'administrative', 'technical', 'other']),
  attachmentUrl: z.string().optional(),
});

// Create student issue
export const createStudentIssue = asyncHandler(async (req: Request, res: Response) => {
  // Validate input
  const validatedData = studentIssueSchema.parse(req.body);
  
  // Create student issue
  const studentIssue = await StudentIssueModel.create({
    title: validatedData.title,
    description: validatedData.description,
    priority: validatedData.priority,
    category: validatedData.category,
    attachmentUrl: validatedData.attachmentUrl,
    submittedBy: req.user._id,
    status: 'pending',
  });
  
  res.status(201).json({
    success: true,
    message: 'Student issue created successfully',
    data: studentIssue,
  });
});

// Get all issues
export const getAllIssues = asyncHandler(async (req: Request, res: Response) => {
  // Build query based on user role
  const query: any = {};
  
  // If user is a student, only show their issues
  if (req.user.role === 'student') {
    query.submittedBy = req.user._id;
  }
  
  // Extract query parameters
  const { status, priority, category } = req.query;
  
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = category;
  
  // Execute query with pagination
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  
  const issues = await StudentIssueModel.find(query)
    .populate({
      path: 'submittedBy',
      select: 'name role'
    })
    .populate({
      path: 'assignedTo',
      select: 'name role'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  // Get total count for pagination
  const total = await StudentIssueModel.countDocuments(query);
  
  res.json({
    success: true,
    data: issues,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
});

// Get issue by ID
export const getIssueById = asyncHandler(async (req: Request, res: Response) => {
  const issue = await StudentIssueModel.findById(req.params.id)
    .populate({
      path: 'submittedBy',
      select: 'name role'
    })
    .populate({
      path: 'assignedTo',
      select: 'name role'
    })
    .populate({
      path: 'comments.user',
      select: 'name role'
    });
  
  if (!issue) {
    throw new ApiError(404, 'Issue not found');
  }
  
  // Check if user has permission to view this issue
  if (
    req.user.role === 'student' &&
    issue.submittedBy._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'You do not have permission to view this issue');
  }
  
  res.json({
    success: true,
    data: issue,
  });
});

// Validate update input
const updateIssueSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'resolved', 'closed']).optional(),
  assignedTo: z.string().optional(),
  comment: z.string().optional(),
  resolution: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

// Update issue
export const updateIssue = asyncHandler(async (req: Request, res: Response) => {
  // Validate input
  const validatedData = updateIssueSchema.parse(req.body);
  
  // Find issue
  const issue = await StudentIssueModel.findById(req.params.id);
  
  if (!issue) {
    throw new ApiError(404, 'Issue not found');
  }
  
  // Update status if provided
  if (validatedData.status) {
    issue.status = validatedData.status;
  }
  
  // Update assignedTo if provided
  if (validatedData.assignedTo) {
    issue.assignedTo = validatedData.assignedTo as any;
  }
  
  // Update priority if provided
  if (validatedData.priority) {
    issue.priority = validatedData.priority;
  }
  
  // Add resolution if provided
  if (validatedData.resolution) {
    issue.resolution = validatedData.resolution;
    
    // If providing resolution, automatically update status to resolved
    // unless a different status was explicitly set
    if (!validatedData.status) {
      issue.status = 'resolved';
    }
  }
  
  // Add comment if provided
  if (validatedData.comment) {
    issue.comments.push({
      text: validatedData.comment,
      user: req.user._id,
      timestamp: new Date(),
    });
  }
  
  // Save updates
  const updatedIssue = await issue.save();
  
  // Populate necessary fields for the response
  const populatedIssue = await StudentIssueModel.findById(updatedIssue._id)
    .populate({
      path: 'submittedBy',
      select: 'name role'
    })
    .populate({
      path: 'assignedTo',
      select: 'name role'
    })
    .populate({
      path: 'comments.user',
      select: 'name role'
    });
  
  res.json({
    success: true,
    message: 'Issue updated successfully',
    data: populatedIssue,
  });
});

// Delete issue
export const deleteIssue = asyncHandler(async (req: Request, res: Response) => {
  const issue = await StudentIssueModel.findById(req.params.id);
  
  if (!issue) {
    throw new ApiError(404, 'Issue not found');
  }
  
  // Check if user has permission to delete this issue
  if (
    req.user.role === 'student' &&
    issue.submittedBy.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'You do not have permission to delete this issue');
  }
  
  // Fix: Use deleteOne() instead of remove()
  await issue.deleteOne();
  
  res.json({
    success: true,
    message: 'Issue deleted successfully',
  });
});
