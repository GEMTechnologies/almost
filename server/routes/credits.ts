/**
 * Granada OS - Credits & Billing Routes
 * Handle credit transactions, balances, and admin oversight
 */

import express from 'express';
import { Request, Response } from 'express';
import { db } from '../db';
import { creditTransactions, creditPackages, users } from '../../shared/schema';
import { eq, desc, and, gte, sql } from 'drizzle-orm';

const router = express.Router();

// Get user credit balance
router.get('/balance', async (req: Request, res: Response) => {
  try {
    // In real app, get user ID from authentication
    const userId = req.query.userId as string || 'demo-user-1';
    
    // Get current balance from transactions
    const transactions = await db
      .select({
        totalCredits: sql<number>`SUM(CASE WHEN ${creditTransactions.type} = 'purchase' OR ${creditTransactions.type} = 'bonus' THEN ${creditTransactions.amount} ELSE 0 END)`,
        usedCredits: sql<number>`SUM(CASE WHEN ${creditTransactions.type} = 'usage' THEN ABS(${creditTransactions.amount}) ELSE 0 END)`
      })
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId));

    const balance = (transactions[0]?.totalCredits || 0) - (transactions[0]?.usedCredits || 0);

    res.json({
      success: true,
      balance: Math.max(0, balance),
      totalPurchased: transactions[0]?.totalCredits || 0,
      totalUsed: transactions[0]?.usedCredits || 0
    });

  } catch (error) {
    console.error('Failed to get credit balance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve credit balance'
    });
  }
});

// Get transaction history
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || 'demo-user-1';
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const transactions = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.timestamp))
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      transactions: transactions.map(tx => ({
        ...tx,
        timestamp: new Date(tx.timestamp)
      }))
    });

  } catch (error) {
    console.error('Failed to get transaction history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve transaction history'
    });
  }
});

// Create new transaction (purchase, usage, bonus)
router.post('/transaction', async (req: Request, res: Response) => {
  try {
    const { userId, type, amount, description, packageId, metadata } = req.body;

    const [transaction] = await db
      .insert(creditTransactions)
      .values({
        userId: userId || 'demo-user-1',
        type,
        amount,
        description,
        packageId,
        metadata: metadata || {},
        timestamp: new Date(),
        status: 'completed'
      })
      .returning();

    // Notify admin of significant transactions
    if (type === 'purchase' && amount > 500) {
      await fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'large_credit_purchase',
          message: `Large credit purchase: ${amount} credits for $${metadata?.price || 'unknown'}`,
          userDetails: {
            userId,
            packageId,
            amount,
            price: metadata?.price
          },
          metadata: {
            component: 'CreditTransactions',
            action: 'large_purchase',
            transactionId: transaction.id
          }
        })
      }).catch(console.error);
    }

    res.json({
      success: true,
      transaction
    });

  } catch (error) {
    console.error('Failed to create transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create transaction'
    });
  }
});

// Admin: Get all credit transactions with user details
router.get('/admin/transactions', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const type = req.query.type as string;

    let query = db
      .select({
        transaction: creditTransactions,
        userEmail: users.email,
        userOrganization: users.firstName // Using firstName as organization name for demo
      })
      .from(creditTransactions)
      .leftJoin(users, eq(creditTransactions.userId, users.id))
      .orderBy(desc(creditTransactions.timestamp))
      .limit(limit)
      .offset(offset);

    if (type) {
      query = query.where(eq(creditTransactions.type, type));
    }

    const results = await query;

    // Get summary statistics
    const stats = await db
      .select({
        totalTransactions: sql<number>`COUNT(*)`,
        totalRevenue: sql<number>`SUM(CASE WHEN ${creditTransactions.type} = 'purchase' AND ${creditTransactions.metadata}->>'price' IS NOT NULL THEN CAST(${creditTransactions.metadata}->>'price' AS DECIMAL) ELSE 0 END)`,
        totalCreditsIssued: sql<number>`SUM(CASE WHEN ${creditTransactions.type} = 'purchase' OR ${creditTransactions.type} = 'bonus' THEN ${creditTransactions.amount} ELSE 0 END)`,
        totalCreditsUsed: sql<number>`SUM(CASE WHEN ${creditTransactions.type} = 'usage' THEN ABS(${creditTransactions.amount}) ELSE 0 END)`
      })
      .from(creditTransactions);

    res.json({
      success: true,
      transactions: results.map(r => ({
        ...r.transaction,
        userEmail: r.userEmail,
        userOrganization: r.userOrganization,
        timestamp: new Date(r.transaction.timestamp)
      })),
      stats: stats[0],
      pagination: {
        limit,
        offset,
        hasMore: results.length === limit
      }
    });

  } catch (error) {
    console.error('Failed to get admin transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve admin transaction data'
    });
  }
});

