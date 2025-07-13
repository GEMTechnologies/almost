import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Download, 
  Search, 
  Filter,
  FolderOpen,
  Calendar,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Share2,
  Clock,
  Shield,
  Users,
  Building,
  ArrowLeft,
  Plus,
  Grid,
  List,
  SortAsc,
  Tag
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  category: 'organizational' | 'policies' | 'staff' | 'compliance';
  subcategory: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'pending_review' | 'archived';
  version: string;
  uploadedBy: string;
  description: string;
  tags: string[];
  isConfidential: boolean;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  lastModified: string;
}

interface DocumentsPageProps {
  onBack: () => void;
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({ onBack }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Sample documents data
  useEffect(() => {
    const sampleDocuments: Document[] = [
      {
        id: '1',
        name: 'NGO Registration Certificate',
        category: 'organizational',
        subcategory: 'Legal Documents',
        fileType: 'PDF',
        fileSize: '2.4 MB',
        uploadDate: '2024-01-15',
        expiryDate: '2025-01-15',
        status: 'active',
        version: '1.0',
        uploadedBy: 'Admin',
        description: 'Official NGO registration certificate from regulatory authority',
        tags: ['legal', 'registration', 'official'],
        isConfidential: false,
        approvalStatus: 'approved',
        lastModified: '2024-01-15'
      },
      {
        id: '2',
        name: 'Child Protection Policy',
        category: 'policies',
        subcategory: 'Safeguarding',
        fileType: 'DOCX',
        fileSize: '1.8 MB',
        uploadDate: '2024-02-01',
        expiryDate: '2025-02-01',
        status: 'active',
        version: '2.1',
        uploadedBy: 'HR Manager',
        description: 'Comprehensive child protection policy and procedures',
        tags: ['safeguarding', 'children', 'policy'],
        isConfidential: true,
        approvalStatus: 'approved',
        lastModified: '2024-02-01'
      },
      {
        id: '3',
        name: 'Financial Policy Manual',
        category: 'policies',
        subcategory: 'Financial',
        fileType: 'PDF',
        fileSize: '3.2 MB',
        uploadDate: '2024-01-20',
        expiryDate: '2025-01-20',
        status: 'active',
        version: '1.5',
        uploadedBy: 'Finance Manager',
        description: 'Complete financial procedures and controls manual',
        tags: ['finance', 'procedures', 'controls'],
        isConfidential: true,
        approvalStatus: 'approved',
        lastModified: '2024-01-20'
      },
      {
        id: '4',
        name: 'Employment Contract Template',
        category: 'staff',
        subcategory: 'HR Documents',
        fileType: 'DOCX',
        fileSize: '0.8 MB',
        uploadDate: '2024-03-01',
        status: 'active',
        version: '1.2',
        uploadedBy: 'HR Manager',
        description: 'Standard employment contract template for new hires',
        tags: ['hr', 'contracts', 'employment'],
        isConfidential: true,
        approvalStatus: 'approved',
        lastModified: '2024-03-01'
      },
      {
        id: '5',
        name: 'Anti-Money Laundering Policy',
        category: 'compliance',
        subcategory: 'AML/CFT',
        fileType: 'PDF',
        fileSize: '1.5 MB',
        uploadDate: '2024-02-15',
        expiryDate: '2025-02-15',
        status: 'active',
        version: '1.0',
        uploadedBy: 'Compliance Officer',
        description: 'AML/CFT compliance policy and procedures',
        tags: ['compliance', 'aml', 'cft', 'legal'],
        isConfidential: true,
        approvalStatus: 'approved',
        lastModified: '2024-02-15'
      },
      {
        id: '6',
        name: 'Board Meeting Minutes - Q1 2024',
        category: 'organizational',
        subcategory: 'Governance',
        fileType: 'PDF',
        fileSize: '1.1 MB',
        uploadDate: '2024-03-31',
        status: 'active',
        version: '1.0',
        uploadedBy: 'Board Secretary',
        description: 'Minutes from Q1 2024 board meeting',
        tags: ['governance', 'board', 'minutes'],
        isConfidential: true,
        approvalStatus: 'approved',
        lastModified: '2024-03-31'
      }
    ];
    setDocuments(sampleDocuments);
  }, []);

  const categories = [
    { id: 'all', name: 'All Documents', icon: FileText, count: documents.length },
    { id: 'organizational', name: 'Organizational', icon: Building, count: documents.filter(d => d.category === 'organizational').length },
    { id: 'policies', name: 'Policies & Manuals', icon: Shield, count: documents.filter(d => d.category === 'policies').length },
    { id: 'staff', name: 'Staff Documents', icon: Users, count: documents.filter(d => d.category === 'staff').length },
    { id: 'compliance', name: 'Compliance', icon: CheckCircle, count: documents.filter(d => d.category === 'compliance').length }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'expired': return 'text-red-400 bg-red-400/20';
      case 'pending_review': return 'text-yellow-400 bg-yellow-400/20';
      case 'archived': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return '📄';
      case 'docx': case 'doc': return '📝';
      case 'xlsx': case 'xls': return '📊';
      case 'pptx': case 'ppt': return '📽️';
      default: return '📎';
    }
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">NGO Documents & Policy Repository</h1>
              <p className="text-slate-400">Manage organizational documents, policies, and compliance files</p>
            </div>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{documents.length}</div>
            <div className="text-sm text-slate-400">Total Documents</div>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{documents.filter(d => isExpiringSoon(d.expiryDate)).length}</div>
            <div className="text-sm text-slate-400">Expiring Soon</div>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-400">{documents.filter(d => d.status === 'expired').length}</div>
            <div className="text-sm text-slate-400">Expired</div>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{documents.filter(d => d.approvalStatus === 'approved').length}</div>
            <div className="text-sm text-slate-400">Approved</div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{category.name}</span>
                    </div>
                    <span className="text-xs bg-slate-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-left">
                <Calendar className="w-5 h-5 text-yellow-400" />
                <span>Expiry Reminders</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-left">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Compliance Check</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-left">
                <Download className="w-5 h-5 text-blue-400" />
                <span>Bulk Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Search and Controls */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="category">Sort by Category</option>
              <option value="status">Sort by Status</option>
            </select>
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Documents Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map(doc => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getFileIcon(doc.fileType)}</div>
                      <div>
                        <h3 className="font-semibold text-white truncate">{doc.name}</h3>
                        <p className="text-sm text-slate-400">{doc.subcategory}</p>
                      </div>
                    </div>
                    {doc.isConfidential && (
                      <Shield className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Version:</span>
                      <span className="text-white">{doc.version}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Size:</span>
                      <span className="text-white">{doc.fileSize}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(doc.status)}`}>
                        {doc.status.replace('_', ' ')}
                      </span>
                    </div>
                    {doc.expiryDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Expires:</span>
                        <span className={`${isExpiringSoon(doc.expiryDate) ? 'text-yellow-400' : 'text-white'}`}>
                          {new Date(doc.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {doc.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {doc.tags.length > 2 && (
                      <span className="text-xs text-slate-400">+{doc.tags.length - 2}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition-colors">
                      <Eye className="w-4 h-4 inline mr-1" />
                      View
                    </button>
                    <button className="p-2 hover:bg-slate-700 rounded transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-slate-700 rounded transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="text-left p-4">Document</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Version</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Modified</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map(doc => (
                    <tr key={doc.id} className="border-b border-slate-700 hover:bg-slate-750">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getFileIcon(doc.fileType)}</span>
                          <div>
                            <div className="font-semibold">{doc.name}</div>
                            <div className="text-sm text-slate-400">{doc.fileSize}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">{doc.subcategory}</td>
                      <td className="p-4 text-slate-300">{doc.version}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(doc.status)}`}>
                          {doc.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{new Date(doc.lastModified).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-slate-600 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-slate-600 rounded">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-slate-600 rounded">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;