
import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'late';
  class: string;
  section: string;
  markedBy: mongoose.Types.ObjectId;
  remarks?: string;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required']
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      required: [true, 'Status is required']
    },
    class: {
      type: String,
      required: [true, 'Class is required']
    },
    section: {
      type: String,
      required: [true, 'Section is required']
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Marker ID is required']
    },
    remarks: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure unique attendance per student per day
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export const AttendanceModel = mongoose.model<IAttendance>('Attendance', attendanceSchema);
