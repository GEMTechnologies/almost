import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Crown, 
  Sparkles, 
  Gift,
  Star,
  Heart,
  Zap,
  Award
} from 'lucide-react';

interface PaymentSuccessAnimationProps {
  isVisible: boolean;
  packageName: string;
  creditsAdded: number;
  amount: number;
  currency: string;
  onClose: () => void;
}

// Confetti particle component
const ConfettiParticle: React.FC<{ delay: number }> = ({ delay }) => {
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: color }}
      initial={{ 
        x: Math.random() * window.innerWidth,
        y: -20,
        rotate: 0,
        scale: 0
      }}
      animate={{
        y: window.innerHeight + 20,
        x: Math.random() * window.innerWidth,
        rotate: 360,
        scale: [0, 1, 0.8, 0]
      }}
      transition={{
        duration: 3,
        delay: delay,
        ease: "easeOut"
      }}
    />
  );
};

// Floating icon component
const FloatingIcon: React.FC<{ Icon: any; delay: number; direction: 'left' | 'right' }> = ({ Icon, delay, direction }) => {
  return (
    <motion.div
      className="absolute text-yellow-400"
      initial={{ 
        x: direction === 'left' ? -50 : window.innerWidth + 50,
        y: Math.random() * (window.innerHeight * 0.6) + 100,
        rotate: 0,
        scale: 0,
        opacity: 0
      }}
      animate={{
        x: direction === 'left' ? window.innerWidth + 50 : -50,
        y: Math.random() * (window.innerHeight * 0.6) + 100,
        rotate: 360,
        scale: [0, 1.2, 1, 0],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: 4,
        delay: delay,
        ease: "easeInOut"
      }}
    >
      <Icon className="w-8 h-8" />
    </motion.div>
  );
};

export const PaymentSuccessAnimation: React.FC<PaymentSuccessAnimationProps> = ({
  isVisible,
  packageName,
  creditsAdded,
  amount,
  currency,
  onClose
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<number[]>([]);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      
      // Generate confetti particles
      const particles = Array.from({ length: 50 }, (_, i) => i);
      setConfettiParticles(particles);

      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const floatingIcons = [Crown, Sparkles, Gift, Star, Heart, Zap, Award];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Confetti particles */}
          {showConfetti && confettiParticles.map((_, index) => (
            <ConfettiParticle key={index} delay={index * 0.1} />
          ))}
          
          {/* Floating icons */}
          {floatingIcons.map((Icon, index) => (
            <FloatingIcon 
              key={index} 
              Icon={Icon} 
              delay={index * 0.5} 
              direction={index % 2 === 0 ? 'left' : 'right'} 
            />
          ))}

          {/* Main success card */}
          <motion.div
            className="relative z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full mx-4 border border-emerald-500/30 shadow-2xl"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ 
              type: "spring", 
              damping: 15, 
              stiffness: 300,
              delay: 0.2 
            }}
          >
            {/* Success checkmark */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                damping: 10, 
                stiffness: 400,
                delay: 0.5 
              }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                />
                <CheckCircle2 className="w-20 h-20 text-emerald-400 relative z-10" />
              </div>
            </motion.div>

            {/* Success message */}
            <motion.div
              className="text-center mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-3xl font-bold text-white mb-2">
                Payment Successful! 🎉
              </h2>
              <p className="text-slate-300 text-lg">
                Congratulations on your purchase!
              </p>
            </motion.div>

            {/* Purchase details */}
            <motion.div
              className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-slate-700/50"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Package:</span>
                  <span className="text-white font-semibold flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    {packageName}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Credits Added:</span>
                  <span className="text-emerald-400 font-bold text-xl">
                    +{creditsAdded.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Amount Paid:</span>
                  <span className="text-white font-semibold">
                    {currency} {amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Celebration message */}
            <motion.div
              className="text-center mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl p-4 border border-emerald-500/30">
                <Sparkles className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-emerald-300 font-medium">
                  Your credits have been added to your account!
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Start creating amazing proposals right away
                </p>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="space-y-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Start Creating Proposals
              </button>
              
              <button
                onClick={onClose}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-medium py-2 px-6 rounded-xl transition-all duration-200"
              >
                View Account Balance
              </button>
            </motion.div>

            {/* Auto-close indicator */}
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <p className="text-slate-500 text-xs">
                This message will close automatically in 5 seconds
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};