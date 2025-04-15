
import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentIssue extends Document {
  studentId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  category: 'academic' | 'technical' | 'facilities' | 'other';
  department?: string;
  assignedTo?: mongoose.Types.ObjectId;
  resolution?: string;
  attachments?: string[];
}

const studentIssueSchema = new Schema<IStudentIssue>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required']
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved', 'rejected'],
      default: 'pending'
    },
    category: {
      type: String,
      enum: ['academic', 'technical', 'facilities', 'other'],
      required: [true, 'Category is required']
    },
    department: {
      type: String
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    resolution: {
      type: String
    },
    attachments: {
      type: [String]
    }
  },
  {
    timestamps: true
  }
);

export const StudentIssueModel = mongoose.model<IStudentIssue>('StudentIssue', studentIssueSchema);
