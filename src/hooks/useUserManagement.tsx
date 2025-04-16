
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { UserData } from '@/types/user';
import { mockUsers } from '@/utils/userUtils';

export const useUserManagement = () => {
  const { user: currentUser, updateUserDetails } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Form state for editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phoneNumber: '',
    status: ''
  });

  // Initialize with mock data
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 800);
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const refreshUsers = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
      toast.success("User data refreshed successfully");
    }, 800);
  };

  const handleEditClick = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || '',
      phoneNumber: user.phoneNumber || '',
      status: user.status
    });
    setIsEditDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    // Update the user in our local state
    const updatedUsers = users.map(u => 
      u.id === editingUser.id 
        ? { 
            ...u, 
            name: formData.name,
            role: formData.role as any,
            department: formData.department || undefined,
            phoneNumber: formData.phoneNumber || undefined,
            status: formData.status as 'active' | 'inactive'
          } 
        : u
    );

    setUsers(updatedUsers);
    
    // If the current user is editing their own profile, update auth context
    if (currentUser && editingUser.id === currentUser.id) {
      updateUserDetails({
        name: formData.name,
        role: formData.role as any,
        department: formData.department || undefined,
        phoneNumber: formData.phoneNumber || undefined
      });
    }

    toast.success(`User ${formData.name} updated successfully`);
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    users,
    filteredUsers,
    isLoading,
    editingUser,
    isEditDialogOpen,
    setIsEditDialogOpen,
    formData,
    refreshUsers,
    handleEditClick,
    handleFormChange,
    handleSelectChange,
    handleSubmit
  };
};
