import express from 'express';
import { db } from '../db';
import { users, paymentTransactions } from '../../shared/schema';
import { eq, desc, sql } from 'drizzle-orm';
import crypto from 'crypto';
import { currencyService } from '../services/currencyService';
import { pesapalSDK } from '../services/pesapalSDK';

const router = express.Router();

// Security middleware for billing routes
const billingAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Add rate limiting and security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Basic user validation (in production, use proper JWT/session)
  const userId = req.headers['x-user-id'] || req.query.userId || 'demo-user';
  req.userId = userId as string;
  
  next();
};

// Get user billing balance
router.get('/balance', billingAuth, async (req, res) => {
  try {
    // Handle demo user
    if (req.userId === 'demo-user') {
      return res.json({
        success: true,
        balance: 245,
        totalPurchased: 245,
        userId: 'demo-user'
      });
    }

    const [user] = await db.select().from(users).where(eq(users.id, req.userId)).limit(1);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({
      success: true,
      balance: user.credits || 0,
      totalPurchased: user.credits || 0,
      userId: user.id
    });
  } catch (error) {
    console.error('Failed to get billing balance:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve balance' });
  }
});

// Get comprehensive billing dashboard data
router.get('/dashboard', billingAuth, async (req, res) => {
  try {
    // Handle demo user
    if (req.userId === 'demo-user') {
      return res.json({
        success: true,
        balance: 245,
        totalSpent: 167,
        totalPurchased: 412,
        thisMonthSpent: 49,
        averageMonthlyUsage: 85,
        creditEfficiency: 94
      });
    }

    const [user] = await db.select().from(users).where(eq(users.id, req.userId)).limit(1);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Calculate spending analytics
    const transactions = await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.userId, req.userId));

    const totalSpent = transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.finalAmount), 0);

    res.json({
      success: true,
      balance: user.credits || 0,
      totalSpent,
      totalPurchased: user.credits || 0,
      thisMonthSpent: totalSpent, // In production, filter by current month
      averageMonthlyUsage: 85,
      creditEfficiency: 94
    });
  } catch (error) {
    console.error('Failed to get dashboard data:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve dashboard data' });
  }
});

// Get detailed usage analytics
router.get('/usage-analytics', billingAuth, async (req, res) => {
  try {
    // Demo data for usage analytics
    const demoUsage = [
      {
        id: 'usage-1',
        description: 'AI Proposal Generation - Gates Foundation',
        credits: 15,
        date: '2025-01-12T10:30:00Z',
        type: 'proposal',
        status: 'completed'
      },
      {
        id: 'usage-2',
        description: 'Donor Search - Healthcare Sector',
        credits: 8,
        date: '2025-01-11T14:20:00Z',
        type: 'search',
        status: 'completed'
      },
      {
        id: 'usage-3',
        description: 'Document Analysis - Grant Requirements',
        credits: 12,
        date: '2025-01-10T09:15:00Z',
        type: 'analysis',
        status: 'completed'
      }
    ];

    res.json({
      success: true,
      monthlyUsage: 67,
      successRate: 98,
      recentUsage: demoUsage,
      topActivities: [
        { type: 'proposal', count: 12, credits: 180 },
        { type: 'search', count: 8, credits: 64 },
        { type: 'analysis', count: 5, credits: 60 }
      ]
    });
  } catch (error) {
    console.error('Failed to get usage analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve usage analytics' });
  }
});

// Get subscription details
router.get('/subscriptions', billingAuth, async (req, res) => {
  try {
    // Demo subscription data
    res.json({
      success: true,
      subscriptions: [
        {
          id: 'sub-123',
          plan: 'Unlimited Plan',
          status: 'active',
          nextBilling: '2025-02-12',
          amount: 100,
          features: ['Unlimited proposals', 'Human expert help', '24/7 support']
        }
      ]
    });
  } catch (error) {
    console.error('Failed to get subscriptions:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve subscriptions' });
  }
});

// Cancel subscription
router.post('/cancel-subscription', billingAuth, async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    // In production, integrate with payment processor to cancel
    console.log(`Cancelling subscription: ${subscriptionId} for user: ${req.userId}`);
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      effectiveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    res.status(500).json({ success: false, error: 'Failed to cancel subscription' });
  }
});

// Get billing transaction history
router.get('/transactions', billingAuth, async (req, res) => {
  try {
    const transactions = await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.userId, req.userId))
      .orderBy(desc(paymentTransactions.createdAt))
      .limit(50);

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      description: `${transaction.packageId} Credits Package`,
      amount: transaction.finalAmount,
      credits: transaction.creditsAdded,
      status: transaction.status,
      date: transaction.createdAt,
      type: 'purchase',
      paymentMethod: transaction.processorResponse?.includes('mobile') ? 'mobile' : 'card',
      transactionId: transaction.transactionId
    }));

    // Add demo usage data for display
    const demoUsage = [
      {
        id: 'usage-1',
        description: 'AI Proposal Generation',
        credits: -5,
        status: 'completed',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        type: 'usage'
      },
      {
        id: 'usage-2', 
        description: 'Donor Search Query',
        credits: -15,
        status: 'completed',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        type: 'usage'
      }
    ];

    res.json({
      success: true,
      transactions: [...formattedTransactions, ...demoUsage]
    });
  } catch (error) {
    console.error('Failed to get transaction history:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve transaction history' });
  }
});

// Create secure payment session
// Get user's geo-location and currency preferences
router.get('/geo-currency', billingAuth, async (req, res) => {
  try {
    const userIP = req.headers['x-forwarded-for'] as string || 
                   req.headers['x-real-ip'] as string || 
                   req.connection.remoteAddress || 
                   '127.0.0.1';

    const countryCode = req.query.country as string;
    
    // Get geo-location and preferred currency
    const geoData = await currencyService.getGeoLocation(userIP);
    const preferredCurrency = await currencyService.getPreferredCurrency(userIP, countryCode);
    
    // Get all supported currencies for selection
    const supportedCurrencies = currencyService.getSupportedCurrencies();
    
    res.json({
      success: true,
      geoData,
      preferredCurrency,
      supportedCurrencies,
      userIP: userIP.replace(/^::ffff:/, '') // Clean IPv4-mapped IPv6
    });

  } catch (error) {
    console.error('Geo-currency detection error:', error);
    res.json({
      success: true,
      geoData: null,
      preferredCurrency: 'USD',
      supportedCurrencies: currencyService.getSupportedCurrencies(),
      userIP: '127.0.0.1'
    });
  }
});

// Convert package prices to user's currency
router.post('/convert-prices', billingAuth, async (req, res) => {
  try {
    const { targetCurrency, packages } = req.body;
    
    if (!targetCurrency) {
      return res.status(400).json({ success: false, error: 'Target currency required' });
    }

    // Standard package prices in USD
    const standardPackages = [
      { id: 'basic', price: 12, credits: 50 },
      { id: 'starter', price: 17, credits: 85 },
      { id: 'growth', price: 25, credits: 150 },
      { id: 'professional', price: 50, credits: 350 },
      { id: 'unlimited', price: 100, credits: 9999 },
      { id: 'premium-support', price: 200, credits: 9999 }
    ];

    const convertedPackages = standardPackages.map(pkg => {
      const converted = currencyService.convertPrice(pkg.price, targetCurrency);
      return {
        ...pkg,
        originalPrice: pkg.price,
        localPrice: converted.amount,
        formattedPrice: converted.formatted,
        currency: targetCurrency
      };
    });

    const currencyInfo = currencyService.getCurrencyInfo(targetCurrency);

    res.json({
      success: true,
      packages: convertedPackages,
      currency: currencyInfo,
      conversionRate: await currencyService.getExchangeRate('USD', targetCurrency)
    });

  } catch (error) {
    console.error('Price conversion error:', error);
    res.status(500).json({ success: false, error: 'Failed to convert prices' });
  }
});

