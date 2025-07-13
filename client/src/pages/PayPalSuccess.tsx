import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowLeft, Download, Receipt } from 'lucide-react';
import ProfessionalReceipt from '@/components/ProfessionalReceipt';

export default function PayPalSuccess() {
  const { packageId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [creditsAdded, setCreditsAdded] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const paymentProcessed = useRef(false);

  const transactionId = searchParams.get('transaction_id');
  const orderTrackingId = searchParams.get('order_id');
  const paypalOrderId = searchParams.get('order_id');
  const amount = searchParams.get('amount');
  const status = searchParams.get('status');

  // Animation timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Process PayPal payment success with database connection
  useEffect(() => {
    const processPaymentSuccess = async () => {
      if ((transactionId || paypalOrderId) && !paymentProcessed.current) {
        paymentProcessed.current = true;
        
        try {
          console.log('Processing PayPal payment success with database:', {
            transactionId: transactionId || paypalOrderId,
            orderTrackingId,
            packageId,
            amount,
            status
          });

          // Call PayPal flow success endpoint
          const response = await fetch(`/api/paypal-flow/success/${paypalOrderId || transactionId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              packageId: packageId || 'basic',
              userId: 'demo_user',
              customerEmail: 'demo@granadaos.com'
            })
          });

          const result = await response.json();
          
          if (result.success) {
            console.log('PayPal payment success processed:', {
              transactionId: result.transactionId,
              creditsAdded: result.creditsAdded
            });

            // Update receipt data with real data from database
            setReceiptData(result.receiptData);
            setCreditsAdded(result.creditsAdded);

            // Show success message
            setSuccessMessage(`PayPal Payment Successful! ${result.creditsAdded} credits added to your account`);
          } else {
            console.error('PayPal payment processing failed:', result);
            setSuccessMessage(`Processing Error: ${result.error || "Failed to process PayPal payment"}`);
          }
        } catch (error) {
          console.error('PayPal payment success processing error:', error);
          setSuccessMessage("Connection Error: Failed to connect to payment system");
        }
      }
    };

    processPaymentSuccess();
  }, [transactionId, paypalOrderId, orderTrackingId, packageId, amount, status]);

  const handleContinue = () => {
    navigate('/credits');
  };

  const handleBackToPackages = () => {
    navigate('/credits');
  };

  const handleShowReceipt = () => {
    setShowReceipt(true);
  };

  // Package information based on packageId
  const getPackageInfo = (id: string) => {
    switch(id) {
      case 'starter': return { name: 'Starter Package', credits: 50, amount: 9.99 };
      case 'professional': return { name: 'Professional Package', credits: 150, amount: 24.99 };
      case 'enterprise': return { name: 'Enterprise Package', credits: 400, amount: 59.99 };
      case 'unlimited': return { name: 'Unlimited Pro Package', credits: 1000, amount: 99.99 };
      default: return { name: 'Basic Package', credits: 50, amount: 10.00 };
    }
  };

  const packageInfo = getPackageInfo(packageId || 'basic');

  // Use database receipt data if available, otherwise fallback to package info
  const finalReceiptData = receiptData || {
    transactionId: transactionId || paypalOrderId || 'TXN_' + Date.now(),
    packageName: packageInfo.name,
    amount: parseFloat(amount || packageInfo.amount.toString()),
    currency: 'USD',
    credits: creditsAdded || packageInfo.credits,
    paymentMethod: 'PayPal',
    customerName: 'Demo User',
    customerEmail: 'demo@granadaos.com',
    customerPhone: '+1-234-567-8900',
    date: new Date().toISOString(),
    organizationName: 'Granada Global Tech Ltd',
    userType: 'NGO'
  };

  // Show receipt if requested
  if (showReceipt) {
    return (
      <ProfessionalReceipt 
        data={finalReceiptData}
        onClose={() => setShowReceipt(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-emerald-900/20 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Floating celebration particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 2 + 's',
              animationDuration: (2 + Math.random() * 3) + 's'
            }}
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
        ))}
      </div>

      <div className="relative max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-200 dark:border-emerald-800 p-8 text-center relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl" />
          
          {/* Main content */}
          <div className="relative z-10">
            {/* Animated checkmark */}
            <div className={`mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mb-6 transform transition-all duration-1000 ${animationComplete ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
              <CheckCircle className="h-12 w-12 text-white" />
            </div>

            {/* Success message */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              PayPal Payment Successful! 🎉
            </h1>
            
            <div className="space-y-4 mb-8">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700">
                <h2 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                  {packageInfo.name}
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Amount Paid:</span>
                    <p className="font-semibold text-gray-900 dark:text-white">${amount || packageInfo.amount}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Credits Added:</span>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">{creditsAdded || packageInfo.credits} credits</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                    <p className="font-mono text-xs text-gray-900 dark:text-white">{transactionId || paypalOrderId}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                    <p className="font-semibold text-blue-600 dark:text-blue-400">PayPal</p>
                  </div>
                </div>
              </div>

              {successMessage && (
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                  <p className="text-blue-800 dark:text-blue-200 font-medium">{successMessage}</p>
                </div>
              )}

              {/* Achievement unlock */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center justify-center space-x-2 text-yellow-700 dark:text-yellow-300">
                  <div className="text-2xl">🏆</div>
                  <span className="font-semibold">Achievement Unlocked: PayPal Pro!</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleShowReceipt}
                className="flex items-center justify-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                <Receipt className="h-5 w-5" />
                <span>Download Receipt</span>
              </button>
              
              <button
                onClick={handleContinue}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                <span>Continue to Dashboard</span>
              </button>
            </div>

            {/* Back link */}
            <button
              onClick={handleBackToPackages}
              className="mt-6 flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Packages</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}