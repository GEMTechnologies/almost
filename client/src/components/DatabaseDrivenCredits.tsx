/**
 * Database-Driven Credits Page
 * All package data loaded from database, fully editable from backend
 */
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  Star, 
  Sparkles, 
  ArrowRight,
  Check,
  Zap,
  Crown,
  Award,
  Target
} from 'lucide-react';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular: boolean;
  bonus_credits: number;
  description: string;
  features: string[];
  badge_text: string | null;
  is_active: boolean;
}

const DatabaseDrivenCredits: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  // Fetch packages from database
  const { data: packagesResponse, isLoading, error } = useQuery({
    queryKey: ['/api/credit-packages'],
    queryFn: async () => {
      const response = await fetch('/api/credit-packages');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('API Response:', data);
      return data;
    },
    refetchInterval: 30000 // Refetch every 30 seconds to get DB updates
  });

  // Fetch user balance from auth profile
  const { data: userProfile } = useQuery({
    queryKey: ['/api/auth/profile'],
    queryFn: async () => {
      const response = await fetch('/api/auth/profile');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    }
  });

  const userBalance = userProfile?.user?.credits || 0;

  const packages = packagesResponse?.packages || [];

  // Debug logging
  console.log('Packages Response:', packagesResponse);
  console.log('Packages Array:', packages);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'basic': return <Target className="w-6 h-6" />;
      case 'starter': return <Sparkles className="w-6 h-6" />;
      case 'professional': return <Crown className="w-6 h-6" />;
      case 'enterprise': return <Award className="w-6 h-6" />;
      case 'unlimited': return <Zap className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  const getPackageColor = (packageId: string) => {
    switch (packageId) {
      case 'basic': return 'from-blue-500 to-cyan-500';
      case 'starter': return 'from-green-500 to-emerald-500';
      case 'professional': return 'from-purple-500 to-violet-500';
      case 'enterprise': return 'from-orange-500 to-red-500';
      case 'unlimited': return 'from-pink-500 to-rose-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const handlePurchase = (packageData: CreditPackage) => {
    setSelectedPackage(packageData.id);
    
    // Navigate to purchase page with correct package data
    navigate(`/purchase/${packageData.id}`, {
      state: {
        package: packageData,
        returnUrl: '/credits'
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading credit packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading packages: {(error as Error).message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!packages || packages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">No credit packages available</p>
          <p className="text-sm text-slate-500 mt-2">Response: {JSON.stringify(packagesResponse)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Credit Packages</h1>
              <p className="text-slate-600 mt-1">Choose the perfect package for your organization</p>
              <p className="text-sm text-emerald-600 mt-2">✨ Packages updated from database in real-time</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600">Current Balance</div>
              <div className="text-2xl font-bold text-emerald-600 flex items-center">
                <Sparkles className="w-5 h-5 mr-1" />
                {userBalance} Credits
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {packages.map((pkg: CreditPackage, index: number) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                pkg.popular ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-slate-200 hover:border-emerald-300'
              } ${selectedPackage === pkg.id ? 'ring-4 ring-emerald-300' : ''}`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Badge Text */}
              {pkg.badge_text && !pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {pkg.badge_text}
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Package Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${getPackageColor(pkg.id)} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto`}>
                  {getPackageIcon(pkg.id)}
                </div>

                {/* Package Name */}
                <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                  {pkg.name}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm text-center mb-4">
                  {pkg.description}
                </p>

                {/* Credits */}
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-slate-900">
                    {pkg.credits.toLocaleString()}
                  </div>
                  {pkg.bonus_credits > 0 && (
                    <div className="text-emerald-600 font-semibold">
                      +{pkg.bonus_credits} Bonus
                    </div>
                  )}
                  <div className="text-slate-500 text-sm">Credits</div>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-emerald-600">
                    ${typeof pkg.price === 'string' ? pkg.price : pkg.price.toFixed(2)}
                  </div>
                  <div className="text-slate-500 text-sm">
                    ${(parseFloat(pkg.price.toString()) / (pkg.credits + pkg.bonus_credits) * 100).toFixed(2)} per 100 credits
                  </div>
                </div>

                {/* Features */}
                {pkg.features && pkg.features.length > 0 && (
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {pkg.features.slice(0, 3).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm text-slate-600">
                          <Check className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Purchase Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePurchase(pkg)}
                  disabled={selectedPackage === pkg.id}
                  className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${
                    pkg.popular
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  } ${selectedPackage === pkg.id ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {selectedPackage === pkg.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Purchase Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <Shield className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-semibold text-slate-900">256-bit SSL</div>
            <div className="text-sm text-slate-600">Secure payments</div>
          </div>
          <div className="text-center">
            <CreditCard className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-semibold text-slate-900">Multiple Methods</div>
            <div className="text-sm text-slate-600">Cards & Mobile Money</div>
          </div>
          <div className="text-center">
            <Smartphone className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-semibold text-slate-900">Mobile Friendly</div>
            <div className="text-sm text-slate-600">M-Pesa, Airtel Money</div>
          </div>
          <div className="text-center">
            <Star className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-semibold text-slate-900">30-Day Guarantee</div>
            <div className="text-sm text-slate-600">Money back promise</div>
          </div>
        </div>

        {/* Database Update Notice */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <div className="text-blue-900 font-semibold mb-2">
            📊 Database-Driven Packages
          </div>
          <div className="text-blue-700 text-sm">
            All package information is loaded from the database in real-time. 
            Admin can update prices, credits, and features directly in the database.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseDrivenCredits;