import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Globe, 
  Bot, 
  TrendingUp, 
  DollarSign, 
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalOpportunities: number;
  activeBots: number;
  monthlyGrowth: number;
  totalRevenue: number;
  totalProposals: number;
  pendingVerifications: number;
  systemHealth: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOpportunities: 0,
    activeBots: 0,
    monthlyGrowth: 0,
    totalRevenue: 0,
    totalProposals: 0,
    pendingVerifications: 0,
    systemHealth: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.activity);
        setSystemAlerts(data.alerts);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
  }> = ({ title, value, icon, color, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor system performance and manage Granada OS platform.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${stats.systemHealth > 90 ? 'bg-green-500' : stats.systemHealth > 70 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            System Health: {stats.systemHealth}%
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          trend="+12% this month"
        />
        <StatCard
          title="Opportunities"
          value={stats.totalOpportunities.toLocaleString()}
          icon={<Globe className="w-6 h-6 text-white" />}
          color="bg-green-500"
          trend="+25 this week"
        />
        <StatCard
          title="Active Bots"
          value={stats.activeBots}
          icon={<Bot className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          trend="Running smoothly"
        />
        <StatCard
          title="Monthly Growth"
          value={`${stats.monthlyGrowth}%`}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-orange-500"
          trend="Above target"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-green-600"
          trend="+18% this month"
        />
        <StatCard
          title="Proposals Generated"
          value={stats.totalProposals.toLocaleString()}
          icon={<FileText className="w-6 h-6 text-white" />}
          color="bg-blue-600"
          trend="+45 this week"
        />
        <StatCard
          title="Pending Verifications"
          value={stats.pendingVerifications}
          icon={<AlertCircle className="w-6 h-6 text-white" />}
          color="bg-yellow-600"
          trend="Requires attention"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
            ) : (
              recentActivity.map((activity: any, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            System Alerts
          </h2>
          <div className="space-y-4">
            {systemAlerts.length === 0 ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">All systems operational</span>
              </div>
            ) : (
              systemAlerts.map((alert: any, index) => (
                <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                  alert.type === 'error' ? 'bg-red-50 dark:bg-red-900/20' :
                  alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                  'bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    alert.type === 'error' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}>
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {alert.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Manage Users
            </span>
          </button>
          <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
            <Globe className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
            <span className="text-sm font-medium text-green-900 dark:text-green-300">
              Verify Opportunities
            </span>
          </button>
          <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
            <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
              Control Bots
            </span>
          </button>
          <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
            <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
            <span className="text-sm font-medium text-orange-900 dark:text-orange-300">
              View Analytics
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;