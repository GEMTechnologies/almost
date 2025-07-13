import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, CreditCard, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const MinimalPayment: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { packageId } = useParams<{ packageId: string }>();
  
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'card'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const packages = {
    'starter': { name: 'Starter', credits: 100, price: 12 },
    'professional': { name: 'Professional', credits: 575, price: 49 },
    'premium': { name: 'Premium', credits: 1500, price: 89 },
    'enterprise': { name: 'Enterprise', credits: 4000, price: 199 }
  };

  const selectedPackage = packages[packageId as keyof typeof packages];

  // Load saved payment details
  useEffect(() => {
    const savedMobile = localStorage.getItem('savedMobile');
    const savedCard = localStorage.getItem('savedCardNumber');
    const savedExpiry = localStorage.getItem('savedExpiry');
    
    if (savedMobile) setMobileNumber(savedMobile);
    if (savedCard) setCardNumber(savedCard);
    if (savedExpiry) setExpiryDate(savedExpiry);
  }, []);

  const handlePayment = async () => {
    if (!selectedPackage) return;
    
    setProcessing(true);

    try {
      // Save payment details for next time
      if (paymentMethod === 'mobile' && mobileNumber) {
        localStorage.setItem('savedMobile', mobileNumber);
      }
      if (paymentMethod === 'card' && cardNumber) {
        localStorage.setItem('savedCardNumber', cardNumber);
        localStorage.setItem('savedExpiry', expiryDate);
      }

      const response = await fetch('/api/payments/pesapal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId,
          userId: user?.id || 'user',
          userEmail: user?.email || 'user@example.com',
          userName: user?.fullName || 'User',
          userPhone: paymentMethod === 'mobile' ? mobileNumber : undefined,
          paymentMethod: paymentMethod
        })
      });
      
      const data = await response.json();
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setProcessing(false);
    }
  };

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-xl font-bold mb-4">Package Not Found</h2>
          <button onClick={() => navigate('/credits')} className="bg-emerald-500 text-white px-6 py-3 rounded-xl">
            Back to Credits
          </button>
        </div>
      </div>
    );
  }

  const isValid = paymentMethod === 'mobile' ? mobileNumber.length >= 10 : 
                  cardNumber.length >= 16 && expiryDate.length >= 5 && cvv.length >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/50 p-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/credits')} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">${selectedPackage.price}</h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="p-4">
        {/* Package Info */}
        <div className="bg-slate-800/50 rounded-2xl p-4 mb-6 text-center">
          <h2 className="text-xl font-bold text-white">{selectedPackage.name}</h2>
          <p className="text-slate-300">{selectedPackage.credits.toLocaleString()} Credits</p>
          <div className="text-2xl font-bold text-emerald-400 mt-2">${selectedPackage.price}</div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setPaymentMethod('mobile')}
              className={`p-4 rounded-xl border transition-all ${
                paymentMethod === 'mobile' 
                  ? 'bg-emerald-500/20 border-emerald-500/50' 
                  : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <Smartphone className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Mobile Money</div>
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-xl border transition-all ${
                paymentMethod === 'card' 
                  ? 'bg-blue-500/20 border-blue-500/50' 
                  : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <CreditCard className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Card</div>
            </button>
          </div>
        </div>

        {/* Payment Form */}
        {paymentMethod === 'mobile' && (
          <div className="mb-6">
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Mobile Number"
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-4 text-white placeholder-slate-400 text-lg"
            />
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="space-y-4 mb-6">
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="Card Number"
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-4 text-white placeholder-slate-400 text-lg"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                  }
                  setExpiryDate(value);
                }}
                placeholder="MM/YY"
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-4 text-white placeholder-slate-400 text-lg"
              />
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="CVV"
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-4 text-white placeholder-slate-400 text-lg"
              />
            </div>
          </div>
        )}

        {/* Pay Button */}
        <motion.button
          whileHover={{ scale: isValid && !processing ? 1.02 : 1 }}
          whileTap={{ scale: isValid && !processing ? 0.98 : 1 }}
          onClick={handlePayment}
          disabled={!isValid || processing}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            isValid && !processing
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-xl'
              : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
          }`}
        >
          {processing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            `Pay $${selectedPackage.price}`
          )}
        </motion.button>

        {/* Saved Data Notice */}
        {((paymentMethod === 'mobile' && localStorage.getItem('savedMobile')) ||
          (paymentMethod === 'card' && localStorage.getItem('savedCardNumber'))) && (
          <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Payment details saved for next time
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalPayment;