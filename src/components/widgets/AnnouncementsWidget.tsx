
import React from 'react';
import { Bell } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: 'low' | 'medium' | 'high';
}

const AnnouncementsWidget: React.FC = () => {
  // Mock data for announcements
  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Parents Teacher Meeting',
      content: 'The PTM is scheduled for 25th April. All parents are requested to attend.',
      date: '2025-04-10',
      author: 'Principal',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Annual Sports Day',
      content: 'Annual Sports Day will be held on May 5th. All students must participate in at least one event.',
      date: '2025-04-08',
      author: 'Sports Department',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Library Book Return',
      content: 'All library books must be returned by April 30th.',
      date: '2025-04-05',
      author: 'Librarian',
      priority: 'low',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {announcements.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 mx-auto text-muted-foreground opacity-30" />
          <p className="mt-2 text-muted-foreground">No announcements at this time</p>
        </div>
      ) : (
        announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-base">{announcement.title}</h3>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(
                  announcement.priority
                )}`}
              >
                {announcement.priority}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{announcement.content}</p>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{announcement.author}</span>
              <span>{formatDate(announcement.date)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AnnouncementsWidget;
