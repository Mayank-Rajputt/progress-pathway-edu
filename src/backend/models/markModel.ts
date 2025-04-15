
import mongoose, { Schema, Document } from 'mongoose';

export interface IMark extends Document {
  studentId: mongoose.Types.ObjectId;
  subject: string;
  marks: number;
  totalMarks: number;
  examType: 'test' | 'assignment' | 'midterm' | 'final';
  class: string;
  section: string;
  date: Date;
  recordedBy: mongoose.Types.ObjectId;
  remarks?: string;
}

const markSchema = new Schema<IMark>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required']
    },
    subject: {
      type: String,
      required: [true, 'Subject is required']
    },
    marks: {
      type: Number,
      required: [true, 'Marks are required'],
      min: [0, 'Marks cannot be negative']
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks are required'],
      min: [1, 'Total marks must be at least 1']
    },
    examType: {
      type: String,
      enum: ['test', 'assignment', 'midterm', 'final'],
      required: [true, 'Exam type is required']
    },
    class: {
      type: String,
      required: [true, 'Class is required']
    },
    section: {
      type: String,
      required: [true, 'Section is required']
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recorder ID is required']
    },
    remarks: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const MarkModel = mongoose.model<IMark>('Mark', markSchema);
