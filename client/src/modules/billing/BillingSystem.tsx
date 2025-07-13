import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  Gem,
  ArrowRight,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface CreditPackage {
  id: string;
  name: string;
  price: number;
  credits: number;
  popular?: boolean;
  bonus?: number;
}

const BillingSystem: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const creditPackages: CreditPackage[] = [
    {
      id: 'basic',
      name: 'Basic Pack',
      price: 10,
      credits: 100
    },
    {
      id: 'starter',
      name: 'Starter Pack',
      price: 25,
      credits: 300,
      bonus: 25
    },
    {
      id: 'professional',
      name: 'Professional Pack',
      price: 50,
      credits: 700,
      popular: true,
      bonus: 100
    },
    {
      id: 'enterprise',
      name: 'Enterprise Pack',
      price: 100,
      credits: 1500,
      bonus: 300
    }
  ];

  const handlePurchase = async (packageId: string) => {
    setLoading(packageId);
    try {
      const selectedPackage = creditPackages.find(pkg => pkg.id === packageId);
      // Navigate to payment method selection with package data
      navigate(`/purchase/${packageId}/method`, {
        state: {
          package: selectedPackage,
          returnUrl: window.location.pathname
        }
      });
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-900 mb-2"
          >
            Buy Credits
          </motion.h1>
          <p className="text-slate-600">
            Top up your account with AI credits to continue using our services
          </p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
            <div className="flex items-center text-blue-800">
              <Gem className="w-5 h-5 mr-2" />
              <span className="font-semibold">Current Balance: </span>
              <span className="ml-1">{user?.credits || 0} credits</span>
            </div>
          </div>
        </div>

        {/* Credit Packages */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {creditPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all relative"
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    POPULAR
                  </div>
                </div>
              )}

              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">{pkg.name}</div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">${pkg.price}</div>
                
                <div className="mb-4">
                  <div className="text-lg font-semibold text-slate-700">
                    {pkg.credits.toLocaleString()} credits
                  </div>
                  {pkg.bonus && (
                    <div className="text-sm text-green-600 font-medium">
                      +{pkg.bonus} bonus credits
                    </div>
                  )}
                </div>

                <div className="text-sm text-slate-500 mb-6">
                  ${(pkg.price / pkg.credits).toFixed(3)} per credit
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={loading === pkg.id}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    pkg.popular 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === pkg.id ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Loading...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </div>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 border border-slate-200"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">Accepted Payment Methods</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center p-4 bg-slate-50 rounded-lg">
              <CreditCard className="w-6 h-6 text-slate-600 mr-3" />
              <div>
                <div className="font-medium text-slate-900">Credit/Debit Cards</div>
                <div className="text-sm text-slate-500">Visa, Mastercard, Amex</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-slate-50 rounded-lg">
              <Smartphone className="w-6 h-6 text-slate-600 mr-3" />
              <div>
                <div className="font-medium text-slate-900">Mobile Money</div>
                <div className="text-sm text-slate-500">M-Pesa, Airtel, MTN</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-slate-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-slate-600 mr-3" />
              <div>
                <div className="font-medium text-slate-900">PayPal</div>
                <div className="text-sm text-slate-500">Secure online payment</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Credit Usage Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-4 text-center">How Credits Work</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">5</div>
              <div className="text-sm text-blue-800">credits per AI proposal</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">15</div>
              <div className="text-sm text-blue-800">credits per donor search</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">10</div>
              <div className="text-sm text-blue-800">credits per document review</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BillingSystem;