import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  TrendingUp, 
  DollarSign, 
  Users, 
  FileText,
  Bell,
  Calendar,
  Target,
  Heart,
  MapPin,
  Award,
  Activity,
  ChevronRight,
  Plus,
  Filter,
  Search,
  BarChart3,
  Globe,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  Zap
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // NGO-focused dashboard stats
  const ngoStats = [
    { 
      label: 'Active Projects', 
      value: '18', 
      icon: Activity, 
      color: 'blue',
      trend: '+12%',
      subtitle: 'Across 5 regions'
    },
    { 
      label: 'Total Impact Funding', 
      value: '$3.2M', 
      icon: DollarSign, 
      color: 'green',
      trend: '+28%',
      subtitle: 'This fiscal year'
    },
    { 
      label: 'Beneficiaries Reached', 
      value: '45,230', 
      icon: Heart, 
      color: 'red',
      trend: '+15%',
      subtitle: 'Lives impacted'
    },
    { 
      label: 'Partner NGOs', 
      value: '127', 
      icon: Users, 
      color: 'purple',
      trend: '+8%',
      subtitle: 'Active collaborations'
    },
  ];

  const recentActivities = [
    { 
      id: 1, 
      type: 'project', 
      title: 'Water Access Project Phase 2 launched in Gulu District', 
      time: '3 hours ago', 
      status: 'active',
      icon: Activity,
      priority: 'high'
    },
    { 
      id: 2, 
      type: 'funding', 
      title: 'USAID Health Systems Grant approved - $850,000', 
      time: '1 day ago', 
      status: 'approved',
      icon: CheckCircle,
      priority: 'high'
    },
    { 
      id: 3, 
      type: 'partnership', 
      title: 'New partnership with Kampala Medical NGO established', 
      time: '2 days ago', 
      status: 'new',
      icon: Users,
      priority: 'medium'
    },
    { 
      id: 4, 
      type: 'deadline', 
      title: 'EU Education Grant application due in 5 days', 
      time: '3 days ago', 
      status: 'urgent',
      icon: AlertCircle,
      priority: 'urgent'
    },
    { 
      id: 5, 
      type: 'impact', 
      title: 'Monthly impact report: 2,340 new beneficiaries', 
      time: '1 week ago', 
      status: 'completed',
      icon: BarChart3,
      priority: 'low'
    },
  ];

  const upcomingOpportunities = [
    { 
      id: 1, 
      title: 'Gates Foundation Global Health Initiative', 
      deadline: '2024-08-15', 
      amount: '$2.5M',
      match: '94%',
      category: 'Health',
      region: 'East Africa'
    },
    { 
      id: 2, 
      title: 'DFID Education Transformation Fund', 
      deadline: '2024-08-25', 
      amount: '$1.8M',
      match: '89%',
      category: 'Education',
      region: 'Uganda'
    },
    { 
      id: 3, 
      title: 'World Bank Climate Resilience Program', 
      deadline: '2024-09-01', 
      amount: '$3.2M',
      match: '86%',
      category: 'Environment',
      region: 'Regional'
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Start New Project Proposal',
      description: 'Launch AI-powered proposal generator',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
      path: '/proposal-generator'
    },
    {
      id: 2,
      title: 'Find Partner NGOs',
      description: 'Discover collaboration opportunities',
      icon: Users,
      color: 'bg-green-600 hover:bg-green-700',
      path: '/donor-discovery'
    },
    {
      id: 3,
      title: 'Impact Analytics',
      description: 'View detailed performance metrics',
      icon: BarChart3,
      color: 'bg-purple-600 hover:bg-purple-700',
      path: '/analytics'
    },
    {
      id: 4,
      title: 'Funding Opportunities',
      description: 'Browse latest grants and funding',
      icon: DollarSign,
      color: 'bg-orange-600 hover:bg-orange-700',
      path: '/funding'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                NGO Impact Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Transforming communities through strategic partnerships and funding excellence.</p>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {ngoStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <stat.icon className={`w-7 h-7 text-${stat.color}-600`} />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-gray-900 mb-1">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities - Larger */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Activities</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    activeFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveFilter('urgent')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    activeFilter === 'urgent' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Urgent
                </button>
              </div>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivities
                .filter(activity => activeFilter === 'all' || activity.priority === activeFilter)
                .map((activity, index) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.priority === 'urgent' ? 'bg-red-100' :
                    activity.priority === 'high' ? 'bg-blue-100' :
                    activity.priority === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <activity.icon className={`w-5 h-5 ${
                      activity.priority === 'urgent' ? 'text-red-600' :
                      activity.priority === 'high' ? 'text-blue-600' :
                      activity.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{activity.title}</p>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'approved' ? 'bg-green-100 text-green-700' :
                        activity.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        activity.status === 'urgent' ? 'bg-red-100 text-red-700' :
                        activity.status === 'new' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* High-Impact Opportunities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">High-Impact Opportunities</h2>
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            
            <div className="space-y-4">
              {upcomingOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{opportunity.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                          {opportunity.category}
                        </span>
                        <span className="text-xs text-gray-500">{opportunity.region}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{opportunity.amount}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">{opportunity.match} match</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      Due: {opportunity.deadline}
                    </div>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                      Apply Now →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`p-6 ${action.color} text-white rounded-2xl transition-all hover:scale-105 hover:shadow-lg text-left group`}
              >
                <action.icon className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-lg mb-2">{action.title}</p>
                <p className="text-sm opacity-90">{action.description}</p>
                <ChevronRight className="w-5 h-5 mt-3 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Impact Summary Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <Heart className="w-12 h-12 mx-auto mb-4" />
              <p className="text-3xl font-bold mb-1">45,230</p>
              <p className="opacity-90">Lives Impacted This Year</p>
            </div>
            <div className="text-center">
              <Globe className="w-12 h-12 mx-auto mb-4" />
              <p className="text-3xl font-bold mb-1">127</p>
              <p className="opacity-90">Partner Organizations</p>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-4" />
              <p className="text-3xl font-bold mb-1">$3.2M</p>
              <p className="opacity-90">Total Funding Secured</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;