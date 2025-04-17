
import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  userId: mongoose.Types.ObjectId;
  employeeId: string;
  qualification: string;
  subjects: string[];
  classes: {
    class: string;
    section: string;
  }[];
  designation: string;
  joiningDate: Date;
  department: string;
  collegeId: string;
  isClassTeacher: boolean;
  classTeacherFor?: {
    class: string;
    section: string;
  };
}

const teacherSchema = new Schema<ITeacher>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required']
    },
    subjects: [{
      type: String,
      required: [true, 'At least one subject is required']
    }],
    classes: [{
      class: {
        type: String,
        required: true
      },
      section: {
        type: String,
        required: true
      }
    }],
    designation: {
      type: String,
      required: [true, 'Designation is required']
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required']
    },
    department: {
      type: String,
      required: [true, 'Department is required']
    },
    collegeId: {
      type: String,
      required: [true, 'College ID is required'],
      index: true
    },
    isClassTeacher: {
      type: Boolean,
      default: false
    },
    classTeacherFor: {
      class: String,
      section: String
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for better query performance
teacherSchema.index({ userId: 1 });
teacherSchema.index({ department: 1, collegeId: 1 });
teacherSchema.index({ subjects: 1, collegeId: 1 });
teacherSchema.index({ 'classes.class': 1, 'classes.section': 1, collegeId: 1 });

export const TeacherModel = mongoose.model<ITeacher>('Teacher', teacherSchema);
