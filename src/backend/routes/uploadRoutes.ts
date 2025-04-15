
import express from 'express';
import { 
  uploadFile,
  uploadMultipleFiles,
  deleteFile
} from '../controllers/uploadController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// File upload routes
router.post('/file', uploadFile);
router.post('/files', uploadMultipleFiles);
router.delete('/:filename', deleteFile);

export default router;
