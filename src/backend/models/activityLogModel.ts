
import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  details: string;
  ip: string;
  userAgent: string;
  module: string;
  resourceId?: string;
  resourceType?: string;
  collegeId: string;
  status: 'success' | 'failure';
  metadata?: {
    [key: string]: any;
  };
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      enum: ['login', 'logout', 'create', 'update', 'delete', 'view', 'download', 'upload', 'other']
    },
    details: {
      type: String,
      required: [true, 'Details are required']
    },
    ip: {
      type: String,
      required: [true, 'IP address is required']
    },
    userAgent: {
      type: String,
      required: [true, 'User agent is required']
    },
    module: {
      type: String,
      required: [true, 'Module is required'],
      enum: ['auth', 'users', 'students', 'teachers', 'parents', 'attendance', 'marks', 'reports', 'documents', 'certificates', 'other']
    },
    resourceId: {
      type: String
    },
    resourceType: {
      type: String
    },
    collegeId: {
      type: String,
      required: [true, 'College ID is required'],
      index: true
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      required: true
    },
    metadata: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for better query performance
activityLogSchema.index({ userId: 1 });
activityLogSchema.index({ action: 1, module: 1, collegeId: 1 });
activityLogSchema.index({ createdAt: -1, collegeId: 1 });

export const ActivityLogModel = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
