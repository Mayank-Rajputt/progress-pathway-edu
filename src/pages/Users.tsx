
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users as UsersIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Users = () => {
  const { user } = useAuth();
  
  if (user?.role !== 'admin') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage school users and their access permissions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-12">
            <UsersIcon className="h-16 w-16 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">User Directory</h3>
            <p className="mt-2 text-muted-foreground">
              Manage administrators, teachers, students, and parents.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
