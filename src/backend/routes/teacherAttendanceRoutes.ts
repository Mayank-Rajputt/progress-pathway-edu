
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

// All routes are protected and only admin can access
router.use(protect);
router.use(authorize('admin'));

// Teacher attendance routes
router.get('/teachers', getAllTeachers);
router.post('/', markTeacherAttendance);
router.post('/bulk', markBulkTeacherAttendance);
router.get('/', getTeacherAttendanceRecords);
router.get('/summary', getTeacherAttendanceSummary);

export default router;
