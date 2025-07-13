import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Users, 
  BookOpen, 
  MessageCircle, 
  HelpCircle,
  Star,
  Bell
} from 'lucide-react';

interface GeneralStats {
  opportunitiesViewed: number;
  resourcesAccessed: number;
  communityPosts: number;
  helpRequestsResolved: number;
  savedOpportunities: number;
  profileCompleteness: number;
}

const GeneralDashboard: React.FC = () => {
  const [stats, setStats] = useState<GeneralStats>({
    opportunitiesViewed: 0,
    resourcesAccessed: 0,
    communityPosts: 0,
    helpRequestsResolved: 0,
    savedOpportunities: 0,
    profileCompleteness: 0
  });

  const [recentOpportunities, setRecentOpportunities] = useState([]);
  const [communityActivity, setCommunityActivity] = useState([]);

  useEffect(() => {
    fetchGeneralData();
  }, []);

  const fetchGeneralData = async () => {
    try {
      const response = await fetch('/api/general/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentOpportunities(data.opportunities);
        setCommunityActivity(data.community);
      }
    } catch (error) {
      console.error('Error fetching general data:', error);
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
            General Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore opportunities, connect with the community, and access resources.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Explore Opportunities
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Opportunities Viewed"
          value={stats.opportunitiesViewed}
          icon={<Globe className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          trend="+12 this week"
        />
        <StatCard
          title="Resources Accessed"
          value={stats.resourcesAccessed}
          icon={<BookOpen className="w-6 h-6 text-white" />}
          color="bg-green-500"
          trend="Learning active"
        />
        <StatCard
          title="Community Posts"
          value={stats.communityPosts}
          icon={<MessageCircle className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          trend="Engaged"
        />
        <StatCard
          title="Help Requests"
          value={stats.helpRequestsResolved}
          icon={<HelpCircle className="w-6 h-6 text-white" />}
          color="bg-orange-500"
          trend="Resolved"
        />
      </div>

      {/* Profile Completeness */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Profile Completeness
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {stats.profileCompleteness}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
            style={{ width: `${stats.profileCompleteness}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Complete your profile to get better recommendations
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Opportunities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Opportunities
          </h2>
          <div className="space-y-4">
            {recentOpportunities.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No recent opportunities</p>
            ) : (
              recentOpportunities.map((opportunity: any, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {opportunity.title}
                    </h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        {opportunity.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {opportunity.organization}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 font-medium">
                      {opportunity.type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {opportunity.datePosted}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Community Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Community Activity
          </h2>
          <div className="space-y-4">
            {communityActivity.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No community activity</p>
            ) : (
              communityActivity.map((activity: any, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.message}
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
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
            <Search className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Search Opportunities
            </span>
          </button>
          <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
            <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
            <span className="text-sm font-medium text-green-900 dark:text-green-300">
              Browse Resources
            </span>
          </button>
          <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
              Join Community
            </span>
          </button>
          <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
            <HelpCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
            <span className="text-sm font-medium text-orange-900 dark:text-orange-300">
              Get Support
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralDashboard;