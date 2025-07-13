# Granada OS Payment Setup Guide

## Required Credentials for Payment Processing

To make the payment system work, you need to provide the following credentials:

### 1. Pesapal API Credentials (For Mobile Money - M-Pesa, Airtel, MTN)

**Where to get them:**
1. Go to [Pesapal Developer Portal](https://developer.pesapal.com/)
2. Create an account or login
3. Create a new application
4. Get your credentials from the dashboard

**Required Environment Variables:**
```bash
PESAPAL_CONSUMER_KEY=your_consumer_key_here
PESAPAL_CONSUMER_SECRET=your_consumer_secret_here
```

**Test Credentials (for development):**
- Consumer Key: `qkio1BGGYAXTu2JOfm7XSXNjRoRcWJQOr5B4Ue5YzD8`
- Consumer Secret: `MJaGpZSHBYTAX8BSn3JE5EZz7c`

### 2. Stripe API Credentials (For Credit Cards)

**Where to get them:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Create an account or login
3. Get your API keys from the dashboard

**Required Environment Variables:**
```bash
STRIPE_SECRET_KEY=sk_test_...  # Your secret key (starts with sk_)
VITE_STRIPE_PUBLIC_KEY=pk_test_...  # Your publishable key (starts with pk_)
```

### 3. PayPal API Credentials (For PayPal Payments)

**Where to get them:**
1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Create an account or login
3. Create a new application
4. Get your Client ID and Secret

**Required Environment Variables:**
```bash
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
```

## Setting Up Credentials in Replit

1. Click on "Secrets" in the left sidebar of your Replit
2. Add each environment variable listed above
3. Restart your application

## Current Payment Status

✅ **Mobile Money (Pesapal)**: Fully integrated with SDK
✅ **Card Inputs**: Form fields implemented
✅ **PayPal Inputs**: Form fields implemented
⚠️ **Missing**: API credentials for live testing

## Testing the System

Once you provide the credentials:

1. **Mobile Money**: Will redirect to actual Pesapal payment page
2. **Credit Cards**: Will process through Stripe
3. **PayPal**: Will process through PayPal

## Demo Features Working

- Currency detection based on location
- Real-time exchange rates
- Coupon system with multiple discount types
- Mobile-first responsive design
- Payment method selection
- Credit balance tracking

## Next Steps

1. Provide the API credentials above
2. Test each payment method
3. Verify credits are added to user accounts
4. Test the callback and notification system