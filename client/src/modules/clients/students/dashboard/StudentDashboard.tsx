import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Users, TrendingUp, Calendar, Bell, Target, Star } from 'lucide-react';

interface StudentStats {
  totalApplications: number;
  scholarshipsWon: number;
  mentoringSessions: number;
  academicProgress: number;
  upcomingDeadlines: number;
}

const StudentDashboard: React.FC = () => {
  const [stats, setStats] = useState<StudentStats>({
    totalApplications: 0,
    scholarshipsWon: 0,
    mentoringSessions: 0,
    academicProgress: 0,
    upcomingDeadlines: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [scholarshipOpportunities, setScholarshipOpportunities] = useState([]);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const response = await fetch('/api/students/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentActivities(data.activities);
        setScholarshipOpportunities(data.scholarships);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
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
            Student Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's your academic and scholarship progress.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Apply for Scholarship
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={<BookOpen className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          trend="+3 this month"
        />
        <StatCard
          title="Scholarships Won"
          value={stats.scholarshipsWon}
          icon={<Award className="w-6 h-6 text-white" />}
          color="bg-green-500"
          trend="$45,000 total"
        />
        <StatCard
          title="Mentoring Sessions"
          value={stats.mentoringSessions}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          trend="2 scheduled"
        />
        <StatCard
          title="Academic Progress"
          value={`${stats.academicProgress}%`}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-orange-500"
          trend="On track"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activities
            </h2>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
              ) : (
                recentActivities.map((activity: any, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
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
        </div>

        {/* Scholarship Opportunities */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              New Scholarships
            </h2>
            <div className="space-y-4">
              {scholarshipOpportunities.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No new scholarships available</p>
              ) : (
                scholarshipOpportunities.map((scholarship: any, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      {scholarship.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {scholarship.amount}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Due: {scholarship.deadline}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm">
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
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Browse Scholarships
            </span>
          </button>
          <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
            <Users className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
            <span className="text-sm font-medium text-green-900 dark:text-green-300">
              Find Mentor
            </span>
          </button>
          <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
            <Target className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
              Set Goals
            </span>
          </button>
          <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
            <Star className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
            <span className="text-sm font-medium text-orange-900 dark:text-orange-300">
              Track Progress
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;