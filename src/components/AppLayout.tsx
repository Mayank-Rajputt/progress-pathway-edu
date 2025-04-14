
import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className={`flex-1 overflow-auto transition-all duration-200 ${isMobile ? 'ml-0' : 'md:ml-64'}`}>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
