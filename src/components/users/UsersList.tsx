
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from 'lucide-react';
import { UserData } from '@/types/user';

interface UsersListProps {
  users: UserData[];
  isLoading: boolean;
  onEditUser: (user: UserData) => void;
  getBadgeClass: (role: string) => string;
}

const UsersList: React.FC<UsersListProps> = ({ 
  users, 
  isLoading, 
  onEditUser, 
  getBadgeClass 
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Department</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Join Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeClass(user.role)}`}>
                  {user.role === 'department_admin' 
                    ? 'Dept Admin' 
                    : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {user.department || '-'}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {user.phoneNumber || '-'}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell">{new Date(user.joinDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="mr-1"
                  onClick={() => onEditUser(user)}
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersList;
