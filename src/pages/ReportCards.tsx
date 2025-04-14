
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Download, Filter, Plus, Printer, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Sample grades data
const mockGrades = [
  { id: 1, subject: 'Mathematics', marks: 85, grade: 'A', comments: 'Excellent work in algebra and calculus.' },
  { id: 2, subject: 'English', marks: 78, grade: 'B+', comments: 'Good comprehension and writing skills.' },
  { id: 3, subject: 'Science', marks: 92, grade: 'A+', comments: 'Outstanding performance in all experiments and theory.' },
  { id: 4, subject: 'History', marks: 75, grade: 'B', comments: 'Good understanding of historical events.' },
  { id: 5, subject: 'Computer Science', marks: 88, grade: 'A', comments: 'Strong programming skills and conceptual understanding.' },
];

// Sample students data for teachers and admin
const mockStudents = [
  { id: 101, name: 'Alex Johnson', class: '10A', reports: 2 },
  { id: 102, name: 'Emma Williams', class: '10A', reports: 2 },
  { id: 103, name: 'Noah Brown', class: '10B', reports: 1 },
  { id: 104, name: 'Sophia Davis', class: '9A', reports: 2 },
  { id: 105, name: 'Liam Wilson', class: '9B', reports: 2 },
];

// Sample report periods
const reportPeriods = [
  { id: 'term1', name: 'Term 1 (2023-2024)' },
  { id: 'term2', name: 'Term 2 (2023-2024)' },
  { id: 'final', name: 'Final Report (2023-2024)' },
];

const ReportCards = () => {
  const { user } = useAuth();
  const role = user?.role;
  const isTeacherOrAdmin = role === 'admin' || role === 'teacher';
  
  const [selectedPeriod, setSelectedPeriod] = useState(reportPeriods[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // For students/parents view
  const [studentGrades, setStudentGrades] = useState(mockGrades);
  
  // For teacher/admin view
  const [students, setStudents] = useState(mockStudents);
  
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      toast.success('Report card generated successfully');
      setIsGenerating(false);
    }, 1500);
  };

  const handleDownloadReport = () => {
    toast.success('Report card downloaded successfully');
  };

  const handlePrintReport = () => {
    toast.success('Report card sent to printer');
  };

  // Calculate totals and percentages for student view
  const totalMarks = studentGrades.reduce((sum, subject) => sum + subject.marks, 0);
  const maxPossibleMarks = studentGrades.length * 100;
  const percentage = ((totalMarks / maxPossibleMarks) * 100).toFixed(2);
  const overallGrade = 
    percentage >= 90 ? 'A+' :
    percentage >= 80 ? 'A' :
    percentage >= 70 ? 'B+' :
    percentage >= 60 ? 'B' :
    percentage >= 50 ? 'C' : 'F';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report Cards</h1>
          <p className="text-muted-foreground">
            {isTeacherOrAdmin
              ? 'Generate and manage student report cards'
              : 'View your academic report cards'}
          </p>
        </div>
        {isTeacherOrAdmin && (
          <Button 
            onClick={handleGenerateReport} 
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate New Report'}
          </Button>
        )}
      </div>

      {/* Report periods selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select report period" />
          </SelectTrigger>
          <SelectContent>
            {reportPeriods.map(period => (
              <SelectItem key={period.id} value={period.id}>
                {period.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {isTeacherOrAdmin && (
          <>
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-8 w-full sm:w-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="10A">Class 10A</SelectItem>
                <SelectItem value="10B">Class 10B</SelectItem>
                <SelectItem value="9A">Class 9A</SelectItem>
                <SelectItem value="9B">Class 9B</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      {isTeacherOrAdmin ? (
        // Teacher/Admin View - List of students
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Student Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Available Reports</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.reports}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Printer className="h-3.5 w-3.5" />
                              Print
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </Button>
                            <Button size="sm">View</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No students found matching your search criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Student/Parent View - Report card
        <Card>
          <CardHeader className="border-b">
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-bold">Academic Report Card</h2>
                <p className="text-muted-foreground mt-1">{reportPeriods.find(p => p.id === selectedPeriod)?.name}</p>
              </div>
              <div className="space-y-1">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Roll No:</strong> 2023ST101</p>
                <p><strong>Class:</strong> 10A</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Marks (out of 100)</TableHead>
                    <TableHead className="text-right">Grade</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentGrades.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">{subject.subject}</TableCell>
                      <TableCell className="text-right">{subject.marks}</TableCell>
                      <TableCell className="text-right font-medium">{subject.grade}</TableCell>
                      <TableCell>{subject.comments}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold">{totalMarks} / {maxPossibleMarks}</TableCell>
                    <TableCell className="text-right font-bold">{overallGrade}</TableCell>
                    <TableCell>{percentage}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6 border rounded-md p-4">
              <h3 className="font-semibold mb-2">Teacher's Remarks</h3>
              <p>A dedicated student who has shown consistent improvement throughout the term. 
                 Excellent performance in Science and Computer Science. 
                 More practice recommended in History to improve overall grade.</p>
            </div>
            
            <div className="mt-6 border rounded-md p-4">
              <h3 className="font-semibold mb-2">Attendance</h3>
              <div className="flex gap-6">
                <div>
                  <p className="text-muted-foreground text-sm">Total Classes</p>
                  <p className="text-2xl font-semibold">120</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Classes Attended</p>
                  <p className="text-2xl font-semibold">116</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Attendance Percentage</p>
                  <p className="text-2xl font-semibold">96.7%</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t pt-6">
            <Button variant="outline" onClick={handlePrintReport} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
            <Button onClick={handleDownloadReport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ReportCards;
