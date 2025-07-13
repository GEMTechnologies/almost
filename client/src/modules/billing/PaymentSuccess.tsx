import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle,
  ArrowRight,
  Download,
  Gem
} from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const packageData = location.state?.package;
  const paymentMethod = location.state?.paymentMethod;
  const returnUrl = location.state?.returnUrl || '/';
  const transactionId = location.state?.transactionId;

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate(returnUrl);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, returnUrl]);

  const handleReturnToDashboard = () => {
    navigate(returnUrl);
  };

  const handleDownloadReceipt = () => {
    // Generate receipt download
    const receiptData = {
      transactionId,
      package: packageData?.name,
      credits: packageData?.credits,
      amount: packageData?.price,
      date: new Date().toLocaleDateString(),
      paymentMethod
    };
    
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${transactionId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-slate-900 mb-2"
          >
            Payment Successful!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600 mb-6"
          >
            Your credits have been added to your account
          </motion.p>

          {/* Transaction Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-50 rounded-lg p-4 mb-6 space-y-2"
          >
            <div className="flex justify-between">
              <span className="text-slate-600">Package</span>
              <span className="font-medium">{packageData?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Credits Added</span>
              <div className="flex items-center">
                <Gem className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="font-medium text-emerald-600">{packageData?.credits}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Amount Paid</span>
              <span className="font-medium">${packageData?.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 text-sm">Transaction ID</span>
              <span className="font-mono text-sm text-slate-500">{transactionId}</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <button
              onClick={handleReturnToDashboard}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-all"
            >
              <div className="flex items-center justify-center">
                Continue to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </button>
            
            <button
              onClick={handleDownloadReceipt}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-lg transition-all"
            >
              <div className="flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </div>
            </button>
          </motion.div>

          {/* Auto-redirect Notice */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-slate-500 mt-4"
          >
            You'll be redirected automatically in 5 seconds
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;