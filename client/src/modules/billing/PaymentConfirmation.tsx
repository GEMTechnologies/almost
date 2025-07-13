import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  X, 
  Shield,
  CheckCircle,
  ArrowRight,
  Lock
} from 'lucide-react';

interface PaymentConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  paymentMethod: string;
  packageData: any;
  formData: any;
  loading: boolean;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  paymentMethod,
  packageData,
  formData,
  loading
}) => {
  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case 'card': return <CreditCard className="w-6 h-6 text-blue-600" />;
      case 'mobile-money': return <Smartphone className="w-6 h-6 text-orange-600" />;
      case 'paypal': return <DollarSign className="w-6 h-6 text-blue-600" />;
      default: return <CreditCard className="w-6 h-6" />;
    }
  };

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case 'card': return 'Credit/Debit Card';
      case 'mobile-money': return 'Mobile Money';
      case 'paypal': return 'PayPal';
      default: return 'Payment';
    }
  };

  const getPaymentDetails = () => {
    switch (paymentMethod) {
      case 'card':
        return `Card ending in ${formData.cardNumber.slice(-4)}`;
      case 'mobile-money':
        return `Mobile: ${formData.phoneNumber}`;
      case 'paypal':
        return formData.email || 'PayPal Account';
      default:
        return '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Confirm Payment</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Payment Method */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-white rounded-lg mr-3 shadow-sm">
                  {getPaymentIcon()}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{getPaymentMethodName()}</h4>
                  <p className="text-sm text-slate-600">{getPaymentDetails()}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Package</span>
                <span className="font-semibold text-slate-900">{packageData?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Credits</span>
                <span className="font-semibold text-emerald-600">{packageData?.credits}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Amount</span>
                <span className="text-xl font-bold text-slate-900">${packageData?.price}</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-6">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-emerald-600 mr-2" />
                <p className="text-sm text-emerald-800">
                  Your payment is protected by enterprise-grade encryption
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <motion.button
                onClick={onConfirm}
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Payment
                  </div>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentConfirmation;