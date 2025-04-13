
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@edutrack.com',
    role: 'admin',
    profileImage: 'https://ui-avatars.com/api/?background=1A73E8&color=fff&name=Admin+User'
  },
  {
    id: '2',
    name: 'Teacher Smith',
    email: 'teacher@edutrack.com',
    role: 'teacher',
    profileImage: 'https://ui-avatars.com/api/?background=8B5CF6&color=fff&name=Teacher+Smith'
  },
  {
    id: '3',
    name: 'Student Johnson',
    email: 'student@edutrack.com',
    role: 'student',
    profileImage: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Student+Johnson'
  },
  {
    id: '4',
    name: 'Parent Davis',
    email: 'parent@edutrack.com',
    role: 'parent',
    profileImage: 'https://ui-avatars.com/api/?background=F59E0B&color=fff&name=Parent+Davis'
  }
];

// Mock passwords (in a real app, these would be hashed in the database)
const MOCK_PASSWORDS: Record<string, string> = {
  'admin@edutrack.com': 'admin123',
  'teacher@edutrack.com': 'teacher123',
  'student@edutrack.com': 'student123',
  'parent@edutrack.com': 'parent123'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved auth on load
    const savedUser = localStorage.getItem('edutrack_user');
    const savedToken = localStorage.getItem('edutrack_token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be a proper API call with JWT
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser || MOCK_PASSWORDS[email] !== password) {
        throw new Error('Invalid credentials');
      }
      
      // Create mock token (in a real app this would be a JWT)
      const token = `mock-jwt-token-${foundUser.id}-${Date.now()}`;
      
      // Save to localStorage
      localStorage.setItem('edutrack_token', token);
      localStorage.setItem('edutrack_user', JSON.stringify(foundUser));
      
      setUser(foundUser);
      
      // Redirect based on role
      navigate(`/dashboard/${foundUser.role}`);
      toast.success(`Welcome back, ${foundUser.name}!`);
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Email already registered');
      }
      
      // Create new user (in a real app, this would be saved to a database)
      const newUser: User = {
        id: `${MOCK_USERS.length + 1}`,
        name,
        email,
        role,
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
      };
      
      // In a real app, we would add the user to the database here
      // For this demo, we'll just pretend we did
      
      // Create mock token (in a real app this would be a JWT)
      const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
      
      // Save to localStorage
      localStorage.setItem('edutrack_token', token);
      localStorage.setItem('edutrack_user', JSON.stringify(newUser));
      
      // Update mock users array for this session
      MOCK_USERS.push(newUser);
      MOCK_PASSWORDS[email] = password;
      
      setUser(newUser);
      
      navigate(`/dashboard/${newUser.role}`);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('edutrack_token');
    localStorage.removeItem('edutrack_user');
    setUser(null);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const getToken = () => localStorage.getItem('edutrack_token');

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    getToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
