
import mongoose, { Schema, Document } from 'mongoose';

export interface IReportCard extends Document {
  studentId: mongoose.Types.ObjectId;
  term: string;
  academicYear: string;
  class: string;
  section: string;
  subjects: {
    name: string;
    marks: number;
    totalMarks: number;
    grade: string;
    remarks?: string;
  }[];
  totalMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  grade: string;
  attendance: {
    totalClasses: number;
    attended: number;
    percentage: number;
  };
  teacherRemarks?: string;
  generatedBy: mongoose.Types.ObjectId;
  generatedDate: Date;
}

const reportCardSchema = new Schema<IReportCard>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required']
    },
    term: {
      type: String,
      required: [true, 'Term is required']
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required']
    },
    class: {
      type: String,
      required: [true, 'Class is required']
    },
    section: {
      type: String,
      required: [true, 'Section is required']
    },
    subjects: [
      {
        name: {
          type: String,
          required: [true, 'Subject name is required']
        },
        marks: {
          type: Number,
          required: [true, 'Marks are required']
        },
        totalMarks: {
          type: Number,
          required: [true, 'Total marks are required']
        },
        grade: {
          type: String,
          required: [true, 'Grade is required']
        },
        remarks: {
          type: String
        }
      }
    ],
    totalMarks: {
      type: Number,
      required: [true, 'Total marks are required']
    },
    totalObtainedMarks: {
      type: Number,
      required: [true, 'Total obtained marks are required']
    },
    percentage: {
      type: Number,
      required: [true, 'Percentage is required']
    },
    grade: {
      type: String,
      required: [true, 'Grade is required']
    },
    attendance: {
      totalClasses: {
        type: Number,
        required: [true, 'Total classes are required']
      },
      attended: {
        type: Number,
        required: [true, 'Attended classes are required']
      },
      percentage: {
        type: Number,
        required: [true, 'Attendance percentage is required']
      }
    },
    teacherRemarks: {
      type: String
    },
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Generator ID is required']
    },
    generatedDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure unique report card per student per term per academic year
reportCardSchema.index(
  { studentId: 1, term: 1, academicYear: 1 },
  { unique: true }
);

export const ReportCardModel = mongoose.model<IReportCard>('ReportCard', reportCardSchema);
