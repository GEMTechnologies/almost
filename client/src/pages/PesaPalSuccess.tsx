import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PesaPalSuccess() {
  const { packageId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);

  const transactionId = searchParams.get('transaction_id');
  const orderTrackingId = searchParams.get('OrderTrackingId');
  const merchantReference = searchParams.get('OrderMerchantReference');
  const amount = searchParams.get('amount');
  const status = searchParams.get('status');

  useEffect(() => {
    // Start confetti animation
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigate('/credits');
  };

  const handleBackToPackages = () => {
    navigate('/credits');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-950 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="w-4 h-4 text-emerald-400 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-emerald-200 dark:border-emerald-800">
        {/* Success Animation */}
        <div className="relative mb-6">
          <div className={`mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center transform transition-all duration-1000 ${animationComplete ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          {/* Floating icons */}
          {animationComplete && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-ping"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '2s'
                  }}
                >
                  <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-75"></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your PesaPal payment has been processed successfully. Credits have been added to your account!
        </p>

        {/* Transaction Details */}
        <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Package:</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              {packageId === 'starter' && 'Starter - 50 Credits'}
              {packageId === 'professional' && 'Professional - 150 Credits'}
              {packageId === 'enterprise' && 'Enterprise - 400 Credits'}
              {packageId === 'unlimited' && 'Unlimited Pro - 1000 Credits'}
            </span>
          </div>
          
          {amount && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Amount Paid:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                UGX {amount}
              </span>
            </div>
          )}
          
          {transactionId && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Transaction ID:</span>
              <span className="font-mono text-xs text-emerald-700 dark:text-emerald-300">
                {transactionId}
              </span>
            </div>
          )}
          
          {orderTrackingId && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">PesaPal Order:</span>
              <span className="font-mono text-xs text-emerald-700 dark:text-emerald-300">
                {orderTrackingId.substring(0, 8)}...
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Payment Method:</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              PesaPal Mobile Money
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-full text-xs font-medium">
              {status === 'success' ? 'Completed' : 'Processed'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            View My Credits
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleBackToPackages}
            className="w-full border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Packages
          </Button>
        </div>

        {/* Receipt Download */}
        <div className="mt-6 pt-4 border-t border-emerald-200 dark:border-emerald-800">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  );
}