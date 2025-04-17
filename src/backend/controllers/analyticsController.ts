
import { Request, Response } from 'express';
import { AnalyticsModel } from '../models/analyticsModel';
import { StudentModel } from '../models/studentModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';
import mongoose from 'mongoose';

// Get analytics for a student
export const getStudentAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { academicYear, term, examType } = req.query;

  // Build query
  const query: any = { studentId: new mongoose.Types.ObjectId(studentId) };
  if (academicYear) query.academicYear = academicYear;
  if (term) query.term = term;
  if (examType) query.examType = examType;
  
  // For multi-tenant support - only show data for the user's college
  if (req.user && req.user.collegeId) {
    query.collegeId = req.user.collegeId;
  }

  // Get analytics data
  const analyticsData = await AnalyticsModel.find(query)
    .populate('subjectId', 'name code')
    .sort({ examDate: -1 });

  // Get student details
  const student = await StudentModel.findById(studentId).populate('userId', 'name');

  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  // Process data for charts
  const subjectWiseData = processSubjectWiseData(analyticsData);
  const performanceTrendData = processPerformanceTrendData(analyticsData);
  const strengthWeaknessData = processStrengthWeaknessData(analyticsData);

  res.json({
    success: true,
    data: {
      student,
      subjectWiseData,
      performanceTrendData,
      strengthWeaknessData,
      rawData: analyticsData
    }
  });
});

// Get class analytics
export const getClassAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { classId, section } = req.params;
  const { academicYear, term, examType } = req.query;

  // Get students in the class
  const students = await StudentModel.find({ 
    class: classId, 
    ...(section && { section })
  });

  const studentIds = students.map(student => student._id);

  // Build query
  const query: any = { 
    studentId: { $in: studentIds }
  };
  
  if (academicYear) query.academicYear = academicYear;
  if (term) query.term = term;
  if (examType) query.examType = examType;
  
  // For multi-tenant support
  if (req.user && req.user.collegeId) {
    query.collegeId = req.user.collegeId;
  }

  // Get analytics data
  const analyticsData = await AnalyticsModel.find(query)
    .populate('subjectId', 'name code')
    .populate({
      path: 'studentId',
      populate: {
        path: 'userId',
        select: 'name'
      }
    });

  // Process data for charts
  const classAverageData = processClassAverageData(analyticsData);
  const topPerformersData = processTopPerformersData(analyticsData, students);
  const subjectWiseAverageData = processSubjectWiseAverageData(analyticsData);

  res.json({
    success: true,
    data: {
      classAverageData,
      topPerformersData,
      subjectWiseAverageData,
      studentCount: students.length,
      rawData: analyticsData
    }
  });
});

// Helper functions for data processing
function processSubjectWiseData(analyticsData: any[]) {
  // Group data by subject and calculate averages
  const subjectMap = new Map();
  
  analyticsData.forEach(item => {
    const subjectId = item.subjectId?._id?.toString() || item.subjectId?.toString();
    const subjectName = item.subjectId?.name || 'Unknown';
    
    if (!subjectMap.has(subjectId)) {
      subjectMap.set(subjectId, {
        name: subjectName,
        totalPercentage: item.percentage,
        count: 1
      });
    } else {
      const current = subjectMap.get(subjectId);
      subjectMap.set(subjectId, {
        ...current,
        totalPercentage: current.totalPercentage + item.percentage,
        count: current.count + 1
      });
    }
  });
  
  // Convert map to array and calculate averages
  return Array.from(subjectMap.values()).map(item => ({
    name: item.name,
    averagePercentage: Math.round(item.totalPercentage / item.count)
  }));
}

function processPerformanceTrendData(analyticsData: any[]) {
  // Sort by date
  const sortedData = [...analyticsData].sort((a, b) => 
    new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
  );
  
  // Group by exam date and calculate averages
  const examDates = new Map();
  
  sortedData.forEach(item => {
    const dateKey = new Date(item.examDate).toLocaleDateString();
    const examName = `${item.examType} (${dateKey})`;
    
    if (!examDates.has(examName)) {
      examDates.set(examName, {
        name: examName,
        date: dateKey,
        totalPercentage: item.percentage,
        count: 1
      });
    } else {
      const current = examDates.get(examName);
      examDates.set(examName, {
        ...current,
        totalPercentage: current.totalPercentage + item.percentage,
        count: current.count + 1
      });
    }
  });
  
  // Convert to array for charts
  return Array.from(examDates.values())
    .map(item => ({
      name: item.name,
      date: item.date,
      averagePercentage: Math.round(item.totalPercentage / item.count)
    }))
    .slice(-10); // Show the last 10 exams for the trend
}

function processStrengthWeaknessData(analyticsData: any[]) {
  // Similar to subject-wise but identify strengths and weaknesses
  const subjectMap = processSubjectWiseData(analyticsData);
  
  // Sort by percentage to find strongest and weakest subjects
  const sortedSubjects = [...subjectMap].sort((a, b) => 
    b.averagePercentage - a.averagePercentage
  );
  
  return {
    strengths: sortedSubjects.slice(0, 3), // Top 3 subjects
    weaknesses: sortedSubjects.slice(-3).reverse() // Bottom 3 subjects
  };
}

function processClassAverageData(analyticsData: any[]) {
  // Calculate overall class average
  let totalPercentage = 0;
  analyticsData.forEach(item => {
    totalPercentage += item.percentage;
  });
  
  return {
    averagePercentage: analyticsData.length > 0 ? Math.round(totalPercentage / analyticsData.length) : 0
  };
}

function processTopPerformersData(analyticsData: any[], students: any[]) {
  // Group by student and calculate average performance
  const studentPerformance = new Map();
  
  analyticsData.forEach(item => {
    const studentId = item.studentId?._id?.toString() || item.studentId?.toString();
    const studentName = item.studentId?.userId?.name || 'Unknown Student';
    
    if (!studentPerformance.has(studentId)) {
      studentPerformance.set(studentId, {
        id: studentId,
        name: studentName,
        totalPercentage: item.percentage,
        count: 1
      });
    } else {
      const current = studentPerformance.get(studentId);
      studentPerformance.set(studentId, {
        ...current,
        totalPercentage: current.totalPercentage + item.percentage,
        count: current.count + 1
      });
    }
  });
  
  // Calculate average and sort
  return Array.from(studentPerformance.values())
    .map(student => ({
      id: student.id,
      name: student.name,
      averagePercentage: Math.round(student.totalPercentage / student.count)
    }))
    .sort((a, b) => b.averagePercentage - a.averagePercentage)
    .slice(0, 5); // Top 5 students
}

function processSubjectWiseAverageData(analyticsData: any[]) {
  // Group by subject and calculate class averages
  const subjectMap = new Map();
  
  analyticsData.forEach(item => {
    const subjectId = item.subjectId?._id?.toString() || item.subjectId?.toString();
    const subjectName = item.subjectId?.name || 'Unknown';
    
    if (!subjectMap.has(subjectId)) {
      subjectMap.set(subjectId, {
        name: subjectName,
        totalPercentage: item.percentage,
        count: 1
      });
    } else {
      const current = subjectMap.get(subjectId);
      subjectMap.set(subjectId, {
        ...current,
        totalPercentage: current.totalPercentage + item.percentage,
        count: current.count + 1
      });
    }
  });
  
  // Convert to array for charts
  return Array.from(subjectMap.values()).map(item => ({
    name: item.name,
    averagePercentage: Math.round(item.totalPercentage / item.count)
  }));
}
