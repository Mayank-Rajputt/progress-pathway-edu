
import express from 'express';
import { 
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  uploadDocument,
  getStudentDocuments,
  deleteDocument
} from '../controllers/studentController';
import { protect, authorize, authorizeForCollege, logActivity } from '../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/backend/uploads/documents');
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image, PDF, Word, and Excel files are allowed'));
  }
});

// All routes are protected
router.use(protect);
router.use(authorizeForCollege);

// Routes for all authorized users
router.get('/', logActivity('view', 'students'), getStudents);
router.get('/:id', logActivity('view', 'students'), getStudentById);
router.get('/:id/documents', logActivity('view', 'documents'), getStudentDocuments);

// Routes for admin and teachers only
router.post('/', authorize('admin', 'department_admin', 'teacher'), logActivity('create', 'students'), createStudent);
router.put('/:id', authorize('admin', 'department_admin', 'teacher'), logActivity('update', 'students'), updateStudent);
router.delete('/:id', authorize('admin', 'department_admin'), logActivity('delete', 'students'), deleteStudent);

// Document routes
router.post('/:id/documents', 
  authorize('admin', 'department_admin', 'teacher', 'student'),
  upload.single('document'),
  logActivity('upload', 'documents'),
  uploadDocument
);

router.delete('/:id/documents/:documentId', 
  authorize('admin', 'department_admin', 'teacher'),
  logActivity('delete', 'documents'),
  deleteDocument
);

export default router;
