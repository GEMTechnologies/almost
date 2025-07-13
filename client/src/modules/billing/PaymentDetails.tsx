import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  ArrowLeft,
  Shield,
  Lock
} from 'lucide-react';

const PaymentDetails: React.FC = () => {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    phoneNumber: '',
    email: '',
    fullName: ''
  });

  const packageData = location.state?.package;
  const paymentMethod = location.state?.paymentMethod;
  const returnUrl = location.state?.returnUrl || '/';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page
      navigate(`/purchase/${packageId}/success`, {
        state: {
          package: packageData,
          paymentMethod,
          returnUrl,
          transactionId: 'TXN_' + Date.now()
        }
      });
    } catch (error) {
      console.error('Payment failed:', error);
      navigate(`/purchase/${packageId}/failed`, {
        state: {
          package: packageData,
          paymentMethod,
          returnUrl,
          error: 'Payment processing failed'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/purchase/${packageId}/method`, {
      state: { package: packageData, returnUrl }
    });
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.cardName}
                onChange={(e) => handleInputChange('cardName', e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>
        );
        
      case 'mobile-money':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+256 700 000 000"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>
        );
        
      case 'paypal':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                PayPal Email
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                You'll be redirected to PayPal to complete your payment securely.
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case 'card': return <CreditCard className="w-6 h-6" />;
      case 'mobile-money': return <Smartphone className="w-6 h-6" />;
      case 'paypal': return <DollarSign className="w-6 h-6" />;
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
            Back to Payment Method
          </button>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-900 mb-2"
          >
            Payment Details
          </motion.h1>
          <p className="text-slate-600">
            Enter your payment information to complete the purchase
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 border border-slate-200"
            >
              <div className="flex items-center mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                  {getPaymentIcon()}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {getPaymentMethodName()}
                </h3>
              </div>

              <form onSubmit={handleSubmit}>
                {renderPaymentForm()}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing Payment...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Lock className="w-5 h-5 mr-2" />
                      Complete Purchase ${packageData?.price}
                    </div>
                  )}
                </button>
              </form>
              
              <div className="mt-4 flex items-center justify-center text-xs text-slate-500">
                <Shield className="w-4 h-4 mr-1" />
                Your payment information is secure and encrypted
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 border border-slate-200"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Package</span>
                  <span className="font-medium">{packageData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Credits</span>
                  <span className="font-medium">{packageData?.credits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Method</span>
                  <span className="font-medium">{getPaymentMethodName()}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-emerald-600">${packageData?.price}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;