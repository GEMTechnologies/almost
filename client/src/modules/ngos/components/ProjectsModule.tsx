import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign,
  Users,
  MapPin,
  Target,
  TrendingUp,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  Pause,
  Play,
  BarChart3,
  Flag
} from 'lucide-react';
import type { Project } from '../ngoLogic';

const ProjectsModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample projects data
  const projects: Project[] = [
    {
      id: '1',
      name: 'Health Systems Strengthening in Rural Uganda',
      description: 'Comprehensive program to strengthen healthcare delivery systems in rural districts of Uganda through infrastructure development, capacity building, and community engagement.',
      donor: 'Gates Foundation',
      amount: 2500000,
      startDate: '2024-01-15',
      endDate: '2026-01-14',
      status: 'ongoing',
      manager: 'Dr. Sarah Nakato',
      team: [
        { id: 't1', name: 'Dr. Sarah Nakato', role: 'Project Manager', email: 'sarah@ngo.org' },
        { id: 't2', name: 'James Okello', role: 'Field Coordinator', email: 'james@ngo.org' },
        { id: 't3', name: 'Grace Tumukunde', role: 'Finance Officer', email: 'grace@ngo.org' }
      ],
      location: ['Gulu', 'Lira', 'Kitgum'],
      beneficiaries: 125000,
      objectives: [
        'Improve maternal and child health outcomes',
        'Strengthen healthcare infrastructure',
        'Train community health workers',
        'Implement digital health solutions'
      ],
      activities: [
        {
          id: 'a1',
          projectId: '1',
          name: 'Infrastructure Development',
          description: 'Build and renovate health centers',
          startDate: '2024-02-01',
          endDate: '2025-06-30',
          status: 'ongoing',
          budget: 800000,
          responsible: 'James Okello',
          deliverables: [
            {
              id: 'd1',
              name: '5 Health Centers Renovated',
              description: 'Complete renovation of existing health centers',
              dueDate: '2024-12-31',
              status: 'in_progress',
              documents: []
            }
          ],
          progress: 65
        }
      ],
      milestones: [
        {
          id: 'm1',
          name: 'Phase 1 Infrastructure Complete',
          description: 'Complete renovation of 5 health centers',
          targetDate: '2024-12-31',
          status: 'planned',
          criteria: ['All renovations completed', 'Equipment installed', 'Staff trained']
        }
      ],
      budget: {
        totalBudget: 2500000,
        spentAmount: 1625000,
        remainingAmount: 875000,
        categories: [
          {
            name: 'Infrastructure',
            amount: 1000000,
            percentage: 40,
            subcategories: []
          },
          {
            name: 'Training',
            amount: 750000,
            percentage: 30,
            subcategories: []
          },
          {
            name: 'Equipment',
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
        variance: 5
      },
      risks: [],
      reports: []
    },
    {
      id: '2',
      name: 'Education Access Initiative for Refugee Children',
      description: 'Providing quality education opportunities for refugee children in settlement areas through infrastructure development, teacher training, and learning materials provision.',
      donor: 'USAID',
      amount: 1800000,
      startDate: '2024-03-01',
      endDate: '2026-02-28',
      status: 'ongoing',
      manager: 'Robert Kayongo',
      team: [
        { id: 't4', name: 'Robert Kayongo', role: 'Project Manager', email: 'robert@ngo.org' },
        { id: 't5', name: 'Mary Atim', role: 'Education Coordinator', email: 'mary@ngo.org' }
      ],
      location: ['Adjumani', 'Yumbe', 'Arua'],
      beneficiaries: 15000,
      objectives: [
        'Increase school enrollment among refugee children',
        'Improve learning outcomes',
        'Train teachers and education staff',
        'Build education infrastructure'
      ],
      activities: [],
      milestones: [],
      budget: {
        totalBudget: 1800000,
        spentAmount: 540000,
        remainingAmount: 1260000,
        categories: [],
        variance: -2
      },
      risks: [],
      reports: []
    },
    {
      id: '3',
      name: 'Women Economic Empowerment Program',
      description: 'Empowering women through skills training, microfinance, and business development support in rural communities.',
      donor: 'UN Women',
      amount: 950000,
      startDate: '2024-04-15',
      endDate: '2025-10-14',
      status: 'ongoing',
      manager: 'Betty Namukasa',
      team: [
        { id: 't6', name: 'Betty Namukasa', role: 'Project Manager', email: 'betty@ngo.org' }
      ],
      location: ['Mukono', 'Wakiso', 'Kampala'],
      beneficiaries: 2500,
      objectives: [
        'Provide vocational skills training',
        'Establish microfinance schemes',
        'Support women-led businesses',
        'Advocate for women\'s economic rights'
      ],
      activities: [],
      milestones: [],
      budget: {
        totalBudget: 950000,
        spentAmount: 380000,
        remainingAmount: 570000,
        categories: [],
        variance: 3
      },
      risks: [],
      reports: []
    },
    {
      id: '4',
      name: 'Climate Resilient Agriculture Initiative',
      description: 'Supporting smallholder farmers to adopt climate-smart agricultural practices and improve food security.',
      donor: 'European Union',
      amount: 3200000,
      startDate: '2024-06-01',
      endDate: '2027-05-31',
      status: 'planning',
      manager: 'David Ssemakula',
      team: [],
      location: ['Hoima', 'Masindi', 'Kiryandongo'],
      beneficiaries: 50000,
      objectives: [
        'Promote climate-smart agriculture',
        'Improve crop yields and food security',
        'Strengthen farmer organizations',
        'Enhance market linkages'
      ],
      activities: [],
      milestones: [],
      budget: {
        totalBudget: 3200000,
        spentAmount: 0,
        remainingAmount: 3200000,
        categories: [],
        variance: 0
      },
      risks: [],
      reports: []
    }
  ];

  const projectStats = {
    total: projects.length,
    ongoing: projects.filter(p => p.status === 'ongoing').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalBeneficiaries: projects.reduce((sum, p) => sum + p.beneficiaries, 0),
    totalBudget: projects.reduce((sum, p) => sum + p.amount, 0)
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.donor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ongoing': return <Play className="w-4 h-4 text-green-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'suspended': return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'suspended': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const calculateProgress = (project: Project) => {
    const totalDuration = new Date(project.endDate).getTime() - new Date(project.startDate).getTime();
    const elapsedDuration = Date.now() - new Date(project.startDate).getTime();
    return Math.min(Math.max((elapsedDuration / totalDuration) * 100, 0), 100);
  };

  const getBudgetUtilization = (project: Project) => {
    return (project.budget.spentAmount / project.budget.totalBudget) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project & Activity Management</h1>
          <p className="text-gray-600">Manage projects, track deliverables, monitor budgets, and measure impact.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Plus className="w-4 h-4" />
          Create New Project
        </button>
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
              <p className="text-3xl font-bold text-gray-900">{projectStats.total}</p>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
            </div>
            <Activity className="w-8 h-8 text-purple-500" />
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
              <p className="text-3xl font-bold text-gray-900">{projectStats.ongoing}</p>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
            </div>
            <Play className="w-8 h-8 text-green-500" />
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
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(projectStats.totalBudget)}</p>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
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
              <p className="text-3xl font-bold text-gray-900">{formatNumber(projectStats.totalBeneficiaries)}</p>
              <p className="text-sm font-medium text-gray-600">Beneficiaries</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
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
              <p className="text-3xl font-bold text-gray-900">{projectStats.completed}</p>
              <p className="text-sm font-medium text-gray-600">Completed</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-500" />
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
              placeholder="Search projects by name, description, or donor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(project.amount)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {formatNumber(project.beneficiaries)} beneficiaries
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {project.location.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusIcon(project.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className="text-sm text-gray-600">by {project.donor}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{project.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Objectives:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {project.objectives.slice(0, 3).map((objective, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Target className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                      {project.objectives.length > 3 && (
                        <li className="text-purple-600 text-sm">+{project.objectives.length - 3} more objectives</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Project Timeline:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium">{new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-medium">{new Date(project.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Progress:</span>
                        <span className="font-medium">{Math.round(calculateProgress(project))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${calculateProgress(project)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget Overview */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Budget Overview</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Budget:</span>
                      <p className="font-bold text-gray-900">{formatCurrency(project.budget.totalBudget)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Spent:</span>
                      <p className="font-bold text-green-600">{formatCurrency(project.budget.spentAmount)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Remaining:</span>
                      <p className="font-bold text-blue-600">{formatCurrency(project.budget.remainingAmount)}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Budget Utilization</span>
                      <span className="text-sm font-medium">{Math.round(getBudgetUtilization(project))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${getBudgetUtilization(project)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Team */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Project Team:</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Manager:</span>
                    <span className="text-sm font-medium">{project.manager}</span>
                    {project.team.length > 1 && (
                      <span className="text-sm text-gray-500">+{project.team.length - 1} team members</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <BarChart3 className="w-4 h-4" />
                  Reports
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Flag className="w-4 h-4" />
                  Milestones
                </button>
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
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <h3 className="font-bold text-gray-900">Project Analytics</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">View detailed analytics, performance metrics, and impact assessments.</p>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            View Analytics
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-gray-900">Timeline Management</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Manage project timelines, milestones, and deliverable schedules.</p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Manage Timeline
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-gray-900">Impact Tracking</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Track project impact, outcomes, and beneficiary feedback.</p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Track Impact
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsModule;