
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Plus, Edit, Trash2, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: 'low' | 'medium' | 'high';
}

const Announcements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const role = user?.role;
  const isTeacher = role === 'admin' || role === 'teacher';
  
  // Mock announcements data
  const [announcements, setAnnouncements] = useState<Announcement[]>([
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
  ]);
  
  // Form state for new announcement
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  const handleAddAnnouncement = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      date: new Date().toISOString().split('T')[0],
      author: user?.name || 'Staff',
      priority: newPriority,
    };
    
    setAnnouncements([newAnnouncement, ...announcements]);
    
    // Reset form
    setNewTitle('');
    setNewContent('');
    setNewPriority('medium');
    
    toast({
      title: "Announcement Added",
      description: "Your announcement has been published.",
    });
  };
  
  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast({
      title: "Announcement Deleted",
      description: "The announcement has been removed.",
    });
  };
  
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">
            {isTeacher 
              ? 'Create and manage school announcements'
              : 'View school announcements and updates'}
          </p>
        </div>
        
        {isTeacher && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="title" className="text-right text-sm">
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Announcement title"
                    className="col-span-3"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label htmlFor="content" className="text-right text-sm">
                    Content
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Announcement details..."
                    className="col-span-3 min-h-32"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="priority" className="text-right text-sm">
                    Priority
                  </label>
                  <Select 
                    value={newPriority} 
                    onValueChange={(value) => setNewPriority(value as 'low' | 'medium' | 'high')}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleAddAnnouncement}>
                    <Send className="mr-2 h-4 w-4" />
                    Publish
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {announcements.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>School Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-12">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Announcements</h3>
              <p className="mt-2 text-muted-foreground">
                There are currently no announcements to display.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  <Badge className={getPriorityColor(announcement.priority)}>
                    {announcement.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line mb-4">{announcement.content}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">{announcement.author}</span>
                    <span> • {formatDate(announcement.date)}</span>
                  </div>
                  {isTeacher && (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
