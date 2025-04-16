
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Users, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface TeacherAttendanceStats {
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

const TeacherAttendanceWidget: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<TeacherAttendanceStats>({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const today = new Date();
  
  const fetchAttendanceData = () => {
    setIsLoading(true);
    
    // Simulate API call for teacher attendance data
    setTimeout(() => {
      // Mock data with random present teachers to simulate real-time updates
      const total = 8;
      const present = Math.floor(Math.random() * 3) + 5; // Random between 5-7 present
      const absent = total - present;
      const percentage = Math.round((present / total) * 100);
      
      setAttendanceData({
        total,
        present,
        absent,
        percentage
      });
      
      setIsLoading(false);
    }, 1000);
  };
  
  useEffect(() => {
    fetchAttendanceData();
    
    // Set up interval to refresh data every 60 seconds for demo purposes
    const interval = setInterval(() => {
      fetchAttendanceData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleRefresh = () => {
    fetchAttendanceData();
    toast.info("Attendance data refreshed");
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-teacher" />
            Teacher Attendance
          </div>
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription>{format(today, 'MMMM d, yyyy')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div className="text-2xl font-bold">{attendanceData.percentage}%</div>
          <div className="text-sm text-muted-foreground">
            {attendanceData.present} / {attendanceData.total} present
          </div>
        </div>
        
        <Progress value={attendanceData.percentage} className="h-2 mb-4" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            <div>
              <div className="text-sm font-medium">Present</div>
              <div className="text-lg">{attendanceData.present}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <XCircle className="h-5 w-5 mr-2 text-red-500" />
            <div>
              <div className="text-sm font-medium">Absent</div>
              <div className="text-lg">{attendanceData.absent}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherAttendanceWidget;
