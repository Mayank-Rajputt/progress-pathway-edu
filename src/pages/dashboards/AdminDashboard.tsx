
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  GraduationCap,
  CalendarDays,
  Clock,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import RecentActivityWidget from '@/components/widgets/RecentActivityWidget';
import AnnouncementsWidget from '@/components/widgets/AnnouncementsWidget';
import TeacherAttendanceWidget from '@/components/widgets/TeacherAttendanceWidget';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data for dashboard stats
  const stats = [
    { title: 'Total Users', value: '1,234', icon: <Users size={24} className="text-admin" /> },
    { title: 'Students', value: '987', icon: <GraduationCap size={24} className="text-student" /> },
    { title: 'Teachers', value: '64', icon: <Users size={24} className="text-teacher" /> },
    { title: 'Average Attendance', value: '92%', icon: <CalendarDays size={24} className="text-admin" /> },
    { title: 'Classes', value: '38', icon: <Clock size={24} className="text-admin" /> },
    { title: 'Reports Generated', value: '342', icon: <BookOpen size={24} className="text-admin" /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">
          Here's what's happening in your school today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Teacher Attendance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-teacher" />
                Teacher Attendance
              </CardTitle>
              <Link 
                to="/teacher-attendance" 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <TeacherAttendanceWidget />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivityWidget />
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnnouncementsWidget />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
