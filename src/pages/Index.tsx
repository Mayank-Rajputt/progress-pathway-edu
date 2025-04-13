
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      // If user is authenticated, redirect to their role-specific dashboard
      navigate(`/dashboard/${user.role}`);
    } else {
      // If not authenticated, redirect to welcome page
      navigate('/');
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  // Show loading screen while checking authentication or redirecting
  return <LoadingScreen />;
};

export default Index;
