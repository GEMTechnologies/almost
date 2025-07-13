import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  ArrowLeft,
  Shield,
  Lock,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import PayPalButton from '../../components/PayPalButton';
import PaymentConfirmation from './PaymentConfirmation';

const PaymentDetails: React.FC = () => {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
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
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Check form validity based on payment method
    let isValid = false;
    if (paymentMethod === 'card') {
      isValid = newFormData.cardNumber.length >= 16 && 
                newFormData.expiryDate.length >= 5 && 
                newFormData.cvv.length >= 3 && 
                newFormData.cardName.length >= 2;
    } else if (paymentMethod === 'mobile-money') {
      isValid = newFormData.phoneNumber.length >= 10;
    } else if (paymentMethod === 'paypal') {
      isValid = true; // PayPal email is optional
    }
    setIsFormValid(isValid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    // Show confirmation popup instead of immediate processing
    setShowConfirmation(true);
  };

  // Handle saved payment method clicks
  const handleSavedMethodClick = async (savedMethodId: string, phoneNumber: string) => {
    console.log('Saved payment method clicked:', { savedMethodId, phoneNumber });
    
    // Show confirmation popup with saved method details
    setFormData(prev => ({ ...prev, phoneNumber }));
    setShowConfirmation(true);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    
    try {
      if (paymentMethod === 'paypal') {
        // For PayPal, create order and redirect
        const response = await fetch('/api/paypal/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: packageData?.price?.toString() || "10",
            currency: "USD",
            intent: "CAPTURE"
          })
        });
        
        const orderData = await response.json();
        if (orderData.id) {
          // Redirect to PayPal
          window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${orderData.id}`;
          return;
        }
      } else if (paymentMethod === 'mobile-money') {
        // For mobile money, use PesaPal
        // Handle saved payment method for mobile money
        const isSavedMethod = formData.phoneNumber.includes('***');
        const actualPhoneNumber = isSavedMethod ? 
          selectedSavedMethod?.phoneNumber || formData.phoneNumber : 
          formData.phoneNumber;
          
        console.log('Processing PesaPal mobile money payment:', {
          isSavedMethod,
          phoneNumber: actualPhoneNumber,
          amount: packageData?.price,
          packageId
        });

        const response = await fetch('/api/pesapal/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: packageData?.price?.toString() || "10",
            currency: "UGX",
            description: `Granada Credits - ${packageData?.name || 'Package'}`,
            phone_number: actualPhoneNumber,
            email_address: formData.email || "user@example.com",
            first_name: formData.fullName?.split(' ')[0] || "Customer",
            last_name: formData.fullName?.split(' ')[1] || "User",
            package_id: packageId,
            credits: packageData?.credits || 0,
            user_id: 'demo-user-1',
            saved_method_id: isSavedMethod ? selectedSavedMethod?.id : null
          })
        });
        
        const orderData = await response.json();
        
        console.log('PesaPal API Response:', orderData);
        
        if (orderData.success && orderData.redirect_url) {
          // Log transaction details for database sync
          console.log('PesaPal transaction initiated:', {
            transactionId: orderData.transaction_id,
            orderTrackingId: orderData.order_tracking_id,
            phoneNumber: actualPhoneNumber,
            amount: packageData?.price
          });
          
          // Redirect to PesaPal payment page
          window.location.href = orderData.redirect_url;
          return;
        } else {
          // Handle PesaPal API errors
          console.error('PesaPal order creation failed:', orderData);
          throw new Error(orderData.error || 'Failed to create PesaPal order');
        }
      } else {
        // For cards, simulate processing
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
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
      
      // Show specific error message for PesaPal configuration issues
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      
      if (errorMessage.includes('not configured') || errorMessage.includes('authenticate')) {
        alert(`Payment Error: ${errorMessage}\n\nNote: This requires valid PesaPal credentials to process real transactions. Currently showing demo success but no real money is being processed.`);
        
        // For demo purposes, still navigate to success to show the flow
        navigate(`/purchase/${packageId}/success`, {
          state: {
            package: packageData,
            paymentMethod,
            returnUrl,
            transactionId: 'DEMO_' + Date.now(),
            demoMode: true
          }
        });
        return;
      }
      
      navigate(`/purchase/${packageId}/failed`, {
        state: {
          package: packageData,
          paymentMethod,
          returnUrl,
          error: errorMessage
        }
      });
    } finally {
      setLoading(false);
      setShowConfirmation(false);
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
              <div className="relative">
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10 transition-all"
                  required
                />
                {formData.cardNumber.length >= 16 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </motion.div>
                )}
              </div>
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
          <div className="space-y-6">
            {/* Saved Mobile Payment Methods */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-700">Saved Mobile Money</h4>
              <div className="space-y-2">
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleSavedMethodClick('mtn_saved_1', '+256701234567')}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-emerald-300 bg-slate-50"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <Smartphone className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">MTN Mobile Money</div>
                      <div className="text-xs text-slate-500">+256 701 ***567</div>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-600 font-medium">Default</div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleSavedMethodClick('airtel_saved_1', '+256705678123')}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-emerald-300"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <Smartphone className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Airtel Money</div>
                      <div className="text-xs text-slate-500">+256 705 ***123</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Add New Mobile Money */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Add New Mobile Money</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+256 700 000 000"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10 transition-all"
                      required
                    />
                    {formData.phoneNumber.length >= 10 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </motion.div>
                    )}
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Smartphone className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800 font-medium mb-1">Mobile Money Payment</p>
                      <p className="text-xs text-amber-700">
                        You'll receive a prompt on your phone to authorize the payment. 
                        Supported: MTN Mobile Money, Airtel Money, Uganda Telecom.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'paypal':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                PayPal Email (Optional)
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                
                <motion.button
                  type="submit"
                  disabled={loading || !isFormValid}
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                  className={`w-full mt-6 font-semibold py-4 rounded-xl transition-all relative overflow-hidden ${
                    isFormValid && !loading
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center"
                      >
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing Payment...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center"
                      >
                        {isFormValid ? (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Complete Purchase ${packageData?.price}
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5 mr-2" />
                            Complete Payment Form
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
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

      {/* Payment Confirmation Popup */}
      <PaymentConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmPayment}
        paymentMethod={paymentMethod}
        packageData={packageData}
        formData={formData}
        loading={loading}
      />
    </div>
  );
};

export default PaymentDetails;