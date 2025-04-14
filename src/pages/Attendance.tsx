
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarDays, 
  Users, 
  CheckCircle, 
  Check, 
  X,
  Search,
  Filter
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Mock student data
const initialStudents = [
  { id: '1', name: 'Alex Johnson', rollNo: '1001', status: 'present', avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Alex+Johnson' },
  { id: '2', name: 'Sarah Williams', rollNo: '1002', status: 'present', avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Sarah+Williams' },
  { id: '3', name: 'Michael Brown', rollNo: '1003', status: 'absent', avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Michael+Brown' },
  { id: '4', name: 'Emily Davis', rollNo: '1004', status: 'present', avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Emily+Davis' },
  { id: '5', name: 'James Wilson', rollNo: '1005', status: 'present', avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=James+Wilson' },
  { id: '6', name: 'Emma Taylor', rollNo: '1006', status: null, avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Emma+Taylor' },
  { id: '7', name: 'Daniel Anderson', rollNo: '1007', status: null, avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Daniel+Anderson' },
  { id: '8', name: 'Olivia Martinez', rollNo: '1008', status: null, avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Olivia+Martinez' },
];

const Attendance = () => {
  const { user } = useAuth();
  const role = user?.role;
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Calculate stats
  const totalStudents = students.length;
  const presentStudents = students.filter(s => s.status === 'present').length;
  const absentStudents = students.filter(s => s.status === 'absent').length;
  const unmarkedStudents = students.filter(s => s.status === null).length;
  const attendancePercentage = totalStudents > 0 
    ? Math.round((presentStudents / totalStudents) * 100) 
    : 0;

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm)
  );

  const markAttendance = (id: string, status: 'present' | 'absent' | null) => {
    if (role !== 'teacher' && role !== 'admin') return;
    
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, status } : student
    ));
    
    toast.success(`Marked ${status} for Roll No. ${students.find(s => s.id === id)?.rollNo}`);
  };

  const markAllPresent = () => {
    if (role !== 'teacher' && role !== 'admin') return;
    
    setStudents(prev => prev.map(student => ({ ...student, status: 'present' })));
    toast.success('Marked all students present');
  };

  const resetAttendance = () => {
    if (role !== 'teacher' && role !== 'admin') return;
    
    setStudents(prev => prev.map(student => ({ ...student, status: null })));
    toast.success('Reset all attendance');
  };

  const saveAttendance = () => {
    if (role !== 'teacher' && role !== 'admin') return;
    
    // Here you would typically send this data to your backend
    toast.success(`Attendance for ${date} saved successfully`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            {role === 'admin' || role === 'teacher' 
              ? 'Manage and track student attendance'
              : 'View your attendance records'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          
          {(role === 'admin' || role === 'teacher') && (
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Manage Attendance</span>
            </TabsTrigger>
          )}
          
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-muted-foreground">Present</h4>
                  <p className="text-2xl font-bold text-green-600">{presentStudents}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-muted-foreground">Absent</h4>
                  <p className="text-2xl font-bold text-red-600">{absentStudents}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-muted-foreground">Unmarked</h4>
                  <p className="text-2xl font-bold text-orange-500">{unmarkedStudents}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-muted-foreground">Percentage</h4>
                  <p className="text-2xl font-bold">{attendancePercentage}%</p>
                </div>
              </div>

              <div className="relative overflow-x-auto rounded-lg border">
                <table className="w-full">
                  <thead className="bg-muted/50 text-sm text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Student</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-muted-foreground">{student.rollNo}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {student.avatar && (
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <span>{student.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {student.status === 'present' ? (
                            <Check className="mx-auto text-green-600" size={18} />
                          ) : student.status === 'absent' ? (
                            <X className="mx-auto text-red-600" size={18} />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {(role === 'admin' || role === 'teacher') && (
          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mark Attendance</CardTitle>
                <div>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-auto"
                  />
                </div>
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={markAllPresent}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Mark All Present
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={resetAttendance}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </div>

                  <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full">
                      <thead className="bg-muted/50 text-sm text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 text-left">#</th>
                          <th className="px-4 py-3 text-left">Student</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3 text-muted-foreground">{student.rollNo}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {student.avatar && (
                                  <img
                                    src={student.avatar}
                                    alt={student.name}
                                    className="w-8 h-8 rounded-full"
                                  />
                                )}
                                <span>{student.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {student.status === 'present' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Present
                                </span>
                              ) : student.status === 'absent' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Absent
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Unmarked
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={student.status === 'present' ? 'text-green-600 bg-green-50' : ''}
                                  onClick={() => markAttendance(student.id, 'present')}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={student.status === 'absent' ? 'text-red-600 bg-red-50' : ''}
                                  onClick={() => markAttendance(student.id, 'absent')}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button onClick={saveAttendance}>
                      Save Attendance
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12">
                <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Attendance Reports</h3>
                <p className="mt-2 text-muted-foreground">
                  View and generate detailed attendance reports.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
