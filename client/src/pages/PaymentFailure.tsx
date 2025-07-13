import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, ArrowLeft, CreditCard, Phone, Mail, Clock } from 'lucide-react';

export default function PaymentFailure() {
  const { packageId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown

  const transactionId = searchParams.get('transaction_id');
  const orderTrackingId = searchParams.get('OrderTrackingId');
  const errorMessage = searchParams.get('error') || 'Payment processing failed';
  const amount = searchParams.get('amount');

  // Countdown timer for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Package information
  const getPackageInfo = (id: string) => {
    switch(id) {
      case 'starter': return { name: 'Starter Package', credits: 50, amount: 9.99, savings: '0%' };
      case 'professional': return { name: 'Professional Package', credits: 150, amount: 24.99, savings: '15%' };
      case 'enterprise': return { name: 'Enterprise Package', credits: 400, amount: 59.99, savings: '25%' };
      case 'unlimited': return { name: 'Unlimited Pro Package', credits: 1000, amount: 99.99, savings: '35%' };
      default: return { name: 'Basic Package', credits: 50, amount: 10.00, savings: '0%' };
    }
  };

  const packageInfo = getPackageInfo(packageId || 'basic');

  const handleRetryPayment = () => {
    setRetryAttempts(prev => prev + 1);
    navigate(`/purchase/${packageId}/method`);
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent(`Payment Failed - ${packageInfo.name} - Transaction: ${transactionId || 'Unknown'}`);
    const body = encodeURIComponent(
      `Hello Granada Global Tech Ltd Support Team,\n\n` +
      `I experienced a payment failure while trying to purchase the ${packageInfo.name}.\n\n` +
      `Details:\n` +
      `- Package: ${packageInfo.name} (${packageInfo.credits} credits)\n` +
      `- Amount: $${packageInfo.amount}\n` +
      `- Transaction ID: ${transactionId || 'Not provided'}\n` +
      `- Order Tracking: ${orderTrackingId || 'Not provided'}\n` +
      `- Error: ${errorMessage}\n` +
      `- Retry Attempts: ${retryAttempts}\n\n` +
      `Please assist me in completing this purchase.\n\n` +
      `Best regards`
    );
    window.open(`mailto:support@granadaglobal.com?subject=${subject}&body=${body}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTryDifferentMethod = () => {
    navigate(`/purchase/${packageId}/method`);
  };

  const urgencyMessages = [
    "⚡ Limited time offer still active!",
    "🔥 Your discount is about to expire!",
    "💎 Reserve your credits before price increase!",
    "🚀 Join thousands of successful organizations!"
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % urgencyMessages.length);
    }, 3000);

    return () => clearInterval(messageTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-950 dark:to-orange-950 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <AlertTriangle className="w-3 h-3 text-red-400 opacity-40" />
          </div>
        ))}
      </div>

      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center border border-red-200 dark:border-red-800">
        {/* Failure Animation */}
        <div className="relative mb-6">
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          
          {/* Pulsing error indicators */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '2s'
                }}
              >
                <div className="w-2 h-2 bg-red-400 rounded-full opacity-75"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Failure Message */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Failed 😞
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Don't worry! This happens sometimes. Let's get you your credits!
        </p>

        <p className="text-sm text-red-600 dark:text-red-400 mb-4 font-semibold">
          Granada Global Tech Ltd - Soroti, Uganda
        </p>

        {/* Urgency Message */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-lg mb-6 animate-pulse">
          <p className="font-bold text-lg">{urgencyMessages[currentMessage]}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            <span className="text-sm">remaining</span>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Package:</span>
            <span className="font-semibold text-red-700 dark:text-red-300">
              {packageInfo.name} - {packageInfo.credits} Credits
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
            <span className="font-semibold text-red-700 dark:text-red-300">
              ${amount || packageInfo.amount}
            </span>
          </div>

          {packageInfo.savings !== '0%' && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">You Save:</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {packageInfo.savings}
              </span>
            </div>
          )}
          
          {transactionId && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Failed Transaction:</span>
              <span className="font-mono text-xs text-red-700 dark:text-red-300">
                {transactionId}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Error:</span>
            <span className="text-xs text-red-600 dark:text-red-400 max-w-48 truncate">
              {errorMessage}
            </span>
          </div>
        </div>

        {/* DEMAND NOTE */}
        <div className="bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900 dark:to-orange-900 border-l-4 border-red-500 p-4 mb-6 text-left">
          <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">⚠️ PAYMENT DEMAND NOTICE</h3>
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>Granada Global Tech Ltd</strong> requires immediate payment resolution for your {packageInfo.name}. 
            Your {packageInfo.credits} credits are reserved for <strong>{formatTime(timeLeft)}</strong> only.
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
            Failure to complete payment within the time limit will result in loss of current pricing and availability.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={handleRetryPayment}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center animate-pulse"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            RETRY PAYMENT NOW ({retryAttempts > 0 ? `Attempt ${retryAttempts + 1}` : 'Try Again'})
          </button>
          
          <button 
            onClick={handleTryDifferentMethod}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Try Different Payment Method
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleContactSupport}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              <Mail className="w-4 h-4 mr-1" />
              Support
            </button>
            
            <button 
              onClick={() => navigate('/credits')}
              className="border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
          </div>
        </div>

        {/* Testimonial for Trust */}
        <div className="mt-6 pt-4 border-t border-red-200 dark:border-red-800">
          <p className="text-xs text-gray-600 dark:text-gray-400 italic mb-2">
            "Granada Global Tech helped us secure $500K in funding. The platform is incredible!" 
            <br/>- Sarah K., NGO Director
          </p>
          <p className="text-xs text-center text-red-600 dark:text-red-400">
            Granada Global Tech Ltd<br/>
            Amen A, Soroti, Eastern Region, Uganda<br/>
            Postal Address: 290884 Soroti | 24/7 Support Available
          </p>
        </div>
      </div>
    </div>
  );
}