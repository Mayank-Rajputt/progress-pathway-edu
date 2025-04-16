import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle, Clock, Edit, MessageSquare, Search, Trash, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Type definitions
interface User {
  _id: string;
  id?: string;
  name: string;
  role: string;
}

interface Comment {
  _id: string;
  text: string;
  user: User;
  timestamp: string;
}

interface StudentIssue {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: 'academic' | 'administrative' | 'technical' | 'other';
  submittedBy: User;
  assignedTo?: User;
  comments: Comment[];
  resolution?: string;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ServerResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// API calls
const fetchIssues = async (status: string = ''): Promise<PaginatedResponse<StudentIssue>> => {
  const response = await fetch(`/api/student-issues?${status ? `status=${status}` : ''}`);
  if (!response.ok) {
    throw new Error('Failed to fetch issues');
  }
  return response.json();
};

const fetchIssueById = async (id: string): Promise<ServerResponse<StudentIssue>> => {
  const response = await fetch(`/api/student-issues/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch issue details');
  }
  return response.json();
};

const updateIssue = async ({ id, data }: { id: string; data: any }): Promise<ServerResponse<StudentIssue>> => {
  const response = await fetch(`/api/student-issues/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update issue');
  }
  return response.json();
};

const deleteIssue = async (id: string): Promise<ServerResponse<null>> => {
  const response = await fetch(`/api/student-issues/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete issue');
  }
  return response.json();
};

const createIssue = async (data: any): Promise<ServerResponse<StudentIssue>> => {
  const response = await fetch('/api/student-issues', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create issue');
  }
  return response.json();
};

// Helper functions
const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-orange-100 text-orange-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'in_progress':
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    case 'resolved':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'closed':
      return <CheckCircle className="h-4 w-4 text-gray-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const StudentIssues: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  
  // Form states
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'academic',
  });
  
  const [updateForm, setUpdateForm] = useState({
    status: '',
    priority: '',
    comment: '',
    resolution: '',
  });
  
  // Queries
  const { data: issuesData, isLoading } = useQuery({
    queryKey: ['studentIssues', activeTab],
    queryFn: () => fetchIssues(activeTab !== 'all' ? activeTab : ''),
  });
  
  const { data: issueDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['issueDetails', selectedIssue],
    queryFn: () => fetchIssueById(selectedIssue || ''),
    enabled: !!selectedIssue,
  });
  
  // Mutations
  const createIssueMutation = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Issue created successfully',
      });
      setIsCreateDialogOpen(false);
      setNewIssue({
        title: '',
        description: '',
        priority: 'medium',
        category: 'academic',
      });
      queryClient.invalidateQueries({ queryKey: ['studentIssues'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create issue',
        variant: 'destructive',
      });
    },
  });
  
  const updateIssueMutation = useMutation({
    mutationFn: updateIssue,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Issue updated successfully',
      });
      setIsUpdateDialogOpen(false);
      setUpdateForm({
        status: '',
        priority: '',
        comment: '',
        resolution: '',
      });
      queryClient.invalidateQueries({ queryKey: ['studentIssues'] });
      queryClient.invalidateQueries({ queryKey: ['issueDetails', selectedIssue] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update issue',
        variant: 'destructive',
      });
    },
  });
  
  const deleteIssueMutation = useMutation({
    mutationFn: deleteIssue,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Issue deleted successfully',
      });
      setSelectedIssue(null);
      queryClient.invalidateQueries({ queryKey: ['studentIssues'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete issue',
        variant: 'destructive',
      });
    },
  });
  
  // Event handlers
  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    createIssueMutation.mutate(newIssue);
  };
  
  const handleUpdateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIssue) {
      const formData = Object.fromEntries(
        Object.entries(updateForm).filter(([_, value]) => value !== '')
      );
      updateIssueMutation.mutate({ id: selectedIssue, data: formData });
    }
  };
  
  const handleDeleteIssue = () => {
    if (selectedIssue) {
      deleteIssueMutation.mutate(selectedIssue);
    }
  };
  
  // Filter issues based on search term
  const filteredIssues = issuesData?.data.filter((issue) =>
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Issues</h1>
          <p className="text-muted-foreground">Manage and respond to student inquiries and problems</p>
        </div>
        
        {user?.role === 'student' && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Submit New Issue
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="in_progress">Active</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Issues</CardTitle>
              <CardDescription>
                {isLoading ? 'Loading...' : `${filteredIssues.length} issues found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {isLoading ? (
                  <p>Loading issues...</p>
                ) : filteredIssues.length === 0 ? (
                  <p>No issues found.</p>
                ) : (
                  filteredIssues.map((issue) => (
                    <div
                      key={issue._id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                        selectedIssue === issue._id ? 'border-primary bg-accent' : 'border-border'
                      }`}
                      onClick={() => setSelectedIssue(issue._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium line-clamp-1">{issue.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {issue.description}
                          </p>
                        </div>
                        {getStatusIcon(issue.status)}
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{issue.submittedBy.name}</span>
                        </div>
                        <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          {selectedIssue ? (
            <Card>
              {isLoadingDetails ? (
                <CardContent className="py-6">Loading issue details...</CardContent>
              ) : issueDetails?.data ? (
                <>
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle>{issueDetails.data.title}</CardTitle>
                      <CardDescription>
                        Submitted by {issueDetails.data.submittedBy.name} on{' '}
                        {formatDate(issueDetails.data.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {(user?.role === 'admin' || user?.role === 'teacher') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUpdateForm({
                              status: issueDetails.data.status,
                              priority: issueDetails.data.priority,
                              comment: '',
                              resolution: issueDetails.data.resolution || '',
                            });
                            setIsUpdateDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Update
                        </Button>
                      )}
                      
                      {(user?.role === 'admin' ||
                        (user?.role === 'student' && 
                         user._id === issueDetails.data.submittedBy._id)) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this issue? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteIssue}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className={`${getPriorityColor(issueDetails.data.priority)}`}>
                          {issueDetails.data.priority.charAt(0).toUpperCase() + issueDetails.data.priority.slice(1)} Priority
                        </Badge>
                        <Badge variant="outline">
                          {issueDetails.data.category.charAt(0).toUpperCase() + issueDetails.data.category.slice(1)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            issueDetails.data.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : issueDetails.data.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : issueDetails.data.status === 'resolved'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-gray-100 text-gray-800 border-gray-200'
                          }
                        >
                          {issueDetails.data.status === 'in_progress'
                            ? 'In Progress'
                            : issueDetails.data.status.charAt(0).toUpperCase() + issueDetails.data.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="whitespace-pre-line">{issueDetails.data.description}</p>
                      </div>
                      
                      {issueDetails.data.attachmentUrl && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Attachment</h4>
                          <a
                            href={issueDetails.data.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Attachment
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {issueDetails.data.assignedTo && (
                      <div>
                        <h4 className="font-medium mb-2">Assigned To</h4>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p>{issueDetails.data.assignedTo.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {issueDetails.data.assignedTo.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {issueDetails.data.resolution && (
                      <div>
                        <h4 className="font-medium mb-2">Resolution</h4>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="whitespace-pre-line">{issueDetails.data.resolution}</p>
                        </div>
                      </div>
                    )}
                    
                    {issueDetails.data.comments.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Comments</h4>
                        <div className="space-y-4">
                          {issueDetails.data.comments.map((comment) => (
                            <div key={comment._id} className="border rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="h-3 w-3" />
                                </div>
                                <span className="font-medium">{comment.user.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(comment.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {(user?.role === 'teacher' || user?.role === 'admin' || user._id === issueDetails.data.submittedBy._id) && (
                      <div>
                        <h4 className="font-medium mb-2">Add Comment</h4>
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Type your comment here..."
                            value={updateForm.comment}
                            onChange={(e) => setUpdateForm({ ...updateForm, comment: e.target.value })}
                          />
                          <Button
                            onClick={() => {
                              if (updateForm.comment.trim()) {
                                updateIssueMutation.mutate({
                                  id: selectedIssue,
                                  data: { comment: updateForm.comment },
                                });
                                setUpdateForm({ ...updateForm, comment: '' });
                              }
                            }}
                            disabled={!updateForm.comment.trim()}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" /> Send
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </>
              ) : (
                <CardContent className="py-6">Issue not found</CardContent>
              )}
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Issue Selected</h3>
                <p className="text-muted-foreground">
                  Select an issue from the list to view its details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit New Issue</DialogTitle>
            <DialogDescription>
              Describe your issue in detail so teachers or admin can help you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateIssue}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief title of your issue"
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of your issue"
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                  required
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newIssue.category}
                    onValueChange={(value) => setNewIssue({ ...newIssue, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="administrative">Administrative</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newIssue.priority}
                    onValueChange={(value) => setNewIssue({ ...newIssue, priority: value })}
                  >
                    <SelectTrigger id="priority">
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
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createIssueMutation.isPending}>
                {createIssueMutation.isPending ? 'Submitting...' : 'Submit Issue'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Issue</DialogTitle>
            <DialogDescription>
              Update the status, priority or add a resolution to this issue.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateIssue}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="update-status">Status</Label>
                  <Select
                    value={updateForm.status}
                    onValueChange={(value) => setUpdateForm({ ...updateForm, status: value })}
                  >
                    <SelectTrigger id="update-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-priority">Priority</Label>
                  <Select
                    value={updateForm.priority}
                    onValueChange={(value) => setUpdateForm({ ...updateForm, priority: value })}
                  >
                    <SelectTrigger id="update-priority">
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
              <div className="space-y-2">
                <Label htmlFor="update-resolution">Resolution</Label>
                <Textarea
                  id="update-resolution"
                  placeholder="Add a resolution to this issue"
                  value={updateForm.resolution}
                  onChange={(e) => setUpdateForm({ ...updateForm, resolution: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUpdateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateIssueMutation.isPending}>
                {updateIssueMutation.isPending ? 'Updating...' : 'Update Issue'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentIssues;
