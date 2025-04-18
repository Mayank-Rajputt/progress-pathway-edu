import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';

// API base URL - would come from environment variables in a real production app
const API_URL = '/api';

export type UserRole = 'admin' | 'department_admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  _id?: string; // Add _id as optional for compatibility with backend models
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  department?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string, role: UserRole, department?: string) => Promise<void>;
  getToken: () => string | null;
  updateProfileImage: (imageUrl: string | null) => void;
  updateUserDetails: (details: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Set auth token for axios requests
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved auth on load
    const savedToken = localStorage.getItem('trakdemy_token');
    
    if (savedToken) {
      setAuthToken(savedToken);
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Load user data from token
  const loadUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`);
      
      if (response.data.success) {
        const userData = response.data.data;
        setUser({
          id: userData._id,
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          profileImage: userData.profileImage,
          department: userData.department,
          phoneNumber: userData.phoneNumber
        });
      }
    } catch (error) {
      // Invalid token - clear storage
      localStorage.removeItem('trakdemy_token');
      localStorage.removeItem('trakdemy_user');
      setAuthToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileImage = async (imageUrl: string | null) => {
    try {
      if (user) {
        const response = await axios.put(`${API_URL}/auth/profile`, {
          profileImage: imageUrl
        });
        
        if (response.data.success) {
          const updatedUser = { ...user, profileImage: imageUrl };
          setUser(updatedUser);
          localStorage.setItem('trakdemy_user', JSON.stringify(updatedUser));
          toast.success('Profile image updated successfully');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile image');
    }
  };

  const updateUserDetails = async (details: Partial<User>) => {
    try {
      if (user) {
        // For admin updating other users
        if (details._id && user.role === 'admin' && details._id !== user._id) {
          const response = await axios.put(`${API_URL}/users/${details._id}`, details);
          
          if (response.data.success) {
            toast.success('User details updated successfully');
          }
          return;
        }
        
        // For updating own profile
        const response = await axios.put(`${API_URL}/auth/profile`, details);
        
        if (response.data.success) {
          const userData = response.data.data;
          const updatedUser = { 
            ...user, 
            ...details,
            // Ensure we get these from the server response
            name: userData.name,
            email: userData.email,
            role: userData.role,
            profileImage: userData.profileImage,
            department: userData.department,
            phoneNumber: userData.phoneNumber
          };
          
          setUser(updatedUser);
          localStorage.setItem('trakdemy_user', JSON.stringify(updatedUser));
          toast.success('User details updated successfully');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user details');
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      if (response.data.success) {
        const userData = response.data.data;
        const token = userData.token;
        
        // Set token in local storage and axios headers
        localStorage.setItem('trakdemy_token', token);
        setAuthToken(token);
        
        // Set user data
        const userToSave = {
          id: userData._id,
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          profileImage: userData.profileImage,
          department: userData.department,
          phoneNumber: userData.phoneNumber
        };
        
        localStorage.setItem('trakdemy_user', JSON.stringify(userToSave));
        setUser(userToSave);
        
        // Redirect based on role
        navigate(`/dashboard/${userData.role}`);
        toast.success(`Welcome back, ${userData.name}!`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole, department?: string) => {
    setIsLoading(true);
    
    try {
      const userData = {
        name,
        email,
        password,
        role,
        department: department || ""
      };
      
      console.log("Signup data being sent:", { ...userData, password: '******' });
      
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      console.log("Signup response:", response.data);
      
      if (response.data.success) {
        const userData = response.data.data;
        const token = userData.token;
        
        // Set token in local storage and axios headers
        localStorage.setItem('trakdemy_token', token);
        setAuthToken(token);
        
        // Set user data
        const userToSave = {
          id: userData._id,
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          profileImage: userData.profileImage,
          department: userData.department,
          phoneNumber: userData.phoneNumber
        };
        
        localStorage.setItem('trakdemy_user', JSON.stringify(userToSave));
        setUser(userToSave);
        
        // Redirect based on role
        navigate(`/dashboard/${userData.role}`);
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Signup failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear everything from storage
    localStorage.removeItem('trakdemy_token');
    localStorage.removeItem('trakdemy_user');
    setAuthToken(null);
    setUser(null);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const getToken = () => localStorage.getItem('trakdemy_token');

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    getToken,
    updateProfileImage,
    updateUserDetails
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
