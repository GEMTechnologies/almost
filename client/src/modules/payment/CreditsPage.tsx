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
  Lightning,
  Coins,
  Menu,
  X
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
}

const CreditsPage: React.FC = () => {
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
      name: 'Starter Pack',
      credits: 100,
      price: 12,
      color: 'from-blue-500 via-cyan-500 to-teal-500',
      icon: <Target className="w-6 h-6" />,
      description: 'Perfect for small NGOs getting started',
      badge: 'Best for Beginners',
      features: [
        '20 AI proposal generations',
        '6 intelligent donor searches', 
        'Basic email support',
        '30-day credit validity',
        'PDF export functionality',
        'Basic templates library'
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
      icon: <Crown className="w-6 h-6" />,
      description: 'Most popular choice for active organizations',
      badge: 'Most Popular',
      features: [
        '100+ AI proposal generations',
        '35+ intelligent donor searches',
        'Priority chat support',
        '90-day credit validity',
        'Advanced proposal templates',
        'Export to multiple formats',
        'Analytics dashboard access',
        'Email marketing integration'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Plus',
      credits: 1200,
      price: 89,
      bonus: 300,
      savings: 'Save 35%',
      color: 'from-purple-500 via-violet-500 to-indigo-600',
      icon: <Zap className="w-6 h-6" />,
      description: 'Power user solution for growth-focused NGOs',
      badge: 'Best Value',
      features: [
        '240+ AI proposal generations',
        '80+ intelligent donor searches',
        '24/7 priority support',
        '6-month credit validity',
        'Custom branded templates',
        'Advanced analytics & insights',
        'API access for integrations',
        'Team collaboration tools',
        'White-label options'
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
      icon: <Award className="w-6 h-6" />,
      description: 'Complete solution for large organizations',
      badge: 'Enterprise Grade',
      features: [
        'Unlimited AI generations',
        'Unlimited donor searches',
        'Dedicated account manager',
        '1-year credit validity',
        'Custom integrations',
        'Advanced team management',
        'Priority feature requests',
        'Custom training sessions',
        'SLA guarantee'
      ]
    }
  ];

  const handlePurchase = async (packageId: string) => {
    // Direct purchase for mobile - no forms
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      const selectedPkg = packages.find(p => p.id === packageId);
      if (!selectedPkg) return;

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
      return;
    }

    try {
      // Track purchase attempt for admin
      await fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'credit_purchase_initiated',
          message: `User initiated purchase of ${packageId} credits package`,
          userDetails: {
            email: user?.email || 'unknown@example.com',
            organizationName: user?.fullName || 'Unknown Organization',
            packageId: packageId,
            creditAmount: packages.find(p => p.id === packageId)?.credits || 0,
            price: packages.find(p => p.id === packageId)?.price || 0
          },
          metadata: {
            component: 'CreditsPage',
            action: 'purchase_initiation',
            sessionId: Date.now().toString()
          }
        })
      });
      
      navigate(`/credits-purchase/${packageId}`);
    } catch (error) {
      console.error('Failed to track purchase:', error);
      navigate(`/credits-purchase/${packageId}`);
    }
  };



  const getCreditsPerDollar = (pkg: CreditPackage) => {
    const totalCredits = pkg.credits + (pkg.bonus || 0);
    return Math.round(totalCredits / pkg.price);
  };

  const creditUsageExamples = [
    {
      action: 'AI Proposal Generation',
      credits: 5,
      icon: <FileText className="w-6 h-6" />,
      description: 'Generate comprehensive, professional proposals with AI intelligence',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      action: 'Smart Donor Discovery',
      credits: 15,
      icon: <Search className="w-6 h-6" />,
      description: 'Find and match with relevant funding opportunities using AI algorithms',
      color: 'from-emerald-500 to-green-500'
    },
    {
      action: 'Application Submission',
      credits: 15,
      icon: <Download className="w-6 h-6" />,
      description: 'Submit applications to donor portals with AI optimization',
      color: 'from-purple-500 to-violet-500'
    },
    {
      action: 'Proposal Review & Analysis',
      credits: 10,
      icon: <Shield className="w-6 h-6" />,
      description: 'Get professional review and analysis of your proposals',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <CreditCard className="w-5 h-5 text-green-600" />;
      case 'usage':
        return <Zap className="w-5 h-5 text-orange-600" />;
      case 'bonus':
        return <Gift className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'bg-green-50 border-green-200';
      case 'usage':
        return 'bg-orange-50 border-orange-200';
      case 'bonus':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-xl"
        />
      </div>

      <div className="relative p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-6">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl shadow-lg"
            >
              <Gem className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Credits & Billing
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Power your funding journey with Expert intelligence</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </motion.button>
        </motion.div>

        {/* Current Credits - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur-xl opacity-20" />
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {user?.credits?.toLocaleString() || '0'}
                </div>
                <div className="text-xl text-gray-600 dark:text-gray-400 font-medium">Credits Available</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-2 mb-8 max-w-md mx-auto border border-white/20 dark:border-gray-700/20">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveTab('packages')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                activeTab === 'packages'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              Buy Credits
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              History
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'packages' && (
              <motion.div
                key="packages"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {/* Credit Usage Guide */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 shadow-xl">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                      How Credits Work
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Every action in Granada OS is powered by Expert intelligence</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {creditUsageExamples.map((example, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all"
                      >
                        <div className={`p-3 ${example.color} rounded-xl mb-4 w-fit group-hover:scale-110 transition-transform`}>
                          {example.icon}
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-gray-900 dark:text-white font-semibold">{example.action}</h4>
                          <div className="flex items-center space-x-1">
                            <Gem className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-600 font-bold text-lg">{example.credits}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{example.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Pricing Packages */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                  {packages.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className={`group relative cursor-pointer transition-all duration-300 ${
                        pkg.popular ? 'scale-105' : ''
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      {pkg.popular && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                        >
                          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold rounded-full shadow-lg">
                            <Crown className="w-4 h-4" />
                            <span>Most Popular</span>
                          </div>
                        </motion.div>
                      )}

                      {pkg.savings && (
                        <div className="absolute -top-3 -right-3 z-10">
                          <div className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                            {pkg.savings}
                          </div>
                        </div>
                      )}

                      <div className="relative h-full">
                        <div className={`absolute inset-0 bg-gradient-to-r ${pkg.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                        <div className="relative h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all">
                          
                          {/* Header */}
                          <div className="text-center mb-8">
                            <div className={`p-4 bg-gradient-to-r ${pkg.color} rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                              <div className="text-white">
                                {pkg.icon}
                              </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{pkg.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{pkg.description}</p>
                            
                            <div className="mb-4">
                              <div className="flex items-baseline justify-center space-x-2 mb-2">
                                <span className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                  ${pkg.price}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">USD</span>
                              </div>
                              
                              <div className="flex items-center justify-center space-x-2 mb-2">
                                <Gem className="w-5 h-5 text-emerald-600" />
                                <span className="text-emerald-600 font-bold text-lg">
                                  {pkg.credits.toLocaleString()} credits
                                </span>
                                {pkg.bonus && (
                                  <motion.span 
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-green-600 font-semibold text-sm bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full"
                                  >
                                    +{pkg.bonus} bonus
                                  </motion.span>
                                )}
                              </div>
                              
                              <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {getCreditsPerDollar(pkg)} credits per $1
                              </p>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="space-y-3 mb-8">
                            {pkg.features.map((feature, i) => (
                              <motion.div 
                                key={i} 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="flex items-center space-x-3"
                              >
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                              </motion.div>
                            ))}
                          </div>

                          {/* Purchase Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePurchase(pkg.id);
                            }}
                            className={`w-full py-4 rounded-2xl font-semibold text-white transition-all shadow-lg hover:shadow-xl ${
                              pkg.popular
                                ? `bg-gradient-to-r ${pkg.color} hover:shadow-emerald-500/25`
                                : `bg-gradient-to-r ${pkg.color} hover:shadow-lg`
                            }`}
                          >
                            Purchase Credits
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Payment Methods Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-10" />
                  <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 shadow-xl">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                        Multiple Payment Options
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">Choose from various secure payment methods worldwide</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { name: 'Credit Cards', icon: <CreditCard className="w-8 h-8" />, color: 'from-blue-500 to-blue-600' },
                        { name: 'Mobile Money', icon: <Wallet className="w-8 h-8" />, color: 'from-green-500 to-green-600' },
                        { name: 'Bank Transfer', icon: <Shield className="w-8 h-8" />, color: 'from-purple-500 to-purple-600' },
                        { name: 'PayPal', icon: <Globe className="w-8 h-8" />, color: 'from-orange-500 to-orange-600' }
                      ].map((method, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          whileHover={{ y: -5 }}
                          className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
                        >
                          <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4`}>
                            {method.icon}
                          </div>
                          <p className="text-gray-800 dark:text-gray-200 font-semibold">{method.name}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 shadow-xl"
              >
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                    Transaction History
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Track your credit purchases and usage</p>
                </div>

                <div className="space-y-4">
                  {transactionHistory.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-2xl border-2 ${getTransactionColor(transaction.type)} hover:shadow-lg transition-all`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{transaction.description}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {transaction.timestamp.toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} credits
                          </div>
                          <span className="text-green-600 text-sm font-medium bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;