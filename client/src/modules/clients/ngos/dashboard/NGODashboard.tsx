import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Globe
} from 'lucide-react';

interface NGOStats {
  totalGrants: number;
  activeProjects: number;
  beneficiaries: number;
  successRate: number;
  pendingApplications: number;
  totalFunding: number;
}

const NGODashboard: React.FC = () => {
  const [stats, setStats] = useState<NGOStats>({
    totalGrants: 0,
    activeProjects: 0,
    beneficiaries: 0,
    successRate: 0,
    pendingApplications: 0,
    totalFunding: 0
  });

  const [recentGrants, setRecentGrants] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);

  useEffect(() => {
    fetchNGOData();
  }, []);

  const fetchNGOData = async () => {
    try {
      const response = await fetch('/api/ngos/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentGrants(data.grants);
        setActiveProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching NGO data:', error);
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
            NGO Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your organization's grants, projects, and impact metrics.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Apply for Grant
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Grants"
          value={stats.totalGrants}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          trend="+5 this quarter"
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={<FileText className="w-6 h-6 text-white" />}
          color="bg-green-500"
          trend="12 completed"
        />
        <StatCard
          title="Beneficiaries"
          value={stats.beneficiaries.toLocaleString()}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          trend="+2,500 this year"
        />
        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-orange-500"
          trend="Above average"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Grants */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Grant Activity
            </h2>
            <div className="space-y-4">
              {recentGrants.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No recent grant activity</p>
              ) : (
                recentGrants.map((grant: any, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      grant.status === 'approved' ? 'bg-green-500' : 
                      grant.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {grant.status === 'approved' ? <CheckCircle className="w-4 h-4 text-white" /> :
                       grant.status === 'pending' ? <Clock className="w-4 h-4 text-white" /> :
                       <AlertCircle className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {grant.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {grant.amount} • {grant.donor}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      grant.status === 'approved' ? 'bg-green-100 text-green-800' :
                      grant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {grant.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Active Projects
            </h2>
            <div className="space-y-4">
              {activeProjects.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No active projects</p>
              ) : (
                activeProjects.map((project: any, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      {project.name}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Progress
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
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
            <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Find Grants
            </span>
          </button>
          <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
            <FileText className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
            <span className="text-sm font-medium text-green-900 dark:text-green-300">
              Create Proposal
            </span>
          </button>
          <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
              Manage Team
            </span>
          </button>
          <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
            <Globe className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
            <span className="text-sm font-medium text-orange-900 dark:text-orange-300">
              View Impact
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;