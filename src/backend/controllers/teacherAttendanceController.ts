
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { TeacherAttendanceModel } from '../models/teacherAttendanceModel';
import { UserModel } from '../models/userModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';

// Get all teachers
export const getAllTeachers = asyncHandler(async (req: Request, res: Response) => {
  const teachers = await UserModel.find({ role: 'teacher' })
    .select('_id name email')
    .sort({ name: 1 });
  
  res.json({
    success: true,
    data: teachers
  });
});

// Mark teacher attendance
export const markTeacherAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { teacherId, date, status, remarks } = req.body;
  
  // Validate input
  if (!teacherId || !date || !status) {
    throw new ApiError(400, 'Please provide teacherId, date, and status');
  }
  
  // Check if the teacher exists
  const teacher = await UserModel.findOne({ _id: teacherId, role: 'teacher' });
  
  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
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
  const { date, attendanceRecords } = req.body;
  
  // Validate input
  if (!date || !attendanceRecords || !Array.isArray(attendanceRecords)) {
    throw new ApiError(400, 'Please provide date and attendance records array');
  }
  
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
  const { teacherId, startDate, endDate } = req.query;
  
  // Build filter
  const filter: any = {};
  
  if (teacherId) {
    filter.teacherId = teacherId;
  }
  
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
    .populate('teacherId', 'name email')
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
  const { startDate, endDate } = req.query;
  
  // Build date filter
  const dateFilter: any = {};
  
  if (startDate) {
    dateFilter.$gte = new Date(startDate.toString());
  }
  
  if (endDate) {
    dateFilter.$lte = new Date(endDate.toString());
  }
  
  // Get attendance summary
  const attendanceSummary = await TeacherAttendanceModel.aggregate([
    {
      $match: startDate || endDate ? { date: dateFilter } : {}
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
        }
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
