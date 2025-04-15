
import { Request, Response } from 'express';
import { AttendanceModel } from '../models/attendanceModel';
import { StudentModel } from '../models/studentModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';
import { z } from 'zod';

// Validate single attendance input
const attendanceSchema = z.object({
  studentId: z.string(),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format'
  }),
  status: z.enum(['present', 'absent', 'late']),
  remarks: z.string().optional()
});

// Validate bulk attendance input
const bulkAttendanceSchema = z.object({
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format'
  }),
  class: z.string(),
  section: z.string(),
  attendanceData: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(['present', 'absent', 'late']),
      remarks: z.string().optional()
    })
  )
});

// Mark single attendance
export const markAttendance = asyncHandler(async (req: Request, res: Response) => {
  // Validate input
  const validatedData = attendanceSchema.parse(req.body);
  
  // Get student details
  const student = await StudentModel.findById(validatedData.studentId);
  
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  
  // Check if attendance for this date already exists
  const existingAttendance = await AttendanceModel.findOne({
    studentId: validatedData.studentId,
    date: new Date(validatedData.date)
  });
  
  if (existingAttendance) {
    // Update existing attendance
    existingAttendance.status = validatedData.status;
    if (validatedData.remarks) existingAttendance.remarks = validatedData.remarks;
    
    const updatedAttendance = await existingAttendance.save();
    
    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: updatedAttendance
    });
  } else {
    // Create new attendance record
    const attendance = await AttendanceModel.create({
      studentId: validatedData.studentId,
      date: new Date(validatedData.date),
      status: validatedData.status,
      class: student.class,
      section: student.section,
      markedBy: req.user._id,
      remarks: validatedData.remarks
    });
    
    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendance
    });
  }
});

// Mark bulk attendance
export const markBulkAttendance = asyncHandler(async (req: Request, res: Response) => {
  // Validate input
  const validatedData = bulkAttendanceSchema.parse(req.body);
  
  // Prepare attendance records for bulk insert
  const attendanceRecords = validatedData.attendanceData.map(item => ({
    studentId: item.studentId,
    date: new Date(validatedData.date),
    status: item.status,
    class: validatedData.class,
    section: validatedData.section,
    markedBy: req.user._id,
    remarks: item.remarks
  }));
  
  // Use updateMany with upsert to handle both creation and updates
  const result = await AttendanceModel.bulkWrite(
    attendanceRecords.map(record => ({
      updateOne: {
        filter: {
          studentId: record.studentId,
          date: record.date
        },
        update: {
          $set: record
        },
        upsert: true
      }
    }))
  );
  
  res.status(201).json({
    success: true,
    message: 'Bulk attendance marked successfully',
    data: {
      modified: result.modifiedCount,
      created: result.upsertedCount
    }
  });
});

// Get attendance
export const getAttendance = asyncHandler(async (req: Request, res: Response) => {
  // Extract query parameters
  const { 
    studentId, 
    class: className, 
    section, 
    date, 
    startDate, 
    endDate, 
    status 
  } = req.query;
  
  // Build query
  const query: any = {};
  
  if (studentId) query.studentId = studentId;
  if (className) query.class = className;
  if (section) query.section = section;
  if (status) query.status = status;
  
  // Handle date filtering
  if (date) {
    const parsedDate = new Date(date as string);
    query.date = {
      $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
      $lte: new Date(parsedDate.setHours(23, 59, 59, 999))
    };
  } else if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string)
    };
  }
  
  // Execute query
  const attendance = await AttendanceModel.find(query)
    .populate({
      path: 'studentId',
      select: 'rollNumber',
      populate: {
        path: 'userId',
        select: 'name'
      }
    })
    .populate({
      path: 'markedBy',
      select: 'name'
    })
    .sort({ date: -1 });
  
  res.json({
    success: true,
    count: attendance.length,
    data: attendance
  });
});

// Get attendance summary
export const getAttendanceSummary = asyncHandler(async (req: Request, res: Response) => {
  // Extract query parameters
  const { class: className, section, startDate, endDate } = req.query;
  
  if (!className || !section) {
    throw new ApiError(400, 'Class and section are required');
  }
  
  // Build date filter
  const dateFilter: any = {};
  if (startDate && endDate) {
    dateFilter.$gte = new Date(startDate as string);
    dateFilter.$lte = new Date(endDate as string);
  } else {
    // Default to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    dateFilter.$gte = firstDay;
    dateFilter.$lte = lastDay;
  }
  
  // Get students in the class
  const students = await StudentModel.find({
    class: className,
    section: section
  }).populate({
    path: 'userId',
    select: 'name'
  });
  
  // Get attendance data
  const attendanceData = await AttendanceModel.aggregate([
    {
      $match: {
        class: className as string,
        section: section as string,
        date: dateFilter
      }
    },
    {
      $group: {
        _id: {
          studentId: '$studentId',
          status: '$status'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.studentId',
        attendance: {
          $push: {
            status: '$_id.status',
            count: '$count'
          }
        }
      }
    }
  ]);
  
  // Count total days in the range
  const totalDays = Math.floor(
    (dateFilter.$lte - dateFilter.$gte) / (1000 * 60 * 60 * 24) + 1
  );
  
  // Map student data with attendance
  const summaryData = students.map(student => {
    const studentAttendance = attendanceData.find(
      item => item._id.toString() === student._id.toString()
    );
    
    const present = studentAttendance
      ? studentAttendance.attendance.find(a => a.status === 'present')?.count || 0
      : 0;
    
    const absent = studentAttendance
      ? studentAttendance.attendance.find(a => a.status === 'absent')?.count || 0
      : 0;
    
    const late = studentAttendance
      ? studentAttendance.attendance.find(a => a.status === 'late')?.count || 0
      : 0;
    
    const percentage = totalDays ? Math.round(((present + late) / totalDays) * 100) : 0;

    // Fix: Extract user name safely from populated document
    const populatedData = student.toObject();
    const userName = populatedData.userId && typeof populatedData.userId === 'object' ? 
                    (populatedData.userId as any).name || 'Unknown' : 'Unknown';
    
    return {
      student: {
        id: student._id,
        rollNumber: student.rollNumber,
        name: userName
      },
      attendance: {
        present,
        absent,
        late,
        total: present + absent + late,
        percentage
      }
    };
  });
  
  res.json({
    success: true,
    totalDays,
    data: summaryData
  });
});
