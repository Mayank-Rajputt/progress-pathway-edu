
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'department_admin' | 'teacher' | 'student' | 'parent';
  department?: string;
  profileImage?: string;
  phoneNumber?: string;
  isMainAdmin?: boolean;
  collegeId?: string;
  lastLogin?: Date;
  status: 'active' | 'inactive' | 'blocked';
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['admin', 'department_admin', 'teacher', 'student', 'parent'],
      required: [true, 'Role is required']
    },
    department: {
      type: String
    },
    profileImage: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    isMainAdmin: {
      type: Boolean,
      default: false
    },
    collegeId: {
      type: String,
      index: true
    },
    lastLogin: {
      type: Date
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add indexes for better query performance
userSchema.index({ role: 1, collegeId: 1 });
userSchema.index({ department: 1, collegeId: 1 });

export const UserModel = mongoose.model<IUser>('User', userSchema);
