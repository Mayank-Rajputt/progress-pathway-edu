
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  Edit, 
  Plus, 
  Trash2, 
  Save,
  Check
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface TimeSlot {
  id: string;
  day: string;
  subject: string;
  startTime: string;
  endTime: string;
  teacher?: string;
  classroom: string;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Mock timetable data
const initialTimeSlots: TimeSlot[] = [
  {
    id: '1',
    day: 'Monday',
    subject: 'Mathematics',
    startTime: '08:00',
    endTime: '09:00',
    teacher: 'Ms. Johnson',
    classroom: 'Room 101',
  },
  {
    id: '2',
    day: 'Monday',
    subject: 'Science',
    startTime: '09:10',
    endTime: '10:10',
    teacher: 'Mr. Smith',
    classroom: 'Lab 3',
  },
  {
    id: '3',
    day: 'Monday',
    subject: 'English',
    startTime: '10:20',
    endTime: '11:20',
    teacher: 'Mrs. Davis',
    classroom: 'Room 205',
  },
  {
    id: '4',
    day: 'Tuesday',
    subject: 'History',
    startTime: '08:00',
    endTime: '09:00',
    teacher: 'Mr. Wilson',
    classroom: 'Room 302',
  },
  {
    id: '5',
    day: 'Tuesday',
    subject: 'Physical Education',
    startTime: '09:10',
    endTime: '10:10',
    teacher: 'Coach Thompson',
    classroom: 'Gym',
  },
  {
    id: '6',
    day: 'Wednesday',
    subject: 'Computer Science',
    startTime: '08:00',
    endTime: '09:00',
    teacher: 'Ms. Taylor',
    classroom: 'Lab 2',
  }
];

const Timetable = () => {
  const { user } = useAuth();
  const role = user?.role;
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialTimeSlots);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [newTimeSlot, setNewTimeSlot] = useState<Omit<TimeSlot, 'id'>>({
    day: selectedDay,
    subject: '',
    startTime: '',
    endTime: '',
    teacher: '',
    classroom: '',
  });

  const filteredSlots = timeSlots
    .filter(slot => slot.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newId = (parseInt(timeSlots[timeSlots.length - 1]?.id || '0') + 1).toString();
    
    const slotToAdd = {
      id: newId,
      ...newTimeSlot,
      day: selectedDay
    };
    
    setTimeSlots([...timeSlots, slotToAdd]);
    
    // Reset form
    setNewTimeSlot({
      day: selectedDay,
      subject: '',
      startTime: '',
      endTime: '',
      teacher: '',
      classroom: '',
    });
    
    setIsAddSlotOpen(false);
    toast.success('Class added to timetable');
  };

  const handleEditSlot = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingSlot) return;
    
    setTimeSlots(timeSlots.map(slot => 
      slot.id === editingSlot.id ? editingSlot : slot
    ));
    
    setEditingSlot(null);
    toast.success('Timetable updated');
  };

  const handleDeleteSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
    toast.success('Class removed from timetable');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const canEdit = role === 'admin' || role === 'teacher';

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
        
        {canEdit && (
          <Button
            variant={isEditMode ? "default" : "outline"}
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Done Editing
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Timetable
              </>
            )}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Class Schedule</CardTitle>
          
          {canEdit && isEditMode && (
            <Dialog open={isAddSlotOpen} onOpenChange={setIsAddSlotOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus size={16} />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Class to Timetable</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new class.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSlot}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject" 
                        value={newTimeSlot.subject}
                        onChange={(e) => setNewTimeSlot({...newTimeSlot, subject: e.target.value})}
                        placeholder="Mathematics"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input 
                          id="startTime" 
                          type="time"
                          value={newTimeSlot.startTime}
                          onChange={(e) => setNewTimeSlot({...newTimeSlot, startTime: e.target.value})}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input 
                          id="endTime" 
                          type="time"
                          value={newTimeSlot.endTime}
                          onChange={(e) => setNewTimeSlot({...newTimeSlot, endTime: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="teacher">Teacher</Label>
                      <Input 
                        id="teacher" 
                        value={newTimeSlot.teacher || ''}
                        onChange={(e) => setNewTimeSlot({...newTimeSlot, teacher: e.target.value})}
                        placeholder="Ms. Johnson"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="classroom">Classroom</Label>
                      <Input 
                        id="classroom" 
                        value={newTimeSlot.classroom}
                        onChange={(e) => setNewTimeSlot({...newTimeSlot, classroom: e.target.value})}
                        placeholder="Room 101"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Class</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex overflow-x-auto pb-2">
              {days.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? "default" : "outline"}
                  className="mr-2 whitespace-nowrap"
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </Button>
              ))}
            </div>
            
            {filteredSlots.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground opacity-30" />
                <p className="mt-2 text-muted-foreground">No classes scheduled for {selectedDay}</p>
                {canEdit && isEditMode && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsAddSlotOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Class
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-4 border rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="min-w-20 text-center">
                        <div className="text-xs text-muted-foreground">
                          {formatTime(slot.startTime)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(slot.endTime)}
                        </div>
                      </div>
                      
                      <div>
                        {editingSlot?.id === slot.id ? (
                          <form onSubmit={handleEditSlot} className="space-y-2">
                            <Input 
                              value={editingSlot.subject}
                              onChange={(e) => setEditingSlot({...editingSlot, subject: e.target.value})}
                              className="font-medium"
                              required
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input 
                                type="time"
                                value={editingSlot.startTime}
                                onChange={(e) => setEditingSlot({...editingSlot, startTime: e.target.value})}
                                required
                              />
                              <Input 
                                type="time"
                                value={editingSlot.endTime}
                                onChange={(e) => setEditingSlot({...editingSlot, endTime: e.target.value})}
                                required
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Input 
                                value={editingSlot.teacher || ''}
                                onChange={(e) => setEditingSlot({...editingSlot, teacher: e.target.value})}
                                placeholder="Teacher"
                              />
                              <Input 
                                value={editingSlot.classroom}
                                onChange={(e) => setEditingSlot({...editingSlot, classroom: e.target.value})}
                                placeholder="Classroom"
                                required
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditingSlot(null)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" size="sm">
                                <Save className="mr-2 h-4 w-4" />
                                Save
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <h3 className="font-medium">{slot.subject}</h3>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              {slot.teacher && <span className="mr-3">{slot.teacher}</span>}
                              <span>{slot.classroom}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {canEdit && isEditMode && editingSlot?.id !== slot.id && (
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setEditingSlot(slot)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteSlot(slot.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timetable;
