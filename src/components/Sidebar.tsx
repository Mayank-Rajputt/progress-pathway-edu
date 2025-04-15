
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  GraduationCap,
  ClipboardList,
  BookOpen,
  MessageSquare,
  Clock,
  UserCog,
  LogOut,
  Menu,
  X,
  Bell,
  CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Define navigation items for each role
const navItems: Record<UserRole, { name: string; path: string; icon: React.ReactNode }[]> = {
  admin: [
    { name: 'Dashboard', path: '/dashboard/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'User Management', path: '/users', icon: <Users size={20} /> },
    { name: 'Teacher Attendance', path: '/teacher-attendance', icon: <CheckSquare size={20} /> },
    { name: 'Student Attendance', path: '/attendance', icon: <CalendarDays size={20} /> },
    { name: 'Marks', path: '/marks', icon: <GraduationCap size={20} /> },
    { name: 'Report Cards', path: '/report-cards', icon: <BookOpen size={20} /> },
    { name: 'Announcements', path: '/announcements', icon: <MessageSquare size={20} /> },
    { name: 'Timetable', path: '/timetable', icon: <Clock size={20} /> },
    { name: 'Profile', path: '/profile', icon: <UserCog size={20} /> },
  ],
  teacher: [
    { name: 'Dashboard', path: '/dashboard/teacher', icon: <LayoutDashboard size={20} /> },
    { name: 'Students', path: '/students', icon: <Users size={20} /> },
    { name: 'Attendance', path: '/attendance', icon: <CalendarDays size={20} /> },
    { name: 'Marks', path: '/marks', icon: <GraduationCap size={20} /> },
    { name: 'Report Cards', path: '/report-cards', icon: <BookOpen size={20} /> },
    { name: 'Student Issues', path: '/student-issues', icon: <MessageSquare size={20} /> },
    { name: 'Announcements', path: '/announcements', icon: <Bell size={20} /> },
    { name: 'Timetable', path: '/timetable', icon: <Clock size={20} /> },
    { name: 'Profile', path: '/profile', icon: <UserCog size={20} /> },
  ],
  student: [
    { name: 'Dashboard', path: '/dashboard/student', icon: <LayoutDashboard size={20} /> },
    { name: 'Attendance', path: '/attendance', icon: <CalendarDays size={20} /> },
    { name: 'Marks', path: '/marks', icon: <GraduationCap size={20} /> },
    { name: 'Report Cards', path: '/report-cards', icon: <BookOpen size={20} /> },
    { name: 'Submit Issue', path: '/submit-issue', icon: <MessageSquare size={20} /> },
    { name: 'Announcements', path: '/announcements', icon: <Bell size={20} /> },
    { name: 'Timetable', path: '/timetable', icon: <Clock size={20} /> },
    { name: 'Profile', path: '/profile', icon: <UserCog size={20} /> },
  ],
  parent: [
    { name: 'Dashboard', path: '/dashboard/parent', icon: <LayoutDashboard size={20} /> },
    { name: 'Attendance', path: '/attendance', icon: <CalendarDays size={20} /> },
    { name: 'Marks', path: '/marks', icon: <GraduationCap size={20} /> },
    { name: 'Report Cards', path: '/report-cards', icon: <BookOpen size={20} /> },
    { name: 'Announcements', path: '/announcements', icon: <MessageSquare size={20} /> },
    { name: 'Timetable', path: '/timetable', icon: <Clock size={20} /> },
    { name: 'Profile', path: '/profile', icon: <UserCog size={20} /> },
  ],
};

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!user) {
    return null;
  }

  const items = navItems[user.role];
  const roleColor = `bg-${user.role}`;

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-background"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full ${roleColor} flex items-center justify-center text-white font-medium`}>
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs text-white role-badge-${user.role}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
