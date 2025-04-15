
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileQuestion, 
  Plus, 
  Search, 
  Filter, 
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Mock data
const mockIssues = [
  { 
    id: '1', 
    title: 'Cannot access homework assignment', 
    category: 'academic',
    status: 'pending', 
    createdAt: '2023-05-10T14:30:00Z', 
    studentName: 'Michael Johnson',
    description: 'I cannot access the homework assignment for Mathematics that was assigned yesterday.',
    assignedTo: 'Sarah Williams'
  },
  { 
    id: '2', 
    title: 'Computer lab system not working', 
    category: 'technical',
    status: 'in_progress', 
    createdAt: '2023-05-09T10:15:00Z', 
    studentName: 'Emily Davis',
    description: 'The system in Computer Lab 3, Station 12 is not booting up properly.',
    assignedTo: 'John Smith'
  },
  { 
    id: '3', 
    title: 'Request for extra study material', 
    category: 'academic',
    status: 'resolved', 
    createdAt: '2023-05-08T09:45:00Z', 
    studentName: 'Alex Thompson',
    description: 'I would like to request additional study material for the upcoming Physics exam.',
    assignedTo: 'Robert Wilson'
  },
  { 
    id: '4', 
    title: 'Classroom projector not working', 
    category: 'facilities',
    status: 'pending', 
    createdAt: '2023-05-08T13:20:00Z', 
    studentName: 'Olivia Martinez',
    description: 'The projector in Room 204 is not displaying properly. The image is very dim.',
    assignedTo: null
  },
  { 
    id: '5', 
    title: 'Special permission for leave', 
    category: 'other',
    status: 'rejected', 
    createdAt: '2023-05-07T11:10:00Z', 
    studentName: 'James Wilson',
    description: 'I need to take 3 days leave next week for a family function.',
    assignedTo: 'Sarah Williams'
  }
];

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { 
      class: 'bg-yellow-100 text-yellow-800', 
      icon: <Clock className="h-3 w-3 mr-1" /> 
    },
    in_progress: { 
      class: 'bg-blue-100 text-blue-800', 
      icon: <RefreshCw className="h-3 w-3 mr-1" /> 
    },
    resolved: { 
      class: 'bg-green-100 text-green-800', 
      icon: <CheckCircle2 className="h-3 w-3 mr-1" /> 
    },
    rejected: { 
      class: 'bg-red-100 text-red-800', 
      icon: <XCircle className="h-3 w-3 mr-1" /> 
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
      {config.icon}
      {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </span>
  );
};

// Category badge component
const CategoryBadge = ({ category }) => {
  const categoryConfig = {
    academic: { class: 'bg-purple-100 text-purple-800' },
    technical: { class: 'bg-blue-100 text-blue-800' },
    facilities: { class: 'bg-green-100 text-green-800' },
    other: { class: 'bg-gray-100 text-gray-800' }
  };

  const config = categoryConfig[category] || categoryConfig.other;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  );
};

const StudentIssues = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('view-issues');
  const [issues, setIssues] = useState(mockIssues);
  const [filteredIssues, setFilteredIssues] = useState(mockIssues);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  // Form state for creating new issue
  const [newIssue, setNewIssue] = useState({
    title: '',
    category: 'academic',
    description: ''
  });
  
  // Form state for updating issue
  const [updateFormData, setUpdateFormData] = useState({
    status: '',
    resolution: '',
    assignedTo: ''
  });
  
  // Apply filters to issues
  useEffect(() => {
    let filtered = [...issues];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        issue => 
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(issue => issue.category === categoryFilter);
    }
    
    setFilteredIssues(filtered);
  }, [searchTerm, statusFilter, categoryFilter, issues]);
  
  // Handle creating a new issue
  const handleCreateIssue = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newIssueData = {
        id: (issues.length + 1).toString(),
        ...newIssue,
        status: 'pending',
        createdAt: new Date().toISOString(),
        studentName: user?.name || 'Current Student',
        assignedTo: null
      };
      
      setIssues([newIssueData, ...issues]);
      
      // Reset form
      setNewIssue({
        title: '',
        category: 'academic',
        description: ''
      });
      
      // Switch to view tab
      setActiveTab('view-issues');
      
      setIsLoading(false);
      toast.success('Issue submitted successfully');
    }, 1000);
  };
  
  // Handle selecting an issue for view/update
  const handleSelectIssue = (issue) => {
    setSelectedIssue(issue);
    
    // Initialize update form
    setUpdateFormData({
      status: issue.status,
      resolution: '',
      assignedTo: issue.assignedTo || ''
    });
  };
  
  // Handle updating an issue
  const handleUpdateIssue = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedIssues = issues.map(issue => 
        issue.id === selectedIssue.id
          ? { ...issue, ...updateFormData }
          : issue
      );
      
      setIssues(updatedIssues);
      setSelectedIssue(null);
      setIsLoading(false);
      toast.success('Issue updated successfully');
    }, 1000);
  };
  
  // Refresh issues
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIssues(mockIssues);
      setIsLoading(false);
      toast.success('Issues refreshed');
    }, 800);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Issues</h1>
          <p className="text-muted-foreground">
            {user?.role === 'student' 
              ? 'Submit and track your issues'
              : 'Manage and respond to student issues'}
          </p>
        </div>
        
        {user?.role === 'student' && (
          <Button 
            onClick={() => setActiveTab('create-issue')}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Submit New Issue
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view-issues">
            {user?.role === 'student' ? 'My Issues' : 'Manage Issues'}
          </TabsTrigger>
          {user?.role === 'student' && (
            <TabsTrigger value="create-issue">Submit New Issue</TabsTrigger>
          )}
          {/* Fix: Change comparison from !== to !== 'student' to compare strings properly */}
          {user?.role !== 'student' && (
            <TabsTrigger value="issue-stats">Issue Statistics</TabsTrigger>
          )}
        </TabsList>
        
        {/* View Issues Tab */}
        <TabsContent value="view-issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileQuestion className="h-5 w-5" />
                  {user?.role === 'student' ? 'My Issues' : 'Student Issues'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search issues..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="facilities">Facilities</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Issues Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        {user?.role !== 'student' && <TableHead>Student</TableHead>}
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIssues.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={user?.role === 'student' ? 5 : 6} className="text-center py-6">
                            No issues found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredIssues.map((issue) => (
                          <TableRow key={issue.id}>
                            <TableCell className="font-medium">{issue.title}</TableCell>
                            {user?.role !== 'student' && (
                              <TableCell>{issue.studentName}</TableCell>
                            )}
                            <TableCell>
                              <CategoryBadge category={issue.category} />
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={issue.status} />
                            </TableCell>
                            <TableCell>
                              {new Date(issue.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSelectIssue(issue)}
                              >
                                {user?.role === 'student' ? 'View' : 'Manage'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Issue Detail/Update Modal (simplified version) */}
                {selectedIssue && (
                  <Card className="mt-8 border-t-4 border-t-blue-500">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <div>
                          <div className="text-xl">{selectedIssue.title}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Submitted by {selectedIssue.studentName} on {new Date(selectedIssue.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedIssue(null)}
                        >
                          Close
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex gap-2 mb-2">
                          <CategoryBadge category={selectedIssue.category} />
                          <StatusBadge status={selectedIssue.status} />
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          {selectedIssue.description}
                        </div>
                      </div>
                      
                      {/* Update Form (for admin, department_admin, and teacher) */}
                      {['admin', 'department_admin', 'teacher'].includes(user?.role) && (
                        <form onSubmit={handleUpdateIssue} className="space-y-4 mt-6 border-t pt-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Update Status</label>
                            <Select 
                              value={updateFormData.status}
                              onValueChange={(value) => setUpdateFormData({...updateFormData, status: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Resolution / Comments</label>
                            <Textarea
                              value={updateFormData.resolution}
                              onChange={(e) => setUpdateFormData({...updateFormData, resolution: e.target.value})}
                              placeholder="Add resolution details or comments"
                              rows={3}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Assign To</label>
                            <Input 
                              value={updateFormData.assignedTo}
                              onChange={(e) => setUpdateFormData({...updateFormData, assignedTo: e.target.value})}
                              placeholder="Enter name of assignee"
                            />
                          </div>
                          
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Issue'}
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Create Issue Tab (students only) */}
        {user?.role === 'student' && (
          <TabsContent value="create-issue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Submit New Issue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateIssue} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Issue Title</label>
                    <Input
                      value={newIssue.title}
                      onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                      placeholder="Brief title of your issue"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <Select 
                      value={newIssue.category}
                      onValueChange={(value) => setNewIssue({...newIssue, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="facilities">Facilities</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      value={newIssue.description}
                      onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                      placeholder="Detailed description of your issue"
                      rows={5}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setNewIssue({
                          title: '',
                          category: 'academic',
                          description: ''
                        });
                        setActiveTab('view-issues');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Submitting...' : 'Submit Issue'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default StudentIssues;
