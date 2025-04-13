
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, CheckCircle, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';

// Mock data for student issues
const mockIssues = [
  {
    id: '1',
    studentName: 'Alex Johnson',
    studentId: '1001',
    subject: 'Question about Math Assignment',
    message: 'I am having difficulty understanding the calculus homework problem #5. Could you provide additional examples?',
    date: '2025-04-10',
    resolved: false,
    avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Alex+Johnson',
  },
  {
    id: '2',
    studentName: 'Emily Davis',
    studentId: '1004',
    subject: 'Request for Extra Help',
    message: 'I would like to schedule extra help sessions for the upcoming physics test. When are you available?',
    date: '2025-04-09',
    resolved: true,
    avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Emily+Davis',
  },
  {
    id: '3',
    studentName: 'James Wilson',
    studentId: '1005',
    subject: 'Missing Assignment',
    message: 'I submitted my history essay last week but it shows as missing in the gradebook. Could you check if you received it?',
    date: '2025-04-08',
    resolved: false,
    avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=James+Wilson',
  },
];

const StudentIssues = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState(mockIssues);
  
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

  const toggleResolved = (id: string) => {
    setIssues(issues.map(issue => 
      issue.id === id ? {...issue, resolved: !issue.resolved} : issue
    ));
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
          <h1 className="text-3xl font-bold tracking-tight">Student Issues</h1>
          <p className="text-muted-foreground">
            Manage and respond to student questions and concerns
          </p>
        </div>
      </div>

      {issues.length === 0 ? (
        <Card>
          <CardContent className="text-center p-12">
            <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Issues</h3>
            <p className="mt-2 text-muted-foreground">
              There are no student issues at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <Card key={issue.id} className={issue.resolved ? "opacity-70" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {issue.avatar && (
                      <img
                        src={issue.avatar}
                        alt={issue.studentName}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg">{issue.subject}</CardTitle>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <User size={14} />
                        <span>{issue.studentName} ({issue.studentId})</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={issue.resolved ? "outline" : "default"}>
                    {issue.resolved ? "Resolved" : "Open"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 whitespace-pre-line">{issue.message}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(issue.date)}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Reply
                    </Button>
                    <Button 
                      variant={issue.resolved ? "default" : "outline"} 
                      size="sm"
                      onClick={() => toggleResolved(issue.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {issue.resolved ? "Mark as Unresolved" : "Mark as Resolved"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentIssues;