// Admin: Get credit analytics
router.get('/admin/analytics', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Revenue and usage analytics
    const analytics = await db
      .select({
        date: sql<string>`DATE(${creditTransactions.timestamp})`,
        revenue: sql<number>`SUM(CASE WHEN ${creditTransactions.type} = 'purchase' AND ${creditTransactions.metadata}->>'price' IS NOT NULL THEN CAST(${creditTransactions.metadata}->>'price' AS DECIMAL) ELSE 0 END)`,
        creditsIssued: sql<number>`SUM(CASE WHEN ${creditTransactions.type} = 'purchase' OR ${creditTransactions.type} = 'bonus' THEN ${creditTransactions.amount} ELSE 0 END)`,
        creditsUsed: sql<number>`SUM(CASE WHEN ${creditTransactions.type} = 'usage' THEN ABS(${creditTransactions.amount}) ELSE 0 END)`,
        transactionCount: sql<number>`COUNT(*)`
      })
      .from(creditTransactions)
      .where(gte(creditTransactions.timestamp, startDate))
      .groupBy(sql`DATE(${creditTransactions.timestamp})`)
      .orderBy(sql`DATE(${creditTransactions.timestamp})`);

    // Popular packages
    const popularPackages = await db
      .select({
        packageId: creditTransactions.packageId,
        purchaseCount: sql<number>`COUNT(*)`,
        totalRevenue: sql<number>`SUM(CASE WHEN ${creditTransactions.metadata}->>'price' IS NOT NULL THEN CAST(${creditTransactions.metadata}->>'price' AS DECIMAL) ELSE 0 END)`
      })
      .from(creditTransactions)
      .where(and(
        eq(creditTransactions.type, 'purchase'),
        gte(creditTransactions.timestamp, startDate)
      ))
      .groupBy(creditTransactions.packageId)
      .orderBy(desc(sql`COUNT(*)`));

    res.json({
      success: true,
      analytics: {
        dailyStats: analytics,
        popularPackages,
        period: `${days} days`
      }
    });

  } catch (error) {
    console.error('Failed to get credit analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve credit analytics'
    });
  }
});

// Initialize demo data
router.post('/admin/init-demo', async (req: Request, res: Response) => {
  try {
    // Create some demo transactions
    const demoTransactions = [
      {
        userId: 'demo-user-1',
        type: 'purchase' as const,
        amount: 575,
        description: 'Professional Credits Package',
        packageId: 'professional',
        metadata: { price: 49, bonus: 75 },
        timestamp: new Date('2024-06-25'),
        status: 'completed' as const
      },
      {
        userId: 'demo-user-1',
        type: 'usage' as const,
        amount: -5,
        description: 'AI Proposal Generation',
        packageId: null,
        metadata: { proposalId: 'prop-001' },
        timestamp: new Date('2024-06-24'),
        status: 'completed' as const
      },
      {
        userId: 'demo-user-1',
        type: 'usage' as const,
        amount: -15,
        description: 'Smart Donor Discovery',
        packageId: null,
        metadata: { searchId: 'search-001' },
        timestamp: new Date('2024-06-23'),
        status: 'completed' as const
      },
      {
        userId: 'demo-user-1',
        type: 'bonus' as const,
        amount: 50,
        description: 'Welcome Bonus Credits',
        packageId: null,
        metadata: { reason: 'welcome_bonus' },
        timestamp: new Date('2024-06-20'),
        status: 'completed' as const
      }
    ];

    await db.insert(creditTransactions).values(demoTransactions).onConflictDoNothing();

    res.json({
      success: true,
      message: 'Demo credit data initialized',
      transactionsCreated: demoTransactions.length
    });

  } catch (error) {
    console.error('Failed to initialize demo data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize demo data'
    });
  }
});

export default router;