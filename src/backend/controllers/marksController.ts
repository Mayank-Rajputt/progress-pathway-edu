
import { Request, Response } from 'express';
import { MarkModel } from '../models/markModel';
import { StudentModel } from '../models/studentModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';
import { z } from 'zod';

// Validate single mark input
const markSchema = z.object({
  studentId: z.string(),
  subject: z.string(),
  marks: z.number().min(0, 'Marks cannot be negative'),
  totalMarks: z.number().min(1, 'Total marks must be at least 1'),
  examType: z.enum(['test', 'assignment', 'midterm', 'final']),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format'
  }).optional(),
  remarks: z.string().optional()
});

// Validate bulk marks input
const bulkMarksSchema = z.object({
  subject: z.string(),
  examType: z.enum(['test', 'assignment', 'midterm', 'final']),
  class: z.string(),
  section: z.string(),
  totalMarks: z.number().min(1, 'Total marks must be at least 1'),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format'
  }).optional(),
  marksData: z.array(
    z.object({
      studentId: z.string(),
      marks: z.number().min(0, 'Marks cannot be negative'),
      remarks: z.string().optional()
    })
  )
});

// Enter marks for a single student
export const enterMarks = asyncHandler(async (req: Request, res: Response) => {
  // Validate input
  const validatedData = markSchema.parse(req.body);
  
  // Get student details
  const student = await StudentModel.findById(validatedData.studentId);
  
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  
  // Check if marks already exist for this student, subject and exam type
  const existingMark = await MarkModel.findOne({
    studentId: validatedData.studentId,
    subject: validatedData.subject,
    examType: validatedData.examType
  });
  
  if (existingMark) {
    // Update existing marks
    existingMark.marks = validatedData.marks;
    existingMark.totalMarks = validatedData.totalMarks;
    if (validatedData.date) existingMark.date = new Date(validatedData.date);
    if (validatedData.remarks) existingMark.remarks = validatedData.remarks;
    
    const updatedMark = await existingMark.save();
    
    res.json({
      success: true,
      message: 'Marks updated successfully',
      data: updatedMark
    });
  } else {
    // Create new marks record
    const mark = await MarkModel.create({
      studentId: validatedData.studentId,
      subject: validatedData.subject,
      marks: validatedData.marks,
      totalMarks: validatedData.totalMarks,
      examType: validatedData.examType,
      class: student.class,
      section: student.section,
      date: validatedData.date ? new Date(validatedData.date) : new Date(),
      recordedBy: req.user._id,
      remarks: validatedData.remarks
    });
    
    res.status(201).json({
      success: true,
      message: 'Marks recorded successfully',
      data: mark
    });
  }
});

