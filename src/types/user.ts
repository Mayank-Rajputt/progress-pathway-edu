
import { UserRole } from '@/context/AuthContext';

export interface UserData {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'blocked';
  joinDate: string;
  department?: string;
  phoneNumber?: string;
  collegeId?: string;
  lastLogin?: string;
  profileImage?: string;
}

export interface EditUserFormData {
  name: string;
  email: string;
  role: string;
  department: string;
  phoneNumber: string;
  status: string;
}

export interface StudentData {
  id: string;
  userId: string;
  name: string;
  email: string;
  rollNumber: string;
  class: string;
  section: string;
  department: string;
  dateOfBirth: string;
  contactNumber?: string;
  address?: string;
  parentId?: string;
  teacherIds?: string[];
  subjects?: string[];
  documents?: DocumentData[];
}

export interface TeacherData {
  id: string;
  userId: string;
  name: string;
  email: string;
  employeeId: string;
  qualification: string;
  subjects: string[];
  classes: {
    class: string;
    section: string;
  }[];
  designation: string;
  joiningDate: string;
  department: string;
  isClassTeacher: boolean;
  classTeacherFor?: {
    class: string;
    section: string;
  };
}

export interface ParentData {
  id: string;
  userId: string;
  name: string;
  email: string;
  studentIds: string[];
  relationship: string;
  occupation?: string;
  phoneNumber?: string;
  alternatePhone?: string;
  address?: string;
}

export interface DocumentData {
  id?: string;
  type: 'marksheet' | 'id_card' | 'transfer_certificate' | 'other';
  name: string;
  url: string;
  uploadDate: string;
}

export interface CertificateData {
  id: string;
  type: string;
  title: string;
  description: string;
  issuedDate: string;
  issuedTo: string;
  issuedBy: string;
  certificateNumber: string;
  fileUrl: string;
  signature: {
    name: string;
    designation: string;
    imageUrl?: string;
  };
}

export interface CollegeData {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
}

export interface ActivityLogData {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  module: string;
  timestamp: string;
  ip: string;
  status: 'success' | 'failure';
}
