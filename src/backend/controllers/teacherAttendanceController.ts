
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { TeacherAttendanceModel } from '../models/teacherAttendanceModel';
import { UserModel } from '../models/userModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';
import { z } from 'zod';

// Validation schemas
const teacherAttendanceSchema = z.object({
  teacherId: z.string(),
  date: z.string(),
  status: z.enum(['present', 'absent']),
  remarks: z.string().optional()
});

const bulkAttendanceSchema = z.object({
  date: z.string(),
  attendanceRecords: z.array(
    z.object({
      teacherId: z.string(),
      status: z.enum(['present', 'absent']),
      remarks: z.string().optional()
    })
  )
});

// Get all teachers
export const getAllTeachers = asyncHandler(async (req: Request, res: Response) => {
  const { department } = req.query;
  
  // Apply department filter for department admins
  const filter: any = { role: 'teacher' };
  
  // If user is department admin, restrict to their department
  if (req.user.role === 'department_admin' && req.user.department) {
    filter.department = req.user.department;
  }
  // If main admin with department filter
  else if (req.user.role === 'admin' && department) {
    filter.department = department;
  }
  
  const teachers = await UserModel.find(filter)
    .select('_id name email department phoneNumber')
    .sort({ name: 1 });
  
  res.json({
    success: true,
    data: teachers
  });
});

// Mark teacher attendance
export const markTeacherAttendance = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const validatedData = teacherAttendanceSchema.parse(req.body);
  const { teacherId, date, status, remarks } = validatedData;
  
  // Check if the teacher exists
  const teacher = await UserModel.findOne({ _id: teacherId, role: 'teacher' });
  
  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
  }
  
  // Check department access for department admins
  if (req.user.role === 'department_admin' && 
      req.user.department && 
      teacher.department !== req.user.department) {
    throw new ApiError(403, 'You can only mark attendance for teachers in your department');
  }
  
  // Parse date and validate
  const attendanceDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (attendanceDate > today) {
    throw new ApiError(400, 'Cannot mark attendance for future dates');
  }
  
  // Check if the attendance record already exists
  const existingRecord = await TeacherAttendanceModel.findOne({
    teacherId,
    date: {
      $gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
      $lt: new Date(attendanceDate.setHours(23, 59, 59, 999))
    }
  });
  
  if (existingRecord) {
    // Update existing record
    existingRecord.status = status;
    existingRecord.remarks = remarks;
    
    await existingRecord.save();
    
    res.json({
      success: true,
      message: 'Teacher attendance updated successfully',
      data: existingRecord
    });
  } else {
    // Create new record
    const attendance = await TeacherAttendanceModel.create({
      teacherId,
      date: attendanceDate,
      status,
      department: teacher.department,
      remarks,
      markedBy: req.user._id
    });
    
    res.status(201).json({
      success: true,
      message: 'Teacher attendance marked successfully',
      data: attendance
    });
  }
});

// Mark bulk teacher attendance
export const markBulkTeacherAttendance = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const validatedData = bulkAttendanceSchema.parse(req.body);
  const { date, attendanceRecords } = validatedData;
  
  // Parse date and validate
  const attendanceDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (attendanceDate > today) {
    throw new ApiError(400, 'Cannot mark attendance for future dates');
  }
  
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const results = [];
    
    for (const record of attendanceRecords) {
      const { teacherId, status, remarks } = record;
      
      // Check if the teacher exists
      const teacher = await UserModel.findOne({ _id: teacherId, role: 'teacher' });
      
      if (!teacher) {
        throw new ApiError(404, `Teacher with ID ${teacherId} not found`);
      }
      
      // Check department access for department admins
      if (req.user.role === 'department_admin' && 
          req.user.department && 
          teacher.department !== req.user.department) {
        throw new ApiError(403, `You cannot mark attendance for teacher ${teacher.name} from another department`);
      }
      
      // Check if the attendance record already exists
      const existingRecord = await TeacherAttendanceModel.findOne({
        teacherId,
        date: {
          $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
        }
      }).session(session);
      
      if (existingRecord) {
        // Update existing record
        existingRecord.status = status;
        existingRecord.remarks = remarks;
        
        await existingRecord.save({ session });
        results.push(existingRecord);
      } else {
        // Create new record
        const attendance = await TeacherAttendanceModel.create([{
          teacherId,
          date: attendanceDate,
          status,
          department: teacher.department,
          remarks,
          markedBy: req.user._id
        }], { session });
        
        results.push(attendance[0]);
      }
    }
    
    await session.commitTransaction();
    
    res.status(201).json({
      success: true,
      message: 'Bulk teacher attendance marked successfully',
      data: results
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// Get teacher attendance records
export const getTeacherAttendanceRecords = asyncHandler(async (req: Request, res: Response) => {
  const { teacherId, department, startDate, endDate } = req.query;
  
  // Build filter
  const filter: any = {};
  
  // Apply teacherId filter if provided
  if (teacherId) {
    filter.teacherId = teacherId;
  }
  
  // Apply department filter for department admins
  if (req.user.role === 'department_admin' && req.user.department) {
    filter.department = req.user.department;
  }
  // If department is specified and user is authorized
  else if (department && ['admin', 'department_admin'].includes(req.user.role)) {
    filter.department = department;
  }
  
  // Apply date filters
  if (startDate || endDate) {
    filter.date = {};
    
    if (startDate) {
      filter.date.$gte = new Date(startDate.toString());
    }
    
    if (endDate) {
      filter.date.$lte = new Date(endDate.toString());
    }
  }
  
  // Get attendance records
  const attendanceRecords = await TeacherAttendanceModel.find(filter)
    .populate('teacherId', 'name email department phoneNumber')
    .populate('markedBy', 'name role')
    .sort({ date: -1 });
  
  res.json({
    success: true,
    count: attendanceRecords.length,
    data: attendanceRecords
  });
});

// Get teacher attendance summary
export const getTeacherAttendanceSummary = asyncHandler(async (req: Request, res: Response) => {
  const { department, startDate, endDate } = req.query;
  
  // Build filters
  const matchFilter: any = {};
  
  // Apply department filter for department admins
  if (req.user.role === 'department_admin' && req.user.department) {
    matchFilter.department = req.user.department;
  }
  // If department is specified and user is authorized
  else if (department && ['admin', 'department_admin'].includes(req.user.role)) {
    matchFilter.department = department;
  }
  
  // Add date filter if provided
  if (startDate || endDate) {
    matchFilter.date = {};
    
    if (startDate) {
      matchFilter.date.$gte = new Date(startDate.toString());
    }
    
    if (endDate) {
      matchFilter.date.$lte = new Date(endDate.toString());
    }
  }
  
  // Get attendance summary
  const attendanceSummary = await TeacherAttendanceModel.aggregate([
    {
      $match: matchFilter
    },
    {
      $group: {
        _id: '$teacherId',
        totalDays: { $sum: 1 },
        present: {
          $sum: {
            $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
          }
        },
        absent: {
          $sum: {
            $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
          }
        },
        department: { $first: '$department' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'teacher'
      }
    },
    {
      $unwind: '$teacher'
    },
    {
      $project: {
        _id: 0,
        teacherId: '$_id',
        name: '$teacher.name',
        email: '$teacher.email',
        department: '$department',
        phoneNumber: '$teacher.phoneNumber',
        totalDays: 1,
        present: 1,
        absent: 1,
        attendancePercentage: {
          $multiply: [
            { $divide: ['$present', '$totalDays'] },
            100
          ]
        }
      }
    },
    {
      $sort: { name: 1 }
    }
  ]);
  
  res.json({
    success: true,
    count: attendanceSummary.length,
    data: attendanceSummary
  });
});