// Enter marks for multiple students
export const enterBulkMarks = asyncHandler(async (req: Request, res: Response) => {
  // Validate input
  const validatedData = bulkMarksSchema.parse(req.body);
  
  // Prepare marks records for bulk insert
  const marksRecords = validatedData.marksData.map(item => ({
    studentId: item.studentId,
    subject: validatedData.subject,
    marks: item.marks,
    totalMarks: validatedData.totalMarks,
    examType: validatedData.examType,
    class: validatedData.class,
    section: validatedData.section,
    date: validatedData.date ? new Date(validatedData.date) : new Date(),
    recordedBy: req.user._id,
    remarks: item.remarks
  }));
  
  // Use updateMany with upsert to handle both creation and updates
  const result = await MarkModel.bulkWrite(
    marksRecords.map(record => ({
      updateOne: {
        filter: {
          studentId: record.studentId,
          subject: record.subject,
          examType: record.examType
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
    message: 'Bulk marks recorded successfully',
    data: {
      modified: result.modifiedCount,
      created: result.upsertedCount
    }
  });
});

// Get marks
export const getMarks = asyncHandler(async (req: Request, res: Response) => {
  // Extract query parameters
  const { 
    studentId, 
    subject, 
    examType, 
    class: className, 
    section 
  } = req.query;
  
  // Build query
  const query: any = {};
  
  if (studentId) query.studentId = studentId;
  if (subject) query.subject = subject;
  if (examType) query.examType = examType;
  if (className) query.class = className;
  if (section) query.section = section;
  
  // Execute query
  const marks = await MarkModel.find(query)
    .populate({
      path: 'studentId',
      select: 'rollNumber',
      populate: {
        path: 'userId',
        select: 'name'
      }
    })
    .populate({
      path: 'recordedBy',
      select: 'name'
    })
    .sort({ subject: 1, date: -1 });
  
  res.json({
    success: true,
    count: marks.length,
    data: marks
  });
});

// Get marks summary for a student
export const getStudentMarksSummary = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Check if student exists
  const student = await StudentModel.findById(id).populate({
    path: 'userId',
    select: 'name'
  });
  
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  
  // Get marks by subject and exam type
  const marks = await MarkModel.find({ studentId: id }).sort({ subject: 1, examType: 1 });
  
  // Group marks by subject
  const subjectWiseMarks: any = {};
  
  marks.forEach(mark => {
    if (!subjectWiseMarks[mark.subject]) {
      subjectWiseMarks[mark.subject] = {
        subject: mark.subject,
        examMarks: {},
        totalObtained: 0,
        totalMaximum: 0,
        percentage: 0
      };
    }
    
    subjectWiseMarks[mark.subject].examMarks[mark.examType] = {
      marks: mark.marks,
      totalMarks: mark.totalMarks,
      percentage: Math.round((mark.marks / mark.totalMarks) * 100)
    };
    
    subjectWiseMarks[mark.subject].totalObtained += mark.marks;
    subjectWiseMarks[mark.subject].totalMaximum += mark.totalMarks;
  });
  
  // Calculate overall percentage for each subject
  let overallObtained = 0;
  let overallMaximum = 0;
  
  Object.keys(subjectWiseMarks).forEach(subject => {
    const subjectData = subjectWiseMarks[subject];
    subjectData.percentage = Math.round(
      (subjectData.totalObtained / subjectData.totalMaximum) * 100
    );
    
    overallObtained += subjectData.totalObtained;
    overallMaximum += subjectData.totalMaximum;
  });
  
  const overallPercentage = overallMaximum > 0
    ? Math.round((overallObtained / overallMaximum) * 100)
    : 0;
  
  res.json({
    success: true,
    data: {
      student: {
        id: student._id,
        name: (student.populate?.userId as any)?.name,
        rollNumber: student.rollNumber,
        class: student.class,
        section: student.section
      },
      marks: Object.values(subjectWiseMarks),
      summary: {
        totalObtained: overallObtained,
        totalMaximum: overallMaximum,
        percentage: overallPercentage
      }
    }
  });
});

// Get class performance
export const getClassPerformance = asyncHandler(async (req: Request, res: Response) => {
  const { class: className, section, examType } = req.query;
  
  if (!className || !section) {
    throw new ApiError(400, 'Class and section are required');
  }
  
  // Build query
  const query: any = {
    class: className,
    section: section
  };
  
  if (examType) {
    query.examType = examType;
  }
  
  // Get subject-wise performance
  const subjectPerformance = await MarkModel.aggregate([
    { $match: query },
    {
      $group: {
        _id: {
          subject: '$subject',
          examType: '$examType'
        },
        totalStudents: { $sum: 1 },
        totalMarks: { $sum: '$marks' },
        totalMaximum: { $sum: '$totalMarks' },
        highestMark: { $max: '$marks' },
        lowestMark: { $min: '$marks' }
      }
    },
    {
      $group: {
        _id: '$_id.subject',
        examTypes: {
          $push: {
            examType: '$_id.examType',
            totalStudents: '$totalStudents',
            totalMarks: '$totalMarks',
            totalMaximum: '$totalMaximum',
            highestMark: '$highestMark',
            lowestMark: '$lowestMark',
            averagePercentage: {
              $multiply: [
                { $divide: ['$totalMarks', '$totalMaximum'] },
                100
              ]
            }
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  // Get overall class statistics
  const overallStats = await MarkModel.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$studentId',
        totalMarks: { $sum: '$marks' },
        totalMaximum: { $sum: '$totalMarks' }
      }
    },
    {
      $addFields: {
        percentage: {
          $multiply: [
            { $divide: ['$totalMarks', '$totalMaximum'] },
            100
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        totalStudents: { $sum: 1 },
        averagePercentage: { $avg: '$percentage' },
        highestPercentage: { $max: '$percentage' },
        lowestPercentage: { $min: '$percentage' },
        below40: {
          $sum: { $cond: [{ $lt: ['$percentage', 40] }, 1, 0] }
        },
        between40And60: {
          $sum: { $cond: [{ $and: [{ $gte: ['$percentage', 40] }, { $lt: ['$percentage', 60] }] }, 1, 0] }
        },
        between60And80: {
          $sum: { $cond: [{ $and: [{ $gte: ['$percentage', 60] }, { $lt: ['$percentage', 80] }] }, 1, 0] }
        },
        above80: {
          $sum: { $cond: [{ $gte: ['$percentage', 80] }, 1, 0] }
        }
      }
    }
  ]);
  
  res.json({
    success: true,
    data: {
      subjects: subjectPerformance,
      classStats: overallStats.length > 0 ? overallStats[0] : {
        totalStudents: 0,
        averagePercentage: 0,
        highestPercentage: 0,
        lowestPercentage: 0,
        below40: 0,
        between40And60: 0,
        between60And80: 0,
        above80: 0
      }
    }
  });
});
