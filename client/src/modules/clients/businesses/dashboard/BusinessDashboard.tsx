import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Briefcase, 
  PieChart,
  ArrowUpRight,
  Building
} from 'lucide-react';

interface BusinessStats {
  totalFunding: number;
  activePartnerships: number;
  employeeCount: number;
  growthRate: number;
  innovationProjects: number;
  complianceScore: number;
}

const BusinessDashboard: React.FC = () => {
  const [stats, setStats] = useState<BusinessStats>({
    totalFunding: 0,
    activePartnerships: 0,
    employeeCount: 0,
    growthRate: 0,
    innovationProjects: 0,
    complianceScore: 0
  });

  const [fundingOpportunities, setFundingOpportunities] = useState([]);
  const [partnerships, setPartnerships] = useState([]);

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    try {
      const response = await fetch('/api/businesses/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setFundingOpportunities(data.funding);
        setPartnerships(data.partnerships);
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
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
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {trend}
            </p>
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
            Business Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your business growth, funding, and partnerships.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Apply for Funding
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Funding"
          value={`$${stats.totalFunding.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-green-500"
          trend="15% increase"
        />
        <StatCard
          title="Active Partnerships"
          value={stats.activePartnerships}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          trend="3 new this month"
        />
        <StatCard
          title="Employee Count"
          value={stats.employeeCount}
          icon={<Building className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          trend="Growing"
        />
        <StatCard
          title="Growth Rate"
          value={`${stats.growthRate}%`}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-orange-500"
          trend="YoY growth"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funding Opportunities */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Funding Opportunities
            </h2>
            <div className="space-y-4">
              {fundingOpportunities.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No funding opportunities available</p>
              ) : (
                fundingOpportunities.map((opportunity: any, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {opportunity.title}
                      </h3>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {opportunity.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {opportunity.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 font-medium">
                        {opportunity.amount}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Due: {opportunity.deadline}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Business Metrics */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Business Metrics
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Innovation Projects</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {stats.innovationProjects}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Compliance Score</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {stats.complianceScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${stats.complianceScore}%` }}
                ></div>
              </div>
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
          <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
            <span className="text-sm font-medium text-green-900 dark:text-green-300">
              Apply for Funding
            </span>
          </button>
          <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Find Partners
            </span>
          </button>
          <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
            <Target className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
              Set Goals
            </span>
          </button>
          <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
            <PieChart className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
            <span className="text-sm font-medium text-orange-900 dark:text-orange-300">
              View Analytics
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;