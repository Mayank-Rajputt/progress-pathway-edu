
import { Request, Response } from 'express';
import { StudentModel } from '../models/studentModel';
import { UserModel } from '../models/userModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';
import { z } from 'zod';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

// Validate student input
const studentSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  class: z.string().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),
  department: z.string().min(1, 'Department is required'),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format'
  }),
  parentId: z.string().optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  teacherIds: z.array(z.string()).optional(),
  subjects: z.array(z.string()).optional(),
  collegeId: z.string().optional(),
});

// Create student
export const createStudent = asyncHandler(async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Validate input
    const validatedData = studentSchema.parse(req.body);
    
    // Set collegeId from request
    const collegeId = req.collegeId;
    
    // Check if student with the same roll number already exists
    const studentExists = await StudentModel.findOne({ 
      rollNumber: validatedData.rollNumber,
      collegeId
    });
    
    if (studentExists) {
      throw new ApiError(400, 'Student with this roll number already exists');
    }
    
    // Create user first (if not provided)
    let userId = validatedData.userId;
    
    if (!userId) {
      // Check if email already exists
      const userExists = await UserModel.findOne({ email: validatedData.email });
      
      if (userExists) {
        throw new ApiError(400, 'User with this email already exists');
      }
      
      // Create new user with student role
      const user = await UserModel.create({
        name: validatedData.name,
        email: validatedData.email,
        password: 'student123', // Default password, should be changed on first login
        role: 'student',
        collegeId,
        department: validatedData.department
      });
      
      userId = user._id.toString();
    }
    
    // Create student profile
    const student = await StudentModel.create({
      userId,
      rollNumber: validatedData.rollNumber,
      class: validatedData.class,
      section: validatedData.section,
      department: validatedData.department,
      dateOfBirth: new Date(validatedData.dateOfBirth),
      parentId: validatedData.parentId,
      contactNumber: validatedData.contactNumber,
      address: validatedData.address,
      teacherIds: validatedData.teacherIds || [],
      subjects: validatedData.subjects || [],
      collegeId,
      documents: []
    });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

// Get all students
export const getStudents = asyncHandler(async (req: Request, res: Response) => {
  // Extract query parameters
  const { 
    class: className, 
    section, 
    department,
    teacherId,
    search,
    page = 1,
    limit = 20
  } = req.query;
  
  // Build query
  const query: any = { collegeId: req.collegeId };
  if (className) query.class = className;
  if (section) query.section = section;
  if (department) query.department = department;
  if (teacherId) query.teacherIds = teacherId;
  
  // Search by name or roll number (requires join with user)
  if (search) {
    // Get user ids that match the search term
    const users = await UserModel.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ],
      collegeId: req.collegeId,
      role: 'student'
    }).select('_id');
    
    const userIds = users.map(user => user._id);
    
    // Add to query
    query.$or = [
      { rollNumber: { $regex: search, $options: 'i' } },
      { userId: { $in: userIds } }
    ];
  }
  
  // For teachers, only show students they teach
  if (req.user.role === 'teacher') {
    // Get the teacher record
    const { TeacherModel } = require('../models/teacherModel');
    const teacher = await TeacherModel.findOne({ userId: req.user._id });
    
    if (teacher) {
      // Add class/section filter based on teacher's classes
      if (!className && !section) {
        const classQueries = teacher.classes.map(c => ({
          class: c.class,
          section: c.section
        }));
        
        if (classQueries.length > 0) {
          // If we already have an $or query for search, we need to use $and
          if (query.$or) {
            query.$and = [
              { $or: query.$or },
              { $or: classQueries }
            ];
            delete query.$or;
          } else {
            query.$or = classQueries;
          }
        }
      }
    }
  }
  
  // Count total documents for pagination
  const totalDocs = await StudentModel.countDocuments(query);
  
  // Calculate pagination
  const skip = (Number(page) - 1) * Number(limit);
  
  // Find students with pagination
  const students = await StudentModel.find(query)
    .populate({
      path: 'userId',
      select: 'name email profileImage'
    })
    .populate({
      path: 'parentId',
      select: 'name email phoneNumber'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  
  res.json({
    success: true,
    count: students.length,
    totalPages: Math.ceil(totalDocs / Number(limit)),
    currentPage: Number(page),
    data: students
  });
});

// Get student by ID
export const getStudentById = asyncHandler(async (req: Request, res: Response) => {
  const student = await StudentModel.findOne({
    _id: req.params.id,
    collegeId: req.collegeId
  }).populate({
    path: 'userId',
    select: 'name email profileImage'
  }).populate({
    path: 'parentId',
    select: 'name email phoneNumber'
  }).populate({
    path: 'teacherIds',
    select: 'name email'
  });
  
  if (student) {
    res.json({
      success: true,
      data: student
    });
  } else {
    throw new ApiError(404, 'Student not found');
  }
});

// Update student
export const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  // Validate input (partial schema)
  const partialStudentSchema = studentSchema.partial();
  const validatedData = partialStudentSchema.parse(req.body);
  
  // Find student
  const student = await StudentModel.findOne({
    _id: req.params.id,
    collegeId: req.collegeId
  });
  
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  
  // Update student fields
  if (validatedData.rollNumber) student.rollNumber = validatedData.rollNumber;
  if (validatedData.class) student.class = validatedData.class;
  if (validatedData.section) student.section = validatedData.section;
  if (validatedData.department) student.department = validatedData.department;
  if (validatedData.dateOfBirth) student.dateOfBirth = new Date(validatedData.dateOfBirth);
  if (validatedData.parentId) student.parentId = new mongoose.Types.ObjectId(validatedData.parentId);
  if (validatedData.contactNumber) student.contactNumber = validatedData.contactNumber;
  if (validatedData.address) student.address = validatedData.address;
  if (validatedData.teacherIds) student.teacherIds = validatedData.teacherIds.map(id => new mongoose.Types.ObjectId(id));
  if (validatedData.subjects) student.subjects = validatedData.subjects;
  
  // Update user if name or email changed
  if (validatedData.name || validatedData.email) {
    const user = await UserModel.findById(student.userId);
    
    if (user) {
      if (validatedData.name) user.name = validatedData.name;
      if (validatedData.email) user.email = validatedData.email;
      if (validatedData.department) user.department = validatedData.department;
      await user.save();
    }
  }
  
  // Save student
  const updatedStudent = await student.save();
  
  res.json({
    success: true,
    data: updatedStudent
  });
});

// Delete student
export const deleteStudent = asyncHandler(async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Find student
    const student = await StudentModel.findOne({
      _id: req.params.id,
      collegeId: req.collegeId
    });
    
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }
    
    // Delete student
    await StudentModel.findByIdAndDelete(req.params.id);
    
    // Optionally delete user account as well
    if (req.query.deleteUser === 'true') {
      await UserModel.findByIdAndDelete(student.userId);
    }
    
    await session.commitTransaction();
    session.endSession();
    
    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

// Upload document for student
export const uploadDocument = asyncHandler(async (req: Request, res: Response) => {
  // Check if document was uploaded
  if (!req.file) {
    throw new ApiError(400, 'No document uploaded');
  }
  
  // Validate document type
  const { type, name } = req.body;
  if (!type || !['marksheet', 'id_card', 'transfer_certificate', 'other'].includes(type)) {
    throw new ApiError(400, 'Invalid document type');
  }
  
  // Find student
  const student = await StudentModel.findOne({
    _id: req.params.id,
    collegeId: req.collegeId
  });
  
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  
  // For students, ensure they can only upload their own documents
  if (req.user.role === 'student' && student.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to upload documents for this student');
  }
  
  // File URL
  const fileUrl = `/api/uploads/documents/${req.file.filename}`;
  
  // Add document to student
  student.documents = student.documents || [];
  student.documents.push({
    type,
    name: name || req.file.originalname,
    url: fileUrl,
    uploadDate: new Date()
  });
  
  // Save student
  await student.save();
  
  res.status(201).json({
    success: true,
    data: {
      documentId: student.documents[student.documents.length - 1]._id,
      type,
      name: name || req.file.originalname,
      url: fileUrl,
      uploadDate: new Date()
    }
  });
});

// Get documents for student
export const getStudentDocuments = asyncHandler(async (req: Request, res: Response) => {
  // Find student
  const student = await StudentModel.findOne({
    _id: req.params.id,
    collegeId: req.collegeId
  });
  
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  
  // For students, ensure they can only view their own documents
  if (req.user.role === 'student' && student.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to view documents for this student');
  }
  
  // For parents, ensure they can only view documents for their children
  if (req.user.role === 'parent') {
    const { ParentModel } = require('../models/parentModel');
    const parent = await ParentModel.findOne({ userId: req.user._id });
    if (!parent || !parent.studentIds.includes(student._id)) {
      throw new ApiError(403, 'Not authorized to view documents for this student');
    }
  }
  
  res.json({
    success: true,
    count: student.documents?.length || 0,
    data: student.documents || []
  });
});

// Delete document
export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
  // Find student
  const student = await StudentModel.findOne({
    _id: req.params.id,
    collegeId: req.collegeId
  });
  
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  
  // Find document
  const documentId = req.params.documentId;
  const documentIndex = student.documents.findIndex(doc => doc._id.toString() === documentId);
  
  if (documentIndex === -1) {
    throw new ApiError(404, 'Document not found');
  }
  
  // Get document info
  const document = student.documents[documentIndex];
  
  // Remove file if it exists
  const filePath = path.join(
    __dirname, 
    '..', 
    'uploads', 
    document.url.replace('/api/uploads/', '')
  );
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  
  // Remove document from array
  student.documents.splice(documentIndex, 1);
  
  // Save student
  await student.save();
  
  res.json({
    success: true,
    message: 'Document deleted successfully'
  });
});
