
import express from 'express';
import { 
  getAllTeachers,
  markTeacherAttendance,
  markBulkTeacherAttendance,
  getTeacherAttendanceRecords,
  getTeacherAttendanceSummary
} from '../controllers/teacherAttendanceController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Teacher attendance routes with proper authorization
router.get('/teachers', authorize('admin', 'department_admin'), getAllTeachers);
router.post('/', authorize('admin', 'department_admin'), markTeacherAttendance);
router.post('/bulk', authorize('admin', 'department_admin'), markBulkTeacherAttendance);
router.get('/', authorize('admin', 'department_admin', 'teacher'), getTeacherAttendanceRecords);
router.get('/summary', authorize('admin', 'department_admin'), getTeacherAttendanceSummary);

export default router;
