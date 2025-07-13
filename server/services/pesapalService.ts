/**
 * Granada OS - Pesapal Payment Service
 * Mobile money integration for African markets using Pesapal API 3.0
 */

import fetch from 'node-fetch';

interface PesapalConfig {
  consumerKey: string;
  consumerSecret: string;
  baseUrl: string; // sandbox or live
  ipnUrl: string;
}

interface PesapalAuthResponse {
  token: string;
  expiryDate: string;
  error: any;
  status: string;
  message: string;
}

interface PesapalOrderRequest {
  id: string; // merchant reference
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  cancellation_url?: string;
  notification_id: string;
  billing_address: {
    phone_number?: string;
    email_address?: string;
    country_code?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    line_1?: string;
    line_2?: string;
    city?: string;
    state?: string;
    postal_code?: number;
  };
}

interface PesapalOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error: any;
  status: string;
}

export class PesapalService {
  private config: PesapalConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.config = {
      consumerKey: process.env.PESAPAL_CONSUMER_KEY || 'demo-key',
      consumerSecret: process.env.PESAPAL_CONSUMER_SECRET || 'demo-secret',
      baseUrl: process.env.NODE_ENV === 'production' 
        ? 'https://pay.pesapal.com/v3/api'
        : 'https://cybqa.pesapal.com/pesapalv3/api',
      ipnUrl: process.env.PESAPAL_IPN_URL || 'https://your-domain.com/api/pesapal/ipn'
    };
  }

  /**
   * Authenticate with Pesapal and get access token
   */
  async authenticate(): Promise<string> {
    try {
      if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
        return this.accessToken;
      }

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

      const data = await response.json() as PesapalAuthResponse;

      if (data.error) {
        throw new Error(`Pesapal authentication failed: ${data.error.message || data.message}`);
      }

      this.accessToken = data.token;
      this.tokenExpiry = new Date(data.expiryDate);

      console.log('Pesapal authentication successful');
      return this.accessToken;

    } catch (error) {
      console.error('Pesapal authentication error:', error);
      throw new Error(`Failed to authenticate with Pesapal: ${error.message}`);
    }
  }

  /**
   * Register IPN URL for payment notifications
   */
  async registerIPN(): Promise<string> {
    try {
      const token = await this.authenticate();

      const response = await fetch(`${this.config.baseUrl}/URLSetup/RegisterIPN`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          url: this.config.ipnUrl,
          ipn_notification_type: 'GET'
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(`IPN registration failed: ${data.error.message}`);
      }

      console.log('IPN registered successfully:', data.ipn_id);
      return data.ipn_id;

    } catch (error) {
      console.error('IPN registration error:', error);
      throw new Error(`Failed to register IPN: ${error.message}`);
    }
  }

  /**
   * Submit payment order to Pesapal
   */
  async submitOrder(orderData: {
    merchantReference: string;
    amount: number;
    currency: string;
    description: string;
    customerEmail: string;
    customerPhone?: string;
    customerName?: string;
    callbackUrl: string;
    cancellationUrl?: string;
  }): Promise<PesapalOrderResponse> {
    try {
      const token = await this.authenticate();
      
      // Get or register IPN URL
      const ipnId = process.env.PESAPAL_IPN_ID || await this.registerIPN();

      const orderRequest: PesapalOrderRequest = {
        id: orderData.merchantReference,
        currency: orderData.currency,
        amount: orderData.amount,
        description: orderData.description,
        callback_url: orderData.callbackUrl,
        cancellation_url: orderData.cancellationUrl,
        notification_id: ipnId,
        billing_address: {
          email_address: orderData.customerEmail,
          phone_number: orderData.customerPhone,
          first_name: orderData.customerName?.split(' ')[0],
          last_name: orderData.customerName?.split(' ').slice(1).join(' '),
          country_code: 'KE' // Default to Kenya, can be made configurable
        }
      };

      const response = await fetch(`${this.config.baseUrl}/Transactions/SubmitOrderRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderRequest)
      });

      const data = await response.json() as PesapalOrderResponse;

      if (data.error) {
        throw new Error(`Order submission failed: ${data.error.message}`);
      }

      console.log('Pesapal order submitted successfully:', data.order_tracking_id);
      return data;

    } catch (error) {
      console.error('Pesapal order submission error:', error);
      throw new Error(`Failed to submit order to Pesapal: ${error.message}`);
    }
  }

  /**
   * Get transaction status from Pesapal
   */
  async getTransactionStatus(orderTrackingId: string): Promise<any> {
    try {
      const token = await this.authenticate();

      const response = await fetch(
        `${this.config.baseUrl}/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(`Status check failed: ${data.error.message}`);
      }

      return data;

    } catch (error) {
      console.error('Pesapal status check error:', error);
      throw new Error(`Failed to get transaction status: ${error.message}`);
    }
  }

  /**
   * Process mobile money STK push for direct payments
   */
  async processMobileMoneySTK(orderData: {
    merchantReference: string;
    amount: number;
    phoneNumber: string;
    description: string;
  }): Promise<any> {
    try {
      const token = await this.authenticate();

      const stkRequest = {
        id: orderData.merchantReference,
        currency: 'KES', // Kenyan Shillings for M-Pesa
        amount: orderData.amount,
        description: orderData.description,
        phone_number: orderData.phoneNumber,
        notification_id: process.env.PESAPAL_IPN_ID || await this.registerIPN()
      };

      const response = await fetch(`${this.config.baseUrl}/transactions/stk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(stkRequest)
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(`STK push failed: ${data.error.message}`);
      }

      console.log('Mobile money STK push successful');
      return data;

    } catch (error) {
      console.error('Mobile money STK error:', error);
      throw new Error(`Failed to process mobile money payment: ${error.message}`);
    }
  }

  /**
   * Handle IPN notification from Pesapal
   */
  async handleIPN(queryParams: Record<string, string>): Promise<{
    status: string;
    merchantReference: string;
    orderTrackingId: string;
    paymentMethod: string;
    amount: number;
    currency: string;
  }> {
    try {
      const { OrderTrackingId, OrderMerchantReference } = queryParams;

      if (!OrderTrackingId) {
        throw new Error('Missing OrderTrackingId in IPN');
      }

      // Get detailed transaction status
      const transactionStatus = await this.getTransactionStatus(OrderTrackingId);

      return {
        status: transactionStatus.payment_status_description || 'Unknown',
        merchantReference: OrderMerchantReference || transactionStatus.merchant_reference,
        orderTrackingId: OrderTrackingId,
        paymentMethod: transactionStatus.payment_method || 'Unknown',
        amount: parseFloat(transactionStatus.amount || '0'),
        currency: transactionStatus.currency || 'KES'
      };

    } catch (error) {
      console.error('IPN handling error:', error);
      throw new Error(`Failed to handle IPN: ${error.message}`);
    }
  }

  /**
   * Generate payment URL for credit package purchase
   */
  async generatePaymentUrl(packageData: {
    packageId: string;
    credits: number;
    price: number;
    userId: string;
    userEmail: string;
    userName?: string;
    userPhone?: string;
  }): Promise<string> {
    try {
      const merchantReference = `CREDITS_${packageData.packageId}_${packageData.userId}_${Date.now()}`;
      
      const order = await this.submitOrder({
        merchantReference,
        amount: packageData.price,
        currency: 'USD',
        description: `Granada Credits - ${packageData.credits} credits package`,
        customerEmail: packageData.userEmail,
        customerPhone: packageData.userPhone,
        customerName: packageData.userName,
        callbackUrl: `${process.env.APP_URL || 'http://localhost:5000'}/credits-success?ref=${merchantReference}`,
        cancellationUrl: `${process.env.APP_URL || 'http://localhost:5000'}/credits-cancelled?ref=${merchantReference}`
      });

      return order.redirect_url;

    } catch (error) {
      console.error('Payment URL generation error:', error);
      throw new Error(`Failed to generate payment URL: ${error.message}`);
    }
  }
}

// Export singleton instance
export const pesapalService = new PesapalService();