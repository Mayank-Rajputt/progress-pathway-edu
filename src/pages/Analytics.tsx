
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, LineChart, BarChart3, Users, Award } from 'lucide-react';
import { toast } from 'sonner';
import PerformanceBarChart from '@/components/analytics/PerformanceBarChart';
import PerformanceLineChart from '@/components/analytics/PerformanceLineChart';
import RadarPerformanceChart from '@/components/analytics/RadarPerformanceChart';
import StrengthWeaknessCard from '@/components/analytics/StrengthWeaknessCard';

// API functions for fetching data
const fetchStudentAnalytics = async (studentId: string, params = {}) => {
  const response = await axios.get(`/api/analytics/student/${studentId}`, { params });
  return response.data.data;
};

const fetchClassAnalytics = async (classId: string, section: string = '', params = {}) => {
  const url = section 
    ? `/api/analytics/class/${classId}/section/${section}` 
    : `/api/analytics/class/${classId}`;
  const response = await axios.get(url, { params });
  return response.data.data;
};

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(user?.role === 'student' ? 'personal' : 'class');
  const [studentId, setStudentId] = useState<string>('');
  const [classId, setClassId] = useState<string>('');
  const [section, setSection] = useState<string>('');
  const [academicYear, setAcademicYear] = useState<string>('2024-2025');
  const [term, setTerm] = useState<string>('');
  const [examType, setExamType] = useState<string>('');
  
  // Set initial values based on user role
  useEffect(() => {
    if (user?.role === 'student') {
      setStudentId(user.id);
    }
  }, [user]);
  
  // Query for student analytics
  const { 
    data: studentAnalytics, 
    isLoading: isLoadingStudentData,
    error: studentError
  } = useQuery({
    queryKey: ['studentAnalytics', studentId, academicYear, term, examType],
    queryFn: () => fetchStudentAnalytics(studentId, { academicYear, term, examType }),
    enabled: !!studentId && activeTab === 'personal',
  });
  
  // Query for class analytics
  const {
    data: classAnalytics,
    isLoading: isLoadingClassData,
    error: classError
  } = useQuery({
    queryKey: ['classAnalytics', classId, section, academicYear, term, examType],
    queryFn: () => fetchClassAnalytics(classId, section, { academicYear, term, examType }),
    enabled: !!classId && activeTab === 'class',
  });
  
  // Handle any errors
  useEffect(() => {
    if (studentError) {
      toast.error('Failed to load student analytics data');
    }
    if (classError) {
      toast.error('Failed to load class analytics data');
    }
  }, [studentError, classError]);
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Academic Analytics</h1>
          <p className="text-muted-foreground">
            Track performance metrics and identify improvement areas
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
          <Select value={academicYear} onValueChange={setAcademicYear}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
              <SelectItem value="2024-2025">2024-2025</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={term} onValueChange={setTerm}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Terms</SelectItem>
              <SelectItem value="Term 1">Term 1</SelectItem>
              <SelectItem value="Term 2">Term 2</SelectItem>
              <SelectItem value="Term 3">Term 3</SelectItem>
              <SelectItem value="Final">Final</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={examType} onValueChange={setExamType}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Exam Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Exams</SelectItem>
              <SelectItem value="Quiz">Quiz</SelectItem>
              <SelectItem value="Test">Test</SelectItem>
              <SelectItem value="Midterm">Midterm</SelectItem>
              <SelectItem value="Final">Final Exam</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger 
            value="personal"
            disabled={user?.role !== 'student' && !studentId}
          >
            <LineChart className="h-4 w-4 mr-2" />
            Student Performance
          </TabsTrigger>
          <TabsTrigger 
            value="class"
            disabled={!classId && user?.role !== 'teacher' && user?.role !== 'admin' && user?.role !== 'department_admin'}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Class Analytics
          </TabsTrigger>
        </TabsList>
        
        {/* Student Performance Tab */}
        <TabsContent value="personal" className="space-y-6">
          {user?.role !== 'student' && (
            <Card>
              <CardHeader>
                <CardTitle>Select Student</CardTitle>
                <CardDescription>Choose a student to view their analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={studentId} onValueChange={setStudentId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">John Smith (Roll #101)</SelectItem>
                    <SelectItem value="2">Jane Doe (Roll #102)</SelectItem>
                    <SelectItem value="3">Michael Johnson (Roll #103)</SelectItem>
                    <SelectItem value="4">Emily Wilson (Roll #104)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}
          
          {isLoadingStudentData && (
            <div className="flex justify-center items-center h-40">
              <div className="loader" />
              <p className="ml-2">Loading analytics data...</p>
            </div>
          )}
          
          {!isLoadingStudentData && studentAnalytics && (
            <>
              {/* Student Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    {studentAnalytics.student?.userId?.name || 'Student'}'s academic performance summary
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                      <div className="text-4xl font-bold mb-2 text-primary">
                        {studentAnalytics.subjectWiseData?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Subjects</div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                      <div className="text-4xl font-bold mb-2 text-primary">
                        {studentAnalytics.performanceTrendData?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Exams Taken</div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                      <div className="text-4xl font-bold mb-2 text-primary">
                        {studentAnalytics.subjectWiseData?.length > 0 
                          ? `${Math.round(studentAnalytics.subjectWiseData.reduce((sum, subject) => 
                              sum + subject.averagePercentage, 0) / studentAnalytics.subjectWiseData.length)}%` 
                          : 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">Average Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PerformanceBarChart 
                  data={studentAnalytics.subjectWiseData || []}
                  title="Subject Performance" 
                  description="Average performance in each subject" 
                  color="#8884d8"
                />
                
                <PerformanceLineChart 
                  data={studentAnalytics.performanceTrendData || []}
                  title="Performance Trend" 
                  description="Performance trend over time" 
                  color="#82ca9d"
                />
              </div>
              
              <StrengthWeaknessCard 
                strengths={studentAnalytics.strengthWeaknessData?.strengths || []} 
                weaknesses={studentAnalytics.strengthWeaknessData?.weaknesses || []} 
              />
              
              <RadarPerformanceChart 
                data={studentAnalytics.subjectWiseData || []}
                title="Performance Radar" 
                description="Subject performance comparison" 
                color="#8884d8"
              />
            </>
          )}
          
          {!isLoadingStudentData && !studentAnalytics && studentId && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <p className="text-muted-foreground">No analytics data available for this student</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Class Analytics Tab */}
        <TabsContent value="class" className="space-y-6">
          {user?.role !== 'student' && (
            <Card>
              <CardHeader>
                <CardTitle>Select Class</CardTitle>
                <CardDescription>Choose a class to view analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={classId} onValueChange={setClassId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Grade 6</SelectItem>
                      <SelectItem value="2">Grade 7</SelectItem>
                      <SelectItem value="3">Grade 8</SelectItem>
                      <SelectItem value="4">Grade 9</SelectItem>
                      <SelectItem value="5">Grade 10</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={section} onValueChange={setSection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sections</SelectItem>
                      <SelectItem value="A">Section A</SelectItem>
                      <SelectItem value="B">Section B</SelectItem>
                      <SelectItem value="C">Section C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
          
          {isLoadingClassData && (
            <div className="flex justify-center items-center h-40">
              <div className="loader" />
              <p className="ml-2">Loading class analytics data...</p>
            </div>
          )}
          
          {!isLoadingClassData && classAnalytics && (
            <>
              {/* Class Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Class Performance Overview</CardTitle>
                  <CardDescription>
                    {`Grade ${classId}${section ? ' - Section ' + section : ''}`} performance summary
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                      <div className="text-4xl font-bold mb-2 text-primary">
                        {classAnalytics.studentCount || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Students</div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                      <div className="text-4xl font-bold mb-2 text-primary">
                        {classAnalytics.subjectWiseAverageData?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Subjects</div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                      <div className="text-4xl font-bold mb-2 text-primary">
                        {classAnalytics.classAverageData?.averagePercentage 
                          ? `${classAnalytics.classAverageData.averagePercentage}%`
                          : 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">Class Average</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Charts */}
              <PerformanceBarChart 
                data={classAnalytics.subjectWiseAverageData || []}
                title="Subject-wise Class Average" 
                description="Average class performance in each subject" 
                color="#8884d8"
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Students with highest average scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {classAnalytics.topPerformersData && classAnalytics.topPerformersData.length > 0 ? (
                      classAnalytics.topPerformersData.map((student, index) => (
                        <li key={student.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white mr-3">
                              {index + 1}
                            </div>
                            <span>{student.name}</span>
                          </div>
                          <span className="font-semibold">{student.averagePercentage}%</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-center text-muted-foreground py-4">No data available</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
              
              <RadarPerformanceChart 
                data={classAnalytics.subjectWiseAverageData || []}
                title="Class Performance Radar" 
                description="Subject performance comparison" 
                color="#82ca9d"
              />
            </>
          )}
          
          {!isLoadingClassData && !classAnalytics && classId && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <p className="text-muted-foreground">No analytics data available for this class</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
