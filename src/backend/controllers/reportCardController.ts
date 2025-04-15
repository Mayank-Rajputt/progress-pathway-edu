
import { Request, Response } from 'express';
import { ReportCardModel, IReportCard } from '../models/reportCardModel';
import { StudentModel } from '../models/studentModel';
import { MarkModel } from '../models/markModel';
import { AttendanceModel } from '../models/attendanceModel';
import { UserModel } from '../models/userModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';
import { z } from 'zod';
import mongoose from 'mongoose';
import { generateReportCardPDF } from '../utils/pdfGenerator';
import path from 'path';

// Validate report card input
const reportCardSchema = z.object({
  studentId: z.string(),
  term: z.string(),
  academicYear: z.string(),
  department: z.string().optional()
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
  
  // Check department access for department admins
  if (req.user.role === 'department_admin' && 
      req.user.department && 
      student.department !== req.user.department) {
    throw new ApiError(403, 'You do not have access to students from other departments');
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
    department: student.department,
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
    section,
    department
  } = req.query;
  
  // Build query
  const query: any = {};
  
  if (studentId) query.studentId = studentId;
  if (term) query.term = term;
  if (academicYear) query.academicYear = academicYear;
  if (className) query.class = className;
  if (section) query.section = section;
  
  // Apply department filter for department admins
  if (req.user.role === 'department_admin' && req.user.department) {
    query.department = req.user.department;
  } 
  // If department is specified and user is authorized
  else if (department && ['admin', 'department_admin'].includes(req.user.role)) {
    query.department = department;
  }
  
  // For students, only show their own report cards
  if (req.user.role === 'student') {
    const student = await StudentModel.findOne({ userId: req.user._id });
    if (student) {
      query.studentId = student._id;
    } else {
      throw new ApiError(404, 'Student profile not found');
    }
  }
  
  // For parents, only show their children's report cards
  if (req.user.role === 'parent') {
    const children = await StudentModel.find({ parentId: req.user._id });
    if (children.length > 0) {
      query.studentId = { $in: children.map(child => child._id) };
    } else {
      throw new ApiError(404, 'No children found');
    }
  }
  
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
  
  if (!reportCard) {
    throw new ApiError(404, 'Report card not found');
  }
  
  // Check access permissions
  if (req.user.role === 'student') {
    const student = await StudentModel.findOne({ userId: req.user._id });
    if (!student || student._id.toString() !== reportCard.studentId.toString()) {
      throw new ApiError(403, 'You do not have permission to view this report card');
    }
  }
  
  if (req.user.role === 'parent') {
    const children = await StudentModel.find({ parentId: req.user._id });
    const childIds = children.map(child => child._id.toString());
    if (!childIds.includes(reportCard.studentId.toString())) {
      throw new ApiError(403, 'You do not have permission to view this report card');
    }
  }
  
  // Check department access for department admins
  if (req.user.role === 'department_admin' && 
      req.user.department && 
      reportCard.department !== req.user.department) {
    throw new ApiError(403, 'You do not have access to report cards from other departments');
  }
  
  res.json({
    success: true,
    data: reportCard
  });
});

// Download report card as PDF
export const downloadReportCardPDF = asyncHandler(async (req: Request, res: Response) => {
  const reportCard = await ReportCardModel.findById(req.params.id)
    .populate({
      path: 'studentId',
      select: 'rollNumber userId',
      populate: {
        path: 'userId',
        select: 'name'
      }
    });
  
  if (!reportCard) {
    throw new ApiError(404, 'Report card not found');
  }
  
  // Check access permissions
  if (req.user.role === 'student') {
    const student = await StudentModel.findOne({ userId: req.user._id });
    if (!student || student._id.toString() !== reportCard.studentId.toString()) {
      throw new ApiError(403, 'You do not have permission to download this report card');
    }
  }
  
  if (req.user.role === 'parent') {
    const children = await StudentModel.find({ parentId: req.user._id });
    const childIds = children.map(child => child._id.toString());
    if (!childIds.includes(reportCard.studentId.toString())) {
      throw new ApiError(403, 'You do not have permission to download this report card');
    }
  }
  
  // Check department access for department admins
  if (req.user.role === 'department_admin' && 
      req.user.department && 
      reportCard.department !== req.user.department) {
    throw new ApiError(403, 'You do not have access to report cards from other departments');
  }
  
  try {
    // Get student name
    const studentUser = await UserModel.findById((reportCard.studentId as any).userId);
    const studentName = studentUser ? studentUser.name : 'Unknown Student';
    
    // Generate PDF
    const pdfPath = await generateReportCardPDF(reportCard as unknown as IReportCard, studentName);
    
    // Set response headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report_card_${reportCard._id}.pdf`);
    
    // Send the file
    res.sendFile(pdfPath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new ApiError(500, 'Failed to generate PDF report card');
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
  
  // Check department access for department admins
  if (req.user.role === 'department_admin' && 
      req.user.department && 
      reportCard.department !== req.user.department) {
    throw new ApiError(403, 'You do not have access to report cards from other departments');
  }
  
  reportCard.teacherRemarks = teacherRemarks;
  const updatedReportCard = await reportCard.save();
  
  res.json({
    success: true,
    message: 'Report card remarks updated successfully',
    data: updatedReportCard
  });
});
