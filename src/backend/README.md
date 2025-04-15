
# Trakdemy Backend API

This is the backend API for the Trakdemy educational management system.

## Tech Stack

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- REST API architecture

## Features

- Authentication with JWT
- Role-based access control
- Student management
- Attendance tracking
- Marks management
- Report card generation
- Admin, Teacher, Student, and Parent dashboards
- File uploads

## Project Structure

```
src/backend/
├── controllers/     # Request handlers
├── middleware/      # Middleware functions
├── models/          # Database models
├── routes/          # API routes
├── uploads/         # Uploaded files
├── server.ts        # Entry point
└── README.md        # Project documentation
```

## API Routes

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login a user
- GET /api/auth/profile - Get user profile
- PUT /api/auth/profile - Update user profile
- PUT /api/auth/password - Change password

### Students
- GET /api/students - Get all students (filtered by class/section)
- GET /api/students/:id - Get a specific student
- POST /api/students - Create a new student (admin, teacher)
- PUT /api/students/:id - Update a student (admin, teacher)
- DELETE /api/students/:id - Delete a student (admin)

### Attendance
- GET /api/attendance - Get attendance records
- GET /api/attendance/summary - Get attendance summary
- POST /api/attendance - Mark attendance for a student (admin, teacher)
- POST /api/attendance/bulk - Mark attendance for multiple students (admin, teacher)

### Marks
- GET /api/marks - Get marks records
- GET /api/marks/student/:id - Get marks summary for a student
- GET /api/marks/class-performance - Get class performance
- POST /api/marks - Enter marks for a student (admin, teacher)
- POST /api/marks/bulk - Enter marks for multiple students (admin, teacher)

### Report Cards
- GET /api/report-cards - Get report cards
- GET /api/report-cards/:id - Get a specific report card
- POST /api/report-cards - Generate a report card (admin, teacher)
- PUT /api/report-cards/:id/remarks - Update report card remarks (admin, teacher)

### Dashboard
- GET /api/dashboard/admin - Get admin dashboard data
- GET /api/dashboard/teacher - Get teacher dashboard data
- GET /api/dashboard/student - Get student dashboard data
- GET /api/dashboard/parent - Get parent dashboard data

### File Upload
- POST /api/upload/file - Upload a single file
- POST /api/upload/files - Upload multiple files
- DELETE /api/upload/:filename - Delete a file

## Setup and Installation

1. Make sure MongoDB is installed and running
2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/trakdemy
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm run dev
   ```

## Environment Variables

- `PORT`: Port on which the server will run (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Environment (development, production)

## Error Handling

The API uses a centralized error handling mechanism with appropriate HTTP status codes and error messages.

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true/false,
  "data": { ... },  // For successful responses
  "error": "Error message",  // For error responses
  "stack": "Error stack trace"  // In development mode only
}
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the request header:

```
Authorization: Bearer <token>
```

## Role-Based Access

The API implements role-based access control with four roles:
- admin: Full access to all features
- teacher: Access to teaching-related features
- student: Access to student-specific features
- parent: Access to features related to their children

## Swagger Documentation

API documentation is available at `/api-docs` when the server is running.
