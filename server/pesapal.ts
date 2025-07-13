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

// PesaPal API URLs
const PESAPAL_BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://pay.pesapal.com/v3/api" 
  : "https://cybqa.pesapal.com/pesapalv3/api";

// Helper function to generate authentication token
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
    return data.token || null;
  } catch (error) {
    console.error('Failed to get PesaPal auth token:', error);
    return null;
  }
}

// Register IPN URL
export async function registerIPN(): Promise<string | null> {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const ipnUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/pesapal/ipn`;
    
    const response = await fetch(`${PESAPAL_BASE_URL}/URLSetup/RegisterIPN`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        url: ipnUrl,
        ipn_notification_type: 'GET'
      })
    });

    const data = await response.json();
    return data.ipn_id || null;
  } catch (error) {
    console.error('Failed to register IPN:', error);
    return null;
  }
}

// Submit order to PesaPal
export async function createPesaPalOrder(req: Request, res: Response) {
  try {
    if (!isPesaPalConfigured) {
      return res.status(400).json({
        error: "PesaPal not configured. Please contact administrator to add PesaPal credentials.",
      });
    }

    const { amount, currency, description, phone_number, email_address, first_name, last_name } = req.body;

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
    
    const orderData = {
      id: orderId,
      currency: currency || 'UGX',
      amount: parseFloat(amount),
      description: description || 'Granada OS Credit Purchase',
      callback_url: `${process.env.BASE_URL || 'http://localhost:5000'}/api/pesapal/callback`,
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
      res.json({
        success: true,
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

// Handle PesaPal callback
export async function handlePesaPalCallback(req: Request, res: Response) {
  try {
    const { OrderTrackingId, OrderMerchantReference } = req.query;

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
    
    if (result.payment_status_description === 'Completed') {
      // Payment successful - redirect to success page
      res.redirect(`/purchase/success?order=${OrderMerchantReference}&status=success&amount=${result.amount}`);
    } else {
      // Payment failed or pending
      res.redirect(`/purchase/failed?order=${OrderMerchantReference}&status=${result.payment_status_description}`);
    }

  } catch (error) {
    console.error("PesaPal callback error:", error);
    res.status(500).json({ 
      error: "Callback processing failed." 
    });
  }
}

// Handle IPN notifications
export async function handlePesaPalIPN(req: Request, res: Response) {
  try {
    const { OrderTrackingId, OrderMerchantReference } = req.query;
    
    console.log('PesaPal IPN received:', {
      OrderTrackingId,
      OrderMerchantReference
    });

    // Here you would typically:
    // 1. Verify the transaction status
    // 2. Update your database
    // 3. Add credits to user account
    // 4. Send confirmation email

    res.status(200).send('OK');
  } catch (error) {
    console.error("PesaPal IPN error:", error);
    res.status(500).send('Error');
  }
}

export { PESAPAL_BASE_URL, isPesaPalConfigured };