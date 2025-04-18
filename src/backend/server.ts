
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import studentRoutes from './routes/studentRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import marksRoutes from './routes/marksRoutes';
import reportCardRoutes from './routes/reportCardRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import uploadRoutes from './routes/uploadRoutes';
import teacherAttendanceRoutes from './routes/teacherAttendanceRoutes';
import studentIssueRoutes from './routes/studentIssueRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import certificateRoutes from './routes/certificateRoutes';
import activityLogRoutes from './routes/activityLogRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import { createInitialAdmin } from './controllers/authController';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Create upload directories if they don't exist
const uploadDirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads/documents'),
  path.join(__dirname, 'uploads/certificates'),
  path.join(__dirname, 'uploads/profiles')
];

uploadDirs.forEach(dir => {
  if (!require('fs').existsSync(dir)) {
    require('fs').mkdirSync(dir, { recursive: true });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/report-cards', reportCardRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/teacher-attendance', teacherAttendanceRoutes);
app.use('/api/student-issues', studentIssueRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trakdemy')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Create initial admin user if none exists
    await createInitialAdmin();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

export default app;