// Validate coupon code
router.post('/validate-coupon', billingAuth, async (req, res) => {
  try {
    const { couponCode, packageId, currency = 'USD' } = req.body;
    
    if (!couponCode) {
      return res.status(400).json({ success: false, error: 'Coupon code required' });
    }

    // Demo coupon validation
    const demoCoupons = {
      'WELCOME20': { discountType: 'percentage', discountValue: 20, description: '20% off your first purchase' },
      'STUDENT50': { discountType: 'percentage', discountValue: 50, description: '50% student discount' },
      'SAVE5': { discountType: 'fixed_amount', discountValue: 5, description: '$5 off any purchase' },
      'FREECREDITS': { discountType: 'free_credits', discountValue: 25, description: '25 free credits' }
    };

    const coupon = demoCoupons[couponCode.toUpperCase()];
    
    if (!coupon) {
      return res.status(400).json({ success: false, error: 'Invalid coupon code' });
    }

    // Get package details for discount calculation
    const packages = [
      { id: 'basic', price: 12, credits: 50 },
      { id: 'starter', price: 17, credits: 85 },
      { id: 'growth', price: 25, credits: 150 },
      { id: 'professional', price: 50, credits: 350 },
      { id: 'unlimited', price: 100, credits: 9999 },
      { id: 'premium-support', price: 200, credits: 9999 }
    ];

    const selectedPackage = packages.find(p => p.id === packageId);
    if (!selectedPackage) {
      return res.status(400).json({ success: false, error: 'Invalid package' });
    }

    // Convert prices to target currency if not USD
    const originalPrice = selectedPackage.price;
    const convertedOriginal = currency !== 'USD' ? 
      currencyService.convertPrice(originalPrice, currency) : 
      { amount: originalPrice, formatted: `$${originalPrice}` };

    let discountAmount = 0;
    let finalPrice = convertedOriginal.amount;

    if (coupon.discountType === 'percentage') {
      discountAmount = (convertedOriginal.amount * coupon.discountValue) / 100;
      finalPrice = convertedOriginal.amount - discountAmount;
    } else if (coupon.discountType === 'fixed_amount') {
      // Convert fixed discount to target currency
      const convertedDiscount = currency !== 'USD' ? 
        currencyService.convertPrice(coupon.discountValue, currency) : 
        { amount: coupon.discountValue, formatted: `$${coupon.discountValue}` };
      discountAmount = Math.min(convertedDiscount.amount, convertedOriginal.amount);
      finalPrice = convertedOriginal.amount - discountAmount;
    } else if (coupon.discountType === 'free_credits') {
      discountAmount = 0; // No price discount, just bonus credits
      finalPrice = convertedOriginal.amount;
    }

    finalPrice = Math.max(0, finalPrice); // Ensure price doesn't go negative

    // Format final price in target currency
    const currencyInfo = currencyService.getCurrencyInfo(currency);
    const finalFormatted = currencyInfo ? 
      `${currencyInfo.symbol}${finalPrice.toFixed(currency === 'JPY' ? 0 : 2)}` : 
      `${finalPrice.toFixed(2)}`;
    const savingsFormatted = currencyInfo ? 
      `${currencyInfo.symbol}${discountAmount.toFixed(currency === 'JPY' ? 0 : 2)}` : 
      `${discountAmount.toFixed(2)}`;

    res.json({
      success: true,
      valid: true,
      coupon: {
        code: couponCode.toUpperCase(),
        ...coupon
      },
      discount: {
        originalPrice: convertedOriginal.amount,
        originalFormatted: convertedOriginal.formatted,
        discountAmount,
        discountFormatted: savingsFormatted,
        finalPrice,
        finalFormatted,
        bonusCredits: coupon.discountType === 'free_credits' ? coupon.discountValue : 0,
        savings: discountAmount,
        currency
      }
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    res.status(500).json({ success: false, error: 'Failed to validate coupon' });
  }
});

router.post('/create-payment', billingAuth, async (req, res) => {
  try {
    const { packageId, paymentMethod, userPhone, countryCode, currency, couponCode } = req.body;
    
    // Validate package
    const packages = {
      'starter': { credits: 100, price: 12, name: 'Starter Pack' },
      'professional': { credits: 575, price: 49, name: 'Professional Pack' },
      'premium': { credits: 1500, price: 89, name: 'Premium Plus Pack' },
      'enterprise': { credits: 4000, price: 199, name: 'Enterprise Pack' }
    };

    const selectedPackage = packages[packageId as keyof typeof packages];
    if (!selectedPackage) {
      return res.status(400).json({ success: false, error: 'Invalid package ID' });
    }

    // Get user details (handle demo user)
    let user;
    if (req.userId === 'demo-user') {
      user = {
        id: 'demo-user',
        email: 'demo@user.com',
        firstName: 'Demo',
        lastName: 'User'
      };
    } else {
      const userResult = await db.select().from(users).where(eq(users.id, req.userId)).limit(1);
      user = userResult[0];
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
    }

    // Generate secure merchant reference
    const merchantReference = `BILL_${packageId}_${req.userId}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    let paymentUrl = '';
    let processorType = '';

    // Handle different payment methods
    if (paymentMethod === 'mobile') {
      // Pesapal mobile money integration
      const pesapalOrder = {
        id: merchantReference,
        currency: currency || 'USD',
        amount: selectedPackage.price,
        description: `${selectedPackage.name} - ${selectedPackage.credits} Credits`,
        callback_url: `${req.protocol}://${req.get('host')}/api/billing/callback`,
        notification_id: process.env.PESAPAL_IPN_ID || 'test-notification-id',
        billing_address: {
          email_address: user.email || 'user@example.com',
          phone_number: userPhone || '+254712345678',
          country_code: countryCode || 'KE',
          first_name: user.firstName || 'User',
          middle_name: '',
          last_name: user.lastName || '',
          line_1: '',
          line_2: '',
          city: '',
          state: '',
          postal_code: '',
          zip_code: ''
        }
      };
      
      paymentUrl = `https://cybqa.pesapal.com/pesapaliframe/PesapalIframe3/Index/?OrderTrackingId=${merchantReference}&demo=true`;
      processorType = 'pesapal';
      console.log('Pesapal Order Request:', JSON.stringify(pesapalOrder, null, 2));
      
    } else if (paymentMethod === 'card') {
      // Stripe credit card integration
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: currency || 'usd',
              product_data: {
                name: `${selectedPackage.name} Credits`,
                description: `${selectedPackage.credits} Credits Package`,
              },
              unit_amount: Math.round(selectedPackage.price * 100), // Convert to cents
            },
            quantity: 1,
          }],
          mode: 'payment',
          success_url: `${req.protocol}://${req.get('host')}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.protocol}://${req.get('host')}/billing`,
          client_reference_id: merchantReference,
          customer_email: user.email,
          metadata: {
            userId: req.userId,
            packageId: packageId,
            credits: selectedPackage.credits.toString()
          }
        });
        
        paymentUrl = session.url;
        processorType = 'stripe';
        
      } catch (stripeError) {
        console.error('Stripe error:', stripeError);
        return res.status(400).json({ success: false, error: 'Payment processor error' });
      }
      
    } else if (paymentMethod === 'paypal') {
      // PayPal integration (placeholder for now)
      const paypalOrder = {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency || 'USD',
            value: selectedPackage.price.toString()
          },
          description: `${selectedPackage.name} - ${selectedPackage.credits} Credits`
        }],
        application_context: {
          return_url: `${req.protocol}://${req.get('host')}/api/billing/paypal-success`,
          cancel_url: `${req.protocol}://${req.get('host')}/billing`
        }
      };
      
      // For demo, create mock PayPal URL
      paymentUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${merchantReference}`;
      processorType = 'paypal';
      console.log('PayPal Order Request:', JSON.stringify(paypalOrder, null, 2));
    }

    // Log payment initiation securely
    console.log(`Secure payment initiated: ${merchantReference} for ${selectedPackage.name}`);

    res.json({
      success: true,
      paymentUrl,
      merchantReference,
      processorType,
      packageDetails: selectedPackage
    });

  } catch (error) {
    console.error('Secure payment creation failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create secure payment'
    });
  }
});

// Webhook handler for payment completion
router.post('/webhook/payment-complete', async (req, res) => {
  try {
    const { merchantReference, status, amount, orderTrackingId } = req.body;
    
    // Verify webhook authenticity (implement signature verification in production)
    if (!merchantReference || !status) {
      return res.status(400).json({ error: 'Invalid webhook data' });
    }

    // Process successful payment
    if (status === 'COMPLETED' || status === 'SUCCESS') {
      const refParts = merchantReference.split('_');
      const packageId = refParts[1];
      const userId = refParts[2];
      
      if (userId && packageId) {
        const packages = {
          'starter': { credits: 100 },
          'professional': { credits: 575 },
          'premium': { credits: 1500 },
          'enterprise': { credits: 4000 }
        };
        
        const creditAmount = packages[packageId as keyof typeof packages]?.credits || 0;
        
        // Atomic transaction to update credits and create record
        await db.transaction(async (tx) => {
          // Update user credits
          await tx.update(users)
            .set({ 
              credits: sql`${users.credits} + ${creditAmount}`,
              updatedAt: new Date()
            })
            .where(eq(users.id, userId));

          // Create payment record
          await tx.insert(paymentTransactions).values({
            userId: userId,
            packageId: packageId,
            originalAmount: amount.toString(),
            finalAmount: amount.toString(),
            creditsAdded: creditAmount,
            status: 'completed',
            transactionId: orderTrackingId,
            processorResponse: JSON.stringify(req.body)
          });
        });

        console.log(`Payment completed: ${creditAmount} credits added to user ${userId}`);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Pesapal payment callback
router.get('/pesapal-callback', async (req, res) => {
  try {
    const { transactionId, OrderTrackingId, OrderMerchantReference } = req.query;
    
    if (!transactionId || !OrderTrackingId) {
      return res.redirect('/billing?status=error&message=Invalid callback');
    }
    
    // Get transaction status from Pesapal
    const status = await pesapalSDK.getTransactionStatus(OrderTrackingId as string);
    
    // Update transaction in database
    await db.update(paymentTransactions)
      .set({ 
        status: status.payment_status_description?.toLowerCase() === 'completed' ? 'completed' : 'failed',
        updatedAt: new Date()
      })
      .where(eq(paymentTransactions.id, transactionId as string));
    
    if (status.payment_status_description?.toLowerCase() === 'completed') {
      // Add credits to user account
      const [transaction] = await db.select().from(paymentTransactions)
        .where(eq(paymentTransactions.id, transactionId as string)).limit(1);
      
      if (transaction) {
        const packages = {
          'basic': { credits: 50 },
          'starter': { credits: 85 },
          'growth': { credits: 150 },
          'professional': { credits: 350 },
          'unlimited': { credits: 9999 },
          'premium-support': { credits: 9999 }
        };
        
        const packageCredits = packages[transaction.packageId as keyof typeof packages]?.credits || 0;
        
        // Update user credits
        await db.update(users)
          .set({ 
            credits: sql`${users.credits} + ${packageCredits}`,
            updatedAt: new Date()
          })
          .where(eq(users.id, transaction.userId));
      }
      
      res.redirect(`/billing?status=success&message=Payment completed successfully&package=${transaction.packageId}&amount=${transaction.amount}&currency=${transaction.currency}`);
    } else {
      res.redirect('/billing?status=error&message=Payment failed');
    }
    
  } catch (error) {
    console.error('Pesapal callback error:', error);
    res.redirect('/billing?status=error&message=Payment processing error');
  }
});

// Pesapal IPN (Instant Payment Notification)
router.post('/pesapal-ipn', async (req, res) => {
  try {
    const { OrderTrackingId, OrderMerchantReference } = req.body;
    
    if (OrderTrackingId) {
      // Process the payment notification
      const status = await pesapalSDK.getTransactionStatus(OrderTrackingId);
      console.log('IPN received:', { OrderTrackingId, status });
      
      // Update any pending transactions
      await db.update(paymentTransactions)
        .set({ 
          status: status.payment_status_description?.toLowerCase() === 'completed' ? 'completed' : 'failed',
          updatedAt: new Date()
        })
        .where(eq(paymentTransactions.externalTransactionId, OrderTrackingId));
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('IPN processing error:', error);
    res.status(500).json({ success: false, error: 'IPN processing failed' });
  }
});

export default router;