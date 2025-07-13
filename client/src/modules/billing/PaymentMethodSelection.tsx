import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  ArrowLeft,
  ArrowRight,
  Check,
  X
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  available: boolean;
}

const PaymentMethodSelection: React.FC = () => {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirming, setConfirming] = useState(false);
  
  // Get package info from state or default packages
  const packageData = location.state?.package || {
    basic: { name: 'Basic Pack', price: 10, credits: 100 },
    starter: { name: 'Starter Pack', price: 25, credits: 300 },
    professional: { name: 'Professional Pack', price: 50, credits: 700 },
    enterprise: { name: 'Enterprise Pack', price: 100, credits: 1500 }
  }[packageId || 'basic'];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-8 h-8" />,
      description: 'Visa, Mastercard, American Express',
      available: true
    },
    {
      id: 'mobile-money',
      name: 'Mobile Money',
      icon: <Smartphone className="w-8 h-8" />,
      description: 'M-Pesa, Airtel Money, MTN Mobile Money',
      available: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <DollarSign className="w-8 h-8" />,
      description: 'Pay with your PayPal account',
      available: true
    }
  ];

  const handleMethodSelect = (methodId: string) => {
    if (!paymentMethods.find(m => m.id === methodId)?.available) return;
    
    setSelectedMethod(methodId);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setConfirming(true);
    
    // Add a small delay for smooth animation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    navigate(`/purchase/${packageId}/details`, {
      state: {
        package: packageData,
        paymentMethod: selectedMethod,
        returnUrl: location.state?.returnUrl || '/'
      }
    });
  };

  const handleBack = () => {
    navigate('/credits');
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setSelectedMethod('');
  };

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'card': return <CreditCard className="w-8 h-8" />;
      case 'mobile-money': return <Smartphone className="w-8 h-8" />;
      case 'paypal': return <DollarSign className="w-8 h-8" />;
      default: return <CreditCard className="w-8 h-8" />;
    }
  };

  const getMethodName = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    return method?.name || 'Payment Method';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Credit Packages
          </button>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-900 mb-2"
          >
            Choose Payment Method
          </motion.h1>
          <p className="text-slate-600">
            Select how you'd like to pay for your credits
          </p>
        </div>

        {/* Package Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-slate-200 mb-8"
        >
          <h3 className="font-semibold text-slate-900 mb-4">Your Order</h3>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-slate-900">{packageData?.name}</div>
              <div className="text-sm text-slate-500">{packageData?.credits} credits</div>
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              ${packageData?.price}
            </div>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-8"
        >
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => handleMethodSelect(method.id)}
              className={`bg-white rounded-xl p-6 border-2 cursor-pointer transition-all hover:shadow-lg transform hover:scale-105 ${
                selectedMethod === method.id 
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg' 
                  : 'border-slate-200 hover:border-emerald-300'
              } ${!method.available ? 'opacity-50 cursor-not-allowed hover:transform-none hover:scale-100' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg mr-4 ${
                    selectedMethod === method.id 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {method.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{method.name}</div>
                    <div className="text-sm text-slate-500">{method.description}</div>
                    {!method.available && (
                      <div className="text-xs text-red-500 mt-1">Currently unavailable</div>
                    )}
                  </div>
                </div>
                {selectedMethod === method.id && (
                  <Check className="w-6 h-6 text-emerald-500" />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-slate-500"
        >
          Select a payment method to continue to the next step
        </motion.div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={handleCloseConfirmation}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleCloseConfirmation}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Confirmation Content */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    {getMethodIcon(selectedMethod)}
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold text-slate-900 mb-2"
                  >
                    Confirm Payment Method
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-600 mb-6"
                  >
                    You selected <span className="font-semibold text-emerald-600">{getMethodName(selectedMethod)}</span> to purchase <span className="font-semibold">{packageData?.name}</span> for <span className="font-semibold text-emerald-600">${packageData?.price}</span>
                  </motion.p>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirm}
                      disabled={confirming}
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50"
                    >
                      {confirming ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Check className="w-5 h-5 mr-2" />
                          Continue to Payment Details
                        </div>
                      )}
                    </motion.button>

                    <button
                      onClick={handleCloseConfirmation}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition-all"
                    >
                      Choose Different Method
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PaymentMethodSelection;