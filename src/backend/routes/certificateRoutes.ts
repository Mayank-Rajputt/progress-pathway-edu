
import express from 'express';
import { 
  createCertificate,
  getCertificates,
  getCertificateById,
  updateCertificate,
  deleteCertificate,
  generateCertificatePDF,
  sendCertificateByEmail
} from '../controllers/certificateController';
import { protect, authorize, authorizeForCollege, logActivity } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);
router.use(authorizeForCollege);

// Get certificates
router.get('/', logActivity('view', 'certificates'), getCertificates);
router.get('/:id', logActivity('view', 'certificates'), getCertificateById);

// Create certificate - admins, department admins and teachers only
router.post('/', 
  authorize('admin', 'department_admin', 'teacher'), 
  logActivity('create', 'certificates'), 
  createCertificate
);

// Update certificate - admins, department admins and teachers only
router.put('/:id', 
  authorize('admin', 'department_admin', 'teacher'), 
  logActivity('update', 'certificates'), 
  updateCertificate
);

// Delete certificate - admins and department admins only
router.delete('/:id', 
  authorize('admin', 'department_admin'), 
  logActivity('delete', 'certificates'), 
  deleteCertificate
);

// Generate certificate PDF
router.get('/:id/pdf', 
  logActivity('generate', 'certificates'), 
  generateCertificatePDF
);

// Send certificate by email
router.post('/:id/send', 
  authorize('admin', 'department_admin', 'teacher'), 
  logActivity('send', 'certificates'), 
  sendCertificateByEmail
);

export default router;
