/**
 * Granada OS - Document Analytics Dashboard
 * Comprehensive document usage analytics and insights
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  FileText,
  TrendingUp,
  Users,
  Download,
  Eye,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface DocumentAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnalyticsData {
  documentUsage: any[];
  categoryBreakdown: any[];
  userActivity: any[];
  timelineData: any[];
  complianceStatus: any[];
  topDocuments: any[];
  systemHealth: {
    totalDocuments: number;
    totalViews: number;
    totalDownloads: number;
    activeUsers: number;
    storageUsed: number;
    averageResponseTime: number;
  };
}

export const DocumentAnalytics: React.FC<DocumentAnalyticsProps> = ({
  isOpen,
  onClose
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  useEffect(() => {
    if (isOpen) {
      fetchAnalyticsData();
    }
  }, [isOpen, selectedPeriod, selectedCategory]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalyticsData({
        documentUsage: [
          { name: 'Mon', views: 45, downloads: 12, uploads: 3 },
          { name: 'Tue', views: 52, downloads: 18, uploads: 7 },
          { name: 'Wed', views: 38, downloads: 8, uploads: 2 },
          { name: 'Thu', views: 67, downloads: 25, uploads: 5 },
          { name: 'Fri', views: 71, downloads: 32, uploads: 8 },
          { name: 'Sat', views: 29, downloads: 5, uploads: 1 },
          { name: 'Sun', views: 34, downloads: 9, uploads: 2 }
        ],
        categoryBreakdown: [
          { name: 'Governance', value: 28, count: 45 },
          { name: 'Financial', value: 22, count: 35 },
          { name: 'Policies', value: 18, count: 29 },
          { name: 'Compliance', value: 15, count: 24 },
          { name: 'Monitoring', value: 12, count: 19 },
          { name: 'HR', value: 5, count: 8 }
        ],
        userActivity: [
          { name: 'Dr. Sarah Johnson', views: 87, downloads: 23, role: 'Director' },
          { name: 'James Wilson', views: 65, downloads: 18, role: 'Manager' },
          { name: 'Maria Rodriguez', views: 54, downloads: 15, role: 'Coordinator' },
          { name: 'Ahmed Hassan', views: 43, downloads: 12, role: 'Officer' },
          { name: 'Lisa Chen', views: 38, downloads: 9, role: 'Assistant' }
        ],
        timelineData: [
          { time: '00:00', activity: 5 },
          { time: '04:00', activity: 2 },
          { time: '08:00', activity: 25 },
          { time: '12:00', activity: 45 },
          { time: '16:00', activity: 38 },
          { time: '20:00', activity: 15 }
        ],
        complianceStatus: [
          { category: 'Governance', current: 12, required: 15, compliance: 80 },
          { category: 'Financial', current: 8, required: 10, compliance: 80 },
          { category: 'Policies', current: 18, required: 20, compliance: 90 },
          { category: 'Compliance', current: 14, required: 16, compliance: 87.5 },
          { category: 'Monitoring', current: 6, required: 8, compliance: 75 },
          { category: 'HR', current: 9, required: 12, compliance: 75 }
        ],
        topDocuments: [
          { name: 'Child Protection Policy', views: 156, downloads: 45, category: 'Policies' },
          { name: 'Financial Procedures Manual', views: 134, downloads: 38, category: 'Financial' },
          { name: 'Staff Code of Conduct', views: 123, downloads: 34, category: 'HR' },
          { name: 'Risk Assessment Framework', views: 98, downloads: 28, category: 'Compliance' },
          { name: 'Board Meeting Minutes', views: 87, downloads: 22, category: 'Governance' }
        ],
        systemHealth: {
          totalDocuments: 160,
          totalViews: 2847,
          totalDownloads: 634,
          activeUsers: 24,
          storageUsed: 2.4, // GB
          averageResponseTime: 245 // ms
        }
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (!isOpen || !analyticsData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800 rounded-2xl p-6 w-full max-w-7xl max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Document Analytics</h2>
              <p className="text-slate-400">Comprehensive document usage insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchAnalyticsData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold">{analyticsData.systemHealth.totalDocuments}</div>
                <div className="text-sm text-slate-400">Total Documents</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold">{analyticsData.systemHealth.totalViews.toLocaleString()}</div>
                <div className="text-sm text-slate-400">Total Views</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Download className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold">{analyticsData.systemHealth.totalDownloads}</div>
                <div className="text-sm text-slate-400">Downloads</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold">{analyticsData.systemHealth.activeUsers}</div>
                <div className="text-sm text-slate-400">Active Users</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
              <div>
                <div className="text-2xl font-bold">{analyticsData.systemHealth.storageUsed}GB</div>
                <div className="text-sm text-slate-400">Storage Used</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-orange-400" />
              <div>
                <div className="text-2xl font-bold">{analyticsData.systemHealth.averageResponseTime}ms</div>
                <div className="text-sm text-slate-400">Avg Response</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Document Usage Trends */}
          <div className="bg-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Document Usage Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.documentUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#374151', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="downloads" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="uploads" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="bg-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Documents by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#374151', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Compliance Status */}
          <div className="bg-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Compliance Status</h3>
            <div className="space-y-4">
              {analyticsData.complianceStatus.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm text-slate-400">
                      {item.current}/{item.required} ({item.compliance}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.compliance >= 90 ? 'bg-green-500' : 
                        item.compliance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.compliance}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Documents */}
          <div className="bg-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Most Accessed Documents</h3>
            <div className="space-y-3">
              {analyticsData.topDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{doc.name}</div>
                    <div className="text-xs text-slate-400">{doc.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{doc.views} views</div>
                    <div className="text-xs text-slate-400">{doc.downloads} downloads</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">User Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.userActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#374151', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Bar dataKey="views" fill="#3B82F6" />
              <Bar dataKey="downloads" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};