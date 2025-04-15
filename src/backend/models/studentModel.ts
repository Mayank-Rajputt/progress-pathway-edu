
import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  rollNumber: string;
  class: string;
  section: string;
  department: string;
  dateOfBirth: Date;
  parentId: mongoose.Types.ObjectId;
  contactNumber: string;
  address: string;
  populate?: any; // Add this to fix TypeScript errors
}

const studentSchema = new Schema<IStudent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true
    },
    class: {
      type: String,
      required: [true, 'Class is required']
    },
    section: {
      type: String,
      required: [true, 'Section is required']
    },
    department: {
      type: String,
      required: [true, 'Department is required']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    contactNumber: {
      type: String
    },
    address: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const StudentModel = mongoose.model<IStudent>('Student', studentSchema);
