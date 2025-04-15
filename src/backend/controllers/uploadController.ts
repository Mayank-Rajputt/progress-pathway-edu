import { Request, Response } from 'express';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';
import path from 'path';
import multer from 'multer';
import fs from 'fs';

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileExtension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  }
});

// Configure upload options
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow specific file types
    const allowedFileTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .jpg, .png, .pdf, .doc, and .docx files are allowed'));
    }
  }
});

// Upload single file
export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  const uploadSingle = upload.single('file');
  
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer error
      throw new ApiError(400, `Upload error: ${err.message}`);
    } else if (err) {
      // Other error
      throw new ApiError(400, err.message);
    }
    
    // File uploaded successfully
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }
    
    // Create file URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    res.status(201).json({
      success: true,
      data: {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });
  });
});

// Upload multiple files
export const uploadMultipleFiles = asyncHandler(async (req: Request, res: Response) => {
  const uploadMultiple = upload.array('files', 5); // Max 5 files
  
  uploadMultiple(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer error
      throw new ApiError(400, `Upload error: ${err.message}`);
    } else if (err) {
      // Other error
      throw new ApiError(400, err.message);
    }
    
    // Files uploaded successfully
    if (!req.files || req.files.length === 0) {
      throw new ApiError(400, 'No files uploaded');
    }
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const files = Array.isArray(req.files) ? req.files : [];
    
    const fileData = files.map(file => ({
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      url: `${baseUrl}/uploads/${file.filename}`
    }));
    
    res.status(201).json({
      success: true,
      count: fileData.length,
      data: fileData
    });
  });
});

// Delete file
export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  const { filename } = req.params;
  
  if (!filename) {
    throw new ApiError(400, 'Filename is required');
  }
  
  const filePath = path.join(__dirname, '../../uploads', filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new ApiError(404, 'File not found');
  }
  
  // Delete file
  fs.unlinkSync(filePath);
  
  res.json({
    success: true,
    message: 'File deleted successfully'
  });
});
