
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Marks = () => {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marks</h1>
          <p className="text-muted-foreground">
            {role === 'admin' || role === 'teacher' 
              ? 'Manage and track student marks'
              : 'View your academic marks'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-12">
            <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Academic Marks</h3>
            <p className="mt-2 text-muted-foreground">
              This section will display academic performance and marks information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Marks;
