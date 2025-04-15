
import { Request, Response } from 'express';
import { ReportCardModel } from '../models/reportCardModel';
import { StudentModel } from '../models/studentModel';
import { MarkModel } from '../models/markModel';
import { AttendanceModel } from '../models/attendanceModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';
import { z } from 'zod';
import mongoose from 'mongoose';

// Validate report card input
const reportCardSchema = z.object({
  studentId: z.string(),
  term: z.string(),
  academicYear: z.string()
});

// Calculate grade based on percentage
const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

// Generate report card
export const generateReportCard = asyncHandler(async (req: Request, res: Response) => {
  // Validate input
  const validatedData = reportCardSchema.parse(req.body);
  
  // Check if student exists
  const student = await StudentModel.findById(validatedData.studentId).populate({
    path: 'userId',
    select: 'name'
  });
  
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  
  // Check if report card already exists
  const existingReportCard = await ReportCardModel.findOne({
    studentId: validatedData.studentId,
    term: validatedData.term,
    academicYear: validatedData.academicYear
  });
  
  if (existingReportCard) {
    throw new ApiError(400, 'Report card already exists for this student, term and academic year');
  }
  
  // Get marks for all subjects
  const marks = await MarkModel.find({
    studentId: validatedData.studentId,
    examType: 'final' // Assuming we use final exams for report cards
  });
  
  if (marks.length === 0) {
    throw new ApiError(400, 'No marks found for this student');
  }
  
  // Calculate total marks and percentage
  let totalObtainedMarks = 0;
  let totalMarks = 0;
  
  const subjectsData = marks.map(mark => {
    totalObtainedMarks += mark.marks;
    totalMarks += mark.totalMarks;
    
    const percentage = Math.round((mark.marks / mark.totalMarks) * 100);
    const grade = calculateGrade(percentage);
    
    return {
      name: mark.subject,
      marks: mark.marks,
      totalMarks: mark.totalMarks,
      grade,
      remarks: mark.remarks
    };
  });
  
  const percentage = Math.round((totalObtainedMarks / totalMarks) * 100);
  const grade = calculateGrade(percentage);
  
  // Get attendance data
  const attendanceData = await AttendanceModel.aggregate([
    {
      $match: {
        studentId: new mongoose.Types.ObjectId(validatedData.studentId)
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const totalClasses = attendanceData.reduce((sum, item) => sum + item.count, 0);
  const attendedClasses = attendanceData.find(item => item._id === 'present')?.count || 0;
  const attendancePercentage = totalClasses > 0
    ? Math.round((attendedClasses / totalClasses) * 100)
    : 0;
  
  // Create report card
  const reportCard = await ReportCardModel.create({
    studentId: validatedData.studentId,
    term: validatedData.term,
    academicYear: validatedData.academicYear,
    class: student.class,
    section: student.section,
    subjects: subjectsData,
    totalMarks,
    totalObtainedMarks,
    percentage,
    grade,
    attendance: {
      totalClasses,
      attended: attendedClasses,
      percentage: attendancePercentage
    },
    generatedBy: req.user._id,
    generatedDate: new Date()
  });
  
  res.status(201).json({
    success: true,
    message: 'Report card generated successfully',
    data: reportCard
  });
});

// Get report cards
export const getReportCards = asyncHandler(async (req: Request, res: Response) => {
  // Extract query parameters
  const { 
    studentId, 
    term, 
    academicYear, 
    class: className, 
    section 
  } = req.query;
  
  // Build query
  const query: any = {};
  
  if (studentId) query.studentId = studentId;
  if (term) query.term = term;
  if (academicYear) query.academicYear = academicYear;
  if (className) query.class = className;
  if (section) query.section = section;
  
  // Execute query
  const reportCards = await ReportCardModel.find(query)
    .populate({
      path: 'studentId',
      select: 'rollNumber',
      populate: {
        path: 'userId',
        select: 'name'
      }
    })
    .populate({
      path: 'generatedBy',
      select: 'name'
    })
    .sort({ generatedDate: -1 });
  
  res.json({
    success: true,
    count: reportCards.length,
    data: reportCards
  });
});

// Get report card by ID
export const getReportCardById = asyncHandler(async (req: Request, res: Response) => {
  const reportCard = await ReportCardModel.findById(req.params.id)
    .populate({
      path: 'studentId',
      select: 'rollNumber',
      populate: {
        path: 'userId',
        select: 'name'
      }
    })
    .populate({
      path: 'generatedBy',
      select: 'name'
    });
  
  if (reportCard) {
    res.json({
      success: true,
      data: reportCard
    });
  } else {
    throw new ApiError(404, 'Report card not found');
  }
});

// Update report card remarks
export const updateReportCardRemarks = asyncHandler(async (req: Request, res: Response) => {
  const { teacherRemarks } = req.body;
  
  if (!teacherRemarks) {
    throw new ApiError(400, 'Teacher remarks are required');
  }
  
  const reportCard = await ReportCardModel.findById(req.params.id);
  
  if (!reportCard) {
    throw new ApiError(404, 'Report card not found');
  }
  
  reportCard.teacherRemarks = teacherRemarks;
  const updatedReportCard = await reportCard.save();
  
  res.json({
    success: true,
    message: 'Report card remarks updated successfully',
    data: updatedReportCard
  });
});
