
import express from 'express';
import { 
  generateReportCard,
  getReportCards,
  getReportCardById,
  updateReportCardRemarks,
  downloadReportCardPDF
} from '../controllers/reportCardController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes for all authorized users
router.get('/', getReportCards);
router.get('/:id', getReportCardById);
router.get('/:id/download', downloadReportCardPDF);

// Routes for teachers and admin only
router.post('/', authorize('admin', 'department_admin', 'teacher'), generateReportCard);
router.put('/:id/remarks', authorize('admin', 'department_admin', 'teacher'), updateReportCardRemarks);

export default router;
