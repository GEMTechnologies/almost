/**
 * PesaPal Integration Service
 * Handles PesaPal API 3.0 integration for mobile money and card payments
 */

import { Request, Response } from "express";
import crypto from "crypto";

const { PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET } = process.env;

const isPesaPalConfigured = PESAPAL_CONSUMER_KEY && PESAPAL_CONSUMER_SECRET;

if (!isPesaPalConfigured) {
  console.warn("PesaPal not configured: Missing PESAPAL_CONSUMER_KEY or PESAPAL_CONSUMER_SECRET");
}

// PesaPal API URLs - Updated to match official documentation
const PESAPAL_BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://pay.pesapal.com/v3/api" 
  : "https://cybqa.pesapal.com/pesapalv3/api";

// Helper function to generate authentication token (Updated for API 3.0)
async function getAuthToken(): Promise<string | null> {
  if (!isPesaPalConfigured) {
    throw new Error("PesaPal not configured. Please add PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET to your environment variables.");
  }

  try {
    const response = await fetch(`${PESAPAL_BASE_URL}/Auth/RequestToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        consumer_key: PESAPAL_CONSUMER_KEY,
        consumer_secret: PESAPAL_CONSUMER_SECRET
      })
    });

    const data = await response.json();
    
    console.log('PesaPal Auth Response:', {
      url: `${PESAPAL_BASE_URL}/Auth/RequestToken`,
      environment: process.env.NODE_ENV,
      status: response.status,
      response: data,
      hasCredentials: {
        consumer_key: !!PESAPAL_CONSUMER_KEY,
        consumer_secret: !!PESAPAL_CONSUMER_SECRET
      }
    });
    
    if (data.token) {
      console.log('PesaPal authentication successful:', {
        status: data.status,
        message: data.message,
        expiryDate: data.expiryDate
      });
      return data.token;
    } else {
      console.error('PesaPal authentication failed:', data);
      return null;
    }
  } catch (error) {
    console.error('Failed to get PesaPal auth token:', error);
    return null;
  }
}

// Register IPN URL (Updated for API 3.0)
export async function registerIPN(): Promise<string | null> {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const ipnUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/pesapal/ipn`;
    
    const response = await fetch(`${PESAPAL_BASE_URL}/URLSetup/RegisterIPN`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        url: ipnUrl,
        ipn_notification_type: 'GET'
      })
    });

    const data = await response.json();
    
    if (data.ipn_id) {
      console.log('IPN registration successful:', {
        url: data.url,
        ipn_id: data.ipn_id,
        status: data.ipn_status_description,
        created_date: data.created_date
      });
      return data.ipn_id;
    } else {
      console.error('IPN registration failed:', data);
      return null;
    }
  } catch (error) {
    console.error('Failed to register IPN:', error);
    return null;
  }
}

// Submit order to PesaPal with saved payment method sync
export async function createPesaPalOrder(req: Request, res: Response) {
  try {
    if (!isPesaPalConfigured) {
      console.error('PesaPal credentials missing:', {
        PESAPAL_CONSUMER_KEY: !!process.env.PESAPAL_CONSUMER_KEY,
        PESAPAL_CONSUMER_SECRET: !!process.env.PESAPAL_CONSUMER_SECRET
      });
      return res.status(400).json({
        success: false,
        error: "PesaPal not configured. Please contact administrator to add PesaPal credentials.",
      });
    }

    console.log('PesaPal is configured, processing order...');

    const { 
      amount, 
      currency, 
      description, 
      phone_number, 
      email_address, 
      first_name, 
      last_name,
      package_id,
      credits,
      user_id,
      saved_method_id
    } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        error: "Invalid amount. Amount must be a positive number.",
      });
    }

    const token = await getAuthToken();
    if (!token) {
      return res.status(500).json({
        error: "Failed to authenticate with PesaPal.",
      });
    }

    // Generate unique order ID
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create payment transaction record for database sync
    const transactionId = crypto.randomUUID();
    const paymentTransaction = {
      id: transactionId,
      userId: user_id,
      packageId: package_id || 'unknown',
      paymentMethod: 'pesapal',
      originalAmount: parseFloat(amount),
      finalAmount: parseFloat(amount),
      creditsAdded: credits || 0,
      status: 'pending',
      transactionId: orderId,
      processorType: 'pesapal',
      mobileNumber: phone_number,
      metadata: {
        saved_method_id: saved_method_id,
        description: description,
        email: email_address,
        full_name: `${first_name || ''} ${last_name || ''}`.trim()
      }
    };
    
    // Log transaction creation for database sync
    console.log('Creating PesaPal transaction:', {
      transactionId,
      orderId,
      amount,
      phone_number,
      saved_method_id
    });
    
    const orderData = {
      id: orderId,
      currency: currency || 'USD',
      amount: parseFloat(amount),
      description: description || 'Granada OS Credit Purchase - Supports Mobile Money & Credit Cards',
      callback_url: `${process.env.BASE_URL || 'http://localhost:5000'}/api/pesapal/callback?transaction_id=${transactionId}&package_id=${package_id}`,
      notification_id: await registerIPN(),
      billing_address: {
        email_address: email_address,
        phone_number: phone_number,
        country_code: 'UG',
        first_name: first_name || 'Customer',
        last_name: last_name || 'User',
        line_1: 'Kampala',
        line_2: '',
        city: 'Kampala',
        state: 'Central',
        postal_code: '00000',
        zip_code: '00000'
      }
    };

    const response = await fetch(`${PESAPAL_BASE_URL}/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    
    if (result.order_tracking_id) {
      // Update transaction status to processing
      paymentTransaction.status = 'processing';
      
      // Update saved payment method last used if applicable
      if (saved_method_id) {
        console.log('Updating saved payment method last used:', saved_method_id);
        // TODO: Update database - saved payment method last used timestamp
      }
      
      // Log successful order creation for database sync
      console.log('PesaPal order created successfully:', {
        orderId,
        orderTrackingId: result.order_tracking_id,
        transactionId,
        status: 'processing'
      });
      
      res.json({
        success: true,
        transaction_id: transactionId,
        order_tracking_id: result.order_tracking_id,
        merchant_reference: orderId,
        redirect_url: result.redirect_url
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to create PesaPal order'
      });
    }

  } catch (error) {
    console.error("Failed to create PesaPal order:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to create order." 
    });
  }
}

// Handle PesaPal callback with transaction synchronization
export async function handlePesaPalCallback(req: Request, res: Response) {
  try {
    const { OrderTrackingId, OrderMerchantReference, transaction_id } = req.query;

    console.log('PesaPal callback received:', {
      OrderTrackingId,
      OrderMerchantReference,
      transaction_id
    });

    if (!OrderTrackingId) {
      return res.status(400).json({
        error: "Missing OrderTrackingId"
      });
    }

    const token = await getAuthToken();
    if (!token) {
      return res.status(500).json({
        error: "Failed to authenticate with PesaPal."
      });
    }

    // Get transaction status
    const response = await fetch(`${PESAPAL_BASE_URL}/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    // Log transaction status for database sync
    console.log('PesaPal transaction status:', {
      transactionId: transaction_id,
      orderTrackingId: OrderTrackingId,
      status: result.payment_status_description,
      amount: result.amount,
      currency: result.currency
    });
    
    if (result.payment_status_description === 'Completed') {
      // Payment successful - update database via API call
      console.log('Payment completed successfully - processing credit allocation');
      
      try {
        const successResponse = await fetch(`${process.env.BASE_URL || 'http://localhost:5000'}/api/payment-flow/success`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            transactionId: transaction_id,
            orderTrackingId: OrderTrackingId,
            packageId: req.query.package_id as string || 'basic',
            amount: result.amount?.toString() || '0',
            currency: result.currency || 'USD',
            paymentMethod: 'pesapal',
            processorType: 'pesapal',
            userId: 'demo_user',
            customerName: 'Demo User',
            customerEmail: 'demo@granadaos.com',
            customerPhone: '+256760195194'
          })
        });
        
        const successResult = await successResponse.json();
        console.log('Database updated for successful payment:', successResult);
      } catch (error) {
        console.error('Failed to update database for successful payment:', error);
      }
      
      res.redirect(`/purchase/${OrderMerchantReference}/success?transaction_id=${transaction_id}&status=success&amount=${result.amount}`);
    } else {
      // Payment failed or pending - update database via API call
      console.log('Payment not completed:', result.payment_status_description);
      
      try {
        const failureResponse = await fetch(`${process.env.BASE_URL || 'http://localhost:5000'}/api/payment-flow/failure`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            transactionId: transaction_id,
            orderTrackingId: OrderTrackingId,
            packageId: req.query.package_id as string || 'basic',
            amount: result.amount?.toString() || '0',
            currency: result.currency || 'USD',
            paymentMethod: 'pesapal',
            processorType: 'pesapal',
            userId: 'demo_user',
            errorMessage: result.payment_status_description || 'Payment processing failed',
            customerName: 'Demo User',
            customerEmail: 'demo@granadaos.com',
            customerPhone: '+256760195194'
          })
        });
        
        const failureResult = await failureResponse.json();
        console.log('Database updated for failed payment:', failureResult);
      } catch (error) {
        console.error('Failed to update database for failed payment:', error);
      }
      
      res.redirect(`/purchase/${OrderMerchantReference}/failure?transaction_id=${transaction_id}&status=${result.payment_status_description}&error=${encodeURIComponent(result.payment_status_description || 'Payment processing failed')}&amount=${result.amount || 0}`);
    }

  } catch (error) {
    console.error("PesaPal callback error:", error);
    res.status(500).json({ 
      error: "Callback processing failed." 
    });
  }
}

