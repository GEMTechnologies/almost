/**
 * PayPal Payment Flow with Database Integration
 * Handles PayPal success/failure with proper database updates
 */

import { Router } from 'express';
import { capturePaypalOrder } from '../paypal';

const router = Router();

// PayPal success handler with database integration
router.post('/success/:orderID', async (req, res) => {
  try {
    const { orderID } = req.params;
    const { packageId, userId, customerEmail } = req.body;

    console.log('Processing PayPal success:', { orderID, packageId, userId });

    // Capture the PayPal order
    const captureResult = await capturePaypalOrder(req, res);
    
    if (captureResult && captureResult.status === 'COMPLETED') {
      // Call payment flow success endpoint
      const successResponse = await fetch('http://localhost:5000/api/payment-flow/success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transactionId: orderID,
          orderTrackingId: orderID,
          packageId: packageId || 'basic',
          amount: captureResult.purchase_units[0]?.amount?.value || '10',
          currency: captureResult.purchase_units[0]?.amount?.currency_code || 'USD',
          paymentMethod: 'paypal',
          processorType: 'paypal',
          userId: userId || 'demo_user',
          customerName: captureResult.payer?.name?.given_name + ' ' + captureResult.payer?.name?.surname,
          customerEmail: captureResult.payer?.email_address || customerEmail,
          paypalEmail: captureResult.payer?.email_address
        })
      });

      const successResult = await successResponse.json();
      console.log('PayPal payment success processed:', successResult);

      res.json({
        success: true,
        message: 'PayPal payment completed successfully',
        transactionId: orderID,
        creditsAdded: successResult.creditsAdded,
        receiptData: successResult.receiptData
      });
    } else {
      throw new Error('PayPal capture failed');
    }

  } catch (error) {
    console.error('PayPal success processing failed:', error);
    
    // Record failure in database
    const failureResponse = await fetch('http://localhost:5000/api/payment-flow/failure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transactionId: req.params.orderID,
        orderTrackingId: req.params.orderID,
        packageId: req.body.packageId || 'basic',
        amount: '0',
        currency: 'USD',
        paymentMethod: 'paypal',
        processorType: 'paypal',
        userId: req.body.userId || 'demo_user',
        errorMessage: error instanceof Error ? error.message : 'PayPal processing failed',
        customerEmail: req.body.customerEmail
      })
    });

    res.status(400).json({
      success: false,
      error: 'PayPal payment processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PayPal failure handler
router.post('/failure', async (req, res) => {
  try {
    const {
      orderID,
      packageId,
      userId,
      customerEmail,
      errorMessage
    } = req.body;

    console.log('Processing PayPal failure:', { orderID, errorMessage });

    // Record failure in database
    const failureResponse = await fetch('http://localhost:5000/api/payment-flow/failure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transactionId: orderID || 'PAYPAL_FAIL_' + Date.now(),
        orderTrackingId: orderID,
        packageId: packageId || 'basic',
        amount: '0',
        currency: 'USD',
        paymentMethod: 'paypal',
        processorType: 'paypal',
        userId: userId || 'demo_user',
        errorMessage: errorMessage || 'PayPal payment cancelled or failed',
        customerEmail: customerEmail,
        paypalEmail: customerEmail
      })
    });

    const failureResult = await failureResponse.json();
    console.log('PayPal failure recorded:', failureResult);

    res.json({
      success: true,
      message: 'PayPal failure recorded',
      transactionId: orderID,
      retryCount: failureResult.retryCount
    });

  } catch (error) {
    console.error('PayPal failure processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process PayPal failure'
    });
  }
});

export default router;