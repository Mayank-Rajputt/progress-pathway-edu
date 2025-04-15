
import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacherAttendance extends Document {
  teacherId: mongoose.Types.ObjectId;
  date: Date;
  status: 'present' | 'absent';
  markedBy: mongoose.Types.ObjectId;
  department?: string;
  remarks?: string;
}

const teacherAttendanceSchema = new Schema<ITeacherAttendance>(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher ID is required']
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    status: {
      type: String,
      enum: ['present', 'absent'],
      required: [true, 'Status is required']
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Marked by user ID is required']
    },
    department: {
      type: String
    },
    remarks: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Create a compound index to prevent duplicate entries
teacherAttendanceSchema.index({ teacherId: 1, date: 1 }, { unique: true });

export const TeacherAttendanceModel = mongoose.model<ITeacherAttendance>('TeacherAttendance', teacherAttendanceSchema);
