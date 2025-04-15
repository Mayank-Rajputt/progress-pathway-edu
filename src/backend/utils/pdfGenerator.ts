
import PDFDocument from 'pdfkit';
import fs from 'fs-extra';
import path from 'path';
import { IReportCard } from '../models/reportCardModel';

// Create a temporary directory for storing PDFs
const tempDir = path.join(process.cwd(), 'temp');
fs.ensureDirSync(tempDir);

export const generateReportCardPDF = async (reportCard: IReportCard, studentName: string): Promise<string> => {
  // Create a new PDF document
  const doc = new PDFDocument({ margin: 50 });
  
  // Create a unique filename
  const filename = `report_card_${reportCard._id}_${Date.now()}.pdf`;
  const filePath = path.join(tempDir, filename);
  
  // Pipe PDF to file
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);
  
  // Add school logo and header
  doc.fontSize(20).text('Trakdemy School', { align: 'center' });
  doc.fontSize(14).text('Report Card', { align: 'center' });
  doc.moveDown();
  
  // Add student information
  doc.fontSize(12).text(`Student Name: ${studentName}`);
  doc.text(`Class: ${reportCard.class} - Section: ${reportCard.section}`);
  doc.text(`Term: ${reportCard.term}`);
  doc.text(`Academic Year: ${reportCard.academicYear}`);
  doc.moveDown();
  
  // Add subject marks table
  doc.fontSize(14).text('Academic Performance', { underline: true });
  doc.moveDown();
  
  // Table headers
  const tableTop = doc.y;
  const subjectWidth = 200;
  const marksWidth = 100;
  const gradeWidth = 100;
  const remarksWidth = 150;
  
  doc.fontSize(10);
  doc.text('Subject', doc.x, tableTop);
  doc.text('Marks', doc.x + subjectWidth, tableTop);
  doc.text('Grade', doc.x + subjectWidth + marksWidth, tableTop);
  doc.text('Remarks', doc.x + subjectWidth + marksWidth + gradeWidth, tableTop);
  
  doc.moveDown();
  let yPosition = doc.y;
  
  // Add a line after headers
  doc.moveTo(doc.x, yPosition - 5)
     .lineTo(doc.x + subjectWidth + marksWidth + gradeWidth + remarksWidth, yPosition - 5)
     .stroke();
  
  // Table rows
  reportCard.subjects.forEach((subject, index) => {
    yPosition = doc.y;
    
    doc.text(subject.name, doc.x, yPosition);
    doc.text(`${subject.marks}/${subject.totalMarks}`, doc.x + subjectWidth, yPosition);
    doc.text(subject.grade, doc.x + subjectWidth + marksWidth, yPosition);
    doc.text(subject.remarks || '', doc.x + subjectWidth + marksWidth + gradeWidth, yPosition, { width: remarksWidth });
    
    doc.moveDown();
    
    // Check if we need a new page
    if (doc.y > 700) {
      doc.addPage();
      yPosition = doc.y;
    }
  });
  
  // Add a line after subjects
  doc.moveTo(doc.x, doc.y)
     .lineTo(doc.x + subjectWidth + marksWidth + gradeWidth + remarksWidth, doc.y)
     .stroke();
  
  doc.moveDown();
  
  // Add total marks and percentage
  doc.fontSize(12).text(`Total Marks: ${reportCard.totalObtainedMarks}/${reportCard.totalMarks}`);
  doc.text(`Percentage: ${reportCard.percentage}%`);
  doc.text(`Overall Grade: ${reportCard.grade}`);
  
  doc.moveDown();
  
  // Add attendance information
  doc.fontSize(14).text('Attendance', { underline: true });
  doc.moveDown();
  
  doc.fontSize(12).text(`Total Classes: ${reportCard.attendance.totalClasses}`);
  doc.text(`Classes Attended: ${reportCard.attendance.attended}`);
  doc.text(`Attendance Percentage: ${reportCard.attendance.percentage}%`);
  
  doc.moveDown();
  
  // Add teacher remarks
  if (reportCard.teacherRemarks) {
    doc.fontSize(14).text('Teacher\'s Remarks', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(reportCard.teacherRemarks);
    doc.moveDown();
  }
  
  // Add signature section
  doc.moveDown();
  doc.moveDown();
  
  const signatureWidth = 150;
  doc.fontSize(10);
  
  doc.text('_____________________', doc.x, doc.y);
  doc.text('_____________________', doc.x + 400 - signatureWidth, doc.y);
  
  doc.moveDown();
  
  doc.text('Class Teacher', doc.x, doc.y);
  doc.text('Principal', doc.x + 400 - signatureWidth, doc.y);
  
  // End the document
  doc.end();
  
  // Return a Promise that resolves with the file path
  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      resolve(filePath);
    });
    
    stream.on('error', (err) => {
      reject(err);
    });
  });
};

// Clean up function to remove temporary files
export const cleanupTempFiles = async (): Promise<void> => {
  // Remove files older than 1 hour
  const files = await fs.readdir(tempDir);
  const now = Date.now();
  
  for (const file of files) {
    const filePath = path.join(tempDir, file);
    const stats = await fs.stat(filePath);
    const fileAge = now - stats.mtimeMs;
    
    // If file is older than 1 hour (3600000 ms), delete it
    if (fileAge > 3600000) {
      await fs.unlink(filePath);
    }
  }
};

// Schedule cleanup task
setInterval(cleanupTempFiles, 3600000); // Run every hour
