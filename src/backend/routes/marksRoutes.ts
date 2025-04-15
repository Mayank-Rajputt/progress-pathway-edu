
import express from 'express';
import { 
  enterMarks,
  enterBulkMarks,
  getMarks,
  getStudentMarksSummary,
  getClassPerformance
} from '../controllers/marksController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes for all authorized users
router.get('/', getMarks);
router.get('/student/:id', getStudentMarksSummary);
router.get('/class-performance', getClassPerformance);

// Routes for teachers and admin only
router.post('/', authorize('admin', 'teacher'), enterMarks);
router.post('/bulk', authorize('admin', 'teacher'), enterBulkMarks);

export default router;
