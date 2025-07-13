/**
 * Stripe Payment Flow with Database Integration
 * Handles Stripe credit card payments with proper database updates
 */

import { Router } from 'express';

const router = Router();

// Stripe success handler with database integration
router.post('/success', async (req, res) => {
  try {
    const {
      paymentIntentId,
      packageId,
      amount,
      currency,
      userId,
      customerName,
      customerEmail,
      cardType,
      cardLast4
    } = req.body;

    console.log('Processing Stripe success:', { paymentIntentId, packageId, amount });

    // Call payment flow success endpoint
    const successResponse = await fetch('http://localhost:5000/api/payment-flow/success', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transactionId: paymentIntentId,
        orderTrackingId: paymentIntentId,
        packageId: packageId || 'basic',
        amount: amount || '10',
        currency: currency || 'USD',
        paymentMethod: 'card',
        processorType: 'stripe',
        userId: userId || 'demo_user',
        customerName: customerName || 'Customer',
        customerEmail: customerEmail || 'customer@example.com',
        cardType: cardType || 'visa',
        cardLast4: cardLast4 || '****'
      })
    });

    const successResult = await successResponse.json();
    console.log('Stripe payment success processed:', successResult);

    res.json({
      success: true,
      message: 'Stripe payment completed successfully',
      transactionId: paymentIntentId,
      creditsAdded: successResult.creditsAdded,
      receiptData: successResult.receiptData
    });

  } catch (error) {
    console.error('Stripe success processing failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process Stripe success',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Stripe failure handler
router.post('/failure', async (req, res) => {
  try {
    const {
      paymentIntentId,
      packageId,
      amount,
      currency,
      userId,
      customerName,
      customerEmail,
      errorMessage,
      cardType,
      cardLast4
    } = req.body;

    console.log('Processing Stripe failure:', { paymentIntentId, errorMessage });

    // Record failure in database
    const failureResponse = await fetch('http://localhost:5000/api/payment-flow/failure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transactionId: paymentIntentId || 'STRIPE_FAIL_' + Date.now(),
        orderTrackingId: paymentIntentId,
        packageId: packageId || 'basic',
        amount: amount || '0',
        currency: currency || 'USD',
        paymentMethod: 'card',
        processorType: 'stripe',
        userId: userId || 'demo_user',
        errorMessage: errorMessage || 'Stripe payment failed',
        customerName: customerName,
        customerEmail: customerEmail,
        cardType: cardType,
        cardLast4: cardLast4
      })
    });

    const failureResult = await failureResponse.json();
    console.log('Stripe failure recorded:', failureResult);

    res.json({
      success: true,
      message: 'Stripe failure recorded',
      transactionId: paymentIntentId,
      retryCount: failureResult.retryCount
    });

  } catch (error) {
    console.error('Stripe failure processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process Stripe failure'
    });
  }
});

export default router;