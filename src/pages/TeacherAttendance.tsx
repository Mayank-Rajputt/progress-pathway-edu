
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, X, Search, Filter, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock data for teacher list - to be replaced with actual API calls
const mockTeachers = [
  { id: 't1', name: 'John Smith', email: 'john@example.com' },
  { id: 't2', name: 'Sarah Johnson', email: 'sarah@example.com' },
  { id: 't3', name: 'Michael Brown', email: 'michael@example.com' },
  { id: 't4', name: 'Emily Davis', email: 'emily@example.com' },
  { id: 't5', name: 'Robert Wilson', email: 'robert@example.com' },
  { id: 't6', name: 'Jennifer Thompson', email: 'jennifer@example.com' },
  { id: 't7', name: 'David Martinez', email: 'david@example.com' },
  { id: 't8', name: 'Lisa Anderson', email: 'lisa@example.com' },
];

// Mock data for attendance history
const mockAttendanceHistory = [
  { id: 'a1', teacherId: 't1', teacherName: 'John Smith', date: '2023-05-01', status: 'present' },
  { id: 'a2', teacherId: 't2', teacherName: 'Sarah Johnson', date: '2023-05-01', status: 'present' },
  { id: 'a3', teacherId: 't3', teacherName: 'Michael Brown', date: '2023-05-01', status: 'absent' },
  { id: 'a4', teacherId: 't1', teacherName: 'John Smith', date: '2023-05-02', status: 'present' },
  { id: 'a5', teacherId: 't2', teacherName: 'Sarah Johnson', date: '2023-05-02', status: 'absent' },
  { id: 'a6', teacherId: 't3', teacherName: 'Michael Brown', date: '2023-05-02', status: 'present' },
];

type AttendanceRecord = {
  teacherId: string;
  status: 'present' | 'absent';
};

const TeacherAttendance: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [teachers, setTeachers] = useState(mockTeachers);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceHistory, setAttendanceHistory] = useState(mockAttendanceHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize attendance records with all teachers marked as present
  useEffect(() => {
    const initialRecords = teachers.map(teacher => ({
      teacherId: teacher.id,
      status: 'present' as const
    }));
    setAttendanceRecords(initialRecords);
  }, [teachers]);

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle attendance status change
  const handleStatusChange = (teacherId: string, status: 'present' | 'absent') => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.teacherId === teacherId ? { ...record, status } : record
      )
    );
  };

  // Submit attendance records
  const handleSubmitAttendance = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add the new records to the history
      const newRecords = attendanceRecords.map(record => {
        const teacher = teachers.find(t => t.id === record.teacherId);
        return {
          id: `a${Math.random().toString(36).substr(2, 9)}`,
          teacherId: record.teacherId,
          teacherName: teacher?.name || 'Unknown',
          date: format(date, 'yyyy-MM-dd'),
          status: record.status
        };
      });
      
      setAttendanceHistory(prev => [...newRecords, ...prev]);
      
      toast({
        title: "Success!",
        description: "Teacher attendance has been recorded.",
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  // Filter attendance history
  const filteredHistory = attendanceHistory.filter(record => {
    let matchesSearch = true;
    let matchesDateRange = true;
    
    if (searchTerm) {
      matchesSearch = record.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    if (startDate) {
      const recordDate = new Date(record.date);
      matchesDateRange = recordDate >= startDate;
    }
    
    if (endDate) {
      const recordDate = new Date(record.date);
      matchesDateRange = matchesDateRange && recordDate <= endDate;
    }
    
    return matchesSearch && matchesDateRange;
  });

  // Refresh data
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setTeachers(mockTeachers);
      setAttendanceHistory(mockAttendanceHistory);
      setIsLoading(false);
      
      toast({
        title: "Refreshed!",
        description: "Teacher data has been refreshed.",
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Attendance</h1>
          <p className="text-muted-foreground">
            Mark and track attendance for all teachers
          </p>
        </div>
        <Button size="sm" className="flex items-center gap-2" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="mark-attendance">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mark-attendance">Mark Attendance</TabsTrigger>
          <TabsTrigger value="view-history">View History</TabsTrigger>
        </TabsList>
        
        {/* Mark Attendance Tab */}
        <TabsContent value="mark-attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Mark Attendance for {format(date, 'MMMM d, yyyy')}</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="ml-auto h-10 w-fit">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search input */}
                <div className="relative flex-1 mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search teachers..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Teachers table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeachers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-6">
                            No teachers found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTeachers.map((teacher) => {
                          const record = attendanceRecords.find(r => r.teacherId === teacher.id);
                          const isPresent = record?.status === 'present';
                          
                          return (
                            <TableRow key={teacher.id}>
                              <TableCell className="font-medium">{teacher.name}</TableCell>
                              <TableCell>{teacher.email}</TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant={isPresent ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => handleStatusChange(teacher.id, 'present')}
                                      className={cn("w-24", 
                                        isPresent ? "bg-green-500 hover:bg-green-600" : ""
                                      )}
                                    >
                                      <Check className={`mr-1 h-4 w-4 ${isPresent ? "text-white" : ""}`} />
                                      Present
                                    </Button>
                                    
                                    <Button
                                      variant={!isPresent ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => handleStatusChange(teacher.id, 'absent')}
                                      className={cn("w-24", 
                                        !isPresent ? "bg-red-500 hover:bg-red-600" : ""
                                      )}
                                    >
                                      <X className={`mr-1 h-4 w-4 ${!isPresent ? "text-white" : ""}`} />
                                      Absent
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Submit button */}
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleSubmitAttendance} 
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Attendance"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* View History Tab */}
        <TabsContent value="view-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search teacher..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'PP') : 'Start Date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, 'PP') : 'End Date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => date > new Date() || (startDate ? date < startDate : false)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setStartDate(undefined);
                        setEndDate(undefined);
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                {/* History table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-6">
                            No attendance records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredHistory.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.teacherName}</TableCell>
                            <TableCell>{format(new Date(record.date), 'MMMM d, yyyy')}</TableCell>
                            <TableCell className="text-center">
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                record.status === 'present' 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              )}>
                                {record.status === 'present' ? 'Present' : 'Absent'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherAttendance;
