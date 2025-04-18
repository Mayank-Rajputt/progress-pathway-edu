
import express from 'express';
import { 
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updatePassword
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { errorHandler } from '../middleware/errorMiddleware';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, updatePassword);

// Apply error handling
router.use(errorHandler);

export default router;
