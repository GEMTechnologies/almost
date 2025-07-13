# PesaPal Setup Guide for Granada OS

## Current Issue
The PesaPal authentication is failing with error: `invalid_consumer_key_or_secret_provided`

This means the current credentials are either:
1. Incorrect for the sandbox environment
2. Live/production credentials being used in development mode
3. Test credentials that have expired

## Environment Detection
- **Current Environment**: Development (NODE_ENV=development)
- **PesaPal URL Used**: https://cybqa.pesapal.com/pesapalv3/api (Sandbox)
- **Credentials Status**: Present but invalid for sandbox

## How to Get Correct PesaPal Credentials

### For Testing/Development (Sandbox):
1. Visit: https://developer.pesapal.com/
2. Download test credentials from the documentation
3. Use sandbox credentials for development testing

### For Production:
1. Register at: https://www.pesapal.com/
2. Complete merchant account verification
3. Get live credentials from your merchant dashboard

## Current Configuration
- **Sandbox URL**: https://cybqa.pesapal.com/pesapalv3/api
- **Live URL**: https://pay.pesapal.com/v3/api
- **Environment Detection**: Automatic based on NODE_ENV

## Test Credentials Available
According to PesaPal documentation, test credentials are available for download.
These allow testing the integration without real money transactions.

## What This Means for Payment Testing
- Real PesaPal transactions will only work with correct credentials
- Demo mode will continue to show "success" without real processing
- For actual mobile money testing, valid sandbox credentials are required

## Next Steps
1. Obtain correct sandbox credentials from PesaPal developer documentation
2. Update the PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET
3. Test the payment flow with real PesaPal sandbox environment
4. Verify transactions appear in PesaPal dashboard

## Demo vs Real Payments
- **Demo Mode**: Shows success without real processing (current state)
- **Real Mode**: Requires valid credentials and processes actual transactions
- **Production**: Requires live credentials and processes real money