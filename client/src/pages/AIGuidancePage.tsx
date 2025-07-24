import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'wouter';
import {
  ArrowLeft,
  Brain,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Target,
  Zap,
  CheckCircle,
  Clock,
  Star,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AIInsight {
  id: string;
  type: 'guidance' | 'warning' | 'suggestion' | 'help_offer';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  actions: AIAction[];
  metadata: {
    confidence: number;
    estimatedImpact: number;
    source: string;
    timestamp: string;
  };
  category: string;
  status: 'new' | 'viewed' | 'acted' | 'dismissed';
}

interface AIAction {
  id: string;
  type: 'navigate' | 'dismiss' | 'bookmark' | 'share';
  label: string;
  url?: string;
}

const AIGuidancePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('priority');

  const categories = [
    { id: 'all', name: 'All Insights', icon: <Brain className="w-4 h-4" /> },
    { id: 'funding', name: 'Funding Opportunities', icon: <Target className="w-4 h-4" /> },
    { id: 'application', name: 'Application Tips', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'strategy', name: 'Strategy Advice', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'warnings', name: 'Warnings & Alerts', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'help', name: 'Help Offers', icon: <HelpCircle className="w-4 h-4" /> }
  ];

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          type: 'guidance',
          priority: 'high',
          title: 'Perfect Grant Match Found',
          message: 'Based on your organization profile, I found a health grant with 95% compatibility. The Gates Foundation Health Innovation Grant matches your community health focus and has a $100K funding range.',
          actions: [
            { id: '1', type: 'navigate', label: 'View Opportunity', url: '/opportunities/gates-health-2024' },
            { id: '2', type: 'bookmark', label: 'Save for Later' },
            { id: '3', type: 'dismiss', label: 'Not Interested' }
          ],
          metadata: {
            confidence: 0.95,
            estimatedImpact: 0.88,
            source: 'AI Opportunity Matcher',
            timestamp: '2024-01-20T10:30:00Z'
          },
          category: 'funding',
          status: 'new'
        },
        {
          id: '2',
          type: 'warning',
          priority: 'urgent',
          title: 'Application Deadline Approaching',
          message: 'The USAID Community Development Grant you bookmarked has a deadline in 3 days. You haven\'t started the application yet. Would you like me to help you begin?',
          actions: [
            { id: '1', type: 'navigate', label: 'Start Application', url: '/apply/usaid-community-2024' },
            { id: '2', type: 'navigate', label: 'Use AI Writer', url: '/apply/usaid-community-2024/ai' },
            { id: '3', type: 'dismiss', label: 'Will Apply Later' }
          ],
          metadata: {
            confidence: 1.0,
            estimatedImpact: 0.75,
            source: 'Deadline Monitor',
            timestamp: '2024-01-20T09:15:00Z'
          },
          category: 'warnings',
          status: 'new'
        },
        {
          id: '3',
          type: 'suggestion',
          priority: 'medium',
          title: 'Improve Your Success Rate',
          message: 'Organizations similar to yours have 40% higher success rates when they include impact metrics in their applications. I can help you generate compelling metrics from your project data.',
          actions: [
            { id: '1', type: 'navigate', label: 'Generate Metrics', url: '/tools/impact-calculator' },
            { id: '2', type: 'navigate', label: 'View Examples', url: '/resources/metrics-examples' },
            { id: '3', type: 'dismiss', label: 'Maybe Later' }
          ],
          metadata: {
            confidence: 0.78,
            estimatedImpact: 0.65,
            source: 'Success Pattern Analyzer',
            timestamp: '2024-01-20T08:45:00Z'
          },
          category: 'strategy',
          status: 'viewed'
        },
        {
          id: '4',
          type: 'help_offer',
          priority: 'low',
          title: 'Free Application Review Available',
          message: 'I noticed you\'ve submitted 3 applications this month. Would you like me to review your application patterns and suggest improvements? This analysis is complementary.',
          actions: [
            { id: '1', type: 'navigate', label: 'Start Review', url: '/ai/application-review' },
            { id: '2', type: 'navigate', label: 'Schedule Later', url: '/calendar/book-review' },
            { id: '3', type: 'dismiss', label: 'No Thanks' }
          ],
          metadata: {
            confidence: 0.82,
            estimatedImpact: 0.55,
            source: 'Application Analyzer',
            timestamp: '2024-01-19T16:20:00Z'
          },
          category: 'help',
          status: 'new'
        }
      ];
      
      setInsights(mockInsights);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'guidance': return <Lightbulb className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'suggestion': return <Sparkles className="w-5 h-5" />;
      case 'help_offer': return <HelpCircle className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string, priority: string) => {
    if (priority === 'urgent') return 'from-red-500 to-orange-500';
    
    switch (type) {
      case 'guidance': return 'from-blue-500 to-purple-500';
      case 'warning': return 'from-yellow-500 to-orange-500';
      case 'suggestion': return 'from-green-500 to-blue-500';
      case 'help_offer': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      urgent: 'bg-red-900/30 text-red-400 border-red-500/30',
      high: 'bg-orange-900/30 text-orange-400 border-orange-500/30',
      medium: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
      low: 'bg-green-900/30 text-green-400 border-green-500/30'
    };
    
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const handleAction = (insight: AIInsight, action: AIAction) => {
    if (action.type === 'navigate' && action.url) {
      navigate(action.url);
    } else if (action.type === 'dismiss') {
      setInsights(prev => prev.map(i => 
        i.id === insight.id ? { ...i, status: 'dismissed' as const } : i
      ));
    }
  };

  const filteredInsights = insights.filter(insight => {
    if (selectedCategory === 'all') return true;
    return insight.category === selectedCategory;
  });

  const sortedInsights = [...filteredInsights].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
    }
    if (sortBy === 'date') {
      return new Date(b.metadata.timestamp).getTime() - new Date(a.metadata.timestamp).getTime();
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-400">Loading AI insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </motion.button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Brain className="w-8 h-8 text-blue-400" />
                AI Guidance Center
              </h1>
              <p className="text-slate-400">Personalized insights and recommendations for your funding journey</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadInsights}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </motion.button>
            <div className="text-right">
              <p className="text-sm text-slate-400">Your Credits</p>
              <p className="text-xl font-bold text-yellow-300">{user?.creditBalance || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{insights.length}</p>
                <p className="text-sm text-slate-400">Total Insights</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{insights.filter(i => i.priority === 'urgent').length}</p>
                <p className="text-sm text-slate-400">Urgent Items</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{insights.filter(i => i.category === 'funding').length}</p>
                <p className="text-sm text-slate-400">Opportunities</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(insights.reduce((acc, i) => acc + i.metadata.confidence, 0) / insights.length * 100)}%
                </p>
                <p className="text-sm text-slate-400">Avg Confidence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {category.icon}
                {category.name}
              </motion.button>
            ))}
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="priority">Sort by Priority</option>
            <option value="date">Sort by Date</option>
            <option value="confidence">Sort by Confidence</option>
          </select>
        </div>

        {/* Insights List */}
        <div className="space-y-4">
          <AnimatePresence>
            {sortedInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-slate-900 rounded-xl p-6 border border-slate-800 ${
                  insight.status === 'dismissed' ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${getInsightColor(insight.type, insight.priority)}`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold mb-1">{insight.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getPriorityBadge(insight.priority)}`}>
                            {insight.priority.toUpperCase()}
                          </div>
                          <div className="text-xs text-slate-400">
                            {insight.metadata.source} • {new Date(insight.metadata.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Confidence</div>
                        <div className="text-sm font-bold">{Math.round(insight.metadata.confidence * 100)}%</div>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 mb-4">{insight.message}</p>
                    
                    <div className="flex flex-wrap gap-3">
                      {insight.actions.map((action) => (
                        <motion.button
                          key={action.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAction(insight, action)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            action.type === 'dismiss'
                              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              : `bg-gradient-to-r ${getInsightColor(insight.type, insight.priority)} text-white hover:shadow-lg`
                          }`}
                        >
                          {action.label}
                        </motion.button>
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-400 mt-4 pt-4 border-t border-slate-800">
                      <span>Impact Score: {Math.round(insight.metadata.estimatedImpact * 100)}%</span>
                      <span>Category: {insight.category}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {sortedInsights.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">No insights available</h3>
            <p className="text-slate-500 mb-4">Check back later for personalized AI recommendations</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadInsights}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium"
            >
              Refresh Insights
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGuidancePage;