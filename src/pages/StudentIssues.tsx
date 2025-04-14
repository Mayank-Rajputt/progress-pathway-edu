
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageSquare, Search, User, Calendar, Filter, CheckCircle, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Mock issues data
const mockIssues = [
  {
    id: '1',
    studentName: 'Alex Johnson',
    studentId: '1001',
    subject: 'Question about assignment deadline',
    message: 'I was wondering if we could get an extension on the math assignment due to the upcoming sports event?',
    dateSubmitted: '2023-04-10T14:30:00',
    status: 'pending',
    studentAvatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Alex+Johnson',
  },
  {
    id: '2',
    studentName: 'Sarah Williams',
    studentId: '1002',
    subject: 'Request for extra study materials',
    message: 'Could you please provide some additional study materials for the upcoming science exam? I\'m having trouble with Chapter 5.',
    dateSubmitted: '2023-04-08T09:15:00',
    status: 'resolved',
    studentAvatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Sarah+Williams',
  },
  {
    id: '3',
    studentName: 'Michael Brown',
    studentId: '1003',
    subject: 'Struggling with calculus concepts',
    message: 'I\'m having difficulty understanding the calculus concepts covered in last week\'s class. Could I schedule a time to discuss these with you?',
    dateSubmitted: '2023-04-07T11:20:00',
    status: 'pending',
    studentAvatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Michael+Brown',
  },
  {
    id: '4',
    studentName: 'Emily Davis',
    studentId: '1004',
    subject: 'Absence notification',
    message: 'I will be absent next Monday due to a doctor\'s appointment. What work should I complete beforehand?',
    dateSubmitted: '2023-04-05T16:45:00',
    status: 'resolved',
    studentAvatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Emily+Davis',
  },
];

const StudentIssues = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState(mockIssues);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  
  if (user?.role !== 'teacher' && user?.role !== 'admin') {
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

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.studentId.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' ? true : issue.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleResolveIssue = (id: string) => {
    setIssues(issues.map(issue => 
      issue.id === id ? { ...issue, status: 'resolved' } : issue
    ));
    toast.success('Issue marked as resolved');
  };

  const handleReopenIssue = (id: string) => {
    setIssues(issues.map(issue => 
      issue.id === id ? { ...issue, status: 'pending' } : issue
    ));
    toast.success('Issue reopened');
  };

  const toggleExpandIssue = (id: string) => {
    if (expandedIssue === id) {
      setExpandedIssue(null);
    } else {
      setExpandedIssue(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Issues</h1>
          <p className="text-muted-foreground">
            Manage and respond to student-submitted issues
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Issues & Requests</CardTitle>
          <div className="text-sm text-muted-foreground">
            {issues.filter(i => i.status === 'pending').length} pending issues
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search issues..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative w-full sm:w-40">
                <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-foreground file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Issues</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            {filteredIssues.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground opacity-30" />
                <p className="mt-2 text-muted-foreground">No issues found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredIssues.map((issue) => (
                  <div 
                    key={issue.id} 
                    className={`border rounded-lg overflow-hidden ${
                      issue.status === 'resolved' ? 'opacity-75' : ''
                    }`}
                  >
                    <div 
                      className="p-4 flex items-start justify-between cursor-pointer hover:bg-muted/30"
                      onClick={() => toggleExpandIssue(issue.id)}
                    >
                      <div className="flex gap-3">
                        <img
                          src={issue.studentAvatar}
                          alt={issue.studentName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h3 className="font-medium flex items-center gap-1">
                            {issue.subject}
                            {issue.status === 'pending' ? (
                              <span className="inline-flex ml-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            ) : (
                              <span className="inline-flex ml-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Resolved
                              </span>
                            )}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:gap-4 text-xs text-muted-foreground mt-1">
                            <div className="flex items-center">
                              <User className="mr-1 h-3 w-3" />
                              <span>{issue.studentName} (Roll No. {issue.studentId})</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>{formatDate(issue.dateSubmitted)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {expandedIssue === issue.id && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="pl-13 ml-13 sm:ml-16">
                          <div className="border-t pt-3 mt-2">
                            <p className="text-sm whitespace-pre-line">{issue.message}</p>
                            
                            <div className="flex justify-end gap-2 mt-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setExpandedIssue(null)}
                              >
                                Close
                              </Button>
                              
                              {issue.status === 'pending' ? (
                                <Button 
                                  size="sm"
                                  onClick={() => handleResolveIssue(issue.id)}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as Resolved
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleReopenIssue(issue.id)}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Reopen Issue
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Showing {filteredIssues.length} of {issues.length} issues
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StudentIssues;
