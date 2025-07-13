import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  FileText,
  Image,
  Archive,
  Star,
  Share2
} from 'lucide-react';
import type { Document, DocumentCategory } from '../ngoLogic';

const DocumentationModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample documents data
  const documents: Document[] = [
    {
      id: '1',
      name: 'NGO Registration Certificate',
      category: 'organizational',
      type: 'PDF',
      uploadDate: '2024-01-15',
      expiryDate: '2029-01-15',
      version: '1.0',
      status: 'active',
      approvalStatus: 'approved',
      approver: 'Board Chairman',
      fileUrl: '/docs/registration.pdf',
      tags: ['legal', 'registration', 'mandatory'],
      description: 'Official NGO registration certificate from government authority',
      reminders: [
        {
          id: 'r1',
          documentId: '1',
          type: 'renewal',
          date: '2028-10-15',
          sent: false,
          recipient: 'admin@ngo.org'
        }
      ]
    },
    {
      id: '2',
      name: 'Child Protection Policy',
      category: 'policies',
      type: 'PDF',
      uploadDate: '2024-03-20',
      expiryDate: '2025-03-20',
      version: '2.1',
      status: 'active',
      approvalStatus: 'approved',
      approver: 'Program Director',
      fileUrl: '/docs/child-protection.pdf',
      tags: ['policy', 'safeguarding', 'mandatory'],
      description: 'Comprehensive child protection and safeguarding policy',
      reminders: [
        {
          id: 'r2',
          documentId: '2',
          type: 'review',
          date: '2024-12-20',
          sent: false,
          recipient: 'hr@ngo.org'
        }
      ]
    },
    {
      id: '3',
      name: 'Anti-Sexual Harassment Policy',
      category: 'policies',
      type: 'PDF',
      uploadDate: '2024-02-10',
      expiryDate: '2025-02-10',
      version: '1.5',
      status: 'active',
      approvalStatus: 'approved',
      approver: 'HR Manager',
      fileUrl: '/docs/anti-harassment.pdf',
      tags: ['policy', 'hr', 'workplace'],
      description: 'Policy outlining procedures for preventing and addressing sexual harassment',
      reminders: []
    },
    {
      id: '4',
      name: 'Financial Policy Manual',
      category: 'financial',
      type: 'PDF',
      uploadDate: '2024-04-05',
      expiryDate: '2025-04-05',
      version: '3.0',
      status: 'active',
      approvalStatus: 'pending',
      fileUrl: '/docs/financial-manual.pdf',
      tags: ['finance', 'procedures', 'manual'],
      description: 'Comprehensive financial management policies and procedures',
      reminders: []
    },
    {
      id: '5',
      name: 'Staff Employment Contract Template',
      category: 'staff',
      type: 'DOCX',
      uploadDate: '2024-01-30',
      version: '1.2',
      status: 'active',
      approvalStatus: 'approved',
      approver: 'Legal Advisor',
      fileUrl: '/docs/employment-contract.docx',
      tags: ['hr', 'contract', 'template'],
      description: 'Standard employment contract template for all staff',
      reminders: []
    },
    {
      id: '6',
      name: 'GDPR Data Protection Policy',
      category: 'compliance',
      type: 'PDF',
      uploadDate: '2024-05-15',
      expiryDate: '2025-05-15',
      version: '1.0',
      status: 'active',
      approvalStatus: 'approved',
      approver: 'Data Protection Officer',
      fileUrl: '/docs/gdpr-policy.pdf',
      tags: ['gdpr', 'data protection', 'compliance'],
      description: 'GDPR compliance policy for data protection and privacy',
      reminders: []
    }
  ];

  const documentStats = {
    total: documents.length,
    active: documents.filter(d => d.status === 'active').length,
    expiringSoon: documents.filter(d => {
      if (!d.expiryDate) return false;
      const expiryDate = new Date(d.expiryDate);
      const today = new Date();
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      return expiryDate <= thirtyDaysFromNow;
    }).length,
    pendingApproval: documents.filter(d => d.approvalStatus === 'pending').length
  };

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         document.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         document.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || document.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || document.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case 'organizational': return FolderOpen;
      case 'policies': return Shield;
      case 'staff': return FileText;
      case 'financial': return FileText;
      case 'compliance': return Shield;
      case 'projects': return FolderOpen;
      case 'legal': return FileText;
      case 'governance': return FolderOpen;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'expired': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'archived': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiry <= thirtyDaysFromNow;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documentation & Policy Repository</h1>
          <p className="text-gray-600">Manage organizational documents, policies, and compliance files with automated reminders.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
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
              <p className="text-3xl font-bold text-gray-900">{documentStats.total}</p>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
            </div>
            <FolderOpen className="w-8 h-8 text-blue-500" />
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
              <p className="text-3xl font-bold text-gray-900">{documentStats.active}</p>
              <p className="text-sm font-medium text-gray-600">Active Documents</p>
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
              <p className="text-3xl font-bold text-red-600">{documentStats.expiringSoon}</p>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
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
              <p className="text-3xl font-bold text-yellow-600">{documentStats.pendingApproval}</p>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
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
              placeholder="Search documents by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="organizational">Organizational</option>
              <option value="policies">Policies</option>
              <option value="staff">Staff</option>
              <option value="financial">Financial</option>
              <option value="compliance">Compliance</option>
              <option value="projects">Projects</option>
              <option value="legal">Legal</option>
              <option value="governance">Governance</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDocuments.map((document, index) => {
          const CategoryIcon = getCategoryIcon(document.category);
          return (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-green-100">
                    <CategoryIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{document.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                        {document.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getApprovalStatusColor(document.approvalStatus)}`}>
                        {document.approvalStatus}
                      </span>
                    </div>
                  </div>
                </div>
                {isExpiringSoon(document.expiryDate) && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4">{document.description}</p>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium capitalize">{document.category.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="font-medium">{document.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>Upload Date:</span>
                  <span className="font-medium">{new Date(document.uploadDate).toLocaleDateString()}</span>
                </div>
                {document.expiryDate && (
                  <div className="flex justify-between">
                    <span>Expires:</span>
                    <span className={`font-medium ${isExpiringSoon(document.expiryDate) ? 'text-red-600' : ''}`}>
                      {new Date(document.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {document.approver && (
                  <div className="flex justify-between">
                    <span>Approved by:</span>
                    <span className="font-medium">{document.approver}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {document.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                  >
                    {tag.replace('_', ' ')}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-orange-600" />
            <h3 className="font-bold text-gray-900">Compliance Checklist</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Generate compliance reports and track regulatory requirements.</p>
          <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            View Compliance
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
            <h3 className="font-bold text-gray-900">Document Reminders</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Set up automated reminders for document renewals and reviews.</p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Manage Reminders
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Archive className="w-6 h-6 text-purple-600" />
            <h3 className="font-bold text-gray-900">Version Control</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Track document versions and approval workflows efficiently.</p>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Version History
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentationModule;