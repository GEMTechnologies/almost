import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles, Target, Coins, BookOpen, Trophy, Gift } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon: React.ReactNode;
  financialTip: string;
  reward?: number;
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: '🎉 Welcome to Granada OS!',
      description: 'Your gateway to unlimited funding opportunities and career growth!',
      target: 'header',
      position: 'bottom',
      icon: <Sparkles className="w-6 h-6 text-yellow-500" />,
      financialTip: '💡 Financial Tip: Start building your funding portfolio early - successful grant seekers apply to 10-15 opportunities monthly!',
      reward: 25
    },
    {
      id: 'credits',
      title: '💳 Understanding Your Credits',
      description: 'Credits power your premium features. Use them wisely for maximum impact!',
      target: 'credit-balance',
      position: 'bottom',
      icon: <Coins className="w-6 h-6 text-green-500" />,
      financialTip: '💰 Smart Spending: Invest 80% of credits in applications, 20% in research and networking!',
      reward: 10
    },
    {
      id: 'search',
      title: '🔍 Smart Job Search',
      description: 'Our AI-powered search finds opportunities tailored to your profile.',
      target: 'search-section',
      position: 'bottom',
      icon: <Target className="w-6 h-6 text-blue-500" />,
      financialTip: '📊 Success Strategy: Quality over quantity - 3 targeted applications beat 10 generic ones!',
      reward: 15
    },
    {
      id: 'cv-tools',
      title: '📄 AI CV Generation',
      description: 'Let our AI create professional CVs that stand out to employers.',
      target: 'cv-tools',
      position: 'left',
      icon: <BookOpen className="w-6 h-6 text-purple-500" />,
      financialTip: '✨ Pro Tip: AI-generated CVs with human review have 70% higher success rates!',
      reward: 20
    },
    {
      id: 'premium-features',
      title: '🚀 Premium Features',
      description: 'Unlock advanced tools: direct employer contact, detailed insights, and priority support.',
      target: 'premium-section',
      position: 'top',
      icon: <Trophy className="w-6 h-6 text-orange-500" />,
      financialTip: '🎯 ROI Focus: Premium features typically pay for themselves within the first successful application!',
      reward: 30
    }
  ];

  const totalReward = tourSteps.reduce((sum, step) => sum + (step.reward || 0), 0);

  useEffect(() => {
    if (currentStep === tourSteps.length && isOpen) {
      setShowConfetti(true);
      setTimeout(() => {
        onComplete();
        setShowConfetti(false);
      }, 3000);
    }
  }, [currentStep, tourSteps.length, isOpen, onComplete]);

  const nextStep = () => {
    if (currentStep < tourSteps.length) {
      const step = tourSteps[currentStep];
      setCompletedSteps(prev => [...prev, step.id]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipTour = () => {
    onClose();
  };

  if (!isOpen) return null;

  // Completion screen
  if (currentStep >= tourSteps.length) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center relative overflow-hidden">
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-2xl animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                >
                  {['🎉', '🎊', '⭐', '💫', '🏆'][Math.floor(Math.random() * 5)]}
                </div>
              ))}
            </div>
          )}
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎊 Congratulations!</h2>
            <p className="text-gray-600 mb-6">
              You've completed the onboarding tour and earned valuable insights into smart financial planning!
            </p>
            
            <div className="bg-gradient-to-r from-yellow-100 to-green-100 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Bonus Reward!</span>
              </div>
              <p className="text-green-700">
                You've earned <span className="font-bold">{totalReward} bonus credits</span> for completing the tour!
              </p>
            </div>
            
            <button
              onClick={onComplete}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Start Exploring! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  const step = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50">
      {/* Tour overlay */}
      <div className="relative w-full h-full">
        {/* Tour popup */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl max-w-lg mx-4 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {step.icon}
                <span className="text-sm font-medium opacity-90">
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
              </div>
              <button
                onClick={skipTour}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <h2 className="text-xl font-bold mb-2">{step.title}</h2>
            <p className="text-blue-100">{step.description}</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Financial tip */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Financial Education</h4>
                  <p className="text-yellow-700 text-sm">{step.financialTip}</p>
                </div>
              </div>
            </div>

            {/* Reward notification */}
            {step.reward && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 text-sm font-medium">
                    Complete this step to earn {step.reward} bonus credits!
                  </span>
                </div>
              </div>
            )}

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Progress</span>
                <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex gap-2">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={skipTour}
          className="absolute top-6 right-6 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-300"
        >
          Skip Tour
        </button>
      </div>
    </div>
  );
};

export default OnboardingTour;