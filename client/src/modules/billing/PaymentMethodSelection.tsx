import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  ArrowLeft,
  ArrowRight,
  Check
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

  const handleContinue = () => {
    if (selectedMethod) {
      navigate(`/purchase/${packageId}/details`, {
        state: {
          package: packageData,
          paymentMethod: selectedMethod,
          returnUrl: location.state?.returnUrl || '/'
        }
      });
    }
  };

  const handleBack = () => {
    navigate('/credits');
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
              onClick={() => method.available && setSelectedMethod(method.id)}
              className={`bg-white rounded-xl p-6 border-2 cursor-pointer transition-all ${
                selectedMethod === method.id 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-slate-200 hover:border-slate-300'
              } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
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

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={handleContinue}
          disabled={!selectedMethod}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all"
        >
          <div className="flex items-center justify-center">
            Continue to Payment Details
            <ArrowRight className="w-5 h-5 ml-2" />
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default PaymentMethodSelection;