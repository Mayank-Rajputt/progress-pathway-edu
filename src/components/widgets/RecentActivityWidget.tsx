
import React from 'react';
import { Clock } from 'lucide-react';

interface Activity {
  id: string;
  action: string;
  user: {
    name: string;
    role: string;
  };
  timestamp: string;
  resource?: string;
}

const RecentActivityWidget: React.FC = () => {
  // Mock data for recent activities
  const activities: Activity[] = [
    {
      id: '1',
      action: 'logged in',
      user: {
        name: 'John Smith',
        role: 'teacher',
      },
      timestamp: '2025-04-12T10:30:00Z',
    },
    {
      id: '2',
      action: 'submitted',
      user: {
        name: 'Sarah Johnson',
        role: 'student',
      },
      timestamp: '2025-04-12T09:45:00Z',
      resource: 'Math Assignment',
    },
    {
      id: '3',
      action: 'updated',
      user: {
        name: 'Mark Davis',
        role: 'admin',
      },
      timestamp: '2025-04-12T09:15:00Z',
      resource: 'School Calendar',
    },
    {
      id: '4',
      action: 'marked attendance',
      user: {
        name: 'Lisa Wilson',
        role: 'teacher',
      },
      timestamp: '2025-04-12T08:30:00Z',
      resource: 'Class 10-A',
    },
    {
      id: '5',
      action: 'viewed',
      user: {
        name: 'Robert Brown',
        role: 'parent',
      },
      timestamp: '2025-04-12T08:15:00Z',
      resource: 'Child\'s Report Card',
    },
  ];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-admin text-white';
      case 'teacher':
        return 'bg-teacher text-white';
      case 'student':
        return 'bg-student text-white';
      case 'parent':
        return 'bg-parent text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-2">
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 mx-auto text-muted-foreground opacity-30" />
          <p className="mt-2 text-muted-foreground">No recent activity</p>
        </div>
      ) : (
        activities.map((activity) => (
          <div
            key={activity.id}
            className="py-3 border-b last:border-b-0 hover:bg-muted/10 px-1 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(
                activity.user.role
              )}`}>
                {activity.user.role}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(activity.timestamp)}
              </span>
            </div>
            <p className="mt-1 text-sm">
              <span className="font-medium">{activity.user.name}</span>{' '}
              {activity.action}{' '}
              {activity.resource && (
                <span className="font-medium">{activity.resource}</span>
              )}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentActivityWidget;
