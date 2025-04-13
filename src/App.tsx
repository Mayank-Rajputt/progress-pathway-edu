
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

            {/* Protected Routes - Admin */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
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

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
