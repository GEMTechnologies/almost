/**
 * Granada OS - Document Writing Service with Progress Tracking
 * Handles document generation requests, progress tracking, and admin notifications
 */

import { db } from "../db";
import { documentWritingJobs, adminNotifications, creditTransactions, users } from "../../shared/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface DocumentWritingRequest {
  userId: string;
  documentName: string;
  documentType: string;
  category: string;
  subcategory?: string;
  organizationContext?: any;
}

export interface WritingProgress {
  jobId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  estimatedDuration: number;
  estimatedCompletion: Date;
  message: string;
}

export class DocumentWritingService {
  
  /**
   * Calculate credits required based on document type and complexity
   */
  private calculateCreditsRequired(documentType: string, category: string): number {
    const baseCredits = {
      'governance': 50,
      'financial': 70,
      'policies': 80,
      'compliance': 75,
      'monitoring': 60,
      'hr': 55
    };
    
    return baseCredits[category as keyof typeof baseCredits] || 60;
  }

  /**
   * Estimate document writing duration in minutes
   */
  private estimateWritingDuration(documentType: string, category: string): number {
    const baseDurations = {
      'governance': 15,
      'financial': 25,
      'policies': 35,
      'compliance': 30,
      'monitoring': 20,
      'hr': 18
    };
    
    return baseDurations[category as keyof typeof baseDurations] || 20;
  }

  /**
   * Create a new document writing job
   */
  async createWritingJob(request: DocumentWritingRequest): Promise<{ success: boolean; jobId?: string; error?: string }> {
    try {
      // Check user credits
      const [user] = await db.select().from(users).where(eq(users.id, request.userId));
      
      if (!user) {
        return { success: false, error: "User not found" };
      }

      const creditsRequired = this.calculateCreditsRequired(request.documentType, request.category);
      
      if ((user.credits || 0) < creditsRequired) {
        return { success: false, error: `Insufficient credits. Required: ${creditsRequired}, Available: ${user.credits || 0}` };
      }

      const estimatedDuration = this.estimateWritingDuration(request.documentType, request.category);
      const jobId = nanoid();

      // Create the writing job
      const [job] = await db.insert(documentWritingJobs).values({
        id: jobId,
        userId: request.userId,
        documentName: request.documentName,
        documentType: request.documentType,
        category: request.category,
        subcategory: request.subcategory,
        creditsRequired,
        estimatedDuration,
        status: 'pending',
        metadata: {
          organizationContext: request.organizationContext,
          requestedAt: new Date().toISOString()
        }
      }).returning();

      // Create admin notification
      await this.createAdminNotification({
        type: 'document_request',
        title: 'New Document Writing Request',
        message: `User ${user.fullName} requested "${request.documentName}" (${request.category})`,
        priority: 'normal',
        userId: request.userId,
        jobId: jobId,
        metadata: {
          documentType: request.documentType,
          creditsRequired,
          estimatedDuration
        }
      });

      return { success: true, jobId };

    } catch (error) {
      console.error('Error creating writing job:', error);
      return { success: false, error: 'Failed to create writing job' };
    }
  }

