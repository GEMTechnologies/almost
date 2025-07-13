import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  Target, 
  Crown, 
  Zap, 
  Award,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PaymentSuccessAnimation } from '../../components/PaymentSuccessAnimation';

const BillingDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'card' | 'paypal'>('mobile');
  const [mobileNumber, setMobileNumber] = useState(localStorage.getItem('savedMobile') || '');
  const [countryCode, setCountryCode] = useState(localStorage.getItem('savedCountry') || 'KE');
  const [processing, setProcessing] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<any>(null);
  const [couponValidating, setCouponValidating] = useState(false);
  const [userCurrency, setUserCurrency] = useState('USD');
  const [convertedPackages, setConvertedPackages] = useState<any[]>([]);
  const [currencyInfo, setCurrencyInfo] = useState<any>(null);
  const [geoData, setGeoData] = useState<any>(null);
  
  // Card payment form state
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  
  // PayPal form state
  const [paypalData, setPaypalData] = useState({
    email: '',
    name: ''
  });
  
  // Payment success animation state
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successData, setSuccessData] = useState({
    packageName: '',
    creditsAdded: 0,
    amount: 0,
    currency: 'USD'
  });

  const { data: userCredits } = useQuery({
    queryKey: ['/api/billing/balance'],
    queryFn: () => fetch('/api/billing/balance', {
      headers: { 'X-User-ID': user?.id || 'demo-user' }
    }).then(res => res.json())
  });

  // Geo-location and currency detection
  const { data: geoInfo } = useQuery({
    queryKey: ['/api/billing/geo-currency'],
    queryFn: () => fetch('/api/billing/geo-currency', {
      headers: { 'X-User-ID': user?.id || 'demo-user' }
    }).then(res => res.json())
  });

  // Check for payment success from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');
    
    if (status === 'success') {
      // Extract package info from localStorage or URL
      const packageId = urlParams.get('package') || localStorage.getItem('lastPurchasePackage');
      const amount = parseFloat(urlParams.get('amount') || localStorage.getItem('lastPurchaseAmount') || '0');
      const currency = urlParams.get('currency') || localStorage.getItem('lastPurchaseCurrency') || 'USD';
      
      if (packageId) {
        const selectedPackage = packages.find(p => p.id === packageId);
        if (selectedPackage) {
          setSuccessData({
            packageName: selectedPackage.name,
            creditsAdded: selectedPackage.credits,
            amount: amount,
            currency: currency
          });
          setShowSuccessAnimation(true);
          
          // Clean up URL and localStorage
          window.history.replaceState({}, document.title, window.location.pathname);
          localStorage.removeItem('lastPurchasePackage');
          localStorage.removeItem('lastPurchaseAmount');
          localStorage.removeItem('lastPurchaseCurrency');
        }
      }
    }
  }, []);

  // Initialize currency and load converted packages
  React.useEffect(() => {
    if (geoInfo?.success && geoInfo.preferredCurrency) {
      setUserCurrency(geoInfo.preferredCurrency);
      setGeoData(geoInfo.geoData);
      
      // Convert package prices to user's currency
      fetch('/api/billing/convert-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user?.id || 'demo-user'
        },
        body: JSON.stringify({ targetCurrency: geoInfo.preferredCurrency })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setConvertedPackages(data.packages);
          setCurrencyInfo(data.currency);
        }
      })
      .catch(console.error);
    }
  }, [geoInfo, user?.id]);

  // African countries with mobile money support via Pesapal
  const countries = [
    { code: 'KE', name: 'Kenya', prefix: '+254', currency: 'KES' },
    { code: 'UG', name: 'Uganda', prefix: '+256', currency: 'UGX' },
    { code: 'TZ', name: 'Tanzania', prefix: '+255', currency: 'TZS' },
    { code: 'RW', name: 'Rwanda', prefix: '+250', currency: 'RWF' },
    { code: 'NG', name: 'Nigeria', prefix: '+234', currency: 'NGN' },
    { code: 'GH', name: 'Ghana', prefix: '+233', currency: 'GHS' },
    { code: 'ZA', name: 'South Africa', prefix: '+27', currency: 'ZAR' },
    { code: 'MW', name: 'Malawi', prefix: '+265', currency: 'MWK' },
    { code: 'ZM', name: 'Zambia', prefix: '+260', currency: 'ZMW' },
    { code: 'BW', name: 'Botswana', prefix: '+267', currency: 'BWP' }
  ];

  const selectedCountry = countries.find(c => c.code === countryCode) || countries[0];

  const packages = [
    {
      id: 'basic',
      name: 'Basic',
      credits: 50,
      price: 12,
      color: 'from-blue-500 to-cyan-500',
      icon: <Target className="w-6 h-6" />,
      description: 'Perfect for getting started',
      features: ['5-10 proposals', 'Basic templates', 'Email support']
    },
    {
      id: 'starter',
      name: 'Starter',
      credits: 85,
      price: 17,
      color: 'from-green-500 to-emerald-500',
      icon: <Crown className="w-6 h-6" />,
      description: 'Most popular for small NGOs',
      features: ['8-15 proposals', 'Premium templates', 'Chat support'],
      popular: true
    },
    {
      id: 'growth',
      name: 'Growth',
      credits: 150,
      price: 25,
      color: 'from-purple-500 to-violet-500',
      icon: <Zap className="w-6 h-6" />,
      description: 'Scale your funding efforts',
      features: ['15-25 proposals', 'Advanced features', 'Priority support']
    },
    {
      id: 'professional',
      name: 'Professional',
      credits: 350,
      price: 50,
      color: 'from-orange-500 to-red-500',
      icon: <Award className="w-6 h-6" />,
      description: 'For established organizations',
      features: ['35+ proposals', 'All features', 'Phone support']
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      credits: 9999,
      price: 100,
      color: 'from-pink-500 to-rose-500',
      icon: <Crown className="w-6 h-6" />,
      description: 'Monthly plan with human help',
      features: ['Unlimited proposals', 'Human expert help', '24/7 support'],
      monthly: true,
      badge: 'BEST VALUE'
    },
    {
      id: 'premium-support',
      name: 'Premium Support',
      credits: 9999,
      price: 200,
      color: 'from-yellow-500 to-amber-500',
      icon: <Award className="w-6 h-6" />,
      description: 'Superior human assistance',
      features: ['Everything unlimited', 'Dedicated expert', 'Custom strategies'],
      monthly: true,
      badge: 'VIP'
    }
  ];

  // Validate payment forms
  const validatePaymentForm = (): boolean => {
    if (paymentMethod === 'mobile') {
      if (!mobileNumber.trim()) {
        alert('Please enter your mobile number');
        return false;
      }
    } else if (paymentMethod === 'card') {
      if (!cardData.number.replace(/\s/g, '') || cardData.number.replace(/\s/g, '').length < 13) {
        alert('Please enter a valid card number');
        return false;
      }
      if (!cardData.expiry || cardData.expiry.length < 5) {
        alert('Please enter card expiry date (MM/YY)');
        return false;
      }
      if (!cardData.cvc || cardData.cvc.length < 3) {
        alert('Please enter CVC code');
        return false;
      }
      if (!cardData.name.trim()) {
        alert('Please enter cardholder name');
        return false;
      }
    } else if (paymentMethod === 'paypal') {
      if (!paypalData.email.includes('@')) {
        alert('Please enter a valid PayPal email');
        return false;
      }
      if (!paypalData.name.trim()) {
        alert('Please enter your full name');
        return false;
      }
    }
    return true;
  };

  const handlePurchase = async (packageId: string) => {
    const selectedPkg = packages.find(p => p.id === packageId);
    if (!selectedPkg) return;

    // Validate form data
    if (!validatePaymentForm()) {
      return;
    }

    setProcessing(packageId);

    try {
      // Save payment details and purchase info for success animation
      if (paymentMethod === 'mobile' && mobileNumber) {
        localStorage.setItem('savedMobile', mobileNumber);
        localStorage.setItem('savedCountry', countryCode);
      }
      
      // Store purchase info for success animation
      localStorage.setItem('lastPurchasePackage', packageId);
      localStorage.setItem('lastPurchaseAmount', selectedPkg.price.toString());
      localStorage.setItem('lastPurchaseCurrency', selectedCountry.currency);

      // Format phone number for Pesapal (remove prefix if user included it)
      let formattedPhone = mobileNumber;
      if (paymentMethod === 'mobile') {
        // Remove any existing country prefix and format properly
        const cleanNumber = mobileNumber.replace(/[^\d]/g, '');
        if (cleanNumber.startsWith(selectedCountry.prefix.slice(1))) {
          formattedPhone = selectedCountry.prefix + cleanNumber.slice(selectedCountry.prefix.length - 1);
        } else {
          formattedPhone = selectedCountry.prefix + cleanNumber;
        }
      }

      const requestBody: any = {
        packageId,
        paymentMethod,
        countryCode: countryCode,
        currency: selectedCountry.currency
      };

      // Add method-specific data
      if (paymentMethod === 'mobile') {
        requestBody.userPhone = formattedPhone;
      } else if (paymentMethod === 'card') {
        requestBody.cardData = {
          number: cardData.number.replace(/\s/g, ''),
          expiry: cardData.expiry,
          cvc: cardData.cvc,
          name: cardData.name
        };
      } else if (paymentMethod === 'paypal') {
        requestBody.paypalData = paypalData;
      }

      const response = await fetch('/api/billing/create-payment', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-ID': user?.id || 'user'
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert(data.error || 'Payment initialization failed');
        setProcessing(null);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment processing failed. Please try again.');
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/50 p-4">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-lg font-bold">Billing</h1>
            {geoData && currencyInfo && (
              <div className="text-xs text-emerald-400 flex items-center gap-1 justify-center mt-1">
                <span>{currencyInfo.flag}</span>
                <span>{geoData.country} • {currencyInfo.name}</span>
              </div>
            )}
            <p className="text-xs text-slate-400">
              Balance: {userCredits?.balance || 0} Credits
            </p>
          </div>
          
          <div className="w-12" />
        </div>
      </div>

      <div className="p-4">
        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Payment Method</h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentMethod('mobile')}
              className={`p-3 rounded-xl border transition-all ${
                paymentMethod === 'mobile' 
                  ? 'bg-emerald-500/20 border-emerald-500/50' 
                  : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <Smartphone className="w-4 h-4 mx-auto mb-1" />
              <div className="text-xs">Mobile</div>
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-xl border transition-all ${
                paymentMethod === 'card' 
                  ? 'bg-blue-500/20 border-blue-500/50' 
                  : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <CreditCard className="w-4 h-4 mx-auto mb-1" />
              <div className="text-xs">Card</div>
            </button>
            <button
              onClick={() => setPaymentMethod('paypal')}
              className={`p-3 rounded-xl border transition-all ${
                paymentMethod === 'paypal' 
                  ? 'bg-yellow-500/20 border-yellow-500/50' 
                  : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <DollarSign className="w-4 h-4 mx-auto mb-1" />
              <div className="text-xs">PayPal</div>
            </button>
          </div>
        </div>

        {/* Payment Method Specific Details */}
        {paymentMethod === 'mobile' && (
          <div className="mb-6 space-y-4">
            {/* Country Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.prefix})
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Number Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Mobile Number</label>
              <div className="flex">
                <div className="bg-slate-700/50 border border-slate-700/50 rounded-l-xl px-3 py-3 text-slate-300 text-sm">
                  {selectedCountry.prefix}
                </div>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="712345678"
                  className="flex-1 bg-slate-800/50 border border-slate-700/50 border-l-0 rounded-r-xl px-4 py-3 text-white placeholder-slate-400"
                />
              </div>
              {mobileNumber && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    Number will be saved for next purchase
                  </div>
                  <div className="text-slate-400 text-xs">
                    Full number: {selectedCountry.prefix + mobileNumber}
                  </div>
                  <div className="text-slate-400 text-xs">
                    Currency: {selectedCountry.currency}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Credit Card Details */}
        {paymentMethod === 'card' && (
          <div className="mb-6 bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold text-white">Credit Card Payment</h4>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm"
                  value={cardData.number}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                    setCardData(prev => ({ ...prev, number: value }));
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm"
                    value={cardData.expiry}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
                      setCardData(prev => ({ ...prev, expiry: value }));
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={4}
                    value={cardData.cvc}
                    onChange={(e) => setCardData(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '') }))}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardData.name}
                  onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm"
                />
              </div>
            </div>
            
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Secure Stripe processing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Your card details are never stored</span>
              </div>
            </div>
          </div>
        )}

        {/* PayPal Details */}
        {paymentMethod === 'paypal' && (
          <div className="mb-6 bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <h4 className="font-semibold text-white">PayPal Payment</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">PayPal Email</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={paypalData.email}
                  onChange={(e) => setPaypalData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={paypalData.name}
                  onChange={(e) => setPaypalData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm"
                />
              </div>
            </div>
            
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Pay with your PayPal account</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>PayPal Buyer Protection included</span>
              </div>
            </div>
          </div>
        )}

        {/* Coupon Code Section */}
        <div className="mb-6 bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <span className="text-yellow-400">🎫</span>
            Have a coupon code?
          </h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm"
            />
            <button
              onClick={() => {
                const pkg = displayPackages[0] || packages[0];
                validateCoupon(pkg.id);
              }}
              disabled={!couponCode.trim() || couponValidating}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 px-4 py-2 rounded-lg text-white font-semibold text-sm transition-colors"
            >
              {couponValidating ? '...' : 'Apply'}
            </button>
          </div>
          
          {couponDiscount && (
            <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium">Coupon Applied!</span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                {couponDiscount.bonusCredits > 0 ? 
                  `+${couponDiscount.bonusCredits} bonus credits` :
                  `Save $${couponDiscount.savings.toFixed(2)}`
                }
              </div>
            </div>
          )}
          
          <div className="mt-3 text-xs text-slate-400">
            Try: WELCOME20, STUDENT50, SAVE5, FREECREDITS
          </div>
        </div>

        {/* Packages */}
        <div className="space-y-4">
          {(convertedPackages.length > 0 ? convertedPackages.map(cp => ({
            ...packages.find(p => p.id === cp.id),
            ...cp,
            displayPrice: cp.formattedPrice,
            originalUSD: cp.originalPrice,
            localPrice: cp.localPrice
          })) : packages).map((pkg) => {
            const appliedDiscount = couponDiscount && 
              (couponDiscount.originalPrice === (pkg.localPrice || pkg.price));
            const finalPrice = appliedDiscount ? couponDiscount.finalPrice : (pkg.localPrice || pkg.price);
            const displayFinalPrice = appliedDiscount ? couponDiscount.finalFormatted : (pkg.displayPrice || `$${pkg.price}`);
            const savings = appliedDiscount ? couponDiscount.savings : 0;
            const bonusCredits = appliedDiscount ? couponDiscount.bonusCredits : 0;
            
            return (
              <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden ${
                pkg.popular ? 'ring-2 ring-emerald-500/50' : ''
              }`}
            >
              {(pkg.popular || pkg.badge) && (
                <div className={`p-2 text-center ${
                  pkg.badge === 'VIP' ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                  pkg.badge === 'BEST VALUE' ? 'bg-gradient-to-r from-pink-500 to-rose-500' :
                  'bg-gradient-to-r from-emerald-500 to-cyan-500'
                }`}>
                  <span className="text-white font-bold text-xs">
                    {pkg.badge || '⭐ Most Popular'}
                  </span>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${pkg.color} rounded-xl flex items-center justify-center text-white`}>
                      {pkg.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {pkg.name}
                        {pkg.monthly && <span className="text-xs text-emerald-400 ml-2">/month</span>}
                      </h3>
                      <p className="text-slate-300 text-sm">
                        {pkg.credits === 9999 ? 'Unlimited' : `${pkg.credits} Credits`}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">{pkg.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {appliedDiscount && savings > 0 ? (
                      <div>
                        <div className="text-lg text-slate-400 line-through">
                          {pkg.displayPrice || `$${pkg.price}`}
                        </div>
                        <div className="text-2xl font-bold text-emerald-400">
                          {displayFinalPrice}
                        </div>
                        <div className="text-xs text-green-400">
                          Save {couponDiscount.discountFormatted || `$${savings.toFixed(2)}`}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-2xl font-bold text-white">
                          {pkg.displayPrice || `$${pkg.price}`}
                        </div>
                        {pkg.originalUSD && userCurrency !== 'USD' && (
                          <div className="text-xs text-slate-400">≈ ${pkg.originalUSD} USD</div>
                        )}
                      </div>
                    )}
                    {bonusCredits > 0 && (
                      <div className="text-xs text-yellow-400 mt-1">+{bonusCredits} bonus</div>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: processing === pkg.id ? 1 : 1.02 }}
                  whileTap={{ scale: processing === pkg.id ? 1 : 0.98 }}
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={processing === pkg.id || (paymentMethod === 'mobile' && (!mobileNumber || mobileNumber.length < 8))}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    processing === pkg.id
                      ? 'bg-slate-600 cursor-not-allowed'
                      : (paymentMethod === 'mobile' && (!mobileNumber || mobileNumber.length < 8))
                      ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                      : `bg-gradient-to-r ${pkg.color} text-white shadow-xl hover:shadow-2xl`
                  }`}
                >
                  {processing === pkg.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </div>
                  ) : appliedDiscount && finalPrice < (pkg.localPrice || pkg.price) ? (
                    displayFinalPrice
                  ) : (
                    pkg.displayPrice || `$${pkg.price}`
                  )}
                </motion.button>
              </div>
            </motion.div>
            );
          })}
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-slate-800/30 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <h4 className="font-semibold text-white text-sm">Secure Payment</h4>
              <p className="text-xs text-slate-300">PCI-DSS compliant via Pesapal</p>
            </div>
          </div>
        </div>
        
        {/* Test Payment Success Animation Button (Development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6">
            <button
              onClick={() => {
                setSuccessData({
                  packageName: 'Professional Package',
                  creditsAdded: 350,
                  amount: 50,
                  currency: 'USD'
                });
                setShowSuccessAnimation(true);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              🎉 Test Success Animation
            </button>
          </div>
        )}
      </div>

      {/* Payment Success Animation */}
      <PaymentSuccessAnimation
        isVisible={showSuccessAnimation}
        packageName={successData.packageName}
        creditsAdded={successData.creditsAdded}
        amount={successData.amount}
        currency={successData.currency}
        onClose={() => setShowSuccessAnimation(false)}
      />
    </div>
  );
};

export default BillingDashboard;