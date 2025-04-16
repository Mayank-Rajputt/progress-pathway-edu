
import { UserRole } from '@/context/AuthContext';

export interface UserData {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  joinDate: string;
  department?: string;
  phoneNumber?: string;
}

export interface EditUserFormData {
  name: string;
  email: string;
  role: string;
  department: string;
  phoneNumber: string;
  status: string;
}
