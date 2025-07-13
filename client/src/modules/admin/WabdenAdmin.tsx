import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Globe, 
  UserCog, 
  DollarSign, 
  FileText, 
  Bot, 
  BarChart3,
  Settings,
  Menu,
  X
} from 'lucide-react';

// Import all admin modules
import AdminDashboard from './modules/dashboard/AdminDashboard';
import UserManagement from './modules/users/UserManagement';
import OpportunityManagement from './modules/opportunities/OpportunityManagement';

const WabdenAdmin: React.FC = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'opportunities', name: 'Opportunities', icon: Globe },
    { id: 'hr', name: 'HR Management', icon: UserCog },
    { id: 'accounting', name: 'Accounting', icon: DollarSign },
    { id: 'submissions', name: 'Submissions', icon: FileText },
    { id: 'bots', name: 'Bot Control', icon: Bot },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'opportunities':
        return <OpportunityManagement />;
      case 'hr':
        return <div className="p-6">HR Management Module - Coming Soon</div>;
      case 'accounting':
        return <div className="p-6">Accounting Module - Coming Soon</div>;
      case 'submissions':
        return <div className="p-6">Submissions Module - Coming Soon</div>;
      case 'bots':
        return <div className="p-6">Bot Control Module - Coming Soon</div>;
      case 'analytics':
        return <div className="p-6">Analytics Module - Coming Soon</div>;
      case 'settings':
        return <div className="p-6">Settings Module - Coming Soon</div>;
      default:
        return <AdminDashboard />;
    }
  };

  const currentModule = modules.find(m => m.id === activeModule);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 z-50">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Wabden Admin
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="mt-4">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <button
                    key={module.id}
                    onClick={() => {
                      setActiveModule(module.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      activeModule === module.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {module.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Wabden Admin
            </h1>
          </div>
          <nav className="flex-1 overflow-y-auto mt-4">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    activeModule === module.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {module.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-3"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentModule?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Admin Panel
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {renderActiveModule()}
        </div>
      </div>
    </div>
  );
};

export default WabdenAdmin;