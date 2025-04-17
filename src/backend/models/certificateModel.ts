
import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  type: string;
  title: string;
  description: string;
  issuedDate: Date;
  issuedTo: mongoose.Types.ObjectId;
  issuedBy: mongoose.Types.ObjectId;
  certificateNumber: string;
  templateId: string;
  collegeId: string;
  fileUrl: string;
  metadata: {
    [key: string]: any;
  };
  signature: {
    name: string;
    designation: string;
    imageUrl: string;
  };
}

const certificateSchema = new Schema<ICertificate>(
  {
    type: {
      type: String,
      enum: ['participation', 'completion', 'achievement', 'appreciation', 'other'],
      required: [true, 'Certificate type is required']
    },
    title: {
      type: String,
      required: [true, 'Certificate title is required']
    },
    description: {
      type: String,
      required: [true, 'Certificate description is required']
    },
    issuedDate: {
      type: Date,
      required: [true, 'Issue date is required'],
      default: Date.now
    },
    issuedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required']
    },
    issuedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Issuer is required']
    },
    certificateNumber: {
      type: String,
      required: [true, 'Certificate number is required'],
      unique: true
    },
    templateId: {
      type: String,
      required: [true, 'Template ID is required']
    },
    collegeId: {
      type: String,
      required: [true, 'College ID is required'],
      index: true
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required']
    },
    metadata: {
      type: Schema.Types.Mixed
    },
    signature: {
      name: {
        type: String,
        required: true
      },
      designation: {
        type: String,
        required: true
      },
      imageUrl: {
        type: String
      }
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for better query performance
certificateSchema.index({ issuedTo: 1, collegeId: 1 });
certificateSchema.index({ type: 1, issuedDate: -1, collegeId: 1 });

export const CertificateModel = mongoose.model<ICertificate>('Certificate', certificateSchema);
