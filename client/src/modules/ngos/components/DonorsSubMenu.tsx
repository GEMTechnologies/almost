import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Plus, 
  Users, 
  DollarSign, 
  Mail, 
  FileText, 
  BarChart3, 
  Calendar,
  Star,
  TrendingUp
} from 'lucide-react';

interface DonorsSubMenuProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const DonorsSubMenu: React.FC<DonorsSubMenuProps> = ({ activeView, onViewChange }) => {
  const donorViews = [
    {
      id: 'overview',
      title: 'Donors Overview',
      description: 'Dashboard and summary',
      icon: Heart,
      color: 'bg-red-500'
    },
    {
      id: 'all-donors',
      title: 'All Donors',
      description: 'Complete donor database',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      id: 'major-donors',
      title: 'Major Donors',
      description: 'High-value donor management',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      id: 'donations',
      title: 'Donations',
      description: 'Track all donations',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      id: 'communications',
      title: 'Communications',
      description: 'Donor communications',
      icon: Mail,
      color: 'bg-purple-500'
    },
    {
      id: 'receipts',
      title: 'Receipts',
      description: 'Generate and manage receipts',
      icon: FileText,
      color: 'bg-indigo-500'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Donor insights and trends',
      icon: BarChart3,
      color: 'bg-cyan-500'
    },
    {
      id: 'campaigns',
      title: 'Campaigns',
      description: 'Fundraising campaigns',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900">Donors Management</h2>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Donor
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {donorViews.map((view) => (
          <motion.button
            key={view.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onViewChange(view.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
              activeView === view.id 
                ? `${view.color} text-white shadow-lg` 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <view.icon className="w-5 h-5" />
            <div className="text-center">
              <p className="font-medium text-xs">{view.title}</p>
              <p className={`text-xs ${activeView === view.id ? 'text-white/80' : 'text-gray-500'}`}>
                {view.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DonorsSubMenu;