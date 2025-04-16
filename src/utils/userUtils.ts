
import { UserRole } from '@/context/AuthContext';

export const getBadgeClass = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-admin text-white';
    case 'department_admin': return 'bg-pink-500 text-white';
    case 'teacher': return 'bg-teacher text-white';
    case 'student': return 'bg-student text-white';
    case 'parent': return 'bg-parent text-white';
    default: return 'bg-gray-200 text-gray-800';
  }
};

// Mock user data for development/testing
export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'teacher' as UserRole,
    status: 'active' as const,
    joinDate: '2023-01-15',
    department: 'Science',
    phoneNumber: '555-1234'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin' as UserRole,
    status: 'active' as const,
    joinDate: '2023-02-10',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    role: 'student' as UserRole,
    status: 'active' as const,
    joinDate: '2023-03-05',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'parent' as UserRole,
    status: 'inactive' as const,
    joinDate: '2023-01-20',
    phoneNumber: '555-5678'
  },
  {
    id: '5',
    name: 'Robert Brown',
    email: 'robert@example.com',
    role: 'teacher' as UserRole,
    status: 'active' as const,
    joinDate: '2023-02-28',
    department: 'Mathematics',
    phoneNumber: '555-8765'
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'student' as UserRole,
    status: 'active' as const,
    joinDate: '2023-03-15',
  },
  {
    id: '7',
    name: 'Daniel Miller',
    email: 'daniel@example.com',
    role: 'parent' as UserRole,
    status: 'active' as const,
    joinDate: '2023-01-25',
    phoneNumber: '555-4321'
  },
  {
    id: '8',
    name: 'Olivia Wilson',
    email: 'olivia@example.com',
    role: 'teacher' as UserRole,
    status: 'inactive' as const,
    joinDate: '2023-02-14',
    department: 'English',
  },
  {
    id: '9',
    name: 'Department Admin',
    email: 'department@trakdemy.com',
    role: 'department_admin' as UserRole,
    status: 'active' as const,
    joinDate: '2023-01-10',
    department: 'Mathematics',
    phoneNumber: '555-9876'
  },
];
