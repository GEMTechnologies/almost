/**
 * Granada OS - Admin Notification Routes
 * Handle admin notifications with user details for backend pipeline modifications
 */

import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

interface AdminNotification {
  type: string;
  message: string;
  timestamp: string;
  timeElapsed?: number;
  userDetails?: {
    userId?: string;
    email?: string;
    organizationName?: string;
    websiteType?: string;
    features?: string[];
    ipAddress?: string;
    userAgent?: string;
  };
  metadata?: {
    component: string;
    action: string;
    sessionId?: string;
    requestId?: string;
  };
}

// Store notifications in memory (in production, use database)
const notifications: AdminNotification[] = [];

// Notify admin about pipeline issues or delays
router.post('/notify', async (req: Request, res: Response) => {
  try {
    const notification: AdminNotification = {
      ...req.body,
      timestamp: new Date().toISOString(),
      userDetails: {
        ...req.body.userDetails,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      }
    };

    // Add to notifications store
    notifications.push(notification);

    // Log for admin monitoring
    console.log('🚨 ADMIN NOTIFICATION:', {
      type: notification.type,
      message: notification.message,
      user: notification.userDetails?.organizationName || 'Unknown User',
      timeElapsed: notification.timeElapsed,
      component: notification.metadata?.component,
      timestamp: notification.timestamp
    });

    // In production, you could:
    // 1. Send email to admin
    // 2. Send Slack notification
    // 3. Store in database
    // 4. Send webhook to monitoring system
    
    await sendAdminAlert(notification);

    res.json({
      success: true,
      message: 'Admin notified successfully',
      notificationId: notifications.length - 1
    });

  } catch (error) {
    console.error('Failed to notify admin:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send admin notification'
    });
  }
});

// Get all notifications for admin dashboard
router.get('/notifications', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const paginatedNotifications = notifications
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(offset, offset + limit);

    res.json({
      success: true,
      notifications: paginatedNotifications,
      total: notifications.length,
      hasMore: offset + limit < notifications.length
    });

  } catch (error) {
    console.error('Failed to get notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve notifications'
    });
  }
});

// Get system health metrics
router.get('/system-health', (req: Request, res: Response) => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const recentNotifications = notifications.filter(n => 
      new Date(n.timestamp) > oneHourAgo
    );

    const delayedGenerations = recentNotifications.filter(n => 
      n.type === 'website_generation_delay'
    ).length;

    const activeUsers = new Set(
      recentNotifications.map(n => n.userDetails?.email || n.userDetails?.organizationName)
    ).size;

    res.json({
      success: true,
      metrics: {
        totalNotifications: notifications.length,
        recentNotifications: recentNotifications.length,
        delayedGenerations,
        activeUsers,
        systemStatus: delayedGenerations > 5 ? 'warning' : 'healthy',
        lastUpdated: now.toISOString()
      }
    });

  } catch (error) {
    console.error('Failed to get system health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve system health'
    });
  }
});

async function sendAdminAlert(notification: AdminNotification) {
  try {
    // Simulate admin alert system
    const alertMessage = formatAdminAlert(notification);
    
    // In production, integrate with:
    // - Email service (SendGrid, etc.)
    // - Slack webhook
    // - Discord webhook
    // - SMS service
    // - Push notifications
    
    console.log('📧 ADMIN ALERT SENT:', alertMessage);
    
    // Example webhook call (uncomment for production)
    /*
    if (process.env.ADMIN_WEBHOOK_URL) {
      await fetch(process.env.ADMIN_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: alertMessage,
          timestamp: notification.timestamp,
          priority: notification.type.includes('delay') ? 'high' : 'medium'
        })
      });
    }
    */

  } catch (error) {
    console.error('Failed to send admin alert:', error);
  }
}

function formatAdminAlert(notification: AdminNotification): string {
  const { type, message, userDetails, timeElapsed, metadata } = notification;
  
  let alert = `🚨 GRANADA OS - PIPELINE MODIFICATION REQUIRED\n\n`;
  alert += `Alert Type: ${type.replace(/_/g, ' ').toUpperCase()}\n`;
  alert += `Issue: ${message}\n\n`;
  
  if (userDetails) {
    alert += `👤 USER DETAILS FOR PIPELINE MODIFICATION:\n`;
    alert += `• Organization: ${userDetails.organizationName || 'Unknown'}\n`;
    alert += `• Email: ${userDetails.email || 'Not provided'}\n`;
    alert += `• Website Type: ${userDetails.websiteType || 'unknown'}\n`;
    if (userDetails.features && userDetails.features.length > 0) {
      alert += `• Required Features: ${userDetails.features.join(', ')}\n`;
    }
    alert += `• Session ID: ${userDetails.sessionId || 'N/A'}\n`;
    alert += `• User IP: ${userDetails.ipAddress || 'Unknown'}\n`;
    alert += `• Browser: ${userDetails.userAgent ? userDetails.userAgent.substring(0, 50) + '...' : 'Unknown'}\n`;
    alert += `\n`;
  }
  
  if (timeElapsed) {
    alert += `⏱️ PERFORMANCE METRICS:\n`;
    alert += `• Processing Time: ${Math.floor(timeElapsed / 60)}m ${timeElapsed % 60}s\n`;
    alert += `• Expected Time: 60-120s\n`;
    alert += `• Delay Factor: ${Math.round((timeElapsed / 90) * 100)}% over expected\n`;
    alert += `• Urgency Level: ${timeElapsed > 300 ? '🔴 CRITICAL' : timeElapsed > 180 ? '🟡 HIGH' : '🟠 MEDIUM'}\n\n`;
  }
  
  if (metadata) {
    alert += `🔧 BACKEND PIPELINE INFO:\n`;
    alert += `• Component: ${metadata.component}\n`;
    alert += `• Failed Action: ${metadata.action}\n`;
    alert += `• Session ID: ${metadata.sessionId || 'N/A'}\n`;
    alert += `• Request ID: ${metadata.requestId || 'N/A'}\n`;
    alert += `\n`;
  }
  
  alert += `🕐 Timestamp: ${new Date(notification.timestamp).toLocaleString()}\n\n`;
  
  alert += `💡 IMMEDIATE ACTIONS REQUIRED:\n`;
  alert += `1. Review DeepSeek API performance for ${userDetails?.websiteType || 'this'} website type\n`;
  alert += `2. Check if specific features (${userDetails?.features?.slice(0, 3).join(', ') || 'selected features'}) are causing delays\n`;
  alert += `3. Consider optimizing pipeline for ${userDetails?.organizationName || 'this organization'}\n`;
  alert += `4. Monitor session ${userDetails?.sessionId || metadata?.sessionId} for completion\n`;
  alert += `5. If delay exceeds 8 minutes, implement manual intervention\n\n`;
  
  alert += `📊 OPTIMIZATION SUGGESTIONS:\n`;
  alert += `• Cache common templates for ${userDetails?.websiteType || 'this'} website type\n`;
  alert += `• Pre-generate content for ${userDetails?.organizationName?.split(' ')[0] || 'similar'} organizations\n`;
  alert += `• Split complex feature generation into smaller chunks\n`;
  alert += `• Consider fallback generation if AI service is slow\n`;
  
  return alert;
}

export default router;