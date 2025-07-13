import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Library, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Upload,
  Eye,
  Edit,
  Copy,
  Star,
  FileText,
  Image,
  BarChart3,
  File,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import type { Template, TemplateCategory } from '../ngoLogic';

const TemplatesModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Sample templates data
  const templates: Template[] = [
    {
      id: '1',
      name: 'EU Horizon Grant Proposal Template',
      category: 'proposals',
      type: 'document',
      description: 'Comprehensive template for EU Horizon grant applications with all required sections and formatting.',
      version: '3.2',
      createdBy: 'Grants Manager',
      createdDate: '2024-01-15',
      lastModified: '2024-06-20',
      downloads: 156,
      fileUrl: '/templates/eu-horizon-proposal.docx',
      tags: ['EU', 'Horizon', 'research', 'innovation'],
      approved: true
    },
    {
      id: '2',
      name: 'USAID Project Budget Template',
      category: 'budgets',
      type: 'spreadsheet',
      description: 'Standard budget template with USAID formatting requirements and automatic calculations.',
      version: '2.1',
      createdBy: 'Finance Manager',
      createdDate: '2024-02-10',
      lastModified: '2024-07-05',
      downloads: 234,
      fileUrl: '/templates/usaid-budget.xlsx',
      tags: ['USAID', 'budget', 'finance', 'calculations'],
      approved: true
    },
    {
      id: '3',
      name: 'Quarterly Progress Report Template',
      category: 'reports',
      type: 'document',
      description: 'Standard format for quarterly project progress reports with impact metrics and narrative sections.',
      version: '1.8',
      createdBy: 'M&E Officer',
      createdDate: '2024-03-05',
      lastModified: '2024-05-15',
      downloads: 89,
      fileUrl: '/templates/quarterly-report.docx',
      tags: ['progress', 'quarterly', 'monitoring', 'evaluation'],
      approved: true
    },
    {
      id: '4',
      name: 'Child Protection Policy Template',
      category: 'policies',
      type: 'document',
      description: 'Comprehensive child protection policy template meeting international standards and donor requirements.',
      version: '4.0',
      createdBy: 'Safeguarding Officer',
      createdDate: '2024-01-20',
      lastModified: '2024-04-10',
      downloads: 167,
      fileUrl: '/templates/child-protection-policy.docx',
      tags: ['safeguarding', 'child protection', 'policy', 'compliance'],
      approved: true
    },
    {
      id: '5',
      name: 'Staff Performance Appraisal Form',
      category: 'hr',
      type: 'form',
      description: 'Standardized performance appraisal form with competency ratings and development planning sections.',
      version: '2.5',
      createdBy: 'HR Manager',
      createdDate: '2024-02-28',
      lastModified: '2024-06-12',
      downloads: 78,
      fileUrl: '/templates/performance-appraisal.pdf',
      tags: ['HR', 'performance', 'appraisal', 'evaluation'],
      approved: true
    },
    {
      id: '6',
      name: 'Logical Framework Template',
      category: 'monitoring',
      type: 'spreadsheet',
      description: 'Standard logframe template with indicators, assumptions, and means of verification columns.',
      version: '3.1',
      createdBy: 'Program Manager',
      createdDate: '2024-01-30',
      lastModified: '2024-05-22',
      downloads: 143,
      fileUrl: '/templates/logframe.xlsx',
      tags: ['logframe', 'monitoring', 'indicators', 'planning'],
      approved: true
    },
    {
      id: '7',
      name: 'Donor Newsletter Template',
      category: 'communications',
      type: 'document',
      description: 'Professional newsletter template for donor communications with image placeholders and branded design.',
      version: '1.3',
      createdBy: 'Communications Manager',
      createdDate: '2024-04-15',
      lastModified: '2024-07-08',
      downloads: 67,
      fileUrl: '/templates/donor-newsletter.docx',
      tags: ['newsletter', 'communications', 'donors', 'branding'],
      approved: true
    },
    {
      id: '8',
      name: 'Risk Assessment Matrix',
      category: 'compliance',
      type: 'spreadsheet',
      description: 'Comprehensive risk assessment matrix with probability, impact, and mitigation strategy columns.',
      version: '2.2',
      createdBy: 'Compliance Officer',
      createdDate: '2024-03-12',
      lastModified: '2024-06-30',
      downloads: 112,
      fileUrl: '/templates/risk-assessment.xlsx',
      tags: ['risk', 'assessment', 'compliance', 'management'],
      approved: true
    },
    {
      id: '9',
      name: 'Grant Application Checklist',
      category: 'proposals',
      type: 'document',
      description: 'Comprehensive checklist for grant application preparation ensuring all requirements are met.',
      version: '1.6',
      createdBy: 'Grants Coordinator',
      createdDate: '2024-05-01',
      lastModified: '2024-07-12',
      downloads: 95,
      fileUrl: '/templates/grant-checklist.pdf',
      tags: ['checklist', 'grants', 'applications', 'preparation'],
      approved: false
    },
    {
      id: '10',
      name: 'Project Presentation Template',
      category: 'communications',
      type: 'presentation',
      description: 'PowerPoint template for project presentations to donors and stakeholders with branded slides.',
      version: '2.0',
      createdBy: 'Communications Officer',
      createdDate: '2024-04-20',
      lastModified: '2024-06-25',
      downloads: 134,
      fileUrl: '/templates/project-presentation.pptx',
      tags: ['presentation', 'PowerPoint', 'projects', 'donors'],
      approved: true
    }
  ];

  const templateStats = {
    total: templates.length,
    approved: templates.filter(t => t.approved).length,
    totalDownloads: templates.reduce((sum, t) => sum + t.downloads, 0),
    mostPopular: templates.sort((a, b) => b.downloads - a.downloads)[0],
    categories: Array.from(new Set(templates.map(t => t.category))).length
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'spreadsheet': return BarChart3;
      case 'presentation': return Image;
      case 'form': return File;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: TemplateCategory) => {
    const colors = {
      proposals: 'bg-blue-100 text-blue-700',
      budgets: 'bg-green-100 text-green-700',
      reports: 'bg-purple-100 text-purple-700',
      policies: 'bg-red-100 text-red-700',
      hr: 'bg-yellow-100 text-yellow-700',
      monitoring: 'bg-indigo-100 text-indigo-700',
      communications: 'bg-pink-100 text-pink-700',
      compliance: 'bg-orange-100 text-orange-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates & Tools Library</h1>
          <p className="text-gray-600">Access proposal templates, policy templates, and standardized tools for organizational efficiency.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
            <Upload className="w-4 h-4" />
            Upload Template
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="w-4 h-4" />
            Create New
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
              <p className="text-3xl font-bold text-gray-900">{templateStats.total}</p>
              <p className="text-sm font-medium text-gray-600">Total Templates</p>
            </div>
            <Library className="w-8 h-8 text-cyan-500" />
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
              <p className="text-3xl font-bold text-gray-900">{templateStats.approved}</p>
              <p className="text-sm font-medium text-gray-600">Approved</p>
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
              <p className="text-3xl font-bold text-gray-900">{templateStats.totalDownloads}</p>
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
            </div>
            <Download className="w-8 h-8 text-blue-500" />
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
              <p className="text-3xl font-bold text-gray-900">{templateStats.categories}</p>
              <p className="text-sm font-medium text-gray-600">Categories</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
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
              <p className="text-3xl font-bold text-gray-900">{templateStats.mostPopular?.downloads || 0}</p>
              <p className="text-sm font-medium text-gray-600">Most Popular</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
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
              placeholder="Search templates by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as TemplateCategory | 'all')}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="proposals">Proposals</option>
              <option value="budgets">Budgets</option>
              <option value="reports">Reports</option>
              <option value="policies">Policies</option>
              <option value="hr">HR</option>
              <option value="monitoring">Monitoring</option>
              <option value="communications">Communications</option>
              <option value="compliance">Compliance</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="document">Document</option>
              <option value="spreadsheet">Spreadsheet</option>
              <option value="presentation">Presentation</option>
              <option value="form">Form</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => {
          const TypeIcon = getTypeIcon(template.type);
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-cyan-100">
                    <TypeIcon className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{template.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </span>
                      <span className="text-xs text-gray-500">v{template.version}</span>
                    </div>
                  </div>
                </div>
                {template.approved ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Clock className="w-5 h-5 text-yellow-500" />
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{template.description}</p>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Created by:</span>
                  <span className="font-medium">{template.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last modified:</span>
                  <span className="font-medium">{formatDate(template.lastModified)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Downloads:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {template.downloads}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {template.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                    +{template.tags.length - 3} more
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Categories Overview */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Template Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { category: 'proposals', count: templates.filter(t => t.category === 'proposals').length, icon: FileText },
            { category: 'budgets', count: templates.filter(t => t.category === 'budgets').length, icon: BarChart3 },
            { category: 'reports', count: templates.filter(t => t.category === 'reports').length, icon: FileText },
            { category: 'policies', count: templates.filter(t => t.category === 'policies').length, icon: FileText },
            { category: 'hr', count: templates.filter(t => t.category === 'hr').length, icon: Users },
            { category: 'monitoring', count: templates.filter(t => t.category === 'monitoring').length, icon: BarChart3 },
            { category: 'communications', count: templates.filter(t => t.category === 'communications').length, icon: Users },
            { category: 'compliance', count: templates.filter(t => t.category === 'compliance').length, icon: FileText }
          ].map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setCategoryFilter(item.category as TemplateCategory)}
            >
              <item.icon className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1 capitalize">{item.category}</h3>
              <p className="text-sm text-gray-600">{item.count} templates</p>
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
            <Upload className="w-6 h-6 text-cyan-600" />
            <h3 className="font-bold text-gray-900">Template Builder</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Create custom templates using our template builder with standardized formatting.</p>
          <button className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
            Build Template
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-yellow-600" />
            <h3 className="font-bold text-gray-900">Popular Templates</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Browse the most downloaded and highly rated templates in our library.</p>
          <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            View Popular
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
            <h3 className="font-bold text-gray-900">Template Analytics</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">View usage statistics, download trends, and template performance metrics.</p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            View Analytics
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TemplatesModule;