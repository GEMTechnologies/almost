/**
 * Payment Flow Database Integration
 * Handles success/failure transaction updates and credit allocation
 */

import { Router } from 'express';
import { db } from '../db';
import { users, paymentTransactions, userCredits } from '../../shared/schema';
import { eq, sql } from 'drizzle-orm';
import crypto from 'crypto';

const router = Router();

// Process successful payment and allocate credits - supports PesaPal, PayPal, Stripe
router.post('/success', async (req, res) => {
  try {
    const {
      transactionId,
      orderTrackingId,
      packageId,
      amount,
      currency,
      paymentMethod,
      processorType,
      userId,
      customerName,
      customerEmail,
      customerPhone,
      cardType,
      cardLast4,
      paypalEmail
    } = req.body;

    console.log('Processing successful payment:', {
      transactionId,
      orderTrackingId,
      packageId,
      amount,
      userId
    });

    // Package credit mapping
    const packageCredits = {
      'basic': 50,
      'starter': 50,
      'professional': 150,
      'enterprise': 400,
      'unlimited': 1000
    };

    const creditsToAdd = packageCredits[packageId as keyof typeof packageCredits] || 50;

    // Start transaction
    await db.transaction(async (tx) => {
      // 1. Create or update payment transaction record
      const paymentRecord = {
        id: crypto.randomUUID(),
        userId: userId || '00000000-0000-0000-0000-000000000001',
        packageId: packageId || 'basic',
        paymentMethod: paymentMethod || 'mobile',
        originalAmount: parseFloat(amount) || 0,
        finalAmount: parseFloat(amount) || 0,
        currency: currency || 'USD',
        creditsAdded: creditsToAdd,
        status: 'completed',
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        processorType: processorType || 'pesapal',
        mobileNumber: customerPhone,
        // metadata stored as JSON in processorResponse field
        processorResponse: JSON.stringify({
          customerName,
          customerEmail,
          orderTrackingId,
          cardType,
          cardLast4,
          paypalEmail,
          processorType: processorType || 'pesapal',
          completedAt: new Date().toISOString()
        })
      };

      await tx.insert(paymentTransactions).values(paymentRecord);

      // 2. Add credits to user account
      await tx.insert(userCredits).values({
        id: crypto.randomUUID(),
        userId: userId || '00000000-0000-0000-0000-000000000001',
        amount: creditsToAdd,
        source: 'payment',
        description: `${packageId} package purchase - ${creditsToAdd} credits`,
        transactionId: `USER_CREDIT_${Date.now()}`,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      }).onConflictDoNothing();

      // 3. Update user's total credits
      await tx.update(users)
        .set({
          credits: sql`${users.credits} + ${creditsToAdd}`,
          updatedAt: sql`CURRENT_TIMESTAMP`
        })
        .where(eq(users.id, userId || '00000000-0000-0000-0000-000000000001'));

      console.log('Payment success processing completed:', {
        transactionId,
        creditsAdded: creditsToAdd,
        userId: userId || '00000000-0000-0000-0000-000000000001'
      });
    });

    // Generate receipt data
    const receiptData = {
      transactionId: transactionId || orderTrackingId,
      packageName: `${packageId.charAt(0).toUpperCase() + packageId.slice(1)} Package`,
      amount: parseFloat(amount) || 0,
      currency: currency || 'USD',
      credits: creditsToAdd,
      paymentMethod: paymentMethod || 'Mobile Money (PesaPal)',
      customerName: customerName || 'Customer',
      customerEmail: customerEmail || 'customer@example.com',
      customerPhone: customerPhone || '',
      date: new Date().toISOString(),
      organizationName: 'Granada Global Tech Ltd',
      userType: 'NGO'
    };

    res.json({
      success: true,
      message: 'Payment processed successfully',
      creditsAdded: creditsToAdd,
      receiptData,
      transactionId: transactionId || orderTrackingId
    });

  } catch (error) {
    console.error('Payment success processing failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process successful payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Process failed payment - supports all payment processors
router.post('/failure', async (req, res) => {
  try {
    const {
      transactionId,
      orderTrackingId,
      packageId,
      amount,
      currency,
      paymentMethod,
      processorType,
      userId,
      errorMessage,
      customerName,
      customerEmail,
      customerPhone,
      cardType,
      cardLast4,
      paypalEmail
    } = req.body;

    console.log('Processing failed payment:', {
      transactionId,
      orderTrackingId,
      packageId,
      errorMessage,
      userId
    });

    // Create or update payment transaction record with failure status
    const paymentRecord = {
      id: crypto.randomUUID(),
      userId: userId || '00000000-0000-0000-0000-000000000001',
      packageId: packageId || 'basic',
      paymentMethod: paymentMethod || 'mobile',
      originalAmount: parseFloat(amount) || 0,
      finalAmount: parseFloat(amount) || 0,
      currency: currency || 'USD',
      creditsAdded: 0,
      status: 'failed',
      transactionId: `TXN_FAIL_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      processorType: processorType || 'pesapal',
      mobileNumber: customerPhone,
      failureReason: errorMessage,
      // metadata stored as JSON in processorResponse field
      processorResponse: JSON.stringify({
        customerName,
        customerEmail,
        orderTrackingId,
        errorMessage,
        cardType,
        cardLast4,
        paypalEmail,
        processorType: processorType || 'pesapal',
        failedAt: new Date().toISOString()
      })
    };

    await db.insert(paymentTransactions).values(paymentRecord);

    // Get retry count for this user/package combination
    const retryCount = await db.select({ count: sql<number>`count(*)` })
      .from(paymentTransactions)
      .where(sql`${paymentTransactions.userId} = ${userId || '00000000-0000-0000-0000-000000000001'} 
                 AND ${paymentTransactions.packageId} = ${packageId || 'basic'} 
                 AND ${paymentTransactions.status} = 'failed'`);

    console.log('Payment failure processing completed:', {
      transactionId,
      errorMessage,
      retryCount: retryCount[0]?.count || 0,
      userId: userId || '00000000-0000-0000-0000-000000000001'
    });

    res.json({
      success: true,
      message: 'Payment failure recorded',
      transactionId: transactionId || orderTrackingId,
      retryCount: retryCount[0]?.count || 0,
      errorMessage
    });

  } catch (error) {
    console.error('Payment failure processing failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process payment failure',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user payment history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const transactions = await db.select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.userId, userId))
      .orderBy(sql`${paymentTransactions.createdAt} DESC`)
      .limit(50);

    const userCreditsHistory = await db.select()
      .from(userCredits)
      .where(eq(userCredits.userId, userId))
      .orderBy(sql`${userCredits.createdAt} DESC`)
      .limit(50);

    res.json({
      success: true,
      transactions,
      creditsHistory: userCreditsHistory
    });

  } catch (error) {
    console.error('Failed to get payment history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve payment history'
    });
  }
});

// Get user current credits
router.get('/credits/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [user] = await db.select({ credits: users.credits })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      credits: user.credits || 0
    });

  } catch (error) {
    console.error('Failed to get user credits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user credits'
    });
  }
});

export default router;