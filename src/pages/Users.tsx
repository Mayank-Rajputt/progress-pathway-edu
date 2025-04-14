
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Users as UsersIcon, 
  Search, 
  Plus, 
  Trash2, 
  Mail, 
  Phone, 
  User,
  Filter,
  FileText,
  Shield,
  GraduationCap,
  UserCog,
  School
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Mock users data
const mockUsers = [
  { 
    id: '1', 
    name: 'Admin User', 
    email: 'admin@trakdemy.com', 
    role: 'admin',
    department: 'Management',
    avatar: 'https://ui-avatars.com/api/?background=1A73E8&color=fff&name=Admin+User' 
  },
  { 
    id: '2', 
    name: 'Teacher Smith', 
    email: 'teacher@trakdemy.com', 
    role: 'teacher',
    department: 'Science',
    avatar: 'https://ui-avatars.com/api/?background=8B5CF6&color=fff&name=Teacher+Smith' 
  },
  { 
    id: '3', 
    name: 'John Teacher', 
    email: 'john@trakdemy.com', 
    role: 'teacher',
    department: 'Mathematics',
    avatar: 'https://ui-avatars.com/api/?background=8B5CF6&color=fff&name=John+Teacher' 
  },
  { 
    id: '4', 
    name: 'Student Johnson', 
    email: 'student@trakdemy.com', 
    role: 'student',
    department: 'BCA-3',
    avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Student+Johnson' 
  },
  { 
    id: '5', 
    name: 'Sarah Student', 
    email: 'sarah@trakdemy.com', 
    role: 'student',
    department: 'MCA-1',
    avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Sarah+Student' 
  },
  { 
    id: '6', 
    name: 'Parent Davis', 
    email: 'parent@trakdemy.com', 
    role: 'parent',
    department: 'N/A',
    avatar: 'https://ui-avatars.com/api/?background=F59E0B&color=fff&name=Parent+Davis' 
  },
];

// Mock student data
const mockStudents = [
  { 
    id: '1', 
    name: 'Alex Johnson', 
    rollNo: '1001', 
    email: 'alex@example.com', 
    phone: '555-123-4567',
    class: 'BCA-3',
    attendance: '92%',
    avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Alex+Johnson' 
  },
  { 
    id: '2', 
    name: 'Sarah Williams', 
    rollNo: '1002', 
    email: 'sarah@example.com', 
    phone: '555-987-6543',
    class: 'BCA-3',
    attendance: '88%',
    avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Sarah+Williams' 
  },
  { 
    id: '3', 
    name: 'Michael Brown', 
    rollNo: '1003', 
    email: 'michael@example.com', 
    phone: '555-234-5678',
    class: 'MCA-1',
    attendance: '95%',
    avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Michael+Brown' 
  },
  { 
    id: '4', 
    name: 'Emily Davis', 
    rollNo: '1004', 
    email: 'emily@example.com', 
    phone: '555-876-5432',
    class: 'B.Tech-2',
    attendance: '90%',
    avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Emily+Davis' 
  },
  { 
    id: '5', 
    name: 'James Wilson', 
    rollNo: '1005', 
    email: 'james@example.com', 
    phone: '555-345-6789',
    class: 'MBA-1',
    attendance: '85%',
    avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=James+Wilson' 
  },
];

// Mock teacher data
const mockTeachers = [
  { 
    id: '1', 
    name: 'John Smith', 
    employeeId: 'T001', 
    email: 'john@trakdemy.com', 
    phone: '555-111-2222',
    department: 'Mathematics',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?background=8B5CF6&color=fff&name=John+Smith' 
  },
  { 
    id: '2', 
    name: 'Jane Doe', 
    employeeId: 'T002', 
    email: 'jane@trakdemy.com', 
    phone: '555-333-4444',
    department: 'Science',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?background=8B5CF6&color=fff&name=Jane+Doe' 
  },
  { 
    id: '3', 
    name: 'Robert Williams', 
    employeeId: 'T003', 
    email: 'robert@trakdemy.com', 
    phone: '555-555-6666',
    department: 'Computer Science',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?background=8B5CF6&color=fff&name=Robert+Williams' 
  },
  { 
    id: '4', 
    name: 'Mary Johnson', 
    employeeId: 'T004', 
    email: 'mary@trakdemy.com', 
    phone: '555-777-8888',
    department: 'English',
    status: 'on-leave',
    avatar: 'https://ui-avatars.com/api/?background=8B5CF6&color=fff&name=Mary+Johnson' 
  },
];

