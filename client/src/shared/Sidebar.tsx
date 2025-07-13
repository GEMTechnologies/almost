import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  BarChart3, 
  Target, 
  FileText, 
  DollarSign, 
  FileCheck, 
  TrendingUp, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building,
  Shield,
  Gem,
  Home,
  GraduationCap,
  BookOpen,
  Search,
  Award,
  Users
} from 'lucide-react';
import { useAuth } from '.././contexts/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is a student
  const isStudent = user?.userType === 'student';

  // Different navigation items based on user type
  // Student-specific navigation focused on education and opportunities
  const studentNavigationItems = [
    { id: 'dashboard', label: 'Student Dashboard', icon: GraduationCap, path: '/' },
    { id: 'scholarships', label: 'Scholarships', icon: Award, path: '/scholarships' },
    { id: 'courses', label: 'Courses', icon: BookOpen, path: '/courses' },
    { id: 'research', label: 'Research', icon: Search, path: '/research' },
    { id: 'jobs', label: 'Student Jobs', icon: Users, path: '/jobs' },
    { id: 'ai-assistant', label: 'Study Help', icon: Sparkles, path: '/human-help' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  // Business-specific navigation
  const businessNavigationItems = [
    { id: 'dashboard', label: 'Business Dashboard', icon: Building, path: '/' },
    { id: 'funding', label: 'Business Funding', icon: DollarSign, path: '/funding' },
    { id: 'business', label: 'Opportunities', icon: Target, path: '/business' },
    { id: 'proposals', label: 'Proposals', icon: FileText, path: '/proposals' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/analytics' },
    { id: 'credits', label: 'Credits', icon: Gem, path: '/credits' },
    { id: 'human-help', label: 'Business Help', icon: Users, path: '/human-help' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  // NGO-specific navigation focused on core needs
  const ngoNavigationItems = [
    { id: 'dashboard', label: 'NGO Dashboard', icon: BarChart3, path: '/' },
    { id: 'donor-discovery', label: 'Find Donors', icon: Target, path: '/donor-discovery' },
    { id: 'proposal-generator', label: 'AI Proposals', icon: Sparkles, path: '/proposal-generator' },
    { id: 'ngo-pipeline', label: 'NGO Tools', icon: Building, path: '/ngo-pipeline' },
    { id: 'documents', label: 'Documents', icon: FileCheck, path: '/documents' },
    { id: 'funding', label: 'Funding Tracker', icon: DollarSign, path: '/funding' },
    { id: 'credits', label: 'Credits', icon: Gem, path: '/credits' },
    { id: 'analytics', label: 'Reports', icon: TrendingUp, path: '/analytics' },
    { id: 'human-help', label: 'Get Help', icon: Users, path: '/human-help' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  // Determine user type
  const userType = user?.userType || 'ngo'; // Default to NGO
  const isBusiness = userType === 'business';

  // Choose navigation items based on user type
  let navigationItems;
  if (isStudent) {
    navigationItems = studentNavigationItems;
  } else if (isBusiness) {
    navigationItems = businessNavigationItems;
  } else {
    navigationItems = ngoNavigationItems; // Default to NGO
  }

  // Add admin dashboard for superusers
  const allItems = user?.is_superuser 
    ? [...navigationItems, { id: 'admin', label: 'Admin', icon: Shield, path: '/admin' }]
    : navigationItems;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-slate-900 border-r border-slate-700 z-40 overflow-y-auto hidden md:block"
    >
      <div className="flex flex-col h-full">
        {/* User Type Indicator & Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                {isStudent ? <GraduationCap className="w-4 h-4 text-emerald-400" /> : 
                 isBusiness ? <Building className="w-4 h-4 text-emerald-400" /> : 
                 <Target className="w-4 h-4 text-emerald-400" />}
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  {isStudent ? 'Student' : isBusiness ? 'Business' : 'NGO'} Portal
                </div>
                <div className="text-xs text-slate-400">
                  {user?.fullName || 'User'}
                </div>
              </div>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {allItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-emerald-500 text-white shadow-lg' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="font-medium truncate">{item.label}</span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* User Profile */}
        {!collapsed && user && (
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-3 p-3 bg-slate-800 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : user.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user.fullName || user.email || 'User'}</p>
                <p className="text-slate-400 text-sm">
                  {user.is_superuser ? 'Administrator' : isStudent ? 'Student' : isBusiness ? 'Business Owner' : 'NGO Director'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;