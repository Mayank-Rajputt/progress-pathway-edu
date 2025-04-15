import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { UserModel } from '../models/userModel';
import { StudentModel } from '../models/studentModel';
import { AttendanceModel } from '../models/attendanceModel';
import { MarkModel } from '../models/markModel';
import { ReportCardModel } from '../models/reportCardModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';

// Get admin dashboard data
export const getAdminDashboard = asyncHandler(async (req: Request, res: Response) => {
  // Get user counts by role
  const userCounts = await UserModel.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);
  
  // Get total users
  const totalUsers = userCounts.reduce((sum, item) => sum + item.count, 0);
  
  // Format user counts
  const userStats = {
    total: totalUsers,
    admin: userCounts.find(item => item._id === 'admin')?.count || 0,
    teacher: userCounts.find(item => item._id === 'teacher')?.count || 0,
    student: userCounts.find(item => item._id === 'student')?.count || 0,
    parent: userCounts.find(item => item._id === 'parent')?.count || 0
  };
  
  // Get class counts
  const classCounts = await StudentModel.aggregate([
    {
      $group: {
        _id: { class: '$class', section: '$section' },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: null,
        classes: { $push: '$$ROOT' },
        totalClasses: { $sum: 1 }
      }
    }
  ]);
  
  const classStats = classCounts.length > 0
    ? classCounts[0]
    : { classes: [], totalClasses: 0 };
  
  // Get today's attendance
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const attendanceToday = await AttendanceModel.aggregate([
    {
      $match: {
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const totalStudentsToday = attendanceToday.reduce((sum, item) => sum + item.count, 0);
  
  const attendanceStats = {
    total: totalStudentsToday,
    present: attendanceToday.find(item => item._id === 'present')?.count || 0,
    absent: attendanceToday.find(item => item._id === 'absent')?.count || 0,
    late: attendanceToday.find(item => item._id === 'late')?.count || 0,
    percentage: totalStudentsToday > 0
      ? Math.round(((attendanceToday.find(item => item._id === 'present')?.count || 0) / totalStudentsToday) * 100)
      : 0
  };
  
  // Get performance by class
  const classPerformance = await MarkModel.aggregate([
    {
      $group: {
        _id: { class: '$class', section: '$section' },
        totalMarks: { $sum: '$marks' },
        totalMaximum: { $sum: '$totalMarks' },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        class: '$_id.class',
        section: '$_id.section',
        average: {
          $multiply: [
            { $divide: ['$totalMarks', '$totalMaximum'] },
            100
          ]
        }
      }
    },
    {
      $sort: { class: 1, section: 1 }
    }
  ]);
  
  res.json({
    success: true,
    data: {
      userStats,
      classStats,
      attendanceStats,
      classPerformance
    }
  });
});

// Get teacher dashboard data
export const getTeacherDashboard = asyncHandler(async (req: Request, res: Response) => {
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get classes taught by the teacher
  const teacherClasses = await MarkModel.aggregate([
    {
      $match: {
        recordedBy: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $group: {
        _id: { class: '$class', section: '$section' },
        subjects: { $addToSet: '$subject' }
      }
    },
    {
      $project: {
        _id: 0,
        class: '$_id.class',
        section: '$_id.section',
        subjects: 1
      }
    },
    {
      $sort: { class: 1, section: 1 }
    }
  ]);
  
  // Get student counts for classes taught
  const studentCounts = await StudentModel.aggregate([
    {
      $match: {
        $or: teacherClasses.map(c => ({
          class: c.class,
          section: c.section
        }))
      }
    },
    {
      $group: {
        _id: { class: '$class', section: '$section' },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        class: '$_id.class',
        section: '$_id.section',
        count: 1
      }
    }
  ]);
  
  // Combine classes with student counts
  const classes = teacherClasses.map(c => ({
    ...c,
    students: studentCounts.find(
      s => s.class === c.class && s.section === c.section
    )?.count || 0
  }));
  
  // Get attendance for today for these classes
  const attendanceToday = await AttendanceModel.aggregate([
    {
      $match: {
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        $or: teacherClasses.map(c => ({
          class: c.class,
          section: c.section
        }))
      }
    },
    {
      $group: {
        _id: {
          class: '$class',
          section: '$section',
          status: '$status'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: {
          class: '$_id.class',
          section: '$_id.section'
        },
        statuses: {
          $push: {
            status: '$_id.status',
            count: '$count'
          }
        }
      }
    }
  ]);
  
  // Format attendance data
  const attendanceByClass = attendanceToday.map(a => {
    const totalStudents = a.statuses.reduce((sum, s) => sum + s.count, 0);
    return {
      class: a._id.class,
      section: a._id.section,
      present: a.statuses.find(s => s.status === 'present')?.count || 0,
      absent: a.statuses.find(s => s.status === 'absent')?.count || 0,
      late: a.statuses.find(s => s.status === 'late')?.count || 0,
      percentage: totalStudents > 0
        ? Math.round(((a.statuses.find(s => s.status === 'present')?.count || 0) / totalStudents) * 100)
        : 0
    };
  });
  
  // Get recent performance
  const recentPerformance = await MarkModel.aggregate([
    {
      $match: {
        recordedBy: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $sort: { date: -1 }
    },
    {
      $limit: 100
    },
    {
      $group: {
        _id: {
          subject: '$subject',
          class: '$class',
          section: '$section',
          examType: '$examType'
        },
        totalMarks: { $sum: '$marks' },
        totalMaximum: { $sum: '$totalMarks' },
        count: { $sum: 1 },
        date: { $max: '$date' }
      }
    },
    {
      $project: {
        _id: 0,
        subject: '$_id.subject',
        class: '$_id.class',
        section: '$_id.section',
        examType: '$_id.examType',
        average: {
          $multiply: [
            { $divide: ['$totalMarks', '$totalMaximum'] },
            100
          ]
        },
        date: 1
      }
    },
    {
      $sort: { date: -1 }
    },
    {
      $limit: 5
    }
  ]);
  
  res.json({
    success: true,
    data: {
      classes,
      attendanceByClass,
      recentPerformance
    }
  });
});

// Get student dashboard data
export const getStudentDashboard = asyncHandler(async (req: Request, res: Response) => {
  // Get student details
  const student = await StudentModel.findOne({ userId: req.user._id }).populate({
    path: 'userId',
    select: 'name'
  });
  
  if (!student) {
    throw new ApiError(404, 'Student profile not found');
  }
  
  // Get recent attendance
  const recentAttendance = await AttendanceModel.find({
    studentId: student._id
  })
    .sort({ date: -1 })
    .limit(30);
  
  // Calculate attendance stats
  const attendanceStats = {
    total: recentAttendance.length,
    present: recentAttendance.filter(a => a.status === 'present').length,
    absent: recentAttendance.filter(a => a.status === 'absent').length,
    late: recentAttendance.filter(a => a.status === 'late').length,
    percentage: recentAttendance.length > 0
      ? Math.round(
          (recentAttendance.filter(a => a.status === 'present').length / recentAttendance.length) * 100
        )
      : 0
  };
  
  // Get recent marks
  const recentMarks = await MarkModel.find({
    studentId: student._id
  })
    .sort({ date: -1 })
    .limit(10);
  
  // Calculate marks summary
  const subjectWiseMarks = await MarkModel.aggregate([
    {
      $match: {
        studentId: student._id
      }
    },
    {
      $group: {
        _id: '$subject',
        totalMarks: { $sum: '$marks' },
        totalMaximum: { $sum: '$totalMarks' },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        subject: '$_id',
        percentage: {
          $multiply: [
            { $divide: ['$totalMarks', '$totalMaximum'] },
            100
          ]
        }
      }
    },
    {
      $sort: { percentage: -1 }
    }
  ]);
  
  // Get upcoming or recent report cards
  const reportCards = await ReportCardModel.find({
    studentId: student._id
  })
    .select('term academicYear percentage grade generatedDate')
    .sort({ generatedDate: -1 })
    .limit(3);
  
  // Fix: Extract user name safely from populated document
  const populatedData = student.toObject();
  const userName = populatedData.userId && typeof populatedData.userId === 'object' ? 
                  (populatedData.userId as any).name || 'Unknown' : 'Unknown';
  
  res.json({
    success: true,
    data: {
      student: {
        id: student._id,
        name: userName,
        rollNumber: student.rollNumber,
        class: student.class,
        section: student.section
      },
      attendanceStats,
      recentAttendance: recentAttendance.map(a => ({
        date: a.date,
        status: a.status,
        remarks: a.remarks
      })),
      subjectWiseMarks,
      recentMarks: recentMarks.map(m => ({
        subject: m.subject,
        marks: m.marks,
        totalMarks: m.totalMarks,
        percentage: Math.round((m.marks / m.totalMarks) * 100),
        examType: m.examType,
        date: m.date
      })),
      reportCards
    }
  });
});

// Get parent dashboard data
export const getParentDashboard = asyncHandler(async (req: Request, res: Response) => {
  // Get children details
  const children = await StudentModel.find({ parentId: req.user._id }).populate({
    path: 'userId',
    select: 'name'
  });
  
  if (children.length === 0) {
    throw new ApiError(404, 'No children found');
  }
  
  // Get data for each child
  const childrenData = await Promise.all(
    children.map(async child => {
      // Get attendance stats
      const attendance = await AttendanceModel.find({
        studentId: child._id
      })
        .sort({ date: -1 })
        .limit(30);
      
      const attendanceStats = {
        total: attendance.length,
        present: attendance.filter(a => a.status === 'present').length,
        absent: attendance.filter(a => a.status === 'absent').length,
        late: attendance.filter(a => a.status === 'late').length,
        percentage: attendance.length > 0
          ? Math.round(
              (attendance.filter(a => a.status === 'present').length / attendance.length) * 100
            )
          : 0
      };
      
      // Get subject performance
      const subjectPerformance = await MarkModel.aggregate([
        {
          $match: {
            studentId: child._id
          }
        },
        {
          $group: {
            _id: '$subject',
            totalMarks: { $sum: '$marks' },
            totalMaximum: { $sum: '$totalMarks' }
          }
        },
        {
          $project: {
            _id: 0,
            subject: '$_id',
            percentage: {
              $multiply: [
                { $divide: ['$totalMarks', '$totalMaximum'] },
                100
              ]
            }
          }
        },
        {
          $sort: { percentage: -1 }
        }
      ]);
      
      // Get latest report card
      const reportCard = await ReportCardModel.findOne({
        studentId: child._id
      })
        .select('term academicYear percentage grade generatedDate')
        .sort({ generatedDate: -1 });
      
      // Fix: Extract user name safely from populated document
      const populatedData = child.toObject();
      const userName = populatedData.userId && typeof populatedData.userId === 'object' ? 
                      (populatedData.userId as any).name || 'Unknown' : 'Unknown';
      
      return {
        student: {
          id: child._id,
          name: userName,
          rollNumber: child.rollNumber,
          class: child.class,
          section: child.section
        },
        attendanceStats,
        subjectPerformance,
        reportCard
      };
    })
  );
  
  res.json({
    success: true,
    data: {
      children: childrenData
    }
  });
});
