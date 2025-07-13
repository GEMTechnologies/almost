/**
 * Granada OS - Document Upload Routes
 * Handles file uploads, document management, and admin approval workflows
 */

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { nanoid } from 'nanoid';
import { db } from '../db';
import { uploadedDocuments, documentAccessLogs, users, adminNotifications } from '../../shared/schema';
import { eq, and, desc } from 'drizzle-orm';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'documents');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = nanoid();
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word, Excel, and image files are allowed.'));
    }
  }
});

// Upload document
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const {
      userId,
      category,
      subcategory,
      documentType,
      description,
      tags,
      isConfidential,
      expiryDate
    } = req.body;

    // Validate required fields
    if (!userId || !category || !documentType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: userId, category, documentType' 
      });
    }

    // Create document record
    const [document] = await db.insert(uploadedDocuments).values({
      userId,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path,
      category,
      subcategory: subcategory || null,
      documentType,
      description: description || null,
      tags: tags ? JSON.parse(tags) : [],
      isConfidential: isConfidential === 'true',
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      status: 'pending',
      approvalStatus: 'pending'
    }).returning();

    // Log the upload action
    await db.insert(documentAccessLogs).values({
      documentId: document.id,
      userId,
      action: 'upload',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Create admin notification
    await db.insert(adminNotifications).values({
      type: 'document_upload',
      title: 'New Document Upload',
      message: `User uploaded "${req.file.originalname}" (${category})`,
      priority: isConfidential === 'true' ? 'high' : 'normal',
      userId,
      metadata: {
        documentId: document.id,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        category,
        documentType
      }
    });

    res.json({
      success: true,
      document: {
        id: document.id,
        fileName: document.originalName,
        category: document.category,
        documentType: document.documentType,
        uploadedAt: document.uploadedAt,
        status: document.status
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload document' 
    });
  }
});

// Get user's documents
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { category, status, search } = req.query;

    let query = db.select().from(uploadedDocuments).where(eq(uploadedDocuments.userId, userId));

    if (category && category !== 'all') {
      query = query.where(eq(uploadedDocuments.category, category as string));
    }

    if (status && status !== 'all') {
      query = query.where(eq(uploadedDocuments.status, status as string));
    }

    const documents = await query.orderBy(desc(uploadedDocuments.uploadedAt));

    // Filter by search if provided
    let filteredDocs = documents;
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredDocs = documents.filter(doc => 
        doc.originalName.toLowerCase().includes(searchTerm) ||
        doc.description?.toLowerCase().includes(searchTerm) ||
        doc.documentType.toLowerCase().includes(searchTerm)
      );
    }

    res.json({
      success: true,
      documents: filteredDocs.map(doc => ({
        id: doc.id,
        fileName: doc.originalName,
        fileType: doc.fileType,
        fileSize: doc.fileSize,
        category: doc.category,
        subcategory: doc.subcategory,
        documentType: doc.documentType,
        description: doc.description,
        tags: doc.tags,
        isConfidential: doc.isConfidential,
        status: doc.status,
        approvalStatus: doc.approvalStatus,
        uploadedAt: doc.uploadedAt,
        expiryDate: doc.expiryDate,
        version: doc.version,
        rejectionReason: doc.rejectionReason
      }))
    });

  } catch (error) {
    console.error('Error fetching user documents:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch documents' 
    });
  }
});

// Download document
router.get('/download/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { userId } = req.query;

    // Get document details
    const [document] = await db.select()
      .from(uploadedDocuments)
      .where(eq(uploadedDocuments.id, documentId));

    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    // Check if user has access (owner or approved)
    if (document.userId !== userId && document.approvalStatus !== 'approved') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    // Log the download action
    if (userId) {
      await db.insert(documentAccessLogs).values({
        documentId,
        userId: userId as string,
        action: 'download',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    }

    // Check if file exists
    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ success: false, error: 'File not found on server' });
    }

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    res.setHeader('Content-Type', document.fileType);

    // Stream the file
    const fileStream = fs.createReadStream(document.filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to download document' 
    });
  }
});

// Delete document
router.delete('/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { userId } = req.body;

    // Get document details
    const [document] = await db.select()
      .from(uploadedDocuments)
      .where(eq(uploadedDocuments.id, documentId));

    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    // Check if user is the owner
    if (document.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Delete from database
    await db.delete(uploadedDocuments).where(eq(uploadedDocuments.id, documentId));

    // Log the deletion
    await db.insert(documentAccessLogs).values({
      documentId,
      userId,
      action: 'delete',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ success: true, message: 'Document deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete document' 
    });
  }
});

// Admin routes
router.get('/admin/pending', async (req, res) => {
  try {
    const pendingDocuments = await db.select({
      id: uploadedDocuments.id,
      fileName: uploadedDocuments.originalName,
      fileType: uploadedDocuments.fileType,
      fileSize: uploadedDocuments.fileSize,
      category: uploadedDocuments.category,
      documentType: uploadedDocuments.documentType,
      description: uploadedDocuments.description,
      isConfidential: uploadedDocuments.isConfidential,
      uploadedAt: uploadedDocuments.uploadedAt,
      userId: uploadedDocuments.userId,
      userFullName: users.fullName,
      userEmail: users.email
    })
    .from(uploadedDocuments)
    .leftJoin(users, eq(uploadedDocuments.userId, users.id))
    .where(eq(uploadedDocuments.approvalStatus, 'pending'))
    .orderBy(desc(uploadedDocuments.uploadedAt));

    res.json({ success: true, documents: pendingDocuments });

  } catch (error) {
    console.error('Error fetching pending documents:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch pending documents' 
    });
  }
});

// Admin approve/reject document
router.patch('/admin/:documentId/status', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { action, adminId, reason, adminNotes } = req.body; // action: 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Invalid action' });
    }

    // Update document status
    const updateData: any = {
      approvalStatus: action === 'approve' ? 'approved' : 'rejected',
      status: action === 'approve' ? 'active' : 'rejected',
      approvedBy: adminId,
      approvedAt: new Date(),
      adminNotes: adminNotes || null
    };

    if (action === 'reject' && reason) {
      updateData.rejectionReason = reason;
    }

    const [updatedDocument] = await db.update(uploadedDocuments)
      .set(updateData)
      .where(eq(uploadedDocuments.id, documentId))
      .returning();

    if (!updatedDocument) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    // Create admin notification to user
    await db.insert(adminNotifications).values({
      type: 'document_status',
      title: `Document ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      message: action === 'approve' 
        ? `Your document "${updatedDocument.originalName}" has been approved`
        : `Your document "${updatedDocument.originalName}" was rejected. Reason: ${reason || 'No reason provided'}`,
      priority: 'normal',
      userId: updatedDocument.userId,
      metadata: {
        documentId,
        action,
        reason: reason || null,
        adminNotes: adminNotes || null
      }
    });

    res.json({ 
      success: true, 
      message: `Document ${action}d successfully`,
      document: updatedDocument
    });

  } catch (error) {
    console.error('Error updating document status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update document status' 
    });
  }
});

export default router;