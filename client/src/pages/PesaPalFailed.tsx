import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PesaPalFailed() {
  const { packageId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const transactionId = searchParams.get('transaction_id');
  const orderTrackingId = searchParams.get('OrderTrackingId');
  const merchantReference = searchParams.get('OrderMerchantReference');
  const status = searchParams.get('status');

  const handleRetry = () => {
    navigate(`/purchase/${packageId}/method`);
  };

  const handleBackToPackages = () => {
    navigate('/credits');
  };

  const handleContactSupport = () => {
    // Navigate to support or open support modal
    navigate('/support', { 
      state: { 
        issue: 'payment_failed',
        transactionId,
        orderTrackingId 
      }
    });
  };

  const getErrorMessage = () => {
    switch (status) {
      case 'Failed':
        return 'Your payment could not be processed. Please check your mobile money balance and try again.';
      case 'Cancelled':
        return 'Payment was cancelled. You can try again with a different payment method.';
      case 'Expired':
        return 'Payment session expired. Please initiate a new payment.';
      case 'Invalid':
        return 'Invalid payment details provided. Please verify your information and try again.';
      default:
        return 'There was an issue processing your payment. Please try again or contact support.';
    }
  };

  const getErrorType = () => {
    switch (status) {
      case 'Failed':
        return 'Payment Failed';
      case 'Cancelled':
        return 'Payment Cancelled';
      case 'Expired':
        return 'Session Expired';
      case 'Invalid':
        return 'Invalid Payment';
      default:
        return 'Payment Error';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-950 dark:to-orange-950 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-red-200 dark:border-red-800">
        {/* Error Icon */}
        <div className="relative mb-6">
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {getErrorType()}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {getErrorMessage()}
        </p>

        {/* Transaction Details */}
        <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Package:</span>
            <span className="font-semibold text-red-700 dark:text-red-300">
              {packageId === 'starter' && 'Starter - 50 Credits'}
              {packageId === 'professional' && 'Professional - 150 Credits'}
              {packageId === 'enterprise' && 'Enterprise - 400 Credits'}
              {packageId === 'unlimited' && 'Unlimited Pro - 1000 Credits'}
            </span>
          </div>
          
          {transactionId && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Transaction ID:</span>
              <span className="font-mono text-xs text-red-700 dark:text-red-300">
                {transactionId}
              </span>
            </div>
          )}
          
          {orderTrackingId && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">PesaPal Order:</span>
              <span className="font-mono text-xs text-red-700 dark:text-red-300">
                {orderTrackingId.substring(0, 8)}...
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Payment Method:</span>
            <span className="font-semibold text-red-700 dark:text-red-300">
              PesaPal Mobile Money
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-medium">
              {status || 'Failed'}
            </span>
          </div>
        </div>

        {/* Troubleshooting Tips */}
        <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center">
            <HelpCircle className="w-4 h-4 mr-2" />
            Common Issues:
          </h3>
          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
            <li>• Check your mobile money balance</li>
            <li>• Ensure your phone number is correct</li>
            <li>• Try a different mobile money provider</li>
            <li>• Check your network connection</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleRetry}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleBackToPackages}
            className="w-full border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-950"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Packages
          </Button>
          
          <Button 
            variant="ghost"
            onClick={handleContactSupport}
            className="w-full text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}