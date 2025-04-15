
import express from 'express';
import { 
  markAttendance,
  markBulkAttendance,
  getAttendance,
  getAttendanceSummary
} from '../controllers/attendanceController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes for all authorized users
router.get('/', getAttendance);
router.get('/summary', getAttendanceSummary);

// Routes for teachers and admin only
router.post('/', authorize('admin', 'teacher'), markAttendance);
router.post('/bulk', authorize('admin', 'teacher'), markBulkAttendance);

export default router;
