
import express from 'express';
import { 
  createStudentIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue
} from '../controllers/studentIssueController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Student issues routes
router.post('/', authorize('student'), createStudentIssue);
router.get('/', getAllIssues);
router.get('/:id', getIssueById);
router.put('/:id', authorize('admin', 'department_admin', 'teacher'), updateIssue);
// Updated to allow students to delete their own issues
router.delete('/:id', deleteIssue);

export default router;
