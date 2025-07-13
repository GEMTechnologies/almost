import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowLeft, Download, Receipt } from 'lucide-react';
import ProfessionalReceipt from '@/components/ProfessionalReceipt';

export default function PesaPalSuccess() {
  const { packageId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

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

  const receiptData = {
    transactionId: transactionId || orderTrackingId || 'TXN_' + Date.now(),
    packageName: packageInfo.name,
    amount: parseFloat(amount || packageInfo.amount.toString()),
    currency: 'USD',
    credits: packageInfo.credits,
    paymentMethod: 'Mobile Money (PesaPal)',
    customerName: 'Demo User',
    customerEmail: 'demo@granadaglobal.com',
    customerPhone: '+256760195194',
    date: new Date().toISOString(),
    organizationName: 'Granada Global Tech Ltd',
    userType: 'NGO'
  };

  // Show receipt if requested
  if (showReceipt) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => setShowReceipt(false)}
            className="mb-6 flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Success Page
          </button>
          
          <ProfessionalReceipt data={receiptData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated success celebration background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            <Sparkles className="w-4 h-4 text-emerald-400 opacity-60" />
          </div>
        ))}
        
        {/* Floating money and success icons */}
        {animationComplete && [...Array(15)].map((_, i) => (
          <div
            key={`float-${i}`}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '3s'
            }}
          >
            <div className="text-2xl">
              {['💰', '🎉', '✨', '🚀', '💎'][Math.floor(Math.random() * 5)]}
            </div>
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
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          🎉 PAYMENT SUCCESS! 🎉
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Congratulations! Your PesaPal payment was processed successfully. 
          <span className="font-bold text-emerald-600"> {packageInfo.credits} credits</span> are now in your account!
        </p>

        <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-3 rounded-lg mb-6 animate-pulse">
          <p className="font-bold">🚀 You're now ready to secure funding!</p>
          <p className="text-sm">Granada Global Tech Ltd - Powering Success from Soroti, Uganda</p>
        </div>

        {/* Transaction Details */}
        <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Package:</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              {packageInfo.name} - {packageInfo.credits} Credits
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

        {/* Achievement Unlocked */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg mb-6 transform animate-bounce">
          <div className="flex items-center justify-center gap-2">
            <div className="text-2xl">🏆</div>
            <div>
              <p className="font-bold">ACHIEVEMENT UNLOCKED!</p>
              <p className="text-sm">Smart Investor - Secured {packageInfo.credits} Credits</p>
            </div>
          </div>
        </div>

        {/* Next Steps Motivation */}
        <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-emerald-800 dark:text-emerald-200 mb-2">🚀 What's Next?</h3>
          <div className="text-sm text-emerald-700 dark:text-emerald-300 space-y-1">
            <p>✅ Generate AI-powered proposals</p>
            <p>✅ Access premium funding opportunities</p>
            <p>✅ Download professional receipts</p>
            <p>✅ Get priority support from our Uganda team</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={handleShowReceipt}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center animate-pulse"
          >
            <Receipt className="w-5 h-5 mr-2" />
            📄 GET YOUR PROFESSIONAL RECEIPT
          </button>
          
          <button 
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            🎯 START USING MY {packageInfo.credits} CREDITS
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/credits')}
              className="border-2 border-emerald-300 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center"
            >
              💎 More Credits
            </button>
            
            <button 
              onClick={() => navigate('/ngopipeline')}
              className="border-2 border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center"
            >
              🛠️ AI Tools
            </button>
          </div>
        </div>

        {/* Company Footer */}
        <div className="mt-6 pt-4 border-t border-emerald-200 dark:border-emerald-800">
          <p className="text-xs text-center text-emerald-600 dark:text-emerald-400">
            Granada Global Tech Ltd<br/>
            Amen A, Soroti, Eastern Region, Uganda<br/>
            Postal Address: 290884 Soroti
          </p>
        </div>
      </div>
    </div>
  );
}