// Mock classes data
const mockClasses = [
  { id: '1', name: 'BCA-1', students: 45, teachers: 6, attendance: '92%' },
  { id: '2', name: 'BCA-2', students: 43, teachers: 5, attendance: '88%' },
  { id: '3', name: 'BCA-3', students: 40, teachers: 6, attendance: '90%' },
  { id: '4', name: 'MCA-1', students: 35, teachers: 7, attendance: '94%' },
  { id: '5', name: 'MCA-2', students: 32, teachers: 6, attendance: '91%' },
  { id: '6', name: 'B.Tech-1', students: 60, teachers: 8, attendance: '89%' },
  { id: '7', name: 'B.Tech-2', students: 55, teachers: 7, attendance: '93%' },
  { id: '8', name: 'MBA-1', students: 50, teachers: 6, attendance: '87%' },
];

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [students, setStudents] = useState(mockStudents);
  const [teachers, setTeachers] = useState(mockTeachers);
  const [classes, setClasses] = useState(mockClasses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student',
    department: '',
  });
  
  if (user?.role !== 'admin') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page
            </p>
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole ? user.role === filterRole : true;
    
    return matchesSearch && matchesRole;
  });

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newId = (parseInt(users[users.length - 1]?.id || '0') + 1).toString();
    
    const userToAdd = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      avatar: `https://ui-avatars.com/api/?background=10B981&color=fff&name=${encodeURIComponent(newUser.name)}`
    };
    
    setUsers([...users, userToAdd]);
    setNewUser({ name: '', email: '', role: 'student', department: '' });
    setIsAddUserOpen(false);
    toast.success('User added successfully');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'teacher':
        return 'bg-purple-100 text-purple-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      case 'parent':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'teacher':
        return <User className="h-4 w-4" />;
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      case 'parent':
        return <UserCog className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success('User removed successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage school users and their access permissions
          </p>
        </div>
      </div>

      <Tabs defaultValue="all-users" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="all-users" className="py-2">
            <User className="mr-2 h-4 w-4" />
            All Users
          </TabsTrigger>
          <TabsTrigger value="students" className="py-2">
            <GraduationCap className="mr-2 h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="teachers" className="py-2">
            <Users className="mr-2 h-4 w-4" />
            Teachers
          </TabsTrigger>
          <TabsTrigger value="classes" className="py-2">
            <School className="mr-2 h-4 w-4" />
            Classes
          </TabsTrigger>
        </TabsList>

        {/* All Users Tab */}
        <TabsContent value="all-users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>User Directory</CardTitle>
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Enter the details of the new user below.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddUser}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <select 
                          id="role"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-foreground file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                          required
                        >
                          <option value="admin">Admin</option>
                          <option value="teacher">Teacher</option>
                          <option value="student">Student</option>
                          <option value="parent">Parent</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="department">Department/Class</Label>
                        <Input 
                          id="department" 
                          value={newUser.department}
                          onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                          placeholder={newUser.role === 'student' ? "BCA-3" : "Science"}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add User</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 justify-between">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative w-full sm:w-40">
                    <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-foreground file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                    >
                      <option value="">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                      <option value="parent">Parent</option>
                    </select>
                  </div>
                </div>

                <div className="relative overflow-x-auto rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-muted/50 text-sm text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left">User</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">Department/Class</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                            No users found. Try adjusting your search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {user.avatar && (
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full"
                                  />
                                )}
                                <div className="font-medium">{user.name}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="mr-1 h-3 w-3" />
                                {user.email}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                {getRoleIcon(user.role)}
                                <span className="ml-1 capitalize">{user.role}</span>
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {user.department}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <UserCog className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Student Directory</CardTitle>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Add Student
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search students..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="relative overflow-x-auto rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-muted/50 text-sm text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left">Student</th>
                        <th className="px-4 py-3 text-left">Contact</th>
                        <th className="px-4 py-3 text-left">Class</th>
                        <th className="px-4 py-3 text-left">Attendance</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                            No students found. Try adjusting your search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {student.avatar && (
                                  <img
                                    src={student.avatar}
                                    alt={student.name}
                                    className="w-8 h-8 rounded-full"
                                  />
                                )}
                                <div>
                                  <div className="font-medium">{student.name}</div>
                                  <div className="text-xs text-muted-foreground">Roll No. {student.rollNo}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Mail className="mr-1 h-3 w-3" />
                                  {student.email}
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <Phone className="mr-1 h-3 w-3" />
                                  {student.phone}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <GraduationCap className="mr-1 h-4 w-4 text-muted-foreground" />
                                <span>{student.class}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {student.attendance}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <UserCog className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Teacher Directory</CardTitle>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Add Teacher
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search teachers..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="relative overflow-x-auto rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-muted/50 text-sm text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left">Teacher</th>
                        <th className="px-4 py-3 text-left">Contact</th>
                        <th className="px-4 py-3 text-left">Department</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredTeachers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                            No teachers found. Try adjusting your search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredTeachers.map((teacher) => (
                          <tr key={teacher.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {teacher.avatar && (
                                  <img
                                    src={teacher.avatar}
                                    alt={teacher.name}
                                    className="w-8 h-8 rounded-full"
                                  />
                                )}
                                <div>
                                  <div className="font-medium">{teacher.name}</div>
                                  <div className="text-xs text-muted-foreground">ID: {teacher.employeeId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Mail className="mr-1 h-3 w-3" />
                                  {teacher.email}
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <Phone className="mr-1 h-3 w-3" />
                                  {teacher.phone}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {teacher.department}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {teacher.status === 'active' ? 'Active' : 'On Leave'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <UserCog className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Classes & Courses</CardTitle>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Add Class
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search classes..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="relative overflow-x-auto rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-muted/50 text-sm text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left">Class</th>
                        <th className="px-4 py-3 text-left">Students</th>
                        <th className="px-4 py-3 text-left">Teachers</th>
                        <th className="px-4 py-3 text-left">Attendance</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredClasses.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                            No classes found. Try adjusting your search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredClasses.map((cls) => (
                          <tr key={cls.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <School className="mr-2 h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{cls.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <GraduationCap className="mr-1 h-4 w-4 text-muted-foreground" />
                                <span>{cls.students}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <User className="mr-1 h-4 w-4 text-muted-foreground" />
                                <span>{cls.teachers}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {cls.attendance}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <UsersIcon className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <UserCog className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Users;
