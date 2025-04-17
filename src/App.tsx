
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import TeacherDashboard from "./pages/dashboards/TeacherDashboard";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import ParentDashboard from "./pages/dashboards/ParentDashboard";
import Attendance from "./pages/Attendance";
import Marks from "./pages/Marks";
import ReportCards from "./pages/ReportCards";
import Announcements from "./pages/Announcements";
import Timetable from "./pages/Timetable";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import Students from "./pages/Students";
import StudentIssues from "./pages/StudentIssues";
import SubmitIssue from "./pages/SubmitIssue";
import TeacherAttendance from "./pages/TeacherAttendance";
import About from "./pages/StaticPages/About";
import PrivacyPolicy from "./pages/StaticPages/PrivacyPolicy";
import TermsConditions from "./pages/StaticPages/TermsConditions";
import Blog from "./pages/StaticPages/Blog";
import Careers from "./pages/StaticPages/Careers";
import ReportAbuse from "./pages/StaticPages/ReportAbuse";
import Support from "./pages/StaticPages/Support";
import FAQ from "./pages/StaticPages/FAQ";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Static Content Pages - Public */}
            <Route path="/about" element={<><About /><Footer /></>} />
            <Route path="/privacy-policy" element={<><PrivacyPolicy /><Footer /></>} />
            <Route path="/terms-conditions" element={<><TermsConditions /><Footer /></>} />
            <Route path="/blog" element={<><Blog /><Footer /></>} />
            <Route path="/careers" element={<><Careers /><Footer /></>} />
            <Route path="/report-abuse" element={<><ReportAbuse /><Footer /></>} />
            <Route path="/support" element={<><Support /><Footer /></>} />
            <Route path="/faq" element={<><FAQ /><Footer /></>} />

            {/* Protected Routes - Admin */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout>
                  <AdminDashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Protected Routes - Department Admin */}
            <Route path="/dashboard/department_admin" element={
              <ProtectedRoute allowedRoles={['department_admin']}>
                <AppLayout>
                  <AdminDashboard />
                </AppLayout>
              </ProtectedRoute>
            } />

            {/* Protected Routes - Teacher */}
            <Route path="/dashboard/teacher" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <AppLayout>
                  <TeacherDashboard />
                </AppLayout>
              </ProtectedRoute>
            } />

            {/* Protected Routes - Student */}
            <Route path="/dashboard/student" element={
              <ProtectedRoute allowedRoles={['student']}>
                <AppLayout>
                  <StudentDashboard />
                </AppLayout>
              </ProtectedRoute>
            } />

            {/* Protected Routes - Parent */}
            <Route path="/dashboard/parent" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <AppLayout>
                  <ParentDashboard />
                </AppLayout>
              </ProtectedRoute>
            } />

            {/* Teacher Attendance Route */}
            <Route path="/teacher-attendance" element={
              <ProtectedRoute allowedRoles={['admin', 'department_admin']}>
                <AppLayout>
                  <TeacherAttendance />
                </AppLayout>
              </ProtectedRoute>
            } />

            {/* Other Protected Routes */}
            <Route path="/attendance" element={
              <ProtectedRoute>
                <AppLayout>
                  <Attendance />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/marks" element={
              <ProtectedRoute>
                <AppLayout>
                  <Marks />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/report-cards" element={
              <ProtectedRoute>
                <AppLayout>
                  <ReportCards />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/announcements" element={
              <ProtectedRoute>
                <AppLayout>
                  <Announcements />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/timetable" element={
              <ProtectedRoute>
                <AppLayout>
                  <Timetable />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/users" element={
              <ProtectedRoute allowedRoles={['admin', 'department_admin']}>
                <AppLayout>
                  <Users />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/students" element={
              <ProtectedRoute allowedRoles={['teacher', 'admin', 'department_admin']}>
                <AppLayout>
                  <Students />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/student-issues" element={
              <ProtectedRoute allowedRoles={['teacher', 'admin', 'department_admin']}>
                <AppLayout>
                  <StudentIssues />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/submit-issue" element={
              <ProtectedRoute allowedRoles={['student']}>
                <AppLayout>
                  <SubmitIssue />
                </AppLayout>
              </ProtectedRoute>
            } />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
