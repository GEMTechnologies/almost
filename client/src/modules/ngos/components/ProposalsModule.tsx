import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign,
  Send,
  Eye,
  Edit,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Target,
  BarChart3
} from 'lucide-react';
import type { Proposal } from '../ngoLogic';
import ProposalsSubMenu from './ProposalsSubMenu';

const ProposalsModule: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample proposals data
  const proposals: Proposal[] = [
    {
      id: '1',
      title: 'Health Systems Strengthening in Rural Uganda',
      donorName: 'Gates Foundation',
      donorType: 'Gates',
      amount: 2500000,
      currency: 'USD',
      submissionDate: '2024-06-15',
      deadline: '2024-08-30',
      status: 'submitted',
      description: 'Comprehensive program to strengthen healthcare delivery systems in rural districts of Uganda.',
      objectives: [
        'Improve maternal and child health outcomes',
        'Strengthen healthcare infrastructure',
        'Train community health workers',
        'Implement digital health solutions'
      ],
      activities: [],
      budget: {
        totalAmount: 2500000,
        categories: [
          {
            name: 'Personnel',
            amount: 1000000,
            percentage: 40,
            subcategories: []
          },
          {
            name: 'Equipment',
            amount: 750000,
            percentage: 30,
            subcategories: []
          },
          {
            name: 'Training',
            amount: 500000,
            percentage: 20,
            subcategories: []
          },
          {
            name: 'Operations',
            amount: 250000,
            percentage: 10,
            subcategories: []
          }
        ],
        indirect: 250000,
        direct: 2250000
      },
      logframe: {
        goal: 'Improved health outcomes in rural Uganda',
        outcomes: [],
        outputs: [],
        assumptions: []
      },
      documents: [],
      team: [],
      timeline: []
    },
    {
      id: '2',
      title: 'Education Access Initiative for Refugee Children',
      donorName: 'USAID',
      donorType: 'USAID',
      amount: 1800000,
      currency: 'USD',
      submissionDate: '2024-07-02',
      deadline: '2024-09-15',
      status: 'under_review',
      description: 'Providing quality education opportunities for refugee children in settlement areas.',
      objectives: [
        'Increase school enrollment among refugee children',
        'Improve learning outcomes',
        'Train teachers and education staff',
        'Build education infrastructure'
      ],
      activities: [],
      budget: {
        totalAmount: 1800000,
        categories: [
          {
            name: 'Infrastructure',
            amount: 720000,
            percentage: 40,
            subcategories: []
          },
          {
            name: 'Teacher Training',
            amount: 540000,
            percentage: 30,
            subcategories: []
          },
          {
            name: 'Learning Materials',
            amount: 360000,
            percentage: 20,
            subcategories: []
          },
          {
            name: 'Management',
            amount: 180000,
            percentage: 10,
            subcategories: []
          }
        ],
        indirect: 180000,
        direct: 1620000
      },
      logframe: {
        goal: 'Enhanced education access for refugee children',
        outcomes: [],
        outputs: [],
        assumptions: []
      },
      documents: [],
      team: [],
      timeline: []
    },
    {
      id: '3',
      title: 'Women Economic Empowerment Program',
      donorName: 'UN Women',
      donorType: 'UN',
      amount: 950000,
      currency: 'USD',
      submissionDate: '2024-05-20',
      deadline: '2024-07-30',
      status: 'approved',
      description: 'Empowering women through skills training, microfinance, and business development support.',
      objectives: [
        'Provide vocational skills training',
        'Establish microfinance schemes',
        'Support women-led businesses',
        'Advocate for women\'s economic rights'
      ],
      activities: [],
      budget: {
        totalAmount: 950000,
        categories: [
          {
            name: 'Training Programs',
            amount: 380000,
            percentage: 40,
            subcategories: []
          },
          {
            name: 'Microfinance Capital',
            amount: 285000,
            percentage: 30,
            subcategories: []
          },
          {
            name: 'Business Support',
            amount: 190000,
            percentage: 20,
            subcategories: []
          },
          {
            name: 'Administration',
            amount: 95000,
            percentage: 10,
            subcategories: []
          }
        ],
        indirect: 95000,
        direct: 855000
      },
      logframe: {
        goal: 'Enhanced economic opportunities for women',
        outcomes: [],
        outputs: [],
        assumptions: []
      },
      documents: [],
      team: [],
      timeline: []
    },
    {
      id: '4',
      title: 'Climate Resilient Agriculture Initiative',
      donorName: 'European Union',
      donorType: 'EU',
      amount: 3200000,
      currency: 'EUR',
      submissionDate: '2024-04-10',
      deadline: '2024-08-15',
      status: 'draft',
      description: 'Supporting smallholder farmers to adopt climate-smart agricultural practices.',
      objectives: [
        'Promote climate-smart agriculture',
        'Improve crop yields and food security',
        'Strengthen farmer organizations',
        'Enhance market linkages'
      ],
      activities: [],
      budget: {
        totalAmount: 3200000,
        categories: [
          {
            name: 'Farmer Training',
            amount: 1280000,
            percentage: 40,
            subcategories: []
          },
          {
            name: 'Technology Transfer',
            amount: 960000,
            percentage: 30,
            subcategories: []
          },
          {
            name: 'Infrastructure',
            amount: 640000,
            percentage: 20,
            subcategories: []
          },
          {
            name: 'Program Management',
            amount: 320000,
            percentage: 10,
            subcategories: []
          }
        ],
        indirect: 320000,
        direct: 2880000
      },
      logframe: {
        goal: 'Climate-resilient agricultural systems',
        outcomes: [],
        outputs: [],
        assumptions: []
      },
      documents: [],
      team: [],
      timeline: []
    }
  ];

  const proposalStats = {
    total: proposals.length,
    totalValue: proposals.reduce((sum, p) => sum + p.amount, 0),
    approved: proposals.filter(p => p.status === 'approved').length,
    submitted: proposals.filter(p => p.status === 'submitted' || p.status === 'under_review').length
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.donorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'submitted': case 'under_review': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Edit className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'submitted': case 'under_review': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Menu */}
      <ProposalsSubMenu activeView={activeView} onViewChange={setActiveView} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{proposalStats.total}</p>
              <p className="text-sm font-medium text-gray-600">Total Proposals</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
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
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(proposalStats.totalValue)}</p>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
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
              <p className="text-3xl font-bold text-gray-900">{proposalStats.approved}</p>
              <p className="text-sm font-medium text-gray-600">Approved</p>
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
              <p className="text-3xl font-bold text-gray-900">{proposalStats.submitted}</p>
              <p className="text-sm font-medium text-gray-600">Under Review</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
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
              placeholder="Search proposals by title or donor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map((proposal, index) => (
          <motion.div
            key={proposal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{proposal.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {proposal.donorName}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(proposal.amount, proposal.currency)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due: {new Date(proposal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(proposal.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
                      {proposal.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{proposal.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Objectives:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {proposal.objectives.slice(0, 3).map((objective, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          {objective}
                        </li>
                      ))}
                      {proposal.objectives.length > 3 && (
                        <li className="text-blue-600 text-sm">+{proposal.objectives.length - 3} more objectives</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Budget Breakdown:</h4>
                    <div className="space-y-2">
                      {proposal.budget.categories.slice(0, 3).map((category, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{category.name}</span>
                          <span className="font-medium">{category.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                {proposal.status === 'draft' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    <Send className="w-4 h-4" />
                    Submit
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Plus className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-gray-900">Create from Template</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Use standardized templates for different donor formats.</p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Browse Templates
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
            <h3 className="font-bold text-gray-900">Proposal Analytics</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">View success rates, submission tracking, and performance metrics.</p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            View Analytics
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="font-bold text-gray-900">Team Collaboration</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Collaborate with team members on proposal development.</p>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Manage Teams
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProposalsModule;