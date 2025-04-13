
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Announcements = () => {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">
            {role === 'admin' || role === 'teacher' 
              ? 'Create and manage school announcements'
              : 'View school announcements and updates'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>School Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-12">
            <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Announcements</h3>
            <p className="mt-2 text-muted-foreground">
              There are currently no announcements to display.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Announcements;
