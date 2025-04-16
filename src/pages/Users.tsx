
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users as UsersIcon, UserPlus } from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import UserSearch from '@/components/users/UserSearch';
import UsersList from '@/components/users/UsersList';
import EditUserDialog from '@/components/users/EditUserDialog';
import { getBadgeClass } from '@/utils/userUtils';

const Users = () => {
  const {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    filteredUsers,
    isLoading,
    isEditDialogOpen,
    setIsEditDialogOpen,
    formData,
    refreshUsers,
    handleEditClick,
    handleFormChange,
    handleSelectChange,
    handleSubmit
  } = useUserManagement();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users in the system
          </p>
        </div>
        <Button size="sm" className="flex items-center gap-2">
          <UserPlus size={16} />
          Add New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and filters */}
            <UserSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onRefresh={refreshUsers}
              isLoading={isLoading}
            />

            {/* Users table */}
            <UsersList
              users={filteredUsers}
              isLoading={isLoading}
              onEditUser={handleEditClick}
              getBadgeClass={getBadgeClass}
            />
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <EditUserDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        onFormChange={handleFormChange}
        onSelectChange={handleSelectChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Users;
