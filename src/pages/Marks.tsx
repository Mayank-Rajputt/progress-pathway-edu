
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Plus, Edit, Search, Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';

// Mock data for student marks
const mockStudents = [
  { id: '1', name: 'Alex Johnson', rollNo: '1001', math: 92, science: 88, english: 85, history: 78 },
  { id: '2', name: 'Sarah Williams', rollNo: '1002', math: 85, science: 90, english: 92, history: 88 },
  { id: '3', name: 'Michael Brown', rollNo: '1003', math: 78, science: 75, english: 80, history: 82 },
  { id: '4', name: 'Emily Davis', rollNo: '1004', math: 95, science: 92, english: 88, history: 90 },
  { id: '5', name: 'James Wilson', rollNo: '1005', math: 82, science: 85, english: 75, history: 80 },
];

// Mock data for student grades
const mockGrades = [
  { id: '1', subject: 'Mathematics', grade: 'A', score: 92, maxScore: 100, date: '2025-03-25' },
  { id: '2', subject: 'Science', grade: 'A-', score: 88, maxScore: 100, date: '2025-03-22' },
  { id: '3', subject: 'English', grade: 'B+', score: 85, maxScore: 100, date: '2025-03-20' },
  { id: '4', subject: 'History', grade: 'B', score: 78, maxScore: 100, date: '2025-03-18' },
  { id: '5', subject: 'Computer Science', grade: 'A+', score: 98, maxScore: 100, date: '2025-03-15' },
];

const Marks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const role = user?.role;
  const isTeacher = role === 'admin' || role === 'teacher';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingMarks, setEditingMarks] = useState<Record<string, Record<string, number>>>({});
  
  // Initialize editing state
  const initializeEditing = () => {
    const initialState: Record<string, Record<string, number>> = {};
    mockStudents.forEach(student => {
      initialState[student.id] = {
        math: student.math,
        science: student.science,
        english: student.english,
        history: student.history
      };
    });
    setEditingMarks(initialState);
    setIsEditing(true);
  };
  
  // Handle mark changes
  const handleMarkChange = (studentId: string, subject: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setEditingMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: numValue > 100 ? 100 : numValue
      }
    }));
  };
  
  // Save marks
  const saveMarks = () => {
    // In a real app, this would send data to the backend
    toast({
      title: "Marks Updated",
      description: "Student marks have been successfully updated.",
    });
    setIsEditing(false);
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
  };
  
  // Filter students based on search term
  const filteredStudents = mockStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marks</h1>
          <p className="text-muted-foreground">
            {isTeacher 
              ? 'Manage and track student marks'
              : 'View your academic marks'}
          </p>
        </div>
        
        {isTeacher && !isEditing && (
          <Button onClick={initializeEditing}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Marks
          </Button>
        )}
        
        {isTeacher && isEditing && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={cancelEditing}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={saveMarks}>
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue={isTeacher ? "manage" : "view"}>
        <TabsList className="grid w-full grid-cols-2">
          {isTeacher && <TabsTrigger value="manage">Manage Marks</TabsTrigger>}
          <TabsTrigger value="view">{isTeacher ? "Student View" : "View Marks"}</TabsTrigger>
          {!isTeacher && <TabsTrigger value="reports">Reports</TabsTrigger>}
        </TabsList>
        
        {isTeacher && (
          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Marks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search students..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="class-10a">Class 10-A</SelectItem>
                        <SelectItem value="class-10b">Class 10-B</SelectItem>
                        <SelectItem value="class-9a">Class 9-A</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {!isEditing && (
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Student
                    </Button>
                  )}
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Roll No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-center">Mathematics</TableHead>
                        <TableHead className="text-center">Science</TableHead>
                        <TableHead className="text-center">English</TableHead>
                        <TableHead className="text-center">History</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No students found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.rollNo}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell className="text-center">
                              {isEditing ? (
                                <Input 
                                  type="number" 
                                  className="w-20 mx-auto text-center"
                                  value={editingMarks[student.id]?.math || 0}
                                  onChange={(e) => handleMarkChange(student.id, 'math', e.target.value)}
                                  min={0}
                                  max={100}
                                />
                              ) : (
                                student.math
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {isEditing ? (
                                <Input 
                                  type="number" 
                                  className="w-20 mx-auto text-center"
                                  value={editingMarks[student.id]?.science || 0}
                                  onChange={(e) => handleMarkChange(student.id, 'science', e.target.value)}
                                  min={0}
                                  max={100}
                                />
                              ) : (
                                student.science
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {isEditing ? (
                                <Input 
                                  type="number" 
                                  className="w-20 mx-auto text-center"
                                  value={editingMarks[student.id]?.english || 0}
                                  onChange={(e) => handleMarkChange(student.id, 'english', e.target.value)}
                                  min={0}
                                  max={100}
                                />
                              ) : (
                                student.english
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {isEditing ? (
                                <Input 
                                  type="number" 
                                  className="w-20 mx-auto text-center"
                                  value={editingMarks[student.id]?.history || 0}
                                  onChange={(e) => handleMarkChange(student.id, 'history', e.target.value)}
                                  min={0}
                                  max={100}
                                />
                              ) : (
                                student.history
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {isTeacher ? (
                <div className="text-center p-12">
                  <p className="text-muted-foreground">
                    This is how students will view their marks.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockGrades.map((grade) => (
                    <div
                      key={grade.id}
                      className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium">{grade.subject}</h3>
                        <span className="text-base font-bold">
                          {grade.grade}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${(grade.score / grade.maxScore) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {grade.score}/{grade.maxScore}
                        </span>
                      </div>
                      <div className="text-xs text-right mt-1 text-muted-foreground">
                        {new Date(grade.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {!isTeacher && (
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Term Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-12">
                  <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Term Reports</h3>
                  <p className="mt-2 text-muted-foreground">
                    Your term-wise academic reports will be displayed here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Marks;
