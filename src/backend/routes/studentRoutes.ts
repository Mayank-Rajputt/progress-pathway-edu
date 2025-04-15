
import express from 'express';
import { 
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} from '../controllers/studentController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes for all authorized users
router.get('/', getStudents);
router.get('/:id', getStudentById);

// Routes for admin and teachers only
router.post('/', authorize('admin', 'teacher'), createStudent);
router.put('/:id', authorize('admin', 'teacher'), updateStudent);
router.delete('/:id', authorize('admin'), deleteStudent);

export default router;
