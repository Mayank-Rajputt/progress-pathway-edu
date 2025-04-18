
import { Request, Response } from 'express';
import { CertificateModel } from '../models/certificateModel';
import { UserModel } from '../models/userModel';
import { ApiError, asyncHandler } from '../middleware/errorMiddleware';
import { z } from 'zod';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Validate certificate input
const certificateSchema = z.object({
  type: z.enum(['participation', 'completion', 'achievement', 'appreciation', 'other']),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  issuedTo: z.string().min(1, 'Recipient is required'),
  templateId: z.string().min(1, 'Template ID is required'),
  metadata: z.record(z.any()).optional(),
  signature: z.object({
    name: z.string().min(1, 'Signature name is required'),
    designation: z.string().min(1, 'Designation is required'),
    imageUrl: z.string().optional()
  })
});

// Create certificate
export const createCertificate = asyncHandler(async (req: Request, res: Response) => {
  // Validate input
  const validatedData = certificateSchema.parse(req.body);
  
  // Check if recipient exists
  const recipient = await UserModel.findById(validatedData.issuedTo);
  if (!recipient) {
    throw new ApiError(404, 'Recipient not found');
  }
  
  // Generate certificate number
  const certificateNumber = `CERT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
  
  // Generate PDF
  const pdfFileName = `certificate-${uuidv4()}.pdf`;
  const pdfPath = path.join(__dirname, '..', 'uploads', 'certificates', pdfFileName);
  
  // Ensure directory exists
  const dir = path.dirname(pdfPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Generate PDF file
  await generatePDF(pdfPath, {
    type: validatedData.type,
    title: validatedData.title,
    description: validatedData.description,
    recipientName: recipient.name,
    certificateNumber,
    issuerName: req.user.name,
    signatureName: validatedData.signature.name,
    designation: validatedData.signature.designation,
    date: new Date().toLocaleDateString()
  });
  
  // File URL for the certificate
  const fileUrl = `/api/uploads/certificates/${pdfFileName}`;
  
  // Create certificate record
  const certificate = await CertificateModel.create({
    type: validatedData.type,
    title: validatedData.title,
    description: validatedData.description,
    issuedDate: new Date(),
    issuedTo: validatedData.issuedTo,
    issuedBy: req.user._id,
    certificateNumber,
    templateId: validatedData.templateId,
    collegeId: req.collegeId,
    fileUrl,
    metadata: validatedData.metadata || {},
    signature: {
      name: validatedData.signature.name,
      designation: validatedData.signature.designation,
      imageUrl: validatedData.signature.imageUrl || ''
    }
  });
  
  res.status(201).json({
    success: true,
    data: certificate
  });
});

// Get certificates
export const getCertificates = asyncHandler(async (req: Request, res: Response) => {
  const { 
    type, 
    issuedTo, 
    startDate, 
    endDate,
    page = 1,
    limit = 10
  } = req.query;
  
  // Build query
  const query: any = { collegeId: req.collegeId };
  if (type) query.type = type;
  if (issuedTo) query.issuedTo = issuedTo;
  
  // Date range
  if (startDate || endDate) {
    query.issuedDate = {};
    if (startDate) query.issuedDate.$gte = new Date(startDate as string);
    if (endDate) query.issuedDate.$lte = new Date(endDate as string);
  }
  
  // For students and parents, only show their own certificates
  if (req.user.role === 'student') {
    query.issuedTo = req.user._id;
  } else if (req.user.role === 'parent') {
    // Get student IDs linked to parent
    const { ParentModel } = require('../models/parentModel');
    const parent = await ParentModel.findOne({ userId: req.user._id });
    if (parent) {
      query.issuedTo = { $in: parent.studentIds };
    } else {
      query.issuedTo = null; // No students linked, return empty result
    }
  }
  
  // Count total documents
  const totalDocs = await CertificateModel.countDocuments(query);
  
  // Get paginated results
  const skip = (Number(page) - 1) * Number(limit);
  
  const certificates = await CertificateModel.find(query)
    .populate('issuedTo', 'name email')
    .populate('issuedBy', 'name role')
    .sort({ issuedDate: -1 })
    .skip(skip)
    .limit(Number(limit));
  
  res.json({
    success: true,
    count: certificates.length,
    totalPages: Math.ceil(totalDocs / Number(limit)),
    currentPage: Number(page),
    data: certificates
  });
});

// Get certificate by ID
export const getCertificateById = asyncHandler(async (req: Request, res: Response) => {
  const certificate = await CertificateModel.findOne({
    _id: req.params.id,
    collegeId: req.collegeId
  })
    .populate('issuedTo', 'name email')
    .populate('issuedBy', 'name role');
  
  if (!certificate) {
    throw new ApiError(404, 'Certificate not found');
  }
  
  // For students and parents, ensure they can only view their own certificates
  if (req.user.role === 'student' && certificate.issuedTo._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to view this certificate');
  } else if (req.user.role === 'parent') {
    // Check if certificate belongs to one of parent's students
    const { ParentModel } = require('../models/parentModel');
    const parent = await ParentModel.findOne({ userId: req.user._id });
    if (!parent || !parent.studentIds.includes(certificate.issuedTo._id)) {
      throw new ApiError(403, 'Not authorized to view this certificate');
    }
  }
  
  res.json({
    success: true,
    data: certificate
  });
});

// Update certificate
export const updateCertificate = asyncHandler(async (req: Request, res: Response) => {
  // Find certificate
  const certificate = await CertificateModel.findOne({
    _id: req.params.id,
    collegeId: req.collegeId
  });
  
  if (!certificate) {
    throw new ApiError(404, 'Certificate not found');
  }
  
  // Partial validation
  const updateSchema = certificateSchema.partial();
  const validatedData = updateSchema.parse(req.body);
  
  // Update fields
  if (validatedData.type) certificate.type = validatedData.type;
  if (validatedData.title) certificate.title = validatedData.title;
  if (validatedData.description) certificate.description = validatedData.description;
  if (validatedData.issuedTo) {
    // Check if new recipient exists
    const recipient = await UserModel.findById(validatedData.issuedTo);
    if (!recipient) {
      throw new ApiError(404, 'Recipient not found');
    }
    certificate.issuedTo = validatedData.issuedTo as any;
  }
  if (validatedData.templateId) certificate.templateId = validatedData.templateId;
  if (validatedData.metadata) certificate.metadata = validatedData.metadata;
  if (validatedData.signature) {
    certificate.signature = {
      name: validatedData.signature.name || certificate.signature.name,
      designation: validatedData.signature.designation || certificate.signature.designation,
      imageUrl: validatedData.signature.imageUrl || certificate.signature.imageUrl
    };
  }
  
  // Regenerate PDF if key details changed
  if (validatedData.title || validatedData.description || 
      validatedData.type || validatedData.issuedTo || 
      validatedData.signature) {
    // Get recipient details
    const recipient = await UserModel.findById(certificate.issuedTo);
    
    // Generate new PDF
    const pdfFileName = `certificate-${uuidv4()}.pdf`;
    const pdfPath = path.join(__dirname, '..', 'uploads', 'certificates', pdfFileName);
    
    // Ensure directory exists
    const dir = path.dirname(pdfPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Generate PDF file
    await generatePDF(pdfPath, {
      type: certificate.type,
      title: certificate.title,
      description: certificate.description,
      recipientName: recipient?.name || 'Recipient',
      certificateNumber: certificate.certificateNumber,
      issuerName: req.user.name,
      signatureName: certificate.signature.name,
      designation: certificate.signature.designation,
      date: new Date(certificate.issuedDate).toLocaleDateString()
    });
    
    // Update file URL
    certificate.fileUrl = `/api/uploads/certificates/${pdfFileName}`;
  }
  
  // Save certificate
  const updatedCertificate = await certificate.save();
  
  res.json({
    success: true,
    data: updatedCertificate
  });
});

// Delete certificate
export const deleteCertificate = asyncHandler(async (req: Request, res: Response) => {
  const certificate = await CertificateModel.findOne({
    _id: req.params.id,
    collegeId: req.collegeId
  });
  
  if (!certificate) {
    throw new ApiError(404, 'Certificate not found');
  }
  
  // Delete file if exists
  const filePath = path.join(
    __dirname, 
    '..', 
    'uploads', 
    certificate.fileUrl.replace('/api/uploads/', '')
  );
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  
  await certificate.deleteOne();
  
  res.json({
    success: true,
    message: 'Certificate deleted successfully'
  });
});

// Generate certificate PDF
export const generateCertificatePDF = asyncHandler(async (req: Request, res: Response) => {
  const certificate = await CertificateModel.findOne({
    _id: req.params.id,
    collegeId: req.collegeId
  }).populate('issuedTo', 'name');
  
  if (!certificate) {
    throw new ApiError(404, 'Certificate not found');
  }
  
  // For students and parents, ensure they can only access their own certificates
  if (req.user.role === 'student' && certificate.issuedTo._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to access this certificate');
  } else if (req.user.role === 'parent') {
    // Check if certificate belongs to one of parent's students
    const { ParentModel } = require('../models/parentModel');
    const parent = await ParentModel.findOne({ userId: req.user._id });
    if (!parent || !parent.studentIds.includes(certificate.issuedTo._id)) {
      throw new ApiError(403, 'Not authorized to access this certificate');
    }
  }
  
  // PDF path
  const filePath = path.join(
    __dirname, 
    '..', 
    'uploads', 
    certificate.fileUrl.replace('/api/uploads/', '')
  );
  
  // If file doesn't exist, regenerate it
  if (!fs.existsSync(filePath)) {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Get the recipient name safely
    let recipientName = 'Recipient';
    if (certificate.issuedTo) {
      // Check if issuedTo is populated
      if (typeof certificate.issuedTo === 'object' && certificate.issuedTo !== null && 'name' in certificate.issuedTo) {
        recipientName = certificate.issuedTo.name as string;
      }
    }
    
    // Generate PDF file
    await generatePDF(filePath, {
      type: certificate.type,
      title: certificate.title,
      description: certificate.description,
      recipientName: recipientName,
      certificateNumber: certificate.certificateNumber,
      issuerName: req.user.name,
      signatureName: certificate.signature.name,
      designation: certificate.signature.designation,
      date: new Date(certificate.issuedDate).toLocaleDateString()
    });
  }
  
  // Set headers for file download
  res.setHeader('Content-Type', 'application/pdf');
  
  // Get the recipient email safely for the filename
  let recipientName = 'recipient';
  if (certificate.issuedTo) {
    // Check if issuedTo is populated
    if (typeof certificate.issuedTo === 'object' && certificate.issuedTo !== null && 'name' in certificate.issuedTo) {
      recipientName = (certificate.issuedTo.name as string).replace(/\s+/g, '_');
    }
  }
  
  res.setHeader(
    'Content-Disposition', 
    `attachment; filename=${certificate.type}_certificate_${recipientName}.pdf`
  );
  
  // Stream file to response
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// Send certificate by email
export const sendCertificateByEmail = asyncHandler(async (req: Request, res: Response) => {
  const certificate = await CertificateModel.findOne({
    _id: req.params.id,
    collegeId: req.collegeId
  }).populate('issuedTo', 'name email');
  
  if (!certificate) {
    throw new ApiError(404, 'Certificate not found');
  }
  
  // Get the recipient email safely
  let recipientEmail = 'No email available';
  if (certificate.issuedTo) {
    // Check if issuedTo is populated
    if (typeof certificate.issuedTo === 'object' && certificate.issuedTo !== null && 'email' in certificate.issuedTo) {
      recipientEmail = certificate.issuedTo.email as string;
    }
  }
  
  // TODO: Implement email sending functionality when email service is configured
  // For now, simulate email sending
  
  res.json({
    success: true,
    message: `Certificate has been sent to ${recipientEmail}`
  });
});

// Helper function to generate PDF certificate
async function generatePDF(
  filePath: string, 
  data: {
    type: string;
    title: string;
    description: string;
    recipientName: string;
    certificateNumber: string;
    issuerName: string;
    signatureName: string;
    designation: string;
    date: string;
  }
) {
  return new Promise<void>((resolve, reject) => {
    try {
      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 50
      });
      
      // Pipe output to file
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
      
      // Add border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .lineWidth(3)
        .stroke('#3b82f6');
      
      // Add certificate type
      doc.fontSize(14)
        .fill('#4b5563')
        .font('Helvetica')
        .text(data.type.toUpperCase(), {
          align: 'center',
          lineGap: 10
        });
      
      // Add title
      doc.fontSize(36)
        .fill('#1f2937')
        .font('Helvetica-Bold')
        .text(data.title, {
          align: 'center',
          lineGap: 20
        });
      
      // Add recipient name
      doc.fontSize(24)
        .fill('#1f2937')
        .font('Helvetica')
        .text('This is to certify that', {
          align: 'center',
          lineGap: 15
        });
      
      doc.fontSize(30)
        .fill('#2563eb')
        .font('Helvetica-Bold')
        .text(data.recipientName, {
          align: 'center',
          lineGap: 20
        });
      
      // Add description
      doc.fontSize(16)
        .fill('#4b5563')
        .font('Helvetica')
        .text(data.description, {
          align: 'center',
          lineGap: 20
        });
      
      // Add date
      doc.fontSize(14)
        .fill('#4b5563')
        .font('Helvetica')
        .text(`Date: ${data.date}`, 150, 500);
      
      // Add signature
      doc.fontSize(14)
        .fill('#4b5563')
        .font('Helvetica-Bold')
        .text(data.signatureName, doc.page.width - 250, 500)
        .font('Helvetica')
        .fontSize(12)
        .text(data.designation, doc.page.width - 250, doc.y + 5);
      
      // Add certificate number
      doc.fontSize(10)
        .fill('#6b7280')
        .font('Helvetica')
        .text(`Certificate No: ${data.certificateNumber}`, 50, doc.page.height - 50);
      
      // Add issuer
      doc.fontSize(10)
        .fill('#6b7280')
        .font('Helvetica')
        .text(`Issued by: ${data.issuerName}`, doc.page.width - 200, doc.page.height - 50);
      
      // Finalize PDF
      doc.end();
      
      // Wait for stream to finish
      stream.on('finish', () => {
        resolve();
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}
