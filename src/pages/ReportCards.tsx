
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ReportCards = () => {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report Cards</h1>
          <p className="text-muted-foreground">
            {role === 'admin' || role === 'teacher' 
              ? 'Generate and manage student report cards'
              : 'View your academic report cards'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-12">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Term Reports</h3>
            <p className="mt-2 text-muted-foreground">
              This section will display academic report cards and term assessments.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportCards;
