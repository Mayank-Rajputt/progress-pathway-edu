
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CalendarDays,
  BookOpen,
  GraduationCap,
  Clock,
  Bell,
  Users,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AnnouncementsWidget from '@/components/widgets/AnnouncementsWidget';
import GradesWidget from '@/components/widgets/GradesWidget';
import TimetableWidget from '@/components/widgets/TimetableWidget';

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - In a real app, this would be fetched from the backend
  const children = [
    {
      id: '101',
      name: 'Alex Johnson',
      grade: '10th',
      section: 'A',
      rollNo: '1024',
      avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Alex+Johnson'
    }
  ];

  // Mock data for quick actions
  const quickActions = [
    { title: 'View Grades', icon: <GraduationCap size={18} />, path: '/marks' },
    { title: 'View Attendance', icon: <CalendarDays size={18} />, path: '/attendance' },
    { title: 'Report Card', icon: <BookOpen size={18} />, path: '/report-cards' },
    { title: 'Messages', icon: <MessageSquare size={18} />, path: '/messages' },
  ];

  // Mock data for stats
  const stats = [
    { title: 'Attendance', value: '95%', icon: <CalendarDays size={24} className="text-parent" /> },
    { title: 'Current GPA', value: '3.8', icon: <GraduationCap size={24} className="text-parent" /> },
    { title: 'Due Assignments', value: '3', icon: <BookOpen size={24} className="text-parent" /> },
    { title: 'Upcoming Tests', value: '2', icon: <Clock size={24} className="text-parent" /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">
          Here's how your child is performing
        </p>
      </div>

      {/* Child Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            My Children
          </CardTitle>
        </CardHeader>
        <CardContent>
          {children.map((child) => (
            <div key={child.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <img 
                src={child.avatar} 
                alt={child.name} 
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium">{child.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Grade: {child.grade} | Section: {child.section} | Roll No: {child.rollNo}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link to={action.path} key={index}>
            <Button
              variant="outline"
              className="w-full h-full min-h-20 flex flex-col items-center justify-center gap-2 p-4 hover:bg-parent hover:text-white hover:border-parent transition-colors"
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
              <GraduationCap className="h-5 w-5" />
              Recent Grades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GradesWidget />
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Timetable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TimetableWidget />
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            School Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnnouncementsWidget />
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentDashboard;
