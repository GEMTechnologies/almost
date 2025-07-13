import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, DollarSign, MapPin, Target, Sparkles } from 'lucide-react';

interface OpportunityBannerProps {
  opportunity: {
    id: string;
    title: string;
    sourceName: string;
    country: string;
    sector: string;
    amountMin: number;
    amountMax: number;
    currency: string;
    deadline: string;
  };
}

export const OpportunityBanner: React.FC<OpportunityBannerProps> = ({ opportunity }) => {
  const formatAmount = (min: number | undefined, max: number | undefined, currency: string) => {
    if (!min && !max) return 'Amount to be determined';
    if (!max || min === max) return `${currency} ${(min || 0).toLocaleString()}`;
    return `${currency} ${(min || 0).toLocaleString()} - ${(max || 0).toLocaleString()}`;
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Deadline passed';
    if (diffDays < 7) return `${diffDays} days left`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks left`;
    return `${Math.ceil(diffDays / 30)} months left`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-8"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {opportunity.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {opportunity.sourceName}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {opportunity.fundingAmount || formatAmount(opportunity.amountMin, opportunity.amountMax, opportunity.currency || '$')}
                </div>
                <div className="text-xs text-gray-500">Funding Range</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {opportunity.country}
                </div>
                <div className="text-xs text-gray-500">Location</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {opportunity.sector}
                </div>
                <div className="text-xs text-gray-500">Sector</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDeadline(opportunity.deadline)}
                </div>
                <div className="text-xs text-gray-500">Deadline</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Auto-populated</span>
        </div>
      </div>
    </motion.div>
  );
};