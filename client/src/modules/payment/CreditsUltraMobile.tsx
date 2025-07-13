import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Crown, Zap, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreditsUltraMobile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const packages = [
    {
      id: 'starter',
      name: 'Starter',
      credits: 100,
      price: 12,
      color: 'from-blue-500 to-cyan-500',
      icon: <Target className="w-6 h-6" />
    },
    {
      id: 'professional',
      name: 'Professional',
      credits: 575,
      price: 49,
      color: 'from-emerald-500 to-green-500',
      icon: <Crown className="w-6 h-6" />
    },
    {
      id: 'premium',
      name: 'Premium',
      credits: 1500,
      price: 89,
      color: 'from-purple-500 to-violet-500',
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      credits: 4000,
      price: 199,
      color: 'from-orange-500 to-red-500',
      icon: <Award className="w-6 h-6" />
    }
  ];

  const handlePurchase = async (packageId: string) => {
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
          
          <h1 className="text-lg font-bold">Credits</h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${pkg.color} rounded-xl flex items-center justify-center text-white`}>
                    {pkg.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                    <p className="text-slate-300 text-sm">{pkg.credits.toLocaleString()} Credits</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">${pkg.price}</div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePurchase(pkg.id)}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-xl bg-gradient-to-r ${pkg.color} hover:shadow-2xl text-lg`}
              >
                ${pkg.price}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CreditsUltraMobile;