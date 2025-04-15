
import express from 'express';
import { 
  getAdminDashboard,
  getTeacherDashboard,
  getStudentDashboard,
  getParentDashboard
} from '../controllers/dashboardController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Role-specific dashboard routes
router.get('/admin', authorize('admin'), getAdminDashboard);
router.get('/teacher', authorize('teacher'), getTeacherDashboard);
router.get('/student', authorize('student'), getStudentDashboard);
router.get('/parent', authorize('parent'), getParentDashboard);

export default router;
