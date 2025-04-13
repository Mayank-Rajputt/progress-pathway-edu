
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Attendance = () => {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            {role === 'admin' || role === 'teacher' 
              ? 'Manage and track student attendance'
              : 'View your attendance records'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          
          {(role === 'admin' || role === 'teacher') && (
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Manage Attendance</span>
            </TabsTrigger>
          )}
          
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12">
                <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Attendance Information</h3>
                <p className="mt-2 text-muted-foreground">
                  This section will display attendance statistics and recent records.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {(role === 'admin' || role === 'teacher') && (
          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Manage Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-12">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Attendance Management</h3>
                  <p className="mt-2 text-muted-foreground">
                    Here you can mark and manage student attendance records.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12">
                <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Attendance Reports</h3>
                <p className="mt-2 text-muted-foreground">
                  View and generate detailed attendance reports.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
