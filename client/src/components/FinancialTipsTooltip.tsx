import React, { useState, useEffect } from 'react';
import { X, Lightbulb, TrendingUp, DollarSign, Target, BookOpen, Calculator } from 'lucide-react';

interface FinancialTip {
  id: string;
  title: string;
  tip: string;
  category: 'budgeting' | 'investing' | 'credits' | 'career' | 'savings' | 'strategy';
  icon: React.ReactNode;
  actionable: string;
  relatedFeature?: string;
}

interface FinancialTipsTooltipProps {
  trigger: React.ReactNode;
  category?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const FinancialTipsTooltip: React.FC<FinancialTipsTooltipProps> = ({ 
  trigger, 
  category = 'credits',
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState<FinancialTip | null>(null);

  const financialTips: FinancialTip[] = [
    {
      id: 'credit-strategy',
      title: '💳 Smart Credit Strategy',
      tip: 'Allocate 70% of credits to job applications, 20% to networking, and 10% to skill development for maximum ROI.',
      category: 'credits',
      icon: <Target className="w-5 h-5 text-blue-500" />,
      actionable: 'Track your credit spending across these categories this month.',
      relatedFeature: 'Credit Management'
    },
    {
      id: 'application-budget',
      title: '📊 Application Budgeting',
      tip: 'Quality over quantity: 5 well-researched applications outperform 20 generic ones by 300%.',
      category: 'strategy',
      icon: <Calculator className="w-5 h-5 text-green-500" />,
      actionable: 'Set a weekly budget of 50 credits for high-quality applications.',
      relatedFeature: 'Job Applications'
    },
    {
      id: 'career-investment',
      title: '🚀 Career Investment',
      tip: 'Invest in premium CV writing and human help - they typically pay for themselves within the first successful application.',
      category: 'career',
      icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
      actionable: 'Budget 25% of credits monthly for premium career services.',
      relatedFeature: 'CV Generation'
    },
    {
      id: 'credit-maximization',
      title: '⚡ Credit Maximization',
      tip: 'Time your premium searches during peak posting hours (Tuesday-Thursday, 10 AM-2 PM) for better opportunities.',
      category: 'credits',
      icon: <DollarSign className="w-5 h-5 text-yellow-500" />,
      actionable: 'Schedule your searches during these peak hours.',
      relatedFeature: 'Job Search'
    },
    {
      id: 'network-building',
      title: '🤝 Network Building',
      tip: 'Direct employer contact (3 credits) often yields 5x better response rates than standard applications.',
      category: 'strategy',
      icon: <BookOpen className="w-5 h-5 text-indigo-500" />,
      actionable: 'Use direct contact for your top 3 target companies monthly.',
      relatedFeature: 'Employer Contact'
    },
    {
      id: 'savings-strategy',
      title: '💰 Smart Savings',
      tip: 'Buy credits in bulk during promotions to save 30-40%. Track seasonal offers and stock up strategically.',
      category: 'savings',
      icon: <Lightbulb className="w-5 h-5 text-orange-500" />,
      actionable: 'Set calendar reminders for promotional periods.',
      relatedFeature: 'Credit Packages'
    }
  ];

  const getCategoryTips = (cat: string) => {
    return financialTips.filter(tip => tip.category === cat || cat === 'all');
  };

  const showRandomTip = () => {
    const categoryTips = getCategoryTips(category);
    const randomTip = categoryTips[Math.floor(Math.random() * categoryTips.length)];
    setCurrentTip(randomTip);
    setIsVisible(true);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 10000);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white';
    }
  };

  return (
    <div className="relative inline-block">
      <div onClick={showRandomTip} className="cursor-pointer">
        {trigger}
      </div>

      {isVisible && currentTip && (
        <div className={`absolute ${getPositionClasses()} z-50 w-80`}>
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 relative">
            {/* Arrow */}
            <div className={`absolute w-0 h-0 ${getArrowClasses()}`}></div>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {currentTip.icon}
                <h4 className="font-semibold text-gray-900 text-sm">{currentTip.title}</h4>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <p className="text-gray-700 text-sm leading-relaxed">
                {currentTip.tip}
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 text-xs font-medium mb-1">Action Step:</p>
                    <p className="text-blue-700 text-xs">{currentTip.actionable}</p>
                  </div>
                </div>
              </div>

              {currentTip.relatedFeature && (
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    <BookOpen className="w-3 h-3" />
                    Related: {currentTip.relatedFeature}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
              <button
                onClick={showRandomTip}
                className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
              >
                <Lightbulb className="w-3 h-3" />
                Another Tip
              </button>
              <div className="text-xs text-gray-400">
                💡 Financial Education
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialTipsTooltip;