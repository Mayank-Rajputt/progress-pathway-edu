
import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  studentId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  academicYear: string;
  term: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  examType: string;
  examDate: Date;
  collegeId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required']
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject ID is required']
    },
    academicYear: {
      type: String,
      required: [true, 'Academic Year is required']
    },
    term: {
      type: String,
      required: [true, 'Term is required']
    },
    marks: {
      type: Number,
      required: [true, 'Marks are required']
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total Marks are required']
    },
    percentage: {
      type: Number,
      required: [true, 'Percentage is required']
    },
    grade: {
      type: String,
      required: [true, 'Grade is required']
    },
    examType: {
      type: String,
      required: [true, 'Exam Type is required']
    },
    examDate: {
      type: Date,
      required: [true, 'Exam Date is required']
    },
    collegeId: {
      type: Schema.Types.ObjectId,
      ref: 'College'
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
analyticsSchema.index({ studentId: 1, subjectId: 1, academicYear: 1 });

export const AnalyticsModel = mongoose.model<IAnalytics>('Analytics', analyticsSchema);
