import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Download,
  Clock,
  Calendar,
  FileText,
  Activity,
  PieChart,
  Globe
} from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  totalDownloads: number;
  uniqueUsers: number;
  avgTimeSpent: string;
  topLocations: { country: string; views: number }[];
  dailyActivity: { date: string; views: number; downloads: number }[];
  documentPerformance: { name: string; views: number; downloads: number }[];
}

const DocumentAnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    
    // Mock analytics data
    const mockData: AnalyticsData = {
      totalViews: 1247,
      totalDownloads: 89,
      uniqueUsers: 156,
      avgTimeSpent: '4m 32s',
      topLocations: [
        { country: 'Uganda', views: 456 },
        { country: 'Kenya', views: 234 },
        { country: 'Tanzania', views: 178 },
        { country: 'South Sudan', views: 123 },
        { country: 'Rwanda', views: 89 }
      ],
      dailyActivity: [
        { date: '2024-01-14', views: 45, downloads: 3 },
        { date: '2024-01-15', views: 67, downloads: 5 },
        { date: '2024-01-16', views: 89, downloads: 8 },
        { date: '2024-01-17', views: 123, downloads: 12 },
        { date: '2024-01-18', views: 156, downloads: 15 },
        { date: '2024-01-19', views: 134, downloads: 11 },
        { date: '2024-01-20', views: 178, downloads: 18 }
      ],
      documentPerformance: [
        { name: 'Child Protection Policy v3.2', views: 456, downloads: 34 },
        { name: 'Financial Manual 2024', views: 234, downloads: 18 },
        { name: 'Code of Conduct', views: 178, downloads: 12 },
        { name: 'HR Policies', views: 123, downloads: 8 },
        { name: 'Safeguarding Guidelines', views: 89, downloads: 6 }
      ]
    };
    
    setTimeout(() => {
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/ngos/documents">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Documents
              </motion.button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-400" />
                Document Analytics
              </h1>
              <p className="text-slate-400">Insights and performance metrics for your documents</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 rounded-xl p-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</p>
                <p className="text-sm text-slate-400">Total Views</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12% from last period</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 rounded-xl p-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Download className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analyticsData.totalDownloads}</p>
                <p className="text-sm text-slate-400">Downloads</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+8% from last period</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 rounded-xl p-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analyticsData.uniqueUsers}</p>
                <p className="text-sm text-slate-400">Unique Users</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+15% from last period</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900 rounded-xl p-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analyticsData.avgTimeSpent}</p>
                <p className="text-sm text-slate-400">Avg Time Spent</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+3% from last period</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Activity Chart */}
          <div className="lg:col-span-2 bg-slate-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Daily Activity
            </h2>
            
            <div className="h-80 flex items-end justify-between gap-2">
              {analyticsData.dailyActivity.map((day, index) => {
                const maxViews = Math.max(...analyticsData.dailyActivity.map(d => d.views));
                const viewHeight = (day.views / maxViews) * 100;
                const downloadHeight = (day.downloads / Math.max(...analyticsData.dailyActivity.map(d => d.downloads))) * 30;
                
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center gap-1 h-60">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${viewHeight}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="w-full bg-blue-500 rounded-t"
                        style={{ minHeight: '4px' }}
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${downloadHeight}px` }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                        className="w-full bg-green-500 rounded-b"
                        style={{ minHeight: '2px' }}
                      />
                    </div>
                    <div className="text-xs text-slate-400 text-center">
                      <div>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="text-blue-400">{day.views}</div>
                      <div className="text-green-400">{day.downloads}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span>Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>Downloads</span>
              </div>
            </div>
          </div>

          {/* Top Locations */}
          <div className="bg-slate-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-400" />
              Top Locations
            </h2>
            
            <div className="space-y-4">
              {analyticsData.topLocations.map((location, index) => {
                const percentage = (location.views / analyticsData.totalViews) * 100;
                
                return (
                  <motion.div
                    key={location.country}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{location.country}</span>
                        <span className="text-sm text-slate-400">{location.views}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                        />
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{percentage.toFixed(1)}%</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Document Performance */}
        <div className="mt-6 bg-slate-900 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            Document Performance
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 font-medium text-slate-400">Document</th>
                  <th className="text-right py-3 font-medium text-slate-400">Views</th>
                  <th className="text-right py-3 font-medium text-slate-400">Downloads</th>
                  <th className="text-right py-3 font-medium text-slate-400">Conversion Rate</th>
                  <th className="text-right py-3 font-medium text-slate-400">Trend</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.documentPerformance.map((doc, index) => {
                  const conversionRate = ((doc.downloads / doc.views) * 100).toFixed(1);
                  
                  return (
                    <motion.tr
                      key={doc.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-slate-800/50 hover:bg-slate-800/20"
                    >
                      <td className="py-4 font-medium">{doc.name}</td>
                      <td className="py-4 text-right">{doc.views.toLocaleString()}</td>
                      <td className="py-4 text-right">{doc.downloads}</td>
                      <td className="py-4 text-right">{conversionRate}%</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1 text-green-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">+{Math.floor(Math.random() * 20)}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalyticsPage;