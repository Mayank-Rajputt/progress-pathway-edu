
import mongoose, { Schema, Document } from 'mongoose';

export interface ICollege extends Document {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
  established?: Date;
  mainAdminId: mongoose.Types.ObjectId;
  subscription: {
    plan: string;
    startDate: Date;
    endDate: Date;
    status: string;
  };
  settings: {
    theme: string;
    enabledModules: string[];
    customFields: {
      name: string;
      type: string;
      required: boolean;
    }[];
  };
}

const collegeSchema = new Schema<ICollege>(
  {
    name: {
      type: String,
      required: [true, 'College name is required'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'College code is required'],
      unique: true,
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    website: {
      type: String
    },
    logoUrl: {
      type: String
    },
    established: {
      type: Date
    },
    mainAdminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Main admin ID is required']
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'basic', 'premium', 'enterprise'],
        default: 'free'
      },
      startDate: {
        type: Date,
        default: Date.now
      },
      endDate: {
        type: Date,
        required: true
      },
      status: {
        type: String,
        enum: ['active', 'expired', 'canceled', 'pending'],
        default: 'active'
      }
    },
    settings: {
      theme: {
        type: String,
        default: 'light'
      },
      enabledModules: [{
        type: String,
        enum: ['attendance', 'marks', 'reports', 'events', 'timetable', 'documents', 'communication']
      }],
      customFields: [{
        name: String,
        type: {
          type: String,
          enum: ['text', 'number', 'date', 'select', 'checkbox']
        },
        required: Boolean
      }]
    }
  },
  {
    timestamps: true
  }
);

export const CollegeModel = mongoose.model<ICollege>('College', collegeSchema);
