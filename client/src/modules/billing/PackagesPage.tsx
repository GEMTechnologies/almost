import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Zap, 
  Star, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Gift,
  TrendingUp,
  Shield,
  Rocket,
  Diamond,
  Award
} from 'lucide-react';

interface Package {
  id: string;
  name: string;
  credits: number;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  badge?: string;
  badgeColor?: string;
  gradient?: string;
  icon?: any;
  popular?: boolean;
  savings?: number;
}

const PackagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      const response = await fetch('/api/billing/balance?userId=demo-user-1');
      const data = await response.json();
      if (data.success) {
        setUserBalance(data.balance);
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const packages: Package[] = [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 50,
      price: 9.99,
      originalPrice: 14.99,
      description: 'Perfect for getting started with basic proposals',
      features: [
        '50 AI proposal generations',
        'Basic templates library',
        'Email support',
        'Standard processing speed'
      ],
      badge: 'BEST VALUE',
      badgeColor: 'bg-emerald-500',
      gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
      icon: Zap,
      savings: 33
    },
    {
      id: 'professional',
      name: 'Professional',
      credits: 150,
      price: 24.99,
      originalPrice: 39.99,
      description: 'Ideal for active NGOs and growing organizations',
      features: [
        '150 AI proposal generations',
        'Premium templates & tools',
        'Priority support',
        'Advanced analytics',
        'Document collaboration',
        'Export to multiple formats'
      ],
      badge: 'MOST POPULAR',
      badgeColor: 'bg-blue-500',
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      icon: Star,
      popular: true,
      savings: 37
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      credits: 400,
      price: 59.99,
      originalPrice: 99.99,
      description: 'For large organizations with extensive funding needs',
      features: [
        '400 AI proposal generations',
        'All premium features',
        'Dedicated account manager',
        'Custom templates',
        'Team collaboration tools',
        'API access',
        'Advanced compliance tools',
        'Custom integrations'
      ],
      badge: 'PREMIUM',
      badgeColor: 'bg-purple-500',
      gradient: 'from-purple-400 via-purple-500 to-purple-600',
      icon: Crown,
      savings: 40
    },
    {
      id: 'unlimited',
      name: 'Unlimited Pro',
      credits: 1000,
      price: 99.99,
      originalPrice: 199.99,
      description: 'Ultimate package for major NGOs and consultancies',
      features: [
        '1000 AI proposal generations',
        'Unlimited document storage',
        'White-label solutions',
        '24/7 premium support',
        'Advanced AI models',
        'Custom workflow automation',
        'Multi-language support',
        'Compliance certification',
        'Training & onboarding'
      ],
      badge: 'ULTIMATE',
      badgeColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      icon: Diamond,
      savings: 50
    }
  ];

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    const selectedPkg = packages.find(p => p.id === packageId);
    if (selectedPkg) {
      navigate(`/purchase/${packageId}/method`, {
        state: {
          package: selectedPkg,
          returnUrl: '/billing'
        }
      });
    }
  };

  const PackageCard: React.FC<{ pkg: Package; index: number }> = ({ pkg, index }) => {
    const IconComponent = pkg.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
          pkg.popular ? 'border-blue-500 scale-105' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        {/* Popular Badge */}
        {pkg.popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
              ⭐ MOST POPULAR
            </div>
          </div>
        )}

        {/* Package Badge */}
        {pkg.badge && (
          <div className="absolute top-4 right-4">
            <div className={`${pkg.badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold shadow-md`}>
              {pkg.badge}
            </div>
          </div>
        )}

        <div className="p-6 pt-8">
          {/* Icon and Savings */}
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${pkg.gradient} shadow-lg`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            {pkg.savings && (
              <div className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-sm font-semibold">
                Save {pkg.savings}%
              </div>
            )}
          </div>

          {/* Package Info */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
            <p className="text-slate-600 text-sm mb-4">{pkg.description}</p>
            
            {/* Pricing */}
            <div className="flex items-baseline mb-2">
              <span className="text-3xl font-bold text-slate-900">${pkg.price}</span>
              {pkg.originalPrice && (
                <span className="text-lg text-slate-400 line-through ml-2">${pkg.originalPrice}</span>
              )}
            </div>
            
            {/* Credits */}
            <div className="flex items-center text-emerald-600 font-semibold">
              <Sparkles className="w-4 h-4 mr-1" />
              {pkg.credits} Credits
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {pkg.features.map((feature, idx) => (
              <div key={idx} className="flex items-start">
                <Check className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Purchase Button */}
          <motion.button
            onClick={() => handlePackageSelect(pkg.id)}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 flex items-center justify-center ${
              pkg.popular 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                : `bg-gradient-to-r ${pkg.gradient} hover:shadow-xl`
            }`}
          >
            {loading && selectedPackage === pkg.id ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Get Package
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Credit Packages</h1>
              <p className="text-slate-600 mt-1">Choose the perfect package for your organization</p>
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

      {/* Trust Indicators */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Shield, title: '256-bit SSL', subtitle: 'Secure Payments' },
            { icon: Award, title: '30-day', subtitle: 'Money Back' },
            { icon: TrendingUp, title: '99.9%', subtitle: 'Uptime SLA' },
            { icon: Gift, title: 'No Hidden', subtitle: 'Fees' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-md text-center"
            >
              <item.icon className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <div className="font-semibold text-slate-900">{item.title}</div>
              <div className="text-sm text-slate-600">{item.subtitle}</div>
            </motion.div>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {packages.map((pkg, index) => (
            <PackageCard key={pkg.id} pkg={pkg} index={index} />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: 'How do credits work?',
                a: 'Each credit allows you to generate one AI-powered proposal section. Credits never expire and can be used for any feature.'
              },
              {
                q: 'Can I upgrade my package?',
                a: 'Yes! You can upgrade at any time. Unused credits from your current package will be added to your new package.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and mobile money payments (MTN, Airtel Money).'
              },
              {
                q: 'Is there a refund policy?',
                a: '30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your purchase within 30 days.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="font-semibold text-slate-900">{faq.q}</h4>
                <p className="text-slate-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;