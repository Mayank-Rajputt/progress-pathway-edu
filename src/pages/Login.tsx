
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { School } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      // Redirect will be handled in the login function
    } catch (error) {
      // Error handling is in the login function
      setIsSubmitting(false);
    }
  };

  const loginAsDemoUser = async (type: 'admin' | 'teacher' | 'student' | 'parent') => {
    setIsSubmitting(true);
    const demoCredentials = {
      admin: { email: 'admin@edutrack.com', password: 'admin123' },
      teacher: { email: 'teacher@edutrack.com', password: 'teacher123' },
      student: { email: 'student@edutrack.com', password: 'student123' },
      parent: { email: 'parent@edutrack.com', password: 'parent123' },
    };
    
    try {
      await login(demoCredentials[type].email, demoCredentials[type].password);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel with image/design */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary justify-center items-center p-12">
        <div className="max-w-lg text-white">
          <School size={80} className="mb-8" />
          <h1 className="text-4xl font-bold mb-4">EduTrack</h1>
          <p className="text-xl mb-8">
            Streamline your educational institution with our comprehensive student information management system.
          </p>
          <div className="bg-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Role-based access control</li>
              <li>Attendance management</li>
              <li>Grades tracking</li>
              <li>Report card generation</li>
              <li>Communication tools</li>
              <li>Timetable management</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right panel with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <School size={40} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to your EduTrack account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>

          <div className="space-y-4 pt-4 border-t">
            <div className="text-center text-sm text-muted-foreground">
              Demo accounts
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-admin text-admin hover:bg-admin hover:text-white"
                onClick={() => loginAsDemoUser('admin')}
                disabled={isSubmitting}
              >
                Admin Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-teacher text-teacher hover:bg-teacher hover:text-white"
                onClick={() => loginAsDemoUser('teacher')}
                disabled={isSubmitting}
              >
                Teacher Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-student text-student hover:bg-student hover:text-white"
                onClick={() => loginAsDemoUser('student')}
                disabled={isSubmitting}
              >
                Student Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-parent text-parent hover:bg-parent hover:text-white"
                onClick={() => loginAsDemoUser('parent')}
                disabled={isSubmitting}
              >
                Parent Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
