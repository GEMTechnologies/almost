import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gem, 
  Search, 
  Download, 
  ArrowLeft,
  FileText,
  CreditCard,
  Wallet,
  Shield,
  Check,
  Star,
  Crown,
  Zap,
  Award,
  TrendingUp,
  Clock,
  Users,
  Globe,
  Sparkles,
  Gift,
  Target,
  ChevronRight,
  Infinity,
  BarChart3,
  Calendar,
  Plus,
  Minus,
  Eye,
  History,
  Settings,
  CheckCircle2,
  Rocket,
  Bolt,
  Coins,
  Menu,
  X,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  bonus?: number;
  features: string[];
  savings?: string;
  color: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
  pesapalSupported?: boolean;
}

const CreditsMobile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<string>('professional');
  const [activeTab, setActiveTab] = useState<'packages' | 'history'>('packages');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch real transaction history from backend
  const { data: transactionHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ['/api/credits/transactions'],
    enabled: activeTab === 'history'
  });

  // Fetch real user credits from backend
  const { data: userCredits, isLoading: creditsLoading } = useQuery({
    queryKey: ['/api/credits/balance']
  });

  const packages: CreditPackage[] = [
    {
      id: 'starter',
      name: 'Starter',
      credits: 100,
      price: 12,
      color: 'from-blue-500 via-cyan-500 to-teal-500',
      icon: <Target className="w-5 h-5" />,
      description: 'Perfect for small NGOs',
      badge: 'Beginner',
      pesapalSupported: true,
      features: [
        '20 AI proposals',
        '6 donor searches', 
        'Email support',
        '30-day validity',
        'PDF export',
        'Mobile money'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      credits: 500,
      price: 49,
      bonus: 75,
      popular: true,
      savings: 'Save 25%',
      color: 'from-emerald-500 via-green-500 to-teal-600',
      icon: <Crown className="w-5 h-5" />,
      description: 'Most popular for active NGOs',
      badge: 'Most Popular',
      pesapalSupported: true,
      features: [
        '100+ AI proposals',
        '35+ donor searches',
        'Priority support',
        '90-day validity',
        'Advanced templates',
        'Multiple exports',
        'Analytics dashboard',
        'Mobile money'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      credits: 1200,
      price: 89,
      bonus: 300,
      savings: 'Save 35%',
      color: 'from-purple-500 via-violet-500 to-indigo-600',
      icon: <Zap className="w-5 h-5" />,
      description: 'Power solution for growth',
      badge: 'Best Value',
      pesapalSupported: true,
      features: [
        '240+ AI proposals',
        '80+ donor searches',
        '24/7 support',
        '6-month validity',
        'Custom templates',
        'Advanced analytics',
        'API access',
        'Team collaboration',
        'Mobile money'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      credits: 3000,
      price: 199,
      bonus: 1000,
      savings: 'Save 45%',
      color: 'from-orange-500 via-red-500 to-pink-600',
      icon: <Award className="w-5 h-5" />,
      description: 'Complete enterprise solution',
      badge: 'Enterprise',
      pesapalSupported: true,
      features: [
        'Unlimited proposals',
        'Unlimited searches',
        'Account manager',
        '1-year validity',
        'Custom integrations',
        'Team management',
        'Feature requests',
        'Training sessions',
        'Mobile money'
      ]
    }
  ];

  const handlePurchase = async (packageId: string) => {
    const selectedPkg = packages.find(p => p.id === packageId);
    if (!selectedPkg) return;

    // Ultra-direct payment - straight to Pesapal
    try {
      const response = await fetch('/api/payments/pesapal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId,
          userId: user?.id || 'mobile-user',
          userEmail: user?.email || 'mobile@user.com',
          userName: user?.fullName || 'Mobile User',
          userPhone: '+254712345678'
        })
      });
      
      const data = await response.json();
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const getCreditsPerDollar = (pkg: CreditPackage) => {
    const totalCredits = pkg.credits + (pkg.bonus || 0);
    return Math.round(totalCredits / pkg.price);
  };

  const creditUsageExamples = [
    {
      action: 'AI Proposal',
      credits: 5,
      icon: <FileText className="w-5 h-5" />,
      description: 'Generate professional proposals',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      action: 'Donor Search',
      credits: 15,
      icon: <Search className="w-5 h-5" />,
      description: 'Find funding opportunities',
      color: 'from-emerald-500 to-green-500'
    },
    {
      action: 'Submit App',
      credits: 15,
      icon: <Download className="w-5 h-5" />,
      description: 'Submit to donor portals',
      color: 'from-purple-500 to-violet-500'
    },
    {
      action: 'Review',
      credits: 10,
      icon: <Shield className="w-5 h-5" />,
      description: 'Professional analysis',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/50 p-4">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>
          
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 backdrop-blur-xl px-4 py-2 rounded-2xl border border-emerald-500/30">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Gem className="w-5 h-5 text-emerald-400" />
            </motion.div>
            <div>
              <span className="text-xs text-slate-400">Credits</span>
              <div className="font-bold text-lg text-white">
                {creditsLoading ? '...' : userCredits?.balance || 150}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Hero */}
        <div className="text-center mt-6 mb-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
          >
            Granada Credits
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-slate-300 leading-relaxed"
          >
            AI-powered funding success for African NGOs
          </motion.p>
        </div>
      </div>

      {/* Mobile Stats Grid */}
      <div className="p-4">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {[
            { label: 'Success Rate', value: '96%', icon: TrendingUp, color: 'from-emerald-500 to-green-500' },
            { label: 'Proposals', value: '75K+', icon: FileText, color: 'from-blue-500 to-cyan-500' },
            { label: 'Funding', value: '$2.5B', icon: Target, color: 'from-purple-500 to-violet-500' },
            { label: 'NGOs', value: '3,200+', icon: Users, color: 'from-orange-500 to-red-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-r ${stat.color} p-4 rounded-2xl backdrop-blur-xl border border-white/10 shadow-xl`}
            >
              <stat.icon className="w-5 h-5 text-white mb-2" />
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-1 border border-slate-700/50">
            <div className="flex gap-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('packages')}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === 'packages'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-300'
                }`}
              >
                <Coins className="w-4 h-4 inline mr-2" />
                Buy Credits
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === 'history'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-300'
                }`}
              >
                <History className="w-4 h-4 inline mr-2" />
                History
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'packages' && (
            <motion.div
              key="packages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Mobile Credit Usage Guide */}
              <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    How Credits Work
                  </h3>
                  <p className="text-sm text-slate-300">Every action powered by AI intelligence</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {creditUsageExamples.map((example, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="group relative"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${example.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                      <div className="relative bg-slate-800/50 backdrop-blur-xl p-4 rounded-2xl border border-slate-700/50 h-full">
                        <div className={`w-12 h-12 bg-gradient-to-r ${example.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                          {example.icon}
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold text-sm">{example.action}</h4>
                          <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-1 rounded-full">
                            <Gem className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold text-xs">{example.credits}</span>
                          </div>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">{example.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mobile Pricing Packages */}
              <div className="space-y-4">
                {packages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`group relative ${pkg.popular ? 'scale-105' : ''}`}
                  >
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${pkg.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                    
                    {/* Package Card */}
                    <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
                      {pkg.popular && (
                        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-2 text-center">
                          <span className="text-white font-bold text-xs">🌟 {pkg.badge}</span>
                        </div>
                      )}

                      <div className="p-5">
                        {/* Package Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-r ${pkg.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                              {pkg.icon}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">
                              ${pkg.price}
                            </div>
                            <div className="flex items-center gap-1">
                              <Gem className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-bold text-sm">
                                {pkg.credits.toLocaleString()}
                              </span>
                              {pkg.bonus && (
                                <span className="text-green-400 font-semibold text-xs bg-green-500/20 px-2 py-1 rounded-full border border-green-500/30">
                                  +{pkg.bonus}
                                </span>
                              )}
                            </div>
                            {pkg.savings && (
                              <div className="text-orange-400 font-semibold text-xs bg-orange-500/20 px-2 py-1 rounded-full border border-orange-500/30 mt-1">
                                {pkg.savings}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Just spacing for minimal design */}
                        <div className="mb-4"></div>

                        {/* Purchase Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handlePurchase(pkg.id)}
                          className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-xl bg-gradient-to-r ${pkg.color} hover:shadow-2xl text-lg`}
                        >
                          ${pkg.price}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Payment Methods */}
              <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Payment Methods
                  </h3>
                  <p className="text-sm text-slate-300">Secure payments for African markets</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'M-Pesa', icon: <Smartphone className="w-6 h-6" />, color: 'from-green-500 to-green-600', supported: true },
                    { name: 'Airtel Money', icon: <Wallet className="w-6 h-6" />, color: 'from-red-500 to-red-600', supported: true },
                    { name: 'Credit Cards', icon: <CreditCard className="w-6 h-6" />, color: 'from-blue-500 to-blue-600', supported: true },
                    { name: 'Bank Transfer', icon: <Shield className="w-6 h-6" />, color: 'from-purple-500 to-purple-600', supported: true }
                  ].map((method, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="text-center p-4 bg-slate-800/50 rounded-xl shadow-lg border border-slate-700/50 hover:shadow-xl transition-all"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center text-white mx-auto mb-3`}>
                        {method.icon}
                      </div>
                      <p className="text-slate-200 font-semibold text-sm">{method.name}</p>
                      {method.supported && (
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                          <span className="text-green-400 text-xs">Supported</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  Transaction History
                </h3>
                <p className="text-sm text-slate-300">Your credit purchases and usage</p>
              </div>

              {historyLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-slate-400 mt-2">Loading transactions...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactionHistory.map((transaction: any, index: number) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800/50 backdrop-blur-xl p-4 rounded-xl border border-slate-700/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-700/50 rounded-lg">
                            {transaction.type === 'purchase' && <CreditCard className="w-5 h-5 text-emerald-400" />}
                            {transaction.type === 'usage' && <Bolt className="w-5 h-5 text-orange-400" />}
                            {transaction.type === 'bonus' && <Gift className="w-5 h-5 text-purple-400" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white text-sm">{transaction.description}</h4>
                            <p className="text-slate-400 text-xs">
                              {new Date(transaction.timestamp).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            transaction.amount > 0 ? 'text-emerald-400' : 'text-orange-400'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                          </div>
                          <span className="text-emerald-400 text-xs font-medium bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-500/30">
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreditsMobile;