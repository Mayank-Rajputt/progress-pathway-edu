
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { School, Users, GraduationCap, UserCog, BookOpen } from 'lucide-react';

const Welcome: React.FC = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-admin" />,
      title: 'Role-Based Access',
      description: 'Specialized dashboards for Administrators, Teachers, Students and Parents.',
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-teacher" />,
      title: 'Academic Tracking',
      description: 'Comprehensive tools for managing attendance, marks, and report cards.',
    },
    {
      icon: <BookOpen className="h-8 w-8 text-student" />,
      title: 'Learning Management',
      description: 'Timetable management, announcements, and resource sharing.',
    },
    {
      icon: <UserCog className="h-8 w-8 text-parent" />,
      title: 'Communication',
      description: 'Seamless messaging between stakeholders for effective communication.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/90 to-primary text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <School size={80} />
          </div>
          <h1 className="text-5xl font-bold mb-6">EduTrack</h1>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            A comprehensive student information management system for educational institutions
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login">
              <Button size="lg" variant="secondary" className="min-w-32">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 min-w-32">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border rounded-xl bg-card hover:shadow-md transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">For Every Educational Stakeholder</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 border border-admin rounded-xl bg-card hover:shadow-md transition-shadow">
              <div className="h-12 w-12 flex items-center justify-center bg-admin text-white rounded-lg mb-4">
                <UserCog size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-admin">Administrators</h3>
              <p className="text-muted-foreground mb-4">
                Manage institution data, users, and monitor academic activities.
              </p>
              <div className="pt-4 border-t">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-admin"></div>
                    User management
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-admin"></div>
                    Institution-wide reporting
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-admin"></div>
                    System configuration
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 border border-teacher rounded-xl bg-card hover:shadow-md transition-shadow">
              <div className="h-12 w-12 flex items-center justify-center bg-teacher text-white rounded-lg mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-teacher">Teachers</h3>
              <p className="text-muted-foreground mb-4">
                Track student attendance, manage grades, and communicate with parents.
              </p>
              <div className="pt-4 border-t">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teacher"></div>
                    Attendance tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teacher"></div>
                    Grade management
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teacher"></div>
                    Report generation
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 border border-student rounded-xl bg-card hover:shadow-md transition-shadow">
              <div className="h-12 w-12 flex items-center justify-center bg-student text-white rounded-lg mb-4">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-student">Students</h3>
              <p className="text-muted-foreground mb-4">
                Access class schedules, assignments, grades, and academic resources.
              </p>
              <div className="pt-4 border-t">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-student"></div>
                    Performance tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-student"></div>
                    Class timetables
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-student"></div>
                    Assignment submissions
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 border border-parent rounded-xl bg-card hover:shadow-md transition-shadow">
              <div className="h-12 w-12 flex items-center justify-center bg-parent text-white rounded-lg mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-parent">Parents</h3>
              <p className="text-muted-foreground mb-4">
                Monitor your child's progress, attendance, and communicate with teachers.
              </p>
              <div className="pt-4 border-t">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-parent"></div>
                    Progress monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-parent"></div>
                    Teacher communication
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-parent"></div>
                    Attendance tracking
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-10 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <School className="text-primary" size={24} />
              <span className="text-xl font-bold">EduTrack</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} EduTrack. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
