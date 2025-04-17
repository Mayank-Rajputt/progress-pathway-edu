
import express from 'express';
import { 
  getActivityLogs,
  getActivityLogById,
  deleteActivityLog,
  getActivityLogStats
} from '../controllers/activityLogController';
import { protect, authorize, authorizeForCollege, logActivity } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected and restricted to admins
router.use(protect);
router.use(authorize('admin', 'department_admin'));
router.use(authorizeForCollege);

// Get activity logs
router.get('/', logActivity('view', 'logs'), getActivityLogs);
router.get('/stats', logActivity('view', 'logs'), getActivityLogStats);
router.get('/:id', logActivity('view', 'logs'), getActivityLogById);

// Delete logs - only main admin can delete logs
router.delete('/:id', authorize('admin'), logActivity('delete', 'logs'), deleteActivityLog);

export default router;
