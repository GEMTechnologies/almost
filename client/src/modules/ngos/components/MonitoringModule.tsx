import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Target,
  Eye,
  Edit,
  Download,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Award,
  Users,
  MapPin
} from 'lucide-react';
import type { MEIndicator, EvaluationReport } from '../ngoLogic';

const MonitoringModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Sample indicators data
  const indicators: MEIndicator[] = [
    {
      id: '1',
      name: 'Number of health centers renovated',
      type: 'output',
      description: 'Total number of health centers that have been renovated and equipped',
      baseline: '0',
      target: '25',
      current: '15',
      unit: 'facilities',
      frequency: 'quarterly',
      dataSource: 'Field reports',
      responsible: 'Project Manager',
      lastUpdated: '2024-06-30',
      progress: 60,
      projectId: '1'
    },
    {
      id: '2',
      name: 'Community health workers trained',
      type: 'output',
      description: 'Number of community health workers who completed the training program',
      baseline: '50',
      target: '500',
      current: '325',
      unit: 'persons',
      frequency: 'monthly',
      dataSource: 'Training records',
      responsible: 'Training Coordinator',
      lastUpdated: '2024-07-15',
      progress: 65,
      projectId: '1'
    },
    {
      id: '3',
      name: 'Maternal mortality rate reduction',
      type: 'outcome',
      description: 'Percentage reduction in maternal mortality in target districts',
      baseline: '320 per 100,000',
      target: '200 per 100,000',
      current: '275 per 100,000',
      unit: 'rate',
      frequency: 'annually',
      dataSource: 'Health ministry data',
      responsible: 'M&E Officer',
      lastUpdated: '2024-06-01',
      progress: 37.5,
      projectId: '1'
    },
    {
      id: '4',
      name: 'School enrollment rate for refugee children',
      type: 'outcome',
      description: 'Percentage of refugee children enrolled in formal education',
      baseline: '45%',
      target: '85%',
      current: '67%',
      unit: 'percentage',
      frequency: 'quarterly',
      dataSource: 'School records',
      responsible: 'Education Coordinator',
      lastUpdated: '2024-07-01',
      progress: 55,
      projectId: '2'
    },
    {
      id: '5',
      name: 'Women with improved income',
      type: 'outcome',
      description: 'Number of women who increased their monthly income by at least 30%',
      baseline: '0',
      target: '2000',
      current: '850',
      unit: 'persons',
      frequency: 'quarterly',
      dataSource: 'Beneficiary surveys',
      responsible: 'Gender Officer',
      lastUpdated: '2024-07-10',
      progress: 42.5,
      projectId: '3'
    }
  ];

  // Sample evaluation reports
  const evaluationReports: EvaluationReport[] = [
    {
      id: '1',
      title: 'Health Systems Project - Midterm Evaluation',
      projectId: '1',
      type: 'midterm',
      date: '2024-06-15',
      evaluator: 'Dr. Margaret Ssali',
      methodology: 'Mixed methods evaluation with quantitative and qualitative data collection',
      findings: [
        {
          area: 'Infrastructure Development',
          description: 'Progress on health center renovations is on track with 60% completion',
          evidence: 'Site visits and contractor reports',
          rating: 4
        },
        {
          area: 'Capacity Building',
          description: 'Training programs are effective but need improved follow-up support',
          evidence: 'Training evaluations and post-training assessments',
          rating: 3
        },
        {
          area: 'Community Engagement',
          description: 'Strong community ownership and participation in project activities',
          evidence: 'Focus group discussions and community meetings',
          rating: 5
        }
      ],
      recommendations: [
        {
          priority: 'high',
          description: 'Establish mentorship program for trained health workers',
          responsible: 'Training Coordinator',
          deadline: '2024-09-30',
          status: 'pending'
        },
        {
          priority: 'medium',
          description: 'Improve coordination with district health teams',
          responsible: 'Project Manager',
          deadline: '2024-08-31',
          status: 'in_progress'
        }
      ],
      score: 4.2,
      status: 'final',
      documents: ['midterm-evaluation-report.pdf', 'data-collection-tools.xlsx']
    },
    {
      id: '2',
      title: 'Education Access Initiative - Annual Review',
      projectId: '2',
      type: 'annual',
      date: '2024-05-20',
      evaluator: 'Prof. John Kiprotich',
      methodology: 'Participatory evaluation with stakeholder involvement',
      findings: [
        {
          area: 'Access to Education',
          description: 'Significant improvement in enrollment rates but attendance remains inconsistent',
          evidence: 'School enrollment data and attendance records',
          rating: 3
        },
        {
          area: 'Quality of Education',
          description: 'Teacher training has improved classroom practices and learning outcomes',
          evidence: 'Classroom observations and student assessments',
          rating: 4
        }
      ],
      recommendations: [
        {
          priority: 'high',
          description: 'Implement school feeding program to improve attendance',
          responsible: 'Program Manager',
          deadline: '2024-12-31',
          status: 'pending'
        }
      ],
      score: 3.8,
      status: 'approved',
      documents: ['annual-review-2024.pdf']
    }
  ];

  const indicatorStats = {
    total: indicators.length,
    onTrack: indicators.filter(i => i.progress >= 75).length,
    behind: indicators.filter(i => i.progress < 50).length,
    avgProgress: indicators.reduce((sum, i) => sum + i.progress, 0) / indicators.length
  };

  const filteredIndicators = indicators.filter(indicator => {
    const matchesSearch = indicator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         indicator.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || indicator.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressTextColor = (progress: number) => {
    if (progress >= 75) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'impact': return <Award className="w-4 h-4" />;
      case 'outcome': return <Target className="w-4 h-4" />;
      case 'output': return <CheckCircle className="w-4 h-4" />;
      case 'input': return <Users className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'impact': return 'bg-purple-100 text-purple-700';
      case 'outcome': return 'bg-blue-100 text-blue-700';
      case 'output': return 'bg-green-100 text-green-700';
      case 'input': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitoring & Evaluation (M&E)</h1>
          <p className="text-gray-600">Track indicators, evaluation reports, and impact assessments for evidence-based decision making.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Indicator
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{indicatorStats.total}</p>
              <p className="text-sm font-medium text-gray-600">Total Indicators</p>
            </div>
            <BarChart3 className="w-8 h-8 text-indigo-500" />
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
              <p className="text-3xl font-bold text-gray-900">{Math.round(indicatorStats.avgProgress)}%</p>
              <p className="text-sm font-medium text-gray-600">Average Progress</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
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
              <p className="text-3xl font-bold text-gray-900">{indicatorStats.onTrack}</p>
              <p className="text-sm font-medium text-gray-600">On Track</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
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
              <p className="text-3xl font-bold text-red-600">{indicatorStats.behind}</p>
              <p className="text-sm font-medium text-gray-600">Behind Target</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
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
              placeholder="Search indicators by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="impact">Impact</option>
              <option value="outcome">Outcome</option>
              <option value="output">Output</option>
              <option value="input">Input</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Indicators List */}
      <div className="space-y-4">
        {filteredIndicators.map((indicator, index) => (
          <motion.div
            key={indicator.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(indicator.type)}`}>
                      {getTypeIcon(indicator.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{indicator.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(indicator.type)}`}>
                        {indicator.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getProgressTextColor(indicator.progress)}`}>
                      {indicator.progress}%
                    </p>
                    <p className="text-sm text-gray-500">Progress</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{indicator.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{indicator.baseline}</p>
                      <p className="text-sm text-gray-600">Baseline</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{indicator.current}</p>
                      <p className="text-sm text-gray-600">Current</p>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{indicator.target}</p>
                      <p className="text-sm text-gray-600">Target</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Progress to Target</span>
                    <span className="text-sm font-medium text-gray-900">{indicator.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(indicator.progress)}`}
                      style={{ width: `${indicator.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Unit:</span>
                    <p>{indicator.unit}</p>
                  </div>
                  <div>
                    <span className="font-medium">Frequency:</span>
                    <p className="capitalize">{indicator.frequency}</p>
                  </div>
                  <div>
                    <span className="font-medium">Responsible:</span>
                    <p>{indicator.responsible}</p>
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>
                    <p>{new Date(indicator.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Edit className="w-4 h-4" />
                  Update
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <BarChart3 className="w-4 h-4" />
                  Charts
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Evaluation Reports Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Evaluation Reports</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
            <Plus className="w-4 h-4" />
            New Evaluation
          </button>
        </div>

        <div className="space-y-4">
          {evaluationReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(report.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {report.evaluator}
                    </span>
                    <span className="capitalize">{report.type} evaluation</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{report.score}/5</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report.status === 'approved' ? 'bg-green-100 text-green-700' :
                    report.status === 'final' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {report.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Findings:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {report.findings.slice(0, 2).map((finding, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="flex items-center gap-1 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < finding.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span>{finding.area}: {finding.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recommendations:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {report.recommendations.slice(0, 2).map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {rec.priority}
                        </span>
                        <span>{rec.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Eye className="w-4 h-4" />
                  View Full Report
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-indigo-600" />
            <h3 className="font-bold text-gray-900">Logframe Management</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Create and manage project logframes with indicators and assumptions.</p>
          <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Manage Logframes
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-gray-900">Data Visualization</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Create charts, graphs, and dashboards for data presentation.</p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Create Visuals
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-purple-600" />
            <h3 className="font-bold text-gray-900">Impact Assessment</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Conduct comprehensive impact assessments and beneficiary feedback.</p>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Assess Impact
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default MonitoringModule;