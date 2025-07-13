import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  Check, 
  Star, 
  Shield, 
  Zap,
  Crown,
  Gift,
  Clock,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  popular?: boolean;
  savings?: string;
  features: string[];
  color: string;
  icon: React.ReactNode;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
}

const BillingSystem: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('starter');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const pricingPlans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 10,
      credits: 100,
      features: ['100 AI Credits', 'Basic Support', 'Standard Processing'],
      color: 'from-gray-500 to-gray-600',
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 25,
      credits: 300,
      popular: true,
      savings: 'Most Popular',
      features: ['300 AI Credits', 'Priority Support', 'Fast Processing', 'Email Templates'],
      color: 'from-emerald-500 to-emerald-600',
      icon: <Star className="w-6 h-6" />
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 50,
      credits: 700,
      savings: 'Best Value',
      features: ['700 AI Credits', '24/7 Support', 'Premium Processing', 'Custom Templates', 'Analytics'],
      color: 'from-blue-500 to-blue-600',
      icon: <Crown className="w-6 h-6" />
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 100,
      credits: 1500,
      savings: '50% Bonus',
      features: ['1500 AI Credits', 'Dedicated Support', 'Priority Processing', 'Custom Integration', 'Advanced Analytics', 'API Access'],
      color: 'from-purple-500 to-purple-600',
      icon: <Shield className="w-6 h-6" />
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Visa, Mastercard, American Express',
      enabled: true
    },
    {
      id: 'mobile',
      name: 'Mobile Money',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'M-Pesa, Airtel Money, MTN Money',
      enabled: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Pay with your PayPal account',
      enabled: true
    }
  ];

  const selectedPlanData = pricingPlans.find(plan => plan.id === selectedPlan);
  const totalPrice = (selectedPlanData?.price || 0) * quantity;
  const totalCredits = (selectedPlanData?.credits || 0) * quantity;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Navigate to payment processing
      window.location.href = '/payment/process';
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Choose Your Plan
          </motion.h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Select the perfect plan for your needs. All plans include AI-powered proposal generation, 
            donor matching, and professional support.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Pricing Plans */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    selectedPlan === plan.id 
                      ? 'border-emerald-500 shadow-lg ring-4 ring-emerald-500/20' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}

                  {plan.savings && !plan.popular && (
                    <div className="absolute -top-3 right-4">
                      <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {plan.savings}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center mb-4">
                    <div className={`p-3 bg-gradient-to-r ${plan.color} rounded-xl text-white mr-4`}>
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-slate-900">${plan.price}</span>
                        <span className="text-slate-500 ml-1">USD</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center text-emerald-600 mb-2">
                      <Gift className="w-4 h-4 mr-2" />
                      <span className="font-semibold">{plan.credits.toLocaleString()} Credits</span>
                    </div>
                    <div className="text-sm text-slate-500">
                      ${(plan.price / plan.credits).toFixed(3)} per credit
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-slate-600">
                        <Check className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center">
                    {selectedPlan === plan.id ? (
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-slate-300 rounded-full" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary & Payment */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg sticky top-6"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>

              {/* Plan Summary */}
              <div className="border rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900">{selectedPlanData?.name} Plan</span>
                  <span className="text-slate-600">${selectedPlanData?.price}</span>
                </div>
                <div className="text-sm text-emerald-600 mb-3">
                  {selectedPlanData?.credits.toLocaleString()} AI Credits included
                </div>
                
                {/* Quantity Selector */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Quantity</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">Payment Method</h4>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => method.enabled && setPaymentMethod(method.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                      } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-slate-600 mr-3">{method.icon}</div>
                          <div>
                            <div className="font-medium text-slate-900">{method.name}</div>
                            <div className="text-xs text-slate-500">{method.description}</div>
                          </div>
                        </div>
                        {paymentMethod === method.id && (
                          <Check className="w-5 h-5 text-emerald-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold">${totalPrice}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Credits</span>
                  <span className="text-emerald-600 font-semibold">{totalCredits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>${totalPrice} USD</span>
                </div>
              </div>

              {/* Purchase Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePurchase}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Complete Purchase
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </div>
                )}
              </motion.button>

              {/* Security Notice */}
              <div className="mt-4 flex items-center justify-center text-xs text-slate-500">
                <Shield className="w-4 h-4 mr-1" />
                Secure SSL encrypted payment
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-white rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">What You Get</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">AI-Powered Proposals</h4>
              <p className="text-slate-600">Generate professional funding proposals with advanced AI technology</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Smart Donor Matching</h4>
              <p className="text-slate-600">Find the perfect donors and funding opportunities for your organization</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">24/7 Support</h4>
              <p className="text-slate-600">Get help whenever you need it with our dedicated support team</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BillingSystem;