
import { Request, Response } from 'express';
import { ActivityLogModel } from '../models/activityLogModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';
import { UserModel } from '../models/userModel';
import mongoose from 'mongoose';

// Get activity logs
export const getActivityLogs = asyncHandler(async (req: Request, res: Response) => {
  const { 
    userId, 
    action, 
    module, 
    startDate, 
    endDate, 
    status,
    page = 1,
    limit = 20,
    sort = '-createdAt'
  } = req.query;
  
  // Build query
  const query: any = { collegeId: req.collegeId };
  if (userId) query.userId = userId;
  if (action) query.action = action;
  if (module) query.module = module;
  if (status) query.status = status;
  
  //   Date range
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate as string);
    if (endDate) query.createdAt.$lte = new Date(endDate as string);
  }
  
  // Count total documents
  const totalDocs = await ActivityLogModel.countDocuments(query);
  
  // Get paginated results
  const skip = (Number(page) - 1) * Number(limit);
  
  // Fix for sort order handling
  const sortField = (sort as string).startsWith('-') 
    ? (sort as string).substring(1) 
    : sort as string;
  const sortDirection = (sort as string).startsWith('-') ? -1 : 1;
  
  // Fix: Use the proper type for sortOrder - use Record<string, 1 | -1 | mongoose.SortOrder>
  const sortOrder: Record<string, 1 | -1> = { [sortField]: sortDirection };
  
  const logs = await ActivityLogModel.find(query)
    .populate('userId', 'name email role')
    .sort(sortOrder)
    .skip(skip)
    .limit(Number(limit));
  
  res.json({
    success: true,
    count: logs.length,
    totalPages: Math.ceil(totalDocs / Number(limit)),
    currentPage: Number(page),
    data: logs
  });
});

// Get activity log by ID
export const getActivityLogById = asyncHandler(async (req: Request, res: Response) => {
  const log = await ActivityLogModel.findOne({
    _id: req.params.id,
    collegeId: req.collegeId
  }).populate('userId', 'name email role');
  
  if (!log) {
    throw new ApiError(404, 'Activity log not found');
  }
  
  res.json({
    success: true,
    data: log
  });
});

// Delete activity log
export const deleteActivityLog = asyncHandler(async (req: Request, res: Response) => {
  const log = await ActivityLogModel.findOne({
    _id: req.params.id,
    collegeId: req.collegeId
  });
  
  if (!log) {
    throw new ApiError(404, 'Activity log not found');
  }
  
  // Only main admin can delete logs
  if (!req.user.isMainAdmin) {
    throw new ApiError(403, 'Only main admin can delete activity logs');
  }
  
  await log.deleteOne();
  
  res.json({
    success: true,
    message: 'Activity log deleted successfully'
  });
});

// Get activity log stats
export const getActivityLogStats = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  
  // Build date range
  const dateRange: any = {};
  if (startDate) dateRange.$gte = new Date(startDate as string);
  if (endDate) dateRange.$lte = new Date(endDate as string);
  if (!startDate && !endDate) {
    // Default to last 30 days
    dateRange.$gte = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }
  
  // Query base
  const baseQuery = {
    collegeId: req.collegeId,
    createdAt: dateRange
  };
  
  // Get total logs
  const totalLogs = await ActivityLogModel.countDocuments(baseQuery);
  
  // Get logs by action
  const logsByAction = await ActivityLogModel.aggregate([
    { $match: baseQuery },
    { $group: { _id: '$action', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  
  // Get logs by module
  const logsByModule = await ActivityLogModel.aggregate([
    { $match: baseQuery },
    { $group: { _id: '$module', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  
  // Get logs by user
  const logsByUser = await ActivityLogModel.aggregate([
    { $match: baseQuery },
    { $group: { _id: '$userId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  
  // Get user details
  const userIds = logsByUser.map(item => item._id);
  const users = await UserModel.find({ _id: { $in: userIds } }, 'name email role');
  
  // Map user details to logs
  const topUsers = logsByUser.map(item => {
    const user = users.find(u => u._id.toString() === item._id.toString());
    return {
      userId: item._id,
      count: item.count,
      name: user?.name || 'Unknown',
      email: user?.email || 'Unknown',
      role: user?.role || 'Unknown'
    };
  });
  
  // Get logs by date
  const logsByDate = await ActivityLogModel.aggregate([
    { $match: baseQuery },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);
  
  // Format date for chart
  const activityTimeline = logsByDate.map(item => {
    const date = new Date(item._id.year, item._id.month - 1, item._id.day);
    return {
      date: date.toISOString().split('T')[0],
      count: item.count
    };
  });
  
  res.json({
    success: true,
    data: {
      totalLogs,
      logsByAction,
      logsByModule,
      topUsers,
      activityTimeline
    }
  });
});
