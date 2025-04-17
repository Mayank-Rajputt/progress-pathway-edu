
import mongoose, { Schema, Document } from 'mongoose';

export interface IParent extends Document {
  userId: mongoose.Types.ObjectId;
  studentIds: mongoose.Types.ObjectId[];
  relationship: string;
  occupation?: string;
  alternatePhone?: string;
  address?: string;
  collegeId: string;
}

const parentSchema = new Schema<IParent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    studentIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'At least one student must be linked']
    }],
    relationship: {
      type: String,
      enum: ['father', 'mother', 'guardian', 'other'],
      required: [true, 'Relationship is required']
    },
    occupation: {
      type: String
    },
    alternatePhone: {
      type: String
    },
    address: {
      type: String
    },
    collegeId: {
      type: String,
      required: [true, 'College ID is required'],
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for better query performance
parentSchema.index({ userId: 1 });
parentSchema.index({ studentIds: 1 });
parentSchema.index({ collegeId: 1 });

export const ParentModel = mongoose.model<IParent>('Parent', parentSchema);
