/**
 * Granada OS - Pesapal SDK Integration
 * Complete Pesapal API 3.0 implementation for mobile money payments
 */

import crypto from 'crypto';

interface PesapalConfig {
  consumerKey: string;
  consumerSecret: string;
  baseUrl: string;
}

interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  callback_url: string;
  notification_id: string;
  billing_address: {
    first_name: string;
    last_name: string;
    email_address: string;
    phone_number: string;
    country_code: string;
    city: string;
    state: string;
    postal_code: string;
    zip_code: string;
  };
}

export class PesapalSDK {
  private config: PesapalConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.config = {
      consumerKey: process.env.PESAPAL_CONSUMER_KEY || 'qkio1BGGYAXTu2JOfm7XSXNjRoRcWJQOr5B4Ue5YzD8',
      consumerSecret: process.env.PESAPAL_CONSUMER_SECRET || 'MJaGpZSHBYTAX8BSn3JE5EZz7c',
      baseUrl: process.env.NODE_ENV === 'production' 
        ? 'https://pay.pesapal.com/v3/api' 
        : 'https://cybqa.pesapal.com/pesapalv3/api'
    };
  }

  /**
   * Get OAuth access token from Pesapal
   */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/Auth/RequestToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          consumer_key: this.config.consumerKey,
          consumer_secret: this.config.consumerSecret
        })
      });

      const data = await response.json();
      
      if (data.token) {
        this.accessToken = data.token;
        // Set expiry to 1 hour from now (Pesapal tokens typically last 1 hour)
        this.tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
        return this.accessToken;
      } else {
        throw new Error('Failed to get access token: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('Pesapal authentication error:', error);
      throw new Error('Failed to authenticate with Pesapal');
    }
  }

  /**
   * Register IPN URL for payment notifications
   */
  async registerIPN(ipnUrl: string): Promise<string> {
    const token = await this.getAccessToken();

    try {
      const response = await fetch(`${this.config.baseUrl}/URLSetup/RegisterIPN`, {
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
        return data.ipn_id;
      } else {
        throw new Error('Failed to register IPN: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('IPN registration error:', error);
      throw new Error('Failed to register IPN URL');
    }
  }

  /**
   * Submit order to Pesapal for payment processing
   */
  async submitOrderRequest(paymentData: PaymentRequest): Promise<{ order_tracking_id: string; redirect_url: string }> {
    const token = await this.getAccessToken();

    try {
      const response = await fetch(`${this.config.baseUrl}/Transactions/SubmitOrderRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          currency: paymentData.currency,
          amount: paymentData.amount,
          description: paymentData.description,
          callback_url: paymentData.callback_url,
          notification_id: paymentData.notification_id,
          billing_address: paymentData.billing_address
        })
      });

      const data = await response.json();
      
      if (data.order_tracking_id && data.redirect_url) {
        return {
          order_tracking_id: data.order_tracking_id,
          redirect_url: data.redirect_url
        };
      } else {
        throw new Error('Failed to submit order: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('Order submission error:', error);
      throw new Error('Failed to submit payment order');
    }
  }

  /**
   * Get transaction status from Pesapal
   */
  async getTransactionStatus(orderTrackingId: string): Promise<any> {
    const token = await this.getAccessToken();

    try {
      const response = await fetch(`${this.config.baseUrl}/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Transaction status error:', error);
      throw new Error('Failed to get transaction status');
    }
  }

  /**
   * Create a complete payment request for Granada OS
   */
  async createPaymentRequest(params: {
    packageId: string;
    amount: number;
    currency: string;
    userPhone: string;
    userEmail?: string;
    userName?: string;
    countryCode: string;
    callbackUrl: string;
    notificationId: string;
  }) {
    const { packageId, amount, currency, userPhone, userEmail, userName, countryCode, callbackUrl, notificationId } = params;

    const paymentRequest: PaymentRequest = {
      amount: amount,
      currency: currency,
      description: `Granada OS Credits - ${packageId} Package`,
      callback_url: callbackUrl,
      notification_id: notificationId,
      billing_address: {
        first_name: userName?.split(' ')[0] || 'User',
        last_name: userName?.split(' ').slice(1).join(' ') || 'Name',
        email_address: userEmail || 'user@granada.com',
        phone_number: userPhone,
        country_code: countryCode,
        city: 'City',
        state: 'State',
        postal_code: '00000',
        zip_code: '00000'
      }
    };

    return await this.submitOrderRequest(paymentRequest);
  }
}

export const pesapalSDK = new PesapalSDK();