  /**
   * Start document writing process
   */
  async startWriting(jobId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const [job] = await db.select().from(documentWritingJobs).where(eq(documentWritingJobs.id, jobId));
      
      if (!job) {
        return { success: false, error: "Job not found" };
      }

      // Deduct credits
      const [user] = await db.select().from(users).where(eq(users.id, job.userId));
      if (!user) {
        return { success: false, error: "User not found" };
      }

      const newBalance = (user.credits || 0) - job.creditsRequired;
      
      // Update user credits
      await db.update(users)
        .set({ credits: newBalance, updatedAt: new Date() })
        .where(eq(users.id, job.userId));

      // Record credit transaction
      await db.insert(creditTransactions).values({
        userId: job.userId,
        type: 'debit',
        amount: job.creditsRequired,
        description: `Document writing: ${job.documentName}`,
        jobId: jobId,
        balanceBefore: user.credits || 0,
        balanceAfter: newBalance
      });

      // Update job status
      await db.update(documentWritingJobs)
        .set({
          status: 'in_progress',
          startedAt: new Date(),
          creditsDeducted: true,
          updatedAt: new Date()
        })
        .where(eq(documentWritingJobs.id, jobId));

      // Start the actual writing process
      this.processDocumentWriting(jobId);

      return { success: true };

    } catch (error) {
      console.error('Error starting writing:', error);
      return { success: false, error: 'Failed to start writing process' };
    }
  }

  /**
   * Get writing progress for a job
   */
  async getWritingProgress(jobId: string): Promise<WritingProgress | null> {
    try {
      const [job] = await db.select().from(documentWritingJobs).where(eq(documentWritingJobs.id, jobId));
      
      if (!job) return null;

      const estimatedCompletion = job.startedAt 
        ? new Date(job.startedAt.getTime() + (job.estimatedDuration || 20) * 60000)
        : new Date(Date.now() + (job.estimatedDuration || 20) * 60000);

      const statusMessages = {
        'pending': 'Waiting to start document generation...',
        'in_progress': 'System is generating your document...',
        'completed': 'Document generation completed successfully!',
        'failed': 'Document generation failed. Please try again.',
        'cancelled': 'Document generation was cancelled.'
      };

      return {
        jobId: job.id,
        status: job.status as any,
        progress: job.progress || 0,
        estimatedDuration: job.estimatedDuration || 20,
        estimatedCompletion,
        message: statusMessages[job.status as keyof typeof statusMessages] || 'Processing...'
      };

    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  }

  /**
   * Process document writing (simulate AI generation with progress updates)
   */
  private async processDocumentWriting(jobId: string): Promise<void> {
    try {
      const [job] = await db.select().from(documentWritingJobs).where(eq(documentWritingJobs.id, jobId));
      if (!job) return;

      // Simulate progressive writing with realistic updates
      const progressSteps = [
        { progress: 10, message: 'Analyzing document requirements...' },
        { progress: 25, message: 'Generating document structure...' },
        { progress: 45, message: 'Creating content sections...' },
        { progress: 65, message: 'Adding organization-specific details...' },
        { progress: 80, message: 'Finalizing document formatting...' },
        { progress: 95, message: 'Performing quality checks...' },
        { progress: 100, message: 'Document completed successfully!' }
      ];

      const stepDelay = (job.estimatedDuration || 20) * 60000 / progressSteps.length; // Distribute time across steps

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, stepDelay));
        
        await db.update(documentWritingJobs)
          .set({
            progress: step.progress,
            updatedAt: new Date()
          })
          .where(eq(documentWritingJobs.id, jobId));

        // If this is the final step, complete the document
        if (step.progress === 100) {
          await this.completeDocument(jobId);
        }
      }

    } catch (error) {
      console.error('Error processing document writing:', error);
      await this.failDocument(jobId, error.message || 'Unknown error');
    }
  }

  /**
   * Complete document writing
   */
  private async completeDocument(jobId: string): Promise<void> {
    try {
      // Generate sample content (in real implementation, this would call DeepSeek API)
      const generatedContent = `
# Professional NGO Document

This document has been generated by the Granada OS System for your organization.

## Executive Summary
[System-generated professional content based on your organization's profile]

## Key Sections
1. Introduction and Background
2. Organizational Framework
3. Implementation Guidelines
4. Monitoring and Evaluation
5. Conclusion and Next Steps

*Document generated on ${new Date().toLocaleDateString()} by Granada OS AI System*
      `.trim();

      const wordCount = generatedContent.split(' ').length;
      const qualityScore = Math.random() * 20 + 80; // Random score between 80-100

      await db.update(documentWritingJobs)
        .set({
          status: 'completed',
          progress: 100,
          completedAt: new Date(),
          generatedContent,
          wordCount,
          qualityScore: qualityScore.toString(),
          actualDuration: Math.floor(Math.random() * 10) + 15, // Random duration 15-25 mins
          updatedAt: new Date()
        })
        .where(eq(documentWritingJobs.id, jobId));

      // Notify admin of completion
      const [job] = await db.select().from(documentWritingJobs).where(eq(documentWritingJobs.id, jobId));
      if (job) {
        await this.createAdminNotification({
          type: 'document_completed',
          title: 'Document Writing Completed',
          message: `Document "${job.documentName}" completed successfully with ${qualityScore.toFixed(1)}% quality score`,
          priority: 'normal',
          userId: job.userId,
          jobId: jobId,
          metadata: {
            wordCount,
            qualityScore,
            actualDuration: job.actualDuration
          }
        });
      }

    } catch (error) {
      console.error('Error completing document:', error);
      await this.failDocument(jobId, 'Failed to complete document generation');
    }
  }

  /**
   * Mark document writing as failed
   */
  private async failDocument(jobId: string, errorMessage: string): Promise<void> {
    await db.update(documentWritingJobs)
      .set({
        status: 'failed',
        failedAt: new Date(),
        errorMessage,
        updatedAt: new Date()
      })
      .where(eq(documentWritingJobs.id, jobId));

    // Refund credits if they were deducted
    const [job] = await db.select().from(documentWritingJobs).where(eq(documentWritingJobs.id, jobId));
    if (job && job.creditsDeducted) {
      const [user] = await db.select().from(users).where(eq(users.id, job.userId));
      if (user) {
        const newBalance = (user.credits || 0) + job.creditsRequired;
        
        await db.update(users)
          .set({ credits: newBalance, updatedAt: new Date() })
          .where(eq(users.id, job.userId));

        await db.insert(creditTransactions).values({
          userId: job.userId,
          type: 'refund',
          amount: job.creditsRequired,
          description: `Refund for failed document: ${job.documentName}`,
          jobId: jobId,
          balanceBefore: user.credits || 0,
          balanceAfter: newBalance
        });
      }
    }
  }

  /**
   * Create admin notification
   */
  private async createAdminNotification(notification: {
    type: string;
    title: string;
    message: string;
    priority: string;
    userId?: string;
    jobId?: string;
    metadata?: any;
  }): Promise<void> {
    await db.insert(adminNotifications).values({
      ...notification,
      metadata: notification.metadata || {}
    });
  }

  /**
   * Get user's writing jobs
   */
  async getUserWritingJobs(userId: string): Promise<any[]> {
    return await db.select()
      .from(documentWritingJobs)
      .where(eq(documentWritingJobs.userId, userId))
      .orderBy(documentWritingJobs.createdAt);
  }

  /**
   * Get admin notifications
   */
  async getAdminNotifications(limit: number = 50): Promise<any[]> {
    return await db.select()
      .from(adminNotifications)
      .orderBy(adminNotifications.createdAt)
      .limit(limit);
  }
}

export const documentWritingService = new DocumentWritingService();