
import express from 'express';
import { getStudentAnalytics, getClassAnalytics } from '../controllers/analyticsController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Protected routes - require authentication
router.use(protect);

// Student analytics - accessible by admin, teacher, the student themselves, and the student's parent
router.get('/student/:studentId', getStudentAnalytics);

// Class analytics - accessible by admin and teachers
router.get('/class/:classId', authorize('admin', 'department_admin', 'teacher'), getClassAnalytics);
router.get('/class/:classId/section/:section', authorize('admin', 'department_admin', 'teacher'), getClassAnalytics);

export default router;
