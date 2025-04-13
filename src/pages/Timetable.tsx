
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Timetable = () => {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
          <p className="text-muted-foreground">
            {role === 'admin' || role === 'teacher' 
              ? 'Manage class schedules and timetables'
              : 'View your class schedule'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-12">
            <Clock className="h-16 w-16 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Weekly Schedule</h3>
            <p className="mt-2 text-muted-foreground">
              Your class schedule will be displayed here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timetable;
