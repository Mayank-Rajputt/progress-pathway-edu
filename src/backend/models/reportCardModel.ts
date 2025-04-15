
import mongoose, { Schema, Document } from 'mongoose';

interface ISubject {
  name: string;
  marks: number;
  totalMarks: number;
  grade: string;
  remarks?: string;
}

interface IAttendance {
  totalClasses: number;
  attended: number;
  percentage: number;
}

export interface IReportCard extends Document {
  studentId: mongoose.Types.ObjectId;
  term: string;
  academicYear: string;
  class: string;
  section: string;
  department?: string;
  subjects: ISubject[];
  totalMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  grade: string;
  attendance: IAttendance;
  teacherRemarks?: string;
  generatedBy: mongoose.Types.ObjectId;
  generatedDate: Date;
}

const reportCardSchema = new Schema<IReportCard>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  term: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  department: {
    type: String
  },
  subjects: [
    {
      name: {
        type: String,
        required: true
      },
      marks: {
        type: Number,
        required: true
      },
      totalMarks: {
        type: Number,
        required: true
      },
      grade: {
        type: String,
        required: true
      },
      remarks: {
        type: String
      }
    }
  ],
  totalMarks: {
    type: Number,
    required: true
  },
  totalObtainedMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  attendance: {
    totalClasses: {
      type: Number,
      required: true
    },
    attended: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    }
  },
  teacherRemarks: {
    type: String
  },
  generatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  generatedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure unique report card
reportCardSchema.index(
  { studentId: 1, term: 1, academicYear: 1 },
  { unique: true }
);

export const ReportCardModel = mongoose.model<IReportCard>('ReportCard', reportCardSchema);
