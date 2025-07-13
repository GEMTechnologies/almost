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
  Coins
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
}

const CreditsPageModern: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<string>('professional');
  const [activeTab, setActiveTab] = useState<'packages' | 'history'>('packages');
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);

  const packages: CreditPackage[] = [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 100,
      price: 12,
      color: 'from-blue-500 via-cyan-500 to-teal-500',
      icon: <Target className="w-8 h-8" />,
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
      icon: <Crown className="w-8 h-8" />,
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
      icon: <Zap className="w-8 h-8" />,
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
      icon: <Award className="w-8 h-8" />,
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

  useEffect(() => {
    generateMockTransactionHistory();
  }, []);

  const generateMockTransactionHistory = () => {
    const history = [
      {
        id: 'tx-001',
        type: 'purchase',
        description: 'Professional Credits Package',
        amount: 575,
        timestamp: new Date('2024-06-25'),
        status: 'completed'
      },
      {
        id: 'tx-002',
        type: 'usage',
        description: 'AI Proposal Generation',
        amount: -5,
        timestamp: new Date('2024-06-24'),
        status: 'completed'
      },
      {
        id: 'tx-003',
        type: 'usage',
        description: 'Smart Donor Discovery',
        amount: -15,
        timestamp: new Date('2024-06-23'),
        status: 'completed'
      },
      {
        id: 'tx-004',
        type: 'bonus',
        description: 'Welcome Bonus Credits',
        amount: 50,
        timestamp: new Date('2024-06-20'),
        status: 'completed'
      }
    ];
    
    setTransactionHistory(history);
  };

  const handlePurchase = (packageId: string) => {
    navigate(`/credits-purchase/${packageId}`);
  };

  const getCreditsPerDollar = (pkg: CreditPackage) => {
    const totalCredits = pkg.credits + (pkg.bonus || 0);
    return Math.round(totalCredits / pkg.price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-slate-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-3 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-2xl transition-all backdrop-blur-xl border border-slate-700/50"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </motion.button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-4 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 backdrop-blur-xl px-8 py-4 rounded-3xl border border-emerald-500/30"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Gem className="w-8 h-8 text-emerald-400" />
              </motion.div>
              <div>
                <span className="text-sm text-slate-400 block">Available Credits</span>
                <div className="font-bold text-3xl text-white">{user?.credits || 150}</div>
              </div>
            </motion.div>
          </div>
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
            >
              Granada Credits
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
            >
              Supercharge your NGO's impact with AI-powered proposal generation, intelligent donor discovery, and professional automation tools
            </motion.p>
            
            {/* Performance Stats */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-12"
            >
              {[
                { label: 'Success Rate', value: '96%', icon: TrendingUp, color: 'from-emerald-500 to-green-500' },
                { label: 'Proposals Generated', value: '75K+', icon: FileText, color: 'from-blue-500 to-cyan-500' },
                { label: 'Funding Secured', value: '$2.5B', icon: Target, color: 'from-purple-500 to-violet-500' },
                { label: 'Active NGOs', value: '3,200+', icon: Users, color: 'from-orange-500 to-red-500' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`bg-gradient-to-r ${stat.color} p-6 rounded-3xl backdrop-blur-xl border border-white/10 shadow-xl`}
                >
                  <stat.icon className="w-8 h-8 text-white mb-3 mx-auto" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-2 border border-slate-700/50">
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('packages')}
                  className={`px-8 py-4 rounded-2xl font-semibold transition-all ${
                    activeTab === 'packages'
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <Coins className="w-5 h-5 inline mr-2" />
                  Buy Credits
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('history')}
                  className={`px-8 py-4 rounded-2xl font-semibold transition-all ${
                    activeTab === 'history'
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <History className="w-5 h-5 inline mr-2" />
                  Transaction History
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
                className="space-y-16"
              >
                {/* Credit Usage Guide */}
                <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50">
                  <div className="text-center mb-12">
                    <h3 className="text-4xl font-bold text-white mb-4">
                      How Credits Work
                    </h3>
                    <p className="text-xl text-slate-300">Every action in Granada OS is powered by advanced AI intelligence</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {creditUsageExamples.map((example, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="group relative"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${example.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                        <div className="relative bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 h-full">
                          <div className={`w-16 h-16 bg-gradient-to-r ${example.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                            {example.icon}
                          </div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-white font-bold text-lg">{example.action}</h4>
                            <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full">
                              <Gem className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">{example.credits}</span>
                            </div>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{example.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Pricing Packages */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                  {packages.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className={`group relative ${pkg.popular ? 'xl:scale-105' : ''}`}
                    >
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${pkg.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                      
                      {/* Package Card */}
                      <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden h-full">
                        {pkg.popular && (
                          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 to-cyan-500 p-3 text-center">
                            <span className="text-white font-bold text-sm">🌟 {pkg.badge}</span>
                          </div>
                        )}

                        <div className={`p-8 ${pkg.popular ? 'pt-16' : ''}`}>
                          {/* Package Header */}
                          <div className="text-center mb-8">
                            <div className={`w-20 h-20 bg-gradient-to-r ${pkg.color} rounded-3xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                              {pkg.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                            <p className="text-slate-300 mb-6">{pkg.description}</p>
                            
                            {/* Price */}
                            <div className="mb-4">
                              <div className="text-5xl font-bold text-white mb-2">
                                ${pkg.price}
                              </div>
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Gem className="w-5 h-5 text-emerald-400" />
                                <span className="text-emerald-400 font-bold text-xl">
                                  {pkg.credits.toLocaleString()} credits
                                </span>
                                {pkg.bonus && (
                                  <motion.span 
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-green-400 font-semibold text-sm bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30"
                                  >
                                    +{pkg.bonus} bonus
                                  </motion.span>
                                )}
                              </div>
                              {pkg.savings && (
                                <div className="text-orange-400 font-semibold text-sm bg-orange-500/20 px-3 py-1 rounded-full inline-block border border-orange-500/30">
                                  {pkg.savings}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Features */}
                          <div className="space-y-4 mb-8">
                            {pkg.features.map((feature, i) => (
                              <motion.div 
                                key={i} 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="flex items-center gap-3"
                              >
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                <span className="text-slate-300">{feature}</span>
                              </motion.div>
                            ))}
                          </div>

                          {/* Purchase Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePurchase(pkg.id)}
                            className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-xl bg-gradient-to-r ${pkg.color} hover:shadow-2xl`}
                          >
                            <Rocket className="w-5 h-5 inline mr-2" />
                            Get Started Now
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-800/30 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50"
              >
                <div className="text-center mb-8">
                  <h3 className="text-4xl font-bold text-white mb-4">
                    Transaction History
                  </h3>
                  <p className="text-xl text-slate-300">Track your credit purchases and usage</p>
                </div>

                <div className="space-y-4">
                  {transactionHistory.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-700/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-700/50 rounded-xl">
                            {transaction.type === 'purchase' && <CreditCard className="w-6 h-6 text-emerald-400" />}
                            {transaction.type === 'usage' && <Lightning className="w-6 h-6 text-orange-400" />}
                            {transaction.type === 'bonus' && <Gift className="w-6 h-6 text-purple-400" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white text-lg">{transaction.description}</h4>
                            <p className="text-slate-400">
                              {transaction.timestamp.toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            transaction.amount > 0 ? 'text-emerald-400' : 'text-orange-400'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} credits
                          </div>
                          <span className="text-emerald-400 text-sm font-medium bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                            Completed
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

export default CreditsPageModern;