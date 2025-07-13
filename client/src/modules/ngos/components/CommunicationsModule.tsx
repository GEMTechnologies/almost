import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Send,
  Mail,
  Users,
  Eye,
  Edit,
  Download,
  Calendar,
  TrendingUp,
  Target,
  BarChart3,
  Globe,
  Smartphone,
  Tv,
  Newspaper,
  Star,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import type { Campaign } from '../ngoLogic';

const CommunicationsModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample campaigns data
  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Annual Fundraising Gala 2024',
      type: 'fundraising',
      startDate: '2024-09-01',
      endDate: '2024-11-30',
      target: '$500,000 raised',
      channels: [
        { type: 'email', reach: 5000, engagement: 25, cost: 500 },
        { type: 'social_media', reach: 15000, engagement: 8, cost: 2000 },
        { type: 'website', reach: 8000, engagement: 15, cost: 300 }
      ],
      metrics: {
        sent: 5000,
        delivered: 4850,
        opened: 1212,
        clicked: 364,
        responses: 125,
        conversions: 45,
        revenue: 125000
      },
      status: 'active',
      budget: 10000,
      responsible: 'Communications Manager'
    },
    {
      id: '2',
      name: 'Child Protection Awareness Campaign',
      type: 'awareness',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      target: '50,000 people reached',
      channels: [
        { type: 'social_media', reach: 25000, engagement: 12, cost: 1500 },
        { type: 'print', reach: 10000, engagement: 5, cost: 3000 },
        { type: 'website', reach: 15000, engagement: 20, cost: 500 }
      ],
      metrics: {
        sent: 50000,
        delivered: 48500,
        opened: 9700,
        clicked: 1940,
        responses: 485,
        conversions: 150,
        revenue: 0
      },
      status: 'completed',
      budget: 8000,
      responsible: 'Program Manager'
    },
    {
      id: '3',
      name: 'Monthly Newsletter - Health Updates',
      type: 'newsletter',
      startDate: '2024-07-01',
      endDate: '2024-07-31',
      target: '2,000 subscribers',
      channels: [
        { type: 'email', reach: 2500, engagement: 35, cost: 200 }
      ],
      metrics: {
        sent: 2500,
        delivered: 2450,
        opened: 857,
        clicked: 343,
        responses: 25,
        conversions: 8,
        revenue: 2500
      },
      status: 'completed',
      budget: 500,
      responsible: 'Communications Officer'
    },
    {
      id: '4',
      name: 'Women Empowerment Workshop Series',
      type: 'event',
      startDate: '2024-08-15',
      endDate: '2024-09-30',
      target: '500 participants',
      channels: [
        { type: 'email', reach: 1500, engagement: 28, cost: 300 },
        { type: 'social_media', reach: 8000, engagement: 15, cost: 800 },
        { type: 'sms', reach: 3000, engagement: 45, cost: 600 }
      ],
      metrics: {
        sent: 12500,
        delivered: 12000,
        opened: 3600,
        clicked: 1080,
        responses: 350,
        conversions: 125,
        revenue: 0
      },
      status: 'active',
      budget: 3000,
      responsible: 'Gender Program Officer'
    }
  ];

  const communicationStats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalReach: campaigns.reduce((sum, c) => sum + c.channels.reduce((chSum, ch) => chSum + ch.reach, 0), 0),
    avgEngagement: campaigns.reduce((sum, c) => {
      const campaignEngagement = c.channels.reduce((chSum, ch) => chSum + ch.engagement, 0) / c.channels.length;
      return sum + campaignEngagement;
    }, 0) / campaigns.length,
    totalRevenue: campaigns.reduce((sum, c) => sum + c.metrics.revenue, 0),
    totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0)
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.responsible.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'paused': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'planned': return <Calendar className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'planned': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fundraising': return Target;
      case 'awareness': return Globe;
      case 'newsletter': return Newspaper;
      case 'event': return Calendar;
      default: return MessageSquare;
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return Smartphone;
      case 'social_media': return Globe;
      case 'website': return Globe;
      case 'print': return Newspaper;
      default: return MessageSquare;
    }
  };

  const calculateEngagementRate = (campaign: Campaign) => {
    const totalOpened = campaign.metrics.opened;
    const totalSent = campaign.metrics.sent;
    return totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
  };

  const calculateConversionRate = (campaign: Campaign) => {
    const totalConversions = campaign.metrics.conversions;
    const totalClicked = campaign.metrics.clicked;
    return totalClicked > 0 ? (totalConversions / totalClicked) * 100 : 0;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communications & Outreach</h1>
          <p className="text-gray-600">Manage donor communications, newsletters, campaigns, and outreach activities.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{communicationStats.totalCampaigns}</p>
              <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
            </div>
            <MessageSquare className="w-8 h-8 text-pink-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(communicationStats.totalReach)}</p>
              <p className="text-sm font-medium text-gray-600">Total Reach</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{Math.round(communicationStats.avgEngagement)}%</p>
              <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(communicationStats.totalRevenue)}</p>
              <p className="text-sm font-medium text-gray-600">Revenue Generated</p>
            </div>
            <Target className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{communicationStats.activeCampaigns}</p>
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search campaigns by name or responsible person..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="fundraising">Fundraising</option>
              <option value="awareness">Awareness</option>
              <option value="newsletter">Newsletter</option>
              <option value="event">Event</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-6">
        {filteredCampaigns.map((campaign, index) => {
          const TypeIcon = getTypeIcon(campaign.type);
          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-pink-100">
                        <TypeIcon className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{campaign.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="capitalize">{campaign.type} campaign</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(campaign.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Campaign Metrics:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Messages Sent:</span>
                          <span className="font-medium">{formatNumber(campaign.metrics.sent)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivered:</span>
                          <span className="font-medium">{formatNumber(campaign.metrics.delivered)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Opened:</span>
                          <span className="font-medium">{formatNumber(campaign.metrics.opened)} ({Math.round(calculateEngagementRate(campaign))}%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Clicked:</span>
                          <span className="font-medium">{formatNumber(campaign.metrics.clicked)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Conversions:</span>
                          <span className="font-medium">{formatNumber(campaign.metrics.conversions)} ({Math.round(calculateConversionRate(campaign))}%)</span>
                        </div>
                        {campaign.metrics.revenue > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Revenue:</span>
                            <span className="font-medium text-green-600">{formatCurrency(campaign.metrics.revenue)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Communication Channels:</h4>
                      <div className="space-y-3">
                        {campaign.channels.map((channel, idx) => {
                          const ChannelIcon = getChannelIcon(channel.type);
                          return (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <ChannelIcon className="w-4 h-4 text-gray-600" />
                                <span className="capitalize text-sm font-medium">{channel.type.replace('_', ' ')}</span>
                              </div>
                              <div className="text-right text-sm">
                                <p className="font-medium">{formatNumber(channel.reach)} reach</p>
                                <p className="text-gray-600">{channel.engagement}% engagement</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>Target: {campaign.target}</span>
                      <span>Budget: {formatCurrency(campaign.budget)}</span>
                      <span>Responsible: {campaign.responsible}</span>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </button>
                  {campaign.status === 'active' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      <Send className="w-4 h-4" />
                      Send Update
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-pink-600" />
            <h3 className="font-bold text-gray-900">Email Templates</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Create and manage email templates for different communication types.</p>
          <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
            Manage Templates
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-gray-900">Contact Management</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Organize contacts into groups for targeted communication campaigns.</p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Manage Contacts
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-gray-900">Campaign Analytics</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Track performance metrics, engagement rates, and ROI analysis.</p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            View Analytics
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunicationsModule;