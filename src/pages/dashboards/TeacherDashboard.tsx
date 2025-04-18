import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  CalendarDays,
  BookOpen,
  Clock,
  AlertCircle,
  Edit,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AttendanceWidget from '@/components/widgets/AttendanceWidget';
import TimetableWidget from '@/components/widgets/TimetableWidget';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data for dashboard stats
  const stats = [
    { title: 'My Students', value: '128', icon: <Users size={24} className="text-teacher" /> },
    { title: 'Classes Today', value: '4', icon: <Clock size={24} className="text-teacher" /> },
    { title: 'Average Attendance', value: '92%', icon: <CalendarDays size={24} className="text-teacher" /> },
    { title: 'Pending Reports', value: '12', icon: <AlertCircle size={24} className="text-red-500" /> },
  ];

  // Mock data for quick actions
  const quickActions = [
    { title: 'Mark Attendance', icon: <CalendarDays size={18} />, path: '/attendance' },
    { title: 'Enter Marks', icon: <Edit size={18} />, path: '/marks' },
    { title: 'View Timetable', icon: <Clock size={18} />, path: '/timetable' },
    { title: 'Generate Report', icon: <BookOpen size={18} />, path: '/report-cards' },
    { title: 'Student Issues', icon: <MessageSquare size={18} />, path: '/student-issues' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your classes today
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link to={action.path} key={index}>
            <Button
              variant="outline"
              className="w-full h-full min-h-20 flex flex-col items-center justify-center gap-2 p-4 hover:bg-teacher hover:text-white hover:border-teacher transition-colors"
            >
              {action.icon}
              <span>{action.title}</span>
            </Button>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceWidget />
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              My Timetable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TimetableWidget />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