// Handle IPN notifications with database synchronization
export async function handlePesaPalIPN(req: Request, res: Response) {
  try {
    const { OrderTrackingId, OrderMerchantReference } = req.query;
    
    console.log('PesaPal IPN received:', {
      OrderTrackingId,
      OrderMerchantReference,
      query: req.query
    });

    if (!OrderTrackingId) {
      console.error('IPN missing OrderTrackingId');
      return res.status(400).send('Missing OrderTrackingId');
    }

    // Get transaction status from PesaPal
    const token = await getAuthToken();
    if (!token) {
      console.error('Failed to get auth token for IPN verification');
      return res.status(500).send('Authentication failed');
    }

    const statusResponse = await fetch(`${PESAPAL_BASE_URL}/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    const transactionStatus = await statusResponse.json();
    
    console.log('Transaction status from PesaPal:', {
      orderTrackingId: OrderTrackingId,
      status: transactionStatus.payment_status_description,
      amount: transactionStatus.amount,
      currency: transactionStatus.currency,
      merchant_reference: transactionStatus.merchant_reference
    });

    // Update database transaction record
    const updateData = {
      orderTrackingId: OrderTrackingId,
      merchantReference: OrderMerchantReference,
      status: transactionStatus.payment_status_description,
      amount: transactionStatus.amount,
      currency: transactionStatus.currency,
      ipnData: transactionStatus,
      updatedAt: new Date().toISOString()
    };

    // Process based on payment status
    if (transactionStatus.payment_status_description === 'Completed') {
      console.log('Payment completed - processing credit allocation:', updateData);
      
      // TODO: Database operations:
      // 1. Update payment_transactions table with completed status
      // 2. Add credits to user account 
      // 3. Update saved payment method last used timestamp
      // 4. Create credit_transactions record
      // 5. Send confirmation email/notification
      
    } else if (transactionStatus.payment_status_description === 'Failed') {
      console.log('Payment failed - updating transaction record:', updateData);
      
      // TODO: Update transaction status to failed in database
      
    } else {
      console.log('Payment pending or other status:', transactionStatus.payment_status_description);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error("PesaPal IPN error:", error);
    res.status(500).send('Error');
  }
}

export { PESAPAL_BASE_URL, isPesaPalConfigured };