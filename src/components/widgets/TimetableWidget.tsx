
import React from 'react';
import { Clock } from 'lucide-react';

interface TimeSlot {
  id: string;
  subject: string;
  startTime: string;
  endTime: string;
  teacher?: string;
  classroom: string;
  current?: boolean;
}

const TimetableWidget: React.FC = () => {
  // Mock data for timetable
  const timeSlots: TimeSlot[] = [
    {
      id: '1',
      subject: 'Mathematics',
      startTime: '08:00',
      endTime: '09:00',
      teacher: 'Ms. Johnson',
      classroom: 'Room 101',
    },
    {
      id: '2',
      subject: 'Science',
      startTime: '09:10',
      endTime: '10:10',
      teacher: 'Mr. Smith',
      classroom: 'Lab 3',
    },
    {
      id: '3',
      subject: 'English',
      startTime: '10:20',
      endTime: '11:20',
      teacher: 'Mrs. Davis',
      classroom: 'Room 205',
      current: true,
    },
    {
      id: '4',
      subject: 'Lunch Break',
      startTime: '11:30',
      endTime: '12:10',
      classroom: 'Cafeteria',
    },
    {
      id: '5',
      subject: 'History',
      startTime: '12:20',
      endTime: '13:20',
      teacher: 'Mr. Wilson',
      classroom: 'Room 302',
    },
    {
      id: '6',
      subject: 'Physical Education',
      startTime: '13:30',
      endTime: '14:30',
      teacher: 'Coach Thompson',
      classroom: 'Gym',
    },
  ];

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div className="space-y-4">
      {timeSlots.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 mx-auto text-muted-foreground opacity-30" />
          <p className="mt-2 text-muted-foreground">No classes scheduled for today</p>
        </div>
      ) : (
        <div className="space-y-3">
          {timeSlots.map((slot) => (
            <div
              key={slot.id}
              className={`p-3 border rounded-lg flex items-center gap-3 ${
                slot.current ? 'bg-muted border-primary' : 'hover:bg-muted/30'
              } transition-colors`}
            >
              <div className="min-w-20 text-center">
                <div className="text-xs text-muted-foreground">
                  {formatTime(slot.startTime)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTime(slot.endTime)}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">
                  {slot.subject}
                  {slot.current && (
                    <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </h3>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {slot.teacher && <span className="mr-3">{slot.teacher}</span>}
                  <span>{slot.classroom}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimetableWidget;
