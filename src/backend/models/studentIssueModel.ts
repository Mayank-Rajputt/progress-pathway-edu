
import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentIssue extends Document {
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: 'academic' | 'administrative' | 'technical' | 'facilities' | 'other';
  submittedBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  resolution?: string;
  attachmentUrl?: string;
  comments: Array<{
    text: string;
    user: mongoose.Types.ObjectId;
    timestamp: Date;
  }>;
}

const studentIssueSchema = new Schema<IStudentIssue>(
  {
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
      enum: ['pending', 'in_progress', 'resolved', 'closed'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    category: {
      type: String,
      enum: ['academic', 'administrative', 'technical', 'facilities', 'other'],
      required: [true, 'Category is required']
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required']
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    resolution: {
      type: String
    },
    attachmentUrl: {
      type: String
    },
    comments: [{
      text: {
        type: String,
        required: true
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  {
    timestamps: true
  }
);

export const StudentIssueModel = mongoose.model<IStudentIssue>('StudentIssue', studentIssueSchema);
