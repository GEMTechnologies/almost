import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  BarChart3, 
  Settings, 
  Download,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  Trash2,
  Edit
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';

interface CreditUsage {
  id: string;
  description: string;
  credits: number;
  date: string;
  type: 'proposal' | 'search' | 'generation' | 'analysis';
  status: 'completed' | 'failed';
}

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired';
  nextBilling: string;
  amount: number;
  features: string[];
}

const UserDashboard: React.FC = () => {
  const user = { id: 'demo-user' }; // Demo user for now
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'payments' | 'settings'>('overview');

  // Fetch user billing data
  const { data: billingData } = useQuery({
    queryKey: ['/api/billing/dashboard'],
    queryFn: () => fetch('/api/billing/dashboard', {
      headers: { 'X-User-ID': user?.id || 'demo-user' }
    }).then(res => res.json())
  });

  // Fetch detailed usage analytics
  const { data: usageData } = useQuery({
    queryKey: ['/api/billing/usage-analytics'],
    queryFn: () => fetch('/api/billing/usage-analytics', {
      headers: { 'X-User-ID': user?.id || 'demo-user' }
    }).then(res => res.json())
  });

  // Fetch subscription details
  const { data: subscriptionData } = useQuery({
    queryKey: ['/api/billing/subscriptions'],
    queryFn: () => fetch('/api/billing/subscriptions', {
      headers: { 'X-User-ID': user?.id || 'demo-user' }
    }).then(res => res.json())
  });

  // Cancel subscription mutation
  const cancelSubscription = useMutation({
    mutationFn: (subscriptionId: string) => 
      fetch('/api/billing/cancel-subscription', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-ID': user?.id || 'demo-user'
        },
        body: JSON.stringify({ subscriptionId })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/billing/subscriptions'] });
    }
  });

  const stats = [
    {
      label: 'Current Balance',
      value: billingData?.balance || 0,
      suffix: 'Credits',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      label: 'This Month Usage',
      value: usageData?.monthlyUsage || 0,
      suffix: 'Credits',
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      label: 'Total Spent',
      value: billingData?.totalSpent || 0,
      prefix: '$',
      color: 'text-purple-400',
      bg: 'bg-purple-500/20',
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      label: 'Success Rate',
      value: usageData?.successRate || 98,
      suffix: '%',
      color: 'text-green-400',
      bg: 'bg-green-500/20',
      icon: <Activity className="w-5 h-5" />
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bg} backdrop-blur-xl rounded-xl p-4 border border-slate-700/50`}
          >
            <div className="flex items-center gap-3">
              <div className={`${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <div className={`text-lg font-bold ${stat.color}`}>
                  {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-slate-400 text-xs">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active Subscriptions */}
      {subscriptionData?.subscriptions && subscriptionData.subscriptions.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Active Subscriptions
          </h3>
          <div className="space-y-3">
            {subscriptionData.subscriptions.map((sub: Subscription) => (
              <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div>
                  <h4 className="font-semibold text-white">{sub.plan}</h4>
                  <p className="text-slate-400 text-sm">Next billing: {sub.nextBilling}</p>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">${sub.amount}/month</div>
                  <button
                    onClick={() => cancelSubscription.mutate(sub.id)}
                    className="text-red-400 hover:text-red-300 text-xs mt-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/billing">
          <a className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-4 rounded-xl text-white font-semibold hover:scale-105 transition-transform block text-center">
            <CreditCard className="w-6 h-6 mx-auto mb-2" />
            Buy More Credits
          </a>
        </Link>
        <button
          onClick={() => setActiveTab('usage')}
          className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
        >
          <BarChart3 className="w-6 h-6 mx-auto mb-2" />
          View Usage
        </button>
        <Link href="/billing/history">
          <a className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl text-white font-semibold hover:scale-105 transition-transform block text-center">
            <Download className="w-6 h-6 mx-auto mb-2" />
            Download Reports
          </a>
        </Link>
      </div>
    </div>
  );

  const renderUsage = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-bold text-white mb-4">Credit Usage Breakdown</h3>
        <div className="space-y-3">
          {usageData?.recentUsage?.map((usage: CreditUsage) => (
            <div key={usage.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  usage.status === 'completed' ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <div>
                  <h4 className="text-white font-medium">{usage.description}</h4>
                  <p className="text-slate-400 text-xs">{usage.date}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">-{usage.credits} credits</div>
                <div className={`text-xs ${
                  usage.status === 'completed' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {usage.status}
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-slate-400">
              <Activity className="w-12 h-12 mx-auto mb-4" />
              <p>No usage data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-bold text-white mb-4">Payment Methods</h3>
        <div className="space-y-3">
          <div className="p-4 border border-slate-600 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-400" />
                <div>
                  <h4 className="text-white font-medium">Mobile Money</h4>
                  <p className="text-slate-400 text-sm">**** **** ****5678</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-slate-400 hover:text-white">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-bold text-white mb-4">Billing Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Auto-recharge</h4>
              <p className="text-slate-400 text-sm">Automatically buy credits when balance is low</p>
            </div>
            <button className="bg-slate-600 rounded-full w-12 h-6 relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Email notifications</h4>
              <p className="text-slate-400 text-sm">Get notified about billing events</p>
            </div>
            <button className="bg-emerald-500 rounded-full w-12 h-6 relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'usage', label: 'Usage', icon: <Activity className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Billing Dashboard</h1>
        <p className="text-slate-400">Manage your credits, usage, and billing preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 bg-slate-800/50 backdrop-blur-xl rounded-xl p-1 border border-slate-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'usage' && renderUsage()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'settings' && renderSettings()}
      </motion.div>
    </div>
  );
};

export default UserDashboard;