import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  Calendar, 
  DollarSign,
  Target,
  BarChart3,
  Users,
  Library
} from 'lucide-react';

interface ProposalsSubMenuProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const ProposalsSubMenu: React.FC<ProposalsSubMenuProps> = ({ activeView, onViewChange }) => {
  const proposalViews = [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Dashboard and summary',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      id: 'active',
      title: 'Active Proposals',
      description: 'Current submissions',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      id: 'approved',
      title: 'Approved',
      description: 'Successful proposals',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      id: 'deadlines',
      title: 'Deadlines',
      description: 'Upcoming deadlines',
      icon: Calendar,
      color: 'bg-red-500'
    },
    {
      id: 'budgets',
      title: 'Budgets',
      description: 'Financial planning',
      icon: DollarSign,
      color: 'bg-green-600'
    },
    {
      id: 'logframes',
      title: 'Logframes',
      description: 'Results frameworks',
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Success metrics',
      icon: BarChart3,
      color: 'bg-indigo-500'
    },
    {
      id: 'teams',
      title: 'Teams',
      description: 'Collaboration',
      icon: Users,
      color: 'bg-cyan-500'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900">Proposal & Grant Management</h2>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          New Proposal
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {proposalViews.map((view) => (
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

export default ProposalsSubMenu;