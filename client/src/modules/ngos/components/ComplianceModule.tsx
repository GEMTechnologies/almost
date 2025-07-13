import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Download,
  Calendar,
  FileText,
  Users,
  Star,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import type { ComplianceItem, Risk, AuditRecord } from '../ngoLogic';

const ComplianceModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample compliance items
  const complianceItems: ComplianceItem[] = [
    {
      id: '1',
      requirement: 'Annual NGO Registration Renewal',
      category: 'legal',
      status: 'compliant',
      dueDate: '2025-01-15',
      responsible: 'Executive Director',
      evidence: ['registration-certificate-2024.pdf', 'renewal-application.pdf'],
      lastReview: '2024-01-10',
      nextReview: '2024-12-15',
      priority: 'high'
    },
    {
      id: '2',
      requirement: 'GDPR Data Protection Compliance',
      category: 'regulatory',
      status: 'compliant',
      dueDate: '2024-12-31',
      responsible: 'Data Protection Officer',
      evidence: ['gdpr-policy.pdf', 'staff-training-records.xlsx', 'data-audit-report.pdf'],
      lastReview: '2024-06-15',
      nextReview: '2024-12-15',
      priority: 'high'
    },
    {
      id: '3',
      requirement: 'Child Protection Policy Implementation',
      category: 'donor',
      status: 'compliant',
      dueDate: '2024-12-31',
      responsible: 'Safeguarding Officer',
      evidence: ['child-protection-policy.pdf', 'staff-training-certificates.pdf'],
      lastReview: '2024-07-01',
      nextReview: '2024-11-01',
      priority: 'high'
    },
    {
      id: '4',
      requirement: 'Financial Audit Completion',
      category: 'donor',
      status: 'compliant',
      dueDate: '2024-09-30',
      responsible: 'Finance Manager',
      evidence: ['audit-report-2023.pdf', 'management-letter.pdf'],
      lastReview: '2024-06-30',
      nextReview: '2025-06-30',
      priority: 'high'
    },
    {
      id: '5',
      requirement: 'Anti-Money Laundering (AML) Controls',
      category: 'regulatory',
      status: 'partially_compliant',
      dueDate: '2024-08-31',
      responsible: 'Compliance Officer',
      evidence: ['aml-policy.pdf'],
      lastReview: '2024-05-15',
      nextReview: '2024-08-15',
      priority: 'medium'
    },
    {
      id: '6',
      requirement: 'Board Meeting Documentation',
      category: 'internal',
      status: 'non_compliant',
      dueDate: '2024-07-31',
      responsible: 'Board Secretary',
      evidence: [],
      lastReview: '2024-04-01',
      nextReview: '2024-07-31',
      priority: 'medium'
    }
  ];

  // Sample risks
  const risks: Risk[] = [
    {
      id: '1',
      title: 'Donor Funding Delays',
      description: 'Potential delays in donor funding could impact project implementation timelines',
      category: 'financial',
      probability: 3,
      impact: 4,
      riskScore: 12,
      mitigation: 'Diversify funding sources and maintain 3-month operational reserves',
      responsible: 'Finance Director',
      status: 'assessed',
      dateIdentified: '2024-03-15',
      lastReview: '2024-07-01'
    },
    {
      id: '2',
      title: 'Staff Turnover in Remote Areas',
      description: 'High staff turnover in remote project locations affecting service delivery',
      category: 'operational',
      probability: 4,
      impact: 3,
      riskScore: 12,
      mitigation: 'Improve compensation packages and provide career development opportunities',
      responsible: 'HR Manager',
      status: 'mitigated',
      dateIdentified: '2024-02-20',
      lastReview: '2024-06-20'
    },
    {
      id: '3',
      title: 'Regulatory Changes Impact',
      description: 'New government regulations could affect NGO operations and compliance requirements',
      category: 'legal',
      probability: 2,
      impact: 5,
      riskScore: 10,
      mitigation: 'Regular monitoring of regulatory changes and engagement with NGO networks',
      responsible: 'Legal Advisor',
      status: 'identified',
      dateIdentified: '2024-06-10',
      lastReview: '2024-07-10'
    }
  ];

  // Sample audit records
  const auditRecords: AuditRecord[] = [
    {
      id: '1',
      type: 'external',
      auditor: 'PwC Uganda',
      date: '2024-06-15',
      scope: ['Financial Management', 'Internal Controls', 'Compliance'],
      findings: [
        {
          area: 'Financial Controls',
          description: 'Minor weaknesses in petty cash controls',
          severity: 'low',
          recommendation: 'Implement daily petty cash reconciliation',
          responsible: 'Finance Officer',
          deadline: '2024-08-31',
          status: 'in_progress'
        },
        {
          area: 'Procurement',
          description: 'Incomplete documentation for some procurement transactions',
          severity: 'medium',
          recommendation: 'Strengthen procurement documentation requirements',
          responsible: 'Procurement Officer',
          deadline: '2024-09-30',
          status: 'open'
        }
      ],
      recommendations: [
        'Enhance financial controls training for all staff',
        'Implement quarterly internal audits',
        'Update procurement manual'
      ],
      overallRating: 'Satisfactory',
      status: 'completed'
    }
  ];

  const complianceStats = {
    total: complianceItems.length,
    compliant: complianceItems.filter(c => c.status === 'compliant').length,
    nonCompliant: complianceItems.filter(c => c.status === 'non_compliant').length,
    partiallyCompliant: complianceItems.filter(c => c.status === 'partially_compliant').length,
    score: Math.round((complianceItems.filter(c => c.status === 'compliant').length / complianceItems.length) * 100)
  };

  const filteredCompliance = complianceItems.filter(item => {
    const matchesSearch = item.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.responsible.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'non_compliant': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'partially_compliant': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-700';
      case 'non_compliant': return 'bg-red-100 text-red-700';
      case 'partially_compliant': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 15) return 'bg-red-100 text-red-700';
    if (score >= 10) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return due <= thirtyDaysFromNow && due >= today;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance & Risk Management</h1>
          <p className="text-gray-600">Manage compliance requirements, risk registry, and audit preparation for organizational accountability.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Requirement
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Compliance Report
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
              <p className="text-3xl font-bold text-gray-900">{complianceStats.score}%</p>
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
            </div>
            <Shield className="w-8 h-8 text-orange-500" />
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
              <p className="text-3xl font-bold text-gray-900">{complianceStats.compliant}</p>
              <p className="text-sm font-medium text-gray-600">Compliant</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
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
              <p className="text-3xl font-bold text-yellow-600">{complianceStats.partiallyCompliant}</p>
              <p className="text-sm font-medium text-gray-600">Partial</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
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
              <p className="text-3xl font-bold text-red-600">{complianceStats.nonCompliant}</p>
              <p className="text-sm font-medium text-gray-600">Non-Compliant</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
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
              <p className="text-3xl font-bold text-gray-900">{risks.length}</p>
              <p className="text-sm font-medium text-gray-600">Active Risks</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
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
              placeholder="Search compliance requirements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="legal">Legal</option>
              <option value="donor">Donor</option>
              <option value="regulatory">Regulatory</option>
              <option value="internal">Internal</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="compliant">Compliant</option>
              <option value="partially_compliant">Partially Compliant</option>
              <option value="non_compliant">Non-Compliant</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Items */}
      <div className="space-y-4">
        {filteredCompliance.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.requirement}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(item.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority} priority
                      </span>
                      <span className="capitalize text-sm text-gray-600">{item.category}</span>
                    </div>
                  </div>
                  {(isOverdue(item.dueDate) || isDueSoon(item.dueDate)) && (
                    <AlertTriangle className={`w-5 h-5 ${isOverdue(item.dueDate) ? 'text-red-500' : 'text-yellow-500'}`} />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Responsible:</span>
                    <p className="font-medium">{item.responsible}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Due Date:</span>
                    <p className={`font-medium ${
                      isOverdue(item.dueDate) ? 'text-red-600' :
                      isDueSoon(item.dueDate) ? 'text-yellow-600' : ''
                    }`}>
                      {new Date(item.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Last Review:</span>
                    <p className="font-medium">{new Date(item.lastReview).toLocaleDateString()}</p>
                  </div>
                </div>

                {item.evidence.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Evidence Documents:</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.evidence.map((doc, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm">
                          <FileText className="w-3 h-3" />
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex lg:flex-col gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Edit className="w-4 h-4" />
                  Update
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  Evidence
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Risk Register */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Risk Register</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
            <Plus className="w-4 h-4" />
            Add Risk
          </button>
        </div>

        <div className="space-y-4">
          {risks.map((risk, index) => (
            <motion.div
              key={risk.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{risk.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="capitalize">{risk.category} risk</span>
                    <span>Identified: {new Date(risk.dateIdentified).toLocaleDateString()}</span>
                    <span>Responsible: {risk.responsible}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(risk.riskScore)}`}>
                    Risk Score: {risk.riskScore}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{risk.probability}/5</p>
                    <p className="text-sm text-gray-600">Probability</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{risk.impact}/5</p>
                    <p className="text-sm text-gray-600">Impact</p>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-600">{risk.riskScore}</p>
                    <p className="text-sm text-gray-600">Risk Score</p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <h4 className="font-medium text-gray-900 mb-1">Mitigation Strategy:</h4>
                <p className="text-sm text-gray-600">{risk.mitigation}</p>
              </div>

              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  risk.status === 'mitigated' ? 'bg-green-100 text-green-700' :
                  risk.status === 'assessed' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {risk.status}
                </span>
                <div className="flex gap-2">
                  <button className="text-sm text-gray-600 hover:text-gray-900">View Details</button>
                  <button className="text-sm text-gray-600 hover:text-gray-900">Update</button>
                </div>
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
            <FileText className="w-6 h-6 text-orange-600" />
            <h3 className="font-bold text-gray-900">Audit Preparation</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Prepare for internal and external audits with comprehensive checklists.</p>
          <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            Audit Checklist
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-gray-900">Compliance Analytics</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">View compliance trends, risk assessments, and improvement metrics.</p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
            <Calendar className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-gray-900">Compliance Calendar</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Track upcoming deadlines, reviews, and compliance activities.</p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            View Calendar
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ComplianceModule;