
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Users, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import axios from 'axios';

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
  
  const fetchAttendanceData = async () => {
    setIsLoading(true);
    
    try {
      // Get today's date in YYYY-MM-DD format
      const dateString = format(today, 'yyyy-MM-dd');
      
      // Fetch attendance data from API
      const response = await axios.get(`/api/teacher-attendance/summary?date=${dateString}`);
      
      if (response.data.success) {
        const data = response.data.data;
        setAttendanceData({
          total: data.total,
          present: data.present,
          absent: data.absent,
          percentage: data.percentage
        });
      }
    } catch (error) {
      console.error('Error fetching teacher attendance data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAttendanceData();
    
    // Set up interval to refresh data every 60 seconds
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
