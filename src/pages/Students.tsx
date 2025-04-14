
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Mail, 
  Phone, 
  GraduationCap,
  Filter,
  FileText
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
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Mock student data
const initialStudents = [
  { 
    id: '1', 
    name: 'Alex Johnson', 
    rollNo: '1001', 
    email: 'alex@example.com', 
    phone: '555-123-4567',
    class: 'BCA-3',
    avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Alex+Johnson' 
  },
  { 
    id: '2', 
    name: 'Sarah Williams', 
    rollNo: '1002', 
    email: 'sarah@example.com', 
    phone: '555-987-6543',
    class: 'BCA-3',
    avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Sarah+Williams' 
  },
  { 
    id: '3', 
    name: 'Michael Brown', 
    rollNo: '1003', 
    email: 'michael@example.com', 
    phone: '555-234-5678',
    class: 'MCA-1',
    avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Michael+Brown' 
  },
  { 
    id: '4', 
    name: 'Emily Davis', 
    rollNo: '1004', 
    email: 'emily@example.com', 
    phone: '555-876-5432',
    class: 'B.Tech-2',
    avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Emily+Davis' 
  },
  { 
    id: '5', 
    name: 'James Wilson', 
    rollNo: '1005', 
    email: 'james@example.com', 
    phone: '555-345-6789',
    class: 'MBA-1',
    avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=James+Wilson' 
  },
];

const Students = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    class: '',
  });
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  if (user?.role !== 'teacher' && user?.role !== 'admin') {
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

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = filterClass ? student.class === filterClass : true;
    
    return matchesSearch && matchesClass;
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newId = (parseInt(students[students.length - 1]?.id || '0') + 1).toString();
    const rollNo = (parseInt(students[students.length - 1]?.rollNo || '1000') + 1).toString();
    
    const studentToAdd = {
      id: newId,
      rollNo,
      name: newStudent.name,
      email: newStudent.email,
      phone: newStudent.phone,
      class: newStudent.class,
      avatar: `https://ui-avatars.com/api/?background=10B981&color=fff&name=${encodeURIComponent(newStudent.name)}`
    };
    
    setStudents([...students, studentToAdd]);
    setNewStudent({ name: '', email: '', phone: '', class: '' });
    setIsAddStudentOpen(false);
    toast.success('Student added successfully');
  };

  const toggleSelectStudent = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(studentId => studentId !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const selectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.id));
    }
  };

  const deleteSelectedStudents = () => {
    if (selectedStudents.length === 0) return;
    
    setStudents(students.filter(student => !selectedStudents.includes(student.id)));
    setSelectedStudents([]);
    toast.success(`${selectedStudents.length} student(s) removed`);
  };

  // Get unique classes for filtering
  const classes = Array.from(new Set(students.map(student => student.class))).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">
            Manage students and view their information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Students Directory</CardTitle>
          <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the details of the new student below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddStudent}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                      placeholder="555-123-4567"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="class">Class</Label>
                    <Input 
                      id="class" 
                      value={newStudent.class}
                      onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
                      placeholder="BCA-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Student</Button>
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
                  placeholder="Search students..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <div className="relative w-full sm:w-40">
                  <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-foreground file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                {selectedStudents.length > 0 && (
                  <Button 
                    variant="destructive"
                    size="icon"
                    onClick={deleteSelectedStudents}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </div>

            <div className="relative overflow-x-auto rounded-lg border">
              <table className="w-full">
                <thead className="bg-muted/50 text-sm text-muted-foreground">
                  <tr>
                    <th className="w-12 px-4 py-3 text-left">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                        onChange={selectAllStudents}
                      />
                    </th>
                    <th className="px-4 py-3 text-left">Student</th>
                    <th className="px-4 py-3 text-left">Contact</th>
                    <th className="px-4 py-3 text-left">Class</th>
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
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => toggleSelectStudent(student.id)}
                          />
                        </td>
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
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
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
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Students;
