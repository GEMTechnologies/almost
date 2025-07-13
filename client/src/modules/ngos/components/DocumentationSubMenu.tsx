import React from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Plus, 
  Shield, 
  FileText, 
  Upload, 
  Calendar,
  AlertCircle,
  Archive,
  Search,
  Settings
} from 'lucide-react';

interface DocumentationSubMenuProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const DocumentationSubMenu: React.FC<DocumentationSubMenuProps> = ({ activeView, onViewChange }) => {
  const documentationViews = [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Dashboard and summary',
      icon: FolderOpen,
      color: 'bg-green-500'
    },
    {
      id: 'policies',
      title: 'Policies',
      description: 'Policy documents',
      icon: Shield,
      color: 'bg-red-500'
    },
    {
      id: 'organizational',
      title: 'Organizational',
      description: 'Org documents',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      id: 'compliance',
      title: 'Compliance',
      description: 'Regulatory docs',
      icon: AlertCircle,
      color: 'bg-orange-500'
    },
    {
      id: 'templates',
      title: 'Templates',
      description: 'Document templates',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      id: 'versions',
      title: 'Versions',
      description: 'Version control',
      icon: Archive,
      color: 'bg-indigo-500'
    },
    {
      id: 'reminders',
      title: 'Reminders',
      description: 'Renewal alerts',
      icon: Calendar,
      color: 'bg-yellow-500'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Document settings',
      icon: Settings,
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-bold text-gray-900">Documentation & Policy Repository</h2>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {documentationViews.map((view) => (
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

export default DocumentationSubMenu;