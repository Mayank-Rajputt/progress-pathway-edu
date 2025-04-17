
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
  teacherIds: mongoose.Types.ObjectId[];
  subjects: string[];
  collegeId: string;
  documents: {
    type: string;
    name: string;
    url: string;
    uploadDate: Date;
  }[];
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
    },
    teacherIds: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    subjects: [{
      type: String
    }],
    collegeId: {
      type: String,
      required: [true, 'College ID is required'],
      index: true
    },
    documents: [{
      type: {
        type: String,
        enum: ['marksheet', 'id_card', 'transfer_certificate', 'other'],
        required: true
      },
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }]
  },
  {
    timestamps: true
  }
);

// Add compound indexes for better query performance
studentSchema.index({ class: 1, section: 1, collegeId: 1 });
studentSchema.index({ department: 1, collegeId: 1 });
studentSchema.index({ teacherIds: 1 });

export const StudentModel = mongoose.model<IStudent>('Student', studentSchema);
