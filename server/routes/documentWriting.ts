/**
 * Granada OS - Document Writing API Routes
 * Handles document generation requests, progress tracking, and admin notifications
 */

import { Router } from 'express';
import { documentWritingService } from '../services/documentWritingService';
import { z } from 'zod';

const router = Router();

// Request document writing
const createWritingJobSchema = z.object({
  documentName: z.string().min(1),
  documentType: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  organizationContext: z.any().optional()
});

router.post('/request', async (req, res) => {
  try {
    const validatedData = createWritingJobSchema.parse(req.body);
    
    // For now, use a default user ID (in real app, get from session)
    const userId = req.body.userId || 'default-user-id';
    
    const result = await documentWritingService.createWritingJob({
      userId,
      ...validatedData
    });
    
    if (result.success) {
      // Start the writing process immediately
      await documentWritingService.startWriting(result.jobId!);
      
      res.json({
        success: true,
        jobId: result.jobId,
        message: 'Document writing started successfully'
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error creating writing job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create writing job'
    });
  }
});

// Get writing progress
router.get('/progress/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const progress = await documentWritingService.getWritingProgress(jobId);
    
    if (progress) {
      res.json(progress);
    } else {
      res.status(404).json({
        error: 'Job not found'
      });
    }
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({
      error: 'Failed to get progress'
    });
  }
});

// Get user's writing jobs
router.get('/jobs/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const jobs = await documentWritingService.getUserWritingJobs(userId);
    res.json(jobs);
  } catch (error) {
    console.error('Error getting user jobs:', error);
    res.status(500).json({
      error: 'Failed to get user jobs'
    });
  }
});

// Admin: Get all notifications
router.get('/admin/notifications', async (req, res) => {
  try {
    const notifications = await documentWritingService.getAdminNotifications();
    res.json(notifications);
  } catch (error) {
    console.error('Error getting admin notifications:', error);
    res.status(500).json({
      error: 'Failed to get notifications'
    });
  }
});

export default router;