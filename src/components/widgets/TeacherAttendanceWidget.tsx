
import React from 'react';
import { format } from 'date-fns';
import { Users, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Mock data for teacher attendance
const mockTodayAttendance = {
  total: 8,
  present: 6,
  absent: 2,
  percentage: 75
};

const TeacherAttendanceWidget: React.FC = () => {
  const today = new Date();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Users className="mr-2 h-4 w-4 text-teacher" />
          Teacher Attendance
        </CardTitle>
        <CardDescription>{format(today, 'MMMM d, yyyy')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div className="text-2xl font-bold">{mockTodayAttendance.percentage}%</div>
          <div className="text-sm text-muted-foreground">
            {mockTodayAttendance.present} / {mockTodayAttendance.total} present
          </div>
        </div>
        
        <Progress value={mockTodayAttendance.percentage} className="h-2 mb-4" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            <div>
              <div className="text-sm font-medium">Present</div>
              <div className="text-lg">{mockTodayAttendance.present}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <XCircle className="h-5 w-5 mr-2 text-red-500" />
            <div>
              <div className="text-sm font-medium">Absent</div>
              <div className="text-lg">{mockTodayAttendance.absent}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherAttendanceWidget;
