import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  CreditCard,
  Smartphone,
  Shield,
  Check,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  User,
  Globe,
  ChevronDown,
  Zap,
  Crown,
  Award,
  Target,
  Gem,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  supported: boolean;
  popular?: boolean;
}

const CreditsPurchase: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { packageId } = useParams<{ packageId: string }>();
  
  const [selectedMethod, setSelectedMethod] = useState<string>('pesapal');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [countryCode, setCountryCode] = useState('+254');
  const [showCountrySelector, setShowCountrySelector] = useState(false);

  // Fetch package from database
  const { data: packageData, isLoading: packageLoading, error: packageError } = useQuery({
    queryKey: ['/api/credit-packages', packageId],
    queryFn: async () => {
      const response = await fetch(`/api/credit-packages/${packageId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.package;
    },
    enabled: !!packageId
  });

  const getPackageIcon = (id: string) => {
    switch (id) {
      case 'basic': return <Target className="w-6 h-6" />;
      case 'starter': return <Sparkles className="w-6 h-6" />;
      case 'professional': return <Crown className="w-6 h-6" />;
      case 'enterprise': return <Award className="w-6 h-6" />;
      case 'unlimited': return <Zap className="w-6 h-6" />;
      default: return <Gem className="w-6 h-6" />;
    }
  };

  const getPackageColor = (id: string) => {
    switch (id) {
      case 'basic': return 'from-blue-500 to-cyan-500';
      case 'starter': return 'from-green-500 to-emerald-500';
      case 'professional': return 'from-purple-500 to-violet-500';
      case 'enterprise': return 'from-orange-500 to-red-500';
      case 'unlimited': return 'from-pink-500 to-rose-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  // Convert database package to component format
  const selectedPackage = packageData ? {
    id: packageData.id,
    name: packageData.name,
    credits: packageData.credits,
    price: parseFloat(packageData.price.toString()),
    icon: getPackageIcon(packageData.id),
    color: getPackageColor(packageData.id)
  } : null;

  const countries = [
    { code: '+254', name: 'Kenya', flag: '🇰🇪' },
    { code: '+256', name: 'Uganda', flag: '🇺🇬' },
    { code: '+255', name: 'Tanzania', flag: '🇹🇿' },
    { code: '+250', name: 'Rwanda', flag: '🇷🇼' },
    { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
    { code: '+233', name: 'Ghana', flag: '🇬🇭' }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'pesapal',
      name: 'Mobile Money',
      description: 'M-Pesa, Airtel Money, MTN Mobile Money',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      supported: true,
      popular: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      supported: true
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      supported: false
    }
  ];

  const createPayment = useMutation({
    mutationFn: async (paymentData: {
      packageId: string;
      userId: string;
      userEmail: string;
      userName: string;
      userPhone?: string;
    }) => {
      const response = await fetch('/api/payments/pesapal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment creation failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.paymentUrl) {
        // Redirect to Pesapal payment page
        window.location.href = data.paymentUrl;
      }
    },
    onError: (error) => {
      console.error('Payment creation failed:', error);
    }
  });

  const handlePayment = () => {
    if (!selectedPackage) return;

    const fullPhoneNumber = selectedMethod === 'pesapal' && phoneNumber 
      ? `${countryCode}${phoneNumber.replace(/^0+/, '')}`
      : undefined;

    createPayment.mutate({
      packageId: selectedPackage.id,
      userId: user?.id || 'demo-user',
      userEmail: email,
      userName: fullName,
      userPhone: fullPhoneNumber
    });
  };

  if (packageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (packageError || !selectedPackage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-2">Package Not Found</h2>
          <p className="text-slate-400 mb-6">The selected credits package could not be found.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/credits')}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Credits
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/50 p-4">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/credits')}
            className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-lg font-bold">Secure Payment</h1>
            <p className="text-xs text-slate-400">Powered by Pesapal</p>
          </div>
          
          <div className="w-12" /> {/* Spacer for center alignment */}
        </div>
      </div>

      <div className="p-4 pb-8">
        {/* Package Summary Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <div className={`relative bg-gradient-to-r ${selectedPackage.color} p-6 rounded-2xl mb-6 overflow-hidden`}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white">
                  {selectedPackage.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedPackage.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Gem className="w-4 h-4 text-white/80" />
                    <span className="text-white/90 font-semibold">{selectedPackage.credits.toLocaleString()} Credits</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">${selectedPackage.price}</div>
                <div className="text-white/80 text-sm">One-time payment</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Choose Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <motion.button
                key={method.id}
                whileHover={{ scale: method.supported ? 1.02 : 1 }}
                whileTap={{ scale: method.supported ? 0.98 : 1 }}
                onClick={() => method.supported && setSelectedMethod(method.id)}
                disabled={!method.supported}
                className={`w-full p-4 rounded-xl border transition-all ${
                  selectedMethod === method.id
                    ? `bg-gradient-to-r ${method.color} border-white/30 shadow-xl`
                    : method.supported
                    ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50'
                    : 'bg-slate-800/20 border-slate-700/30 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedMethod === method.id ? 'bg-white/20' : 'bg-slate-700/50'
                    }`}>
                      {method.icon}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{method.name}</h4>
                        {method.popular && (
                          <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full border border-emerald-500/30">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-300">{method.description}</p>
                    </div>
                  </div>
                  {selectedMethod === method.id && (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  )}
                  {!method.supported && (
                    <span className="text-slate-400 text-sm">Coming Soon</span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Payment Form */}
        <AnimatePresence>
          {selectedMethod === 'pesapal' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 space-y-4"
            >
              <h3 className="text-xl font-bold text-white mb-4">Payment Details</h3>
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Mobile Number (for M-Pesa)
                </label>
                <div className="flex gap-2">
                  {/* Country Code Selector */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountrySelector(!showCountrySelector)}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-3 text-white flex items-center gap-2 min-w-[120px]"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">{countryCode}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showCountrySelector && (
                      <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 min-w-[200px]">
                        {countries.map((country) => (
                          <button
                            key={country.code}
                            onClick={() => {
                              setCountryCode(country.code);
                              setShowCountrySelector(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-700/50 flex items-center gap-3 first:rounded-t-xl last:rounded-b-xl"
                          >
                            <span className="text-lg">{country.flag}</span>
                            <div>
                              <div className="text-white font-medium">{country.name}</div>
                              <div className="text-slate-400 text-sm">{country.code}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Phone Number Input */}
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                    placeholder="712345678"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  We'll send an M-Pesa STK push to this number
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Notice */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/30 backdrop-blur-xl rounded-xl p-4 mb-6 border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <h4 className="font-semibold text-white">Secure Payment</h4>
              <p className="text-sm text-slate-300">Your payment is protected by Pesapal's PCI-DSS compliant security</p>
            </div>
          </div>
        </motion.div>

        {/* Payment Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePayment}
          disabled={createPayment.isPending || !email || !fullName || (selectedMethod === 'pesapal' && !phoneNumber)}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {createPayment.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Pay ${selectedPackage.price} Securely
            </>
          )}
        </motion.button>

        {/* Error Display */}
        {createPayment.isError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-red-500/20 border border-red-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Payment Failed</span>
            </div>
            <p className="text-red-300 text-sm mt-1">
              {createPayment.error?.message || 'An error occurred while processing your payment'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CreditsPurchase;