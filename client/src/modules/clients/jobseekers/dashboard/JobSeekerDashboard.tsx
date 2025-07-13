import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  User, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Star,
  Network
} from 'lucide-react';

interface JobSeekerStats {
  totalApplications: number;
  interviews: number;
  skillsCompleted: number;
  networkConnections: number;
  responseRate: number;
  profileViews: number;
}

const JobSeekerDashboard: React.FC = () => {
  const [stats, setStats] = useState<JobSeekerStats>({
    totalApplications: 0,
    interviews: 0,
    skillsCompleted: 0,
    networkConnections: 0,
    responseRate: 0,
    profileViews: 0
  });

  const [recentApplications, setRecentApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  useEffect(() => {
    fetchJobSeekerData();
  }, []);

  const fetchJobSeekerData = async () => {
    try {
      const response = await fetch('/api/jobseekers/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentApplications(data.applications);
        setRecommendedJobs(data.recommendations);
      }
    } catch (error) {
      console.error('Error fetching job seeker data:', error);
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
            Job Seeker Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your job search progress and enhance your career prospects.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Browse Jobs
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Applications Sent"
          value={stats.totalApplications}
          icon={<Briefcase className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          trend="+8 this week"
        />
        <StatCard
          title="Interviews"
          value={stats.interviews}
          icon={<User className="w-6 h-6 text-white" />}
          color="bg-green-500"
          trend="2 scheduled"
        />
        <StatCard
          title="Skills Completed"
          value={stats.skillsCompleted}
          icon={<BookOpen className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          trend="5 certificates"
        />
        <StatCard
          title="Network Connections"
          value={stats.networkConnections}
          icon={<Network className="w-6 h-6 text-white" />}
          color="bg-orange-500"
          trend="Growing"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Applications
            </h2>
            <div className="space-y-4">
              {recentApplications.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No recent applications</p>
              ) : (
                recentApplications.map((application: any, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      application.status === 'accepted' ? 'bg-green-500' : 
                      application.status === 'pending' ? 'bg-yellow-500' : 
                      application.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
                    }`}>
                      {application.status === 'accepted' ? <CheckCircle className="w-4 h-4 text-white" /> :
                       application.status === 'pending' ? <Clock className="w-4 h-4 text-white" /> :
                       <Briefcase className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {application.position}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {application.company} • Applied {application.dateApplied}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recommended Jobs
            </h2>
            <div className="space-y-4">
              {recommendedJobs.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No job recommendations</p>
              ) : (
                recommendedJobs.map((job: any, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {job.title}
                      </h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          {job.match}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {job.company}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 font-medium">
                        {job.salary}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs">
                        Apply
                      </button>
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
            <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Search Jobs
            </span>
          </button>
          <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
            <User className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
            <span className="text-sm font-medium text-green-900 dark:text-green-300">
              Update Profile
            </span>
          </button>
          <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
            <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
              Learn Skills
            </span>
          </button>
          <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
            <Network className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
            <span className="text-sm font-medium text-orange-900 dark:text-orange-300">
              Build Network
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;