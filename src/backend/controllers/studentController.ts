
import { Request, Response } from 'express';
import { StudentModel } from '../models/studentModel';
import { UserModel } from '../models/userModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';
import { z } from 'zod';
import mongoose from 'mongoose';

// Validate student input
const studentSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  class: z.string().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format'
  }),
  parentId: z.string().optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
});

// Create student
export const createStudent = asyncHandler(async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Validate input
    const validatedData = studentSchema.parse(req.body);
    
    // Check if student with the same roll number already exists
    const studentExists = await StudentModel.findOne({ rollNumber: validatedData.rollNumber });
    
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
        role: 'student'
      });
      
      userId = user._id.toString();
    }
    
    // Create student profile
    const student = await StudentModel.create({
      userId,
      rollNumber: validatedData.rollNumber,
      class: validatedData.class,
      section: validatedData.section,
      dateOfBirth: new Date(validatedData.dateOfBirth),
      parentId: validatedData.parentId,
      contactNumber: validatedData.contactNumber,
      address: validatedData.address
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
  const { class: className, section } = req.query;
  
  // Build query
  const query: any = {};
  if (className) query.class = className;
  if (section) query.section = section;
  
  // Find students
  const students = await StudentModel.find(query).populate({
    path: 'userId',
    select: 'name email profileImage'
  });
  
  res.json({
    success: true,
    count: students.length,
    data: students
  });
});

// Get student by ID
export const getStudentById = asyncHandler(async (req: Request, res: Response) => {
  const student = await StudentModel.findById(req.params.id).populate({
    path: 'userId',
    select: 'name email profileImage'
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
  const student = await StudentModel.findById(req.params.id);
  
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  
  // Update student fields
  if (validatedData.rollNumber) student.rollNumber = validatedData.rollNumber;
  if (validatedData.class) student.class = validatedData.class;
  if (validatedData.section) student.section = validatedData.section;
  if (validatedData.dateOfBirth) student.dateOfBirth = new Date(validatedData.dateOfBirth);
  if (validatedData.parentId) student.parentId = new mongoose.Types.ObjectId(validatedData.parentId);
  if (validatedData.contactNumber) student.contactNumber = validatedData.contactNumber;
  if (validatedData.address) student.address = validatedData.address;
  
  // Update user if name or email changed
  if (validatedData.name || validatedData.email) {
    const user = await UserModel.findById(student.userId);
    
    if (user) {
      if (validatedData.name) user.name = validatedData.name;
      if (validatedData.email) user.email = validatedData.email;
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
    const student = await StudentModel.findById(req.params.id);
    
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
