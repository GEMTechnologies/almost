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
  Plus,
  SortAsc,
  Tag,
  Sparkles,
  Wand2,
  BookOpen,
  PenTool,
  Globe,
  Settings,
  Zap,
  BarChart3,
  Menu,
  X,
  LayoutGrid,
  List,
  GitBranch,
  History
} from 'lucide-react';
import SystemDocumentWriter from './SystemDocumentWriter';
import { DocumentWritingProgress } from '../../../../components/DocumentWritingProgress';
import DocumentUploadModal from './DocumentUploadModal';
import { DocumentVersioning } from './DocumentVersioning';
import { DocumentSharingSystem } from './DocumentSharingSystem';
import { DocumentAnalytics } from './DocumentAnalytics';
import { DocumentCollaborationHub } from './DocumentCollaborationHub';

interface Document {
  id: string;
  name: string;
  category: 'governance' | 'financial' | 'policies' | 'compliance' | 'monitoring' | 'hr';
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
  content?: string;
}

const NGODocumentSystem: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocumentWriter, setShowDocumentWriter] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState<'documents' | 'writer' | 'templates'>('documents');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['governance']));
  const [showCustomRequestModal, setShowCustomRequestModal] = useState(false);
  const [customRequest, setCustomRequest] = useState('');
  
  // Document Writing Progress States
  const [showWritingProgress, setShowWritingProgress] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState(150); // Default credits
  
  // Document Upload States
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  
  // Advanced Features States
  const [showVersioning, setShowVersioning] = useState(false);
  const [showSharing, setShowSharing] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [selectedDocForVersioning, setSelectedDocForVersioning] = useState<string>('');
  const [selectedDocForSharing, setSelectedDocForSharing] = useState({ id: '', name: '' });

  // Organization context for document generation
  const organizationContext = {
    name: 'Smart Health Solutions Uganda',
    type: 'Health NGO',
    sector: 'Healthcare',
    country: 'Uganda',
    size: 'Medium (50-100 staff)',
    focus: 'Community health programs'
  };

  // Document Writing Request Function
  const requestDocumentWriting = async (documentName: string, category: string, subcategory: string) => {
    try {
      const creditsRequired = category === 'policies' ? 80 : category === 'financial' ? 70 : 60;
      
      if (userCredits < creditsRequired) {
        alert(`Insufficient credits. Required: ${creditsRequired}, Available: ${userCredits}`);
        return;
      }

      const response = await fetch('/api/document-writing/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID format
          documentName,
          documentType: 'Professional NGO Document',
          category,
          subcategory,
          organizationContext
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setCurrentJobId(result.jobId);
        setShowWritingProgress(true);
        setUserCredits(prev => prev - creditsRequired);
      } else {
        alert(result.error || 'Failed to start document writing');
      }
    } catch (error) {
      console.error('Error requesting document writing:', error);
      alert('Failed to request document writing');
    }
  };

  // Handle Writing Progress Completion
  const handleWritingComplete = (jobId: string) => {
    console.log('Document writing completed:', jobId);
    // Refresh documents list or navigate to completed document
    setShowWritingProgress(false);
    setCurrentJobId(null);
  };

  // Fetch uploaded documents
  const fetchUploadedDocuments = async () => {
    try {
      const response = await fetch(`/api/document-upload/user/550e8400-e29b-41d4-a716-446655440000`);
      if (response.ok) {
        const result = await response.json();
        setUploadedDocuments(result.documents || []);
      }
    } catch (error) {
      console.error('Error fetching uploaded documents:', error);
    }
  };

  // Handle upload completion
  const handleUploadComplete = (document: any) => {
    setUploadedDocuments(prev => [document, ...prev]);
    fetchUploadedDocuments(); // Refresh the list
  };

  // Load uploaded documents on component mount
  useEffect(() => {
    fetchUploadedDocuments();
  }, []);

  // Comprehensive document folders structure
  const documentFolders = [
    {
      id: 'governance',
      name: '📁 Governance & Legal Documents',
      icon: Building,
      color: 'blue',
      documents: ['Registration Certificate', 'Constitution / Articles of Association', 'Board Resolutions', 'Memorandum of Understanding (MoUs)', 'Tax Exemption Certificate', 'Strategic Plan', 'Annual Reports']
    },
    {
      id: 'financial',
      name: '📁 Financial Documents',
      icon: Shield,
      color: 'green',
      documents: ['Audited Financial Statements', 'Annual Budget', 'Cash Flow Statements', 'Fund Utilization Reports', 'Procurement Records', 'Receipts & Invoices', 'Petty Cash Log', 'Bank Reconciliation Statements']
    },
    {
      id: 'policies',
      name: '📁 Key Organizational Policies',
      icon: FileText,
      color: 'purple',
      documents: ['Code of Conduct', 'Financial Management Policy', 'Procurement Policy', 'Anti-Sexual Harassment Policy', 'Child Protection Policy', 'Safeguarding Policy', 'Whistleblower Policy', 'HR Policy Manual', 'Data Protection / Privacy Policy', 'IT & Cybersecurity Policy', 'Travel & Per Diem Policy', 'Asset Management Policy', 'Risk Management Policy', 'Conflict of Interest Policy', 'Environmental Policy', 'Communications & Branding Policy']
    },
    {
      id: 'compliance',
      name: '📁 Compliance & Legal',
      icon: CheckCircle,
      color: 'red',
      documents: ['AML/CFT Policy (Anti-Money Laundering)', 'KYC Documents', 'Donor Compliance Guidelines', 'Beneficial Ownership Declaration', 'Sanctions Screening Records']
    },
    {
      id: 'monitoring',
      name: '📁 Monitoring & Evaluation (M&E)',
      icon: BarChart3,
      color: 'yellow',
      documents: ['M&E Framework', 'Logical Framework (LogFrame)', 'Impact Assessment Reports', 'Indicator Tracking Sheets', 'Baseline & Endline Surveys']
    },
    {
      id: 'hr',
      name: '📁 HR & Admin',
      icon: Users,
      color: 'teal',
      documents: ['Employment Contracts', 'Volunteer Agreements', 'Performance Appraisals', 'Job Descriptions', 'Leave & Attendance Records', 'Training Certificates', 'Staff Induction Pack']
    }
  ];

  // Sample documents data with comprehensive NGO documents
  useEffect(() => {
    const sampleDocuments: Document[] = [
      {
        id: '1',
        name: 'NGO Registration Certificate',
        category: 'governance',
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
        name: 'Financial Management Policy',
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
        name: 'Employment Contracts',
        category: 'hr',
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
        name: 'AML/CFT Policy (Anti-Money Laundering)',
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
        name: 'Audited Financial Statements',
        category: 'financial',
        subcategory: 'Financial Reports',
        fileType: 'PDF',
        fileSize: '2.1 MB',
        uploadDate: '2024-01-10',
        expiryDate: '2025-01-10',
        status: 'active',
        version: '1.3',
        uploadedBy: 'Finance Manager',
        description: 'Annual audited financial statements for 2023',
        tags: ['audit', 'financial', 'annual'],
        isConfidential: true,
        approvalStatus: 'approved',
        lastModified: '2024-01-10'
      },
      {
        id: '7',
        name: 'Code of Conduct',
        category: 'policies',
        subcategory: 'Ethics',
        fileType: 'PDF',
        fileSize: '1.2 MB',
        uploadDate: '2024-02-20',
        expiryDate: '2025-02-20',
        status: 'active',
        version: '2.0',
        uploadedBy: 'HR Manager',
        description: 'Organizational code of conduct and ethical guidelines',
        tags: ['ethics', 'conduct', 'guidelines'],
        isConfidential: false,
        approvalStatus: 'approved',
        lastModified: '2024-02-20'
      },
      {
        id: '8',
        name: 'M&E Framework',
        category: 'monitoring',
        subcategory: 'M&E Documents',
        fileType: 'DOCX',
        fileSize: '1.4 MB',
        uploadDate: '2024-01-25',
        status: 'active',
        version: '1.1',
        uploadedBy: 'M&E Manager',
        description: 'Comprehensive monitoring and evaluation framework',
        tags: ['monitoring', 'evaluation', 'framework'],
        isConfidential: false,
        approvalStatus: 'approved',
        lastModified: '2024-01-25'
      },
      {
        id: '9',
        name: 'Constitution / Articles of Association',
        category: 'governance',
        subcategory: 'Legal Documents',
        fileType: 'PDF',
        fileSize: '1.9 MB',
        uploadDate: '2024-01-05',
        status: 'active',
        version: '1.0',
        uploadedBy: 'Admin',
        description: 'Organizational constitution and articles of association',
        tags: ['constitution', 'governance', 'legal'],
        isConfidential: false,
        approvalStatus: 'approved',
        lastModified: '2024-01-05'
      }
    ];
    setDocuments(sampleDocuments);
  }, []);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCustomDocumentRequest = async () => {
    if (!customRequest.trim()) return;
    
    // Start document writing with progress tracking
    try {
      await requestDocumentWriting(customRequest, 'policies', 'Custom Request');
      setShowCustomRequestModal(false);
      setCustomRequest('');
    } catch (error) {
      console.error('Failed to request custom document:', error);
    }
  };

  const documentTemplates = [
    {
      id: 'child-protection',
      name: 'Child Protection Policy',
      category: 'Safeguarding',
      description: 'Comprehensive child protection policy with procedures and reporting mechanisms',
      estimatedTime: '15-20 minutes',
      complexity: 'Advanced'
    },
    {
      id: 'financial-policy',
      name: 'Financial Policy Manual',
      category: 'Financial',
      description: 'Complete financial procedures, controls, and approval workflows',
      estimatedTime: '25-30 minutes',
      complexity: 'Advanced'
    },
    {
      id: 'code-of-conduct',
      name: 'Code of Conduct',
      category: 'Ethics',
      description: 'Organizational code of conduct and ethical guidelines',
      estimatedTime: '10-15 minutes',
      complexity: 'Intermediate'
    },
    {
      id: 'data-protection',
      name: 'Data Protection Policy',
      category: 'Compliance',
      description: 'GDPR-compliant data protection policy and procedures',
      estimatedTime: '20-25 minutes',
      complexity: 'Advanced'
    },
    {
      id: 'anti-harassment',
      name: 'Anti-Sexual Harassment Policy',
      category: 'HR',
      description: 'Anti-harassment policy with complaint and investigation procedures',
      estimatedTime: '15-20 minutes',
      complexity: 'Intermediate'
    },
    {
      id: 'procurement-policy',
      name: 'Procurement Policy',
      category: 'Operations',
      description: 'Procurement procedures, vendor selection, and approval processes',
      estimatedTime: '20-25 minutes',
      complexity: 'Intermediate'
    }
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

  const handleCreateDocument = (templateId: string) => {
    const template = documentTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedDocument({
        id: 'new',
        name: template.name,
        category: 'policies' as any,
        subcategory: template.category,
        fileType: 'DOCX',
        fileSize: '0 KB',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending_review' as any,
        version: '1.0',
        uploadedBy: 'Current User',
        description: template.description,
        tags: [],
        isConfidential: true,
        approvalStatus: 'pending' as any,
        lastModified: new Date().toISOString().split('T')[0]
      });
      setShowDocumentWriter(true);
    }
  };

  if (showDocumentWriter) {
    return (
      <SystemDocumentWriter
        document={selectedDocument}
        onClose={() => {
          setShowDocumentWriter(false);
          setSelectedDocument(null);
        }}
        onSave={(updatedDoc) => {
          // Handle save logic
          setShowDocumentWriter(false);
          setSelectedDocument(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      {/* Mobile Menu Overlay */}
      {showMobileMenu && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileMenu(false)} />
      )}
      
      {/* Mobile Side Menu */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-slate-800 z-50 transform transition-transform duration-300 ${
        showMobileMenu && isMobile ? 'translate-x-0' : '-translate-x-full'
      } md:hidden`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">System Menu</h2>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="p-2 hover:bg-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Mobile Navigation */}
          <div className="space-y-2">
            {[
              { id: 'documents', name: 'Documents', icon: FileText },
              { id: 'writer', name: 'System Writer', icon: PenTool },
              { id: 'templates', name: 'Templates', icon: BookOpen }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Mobile Quick Actions */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowUploadModal(true);
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700 rounded-lg"
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
              <button
                onClick={() => {
                  setActiveTab('writer');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700 rounded-lg"
              >
                <Sparkles className="w-4 h-4" />
                Create Document
              </button>
              <button
                onClick={() => {
                  setShowCustomRequestModal(true);
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700 rounded-lg"
              >
                <PenTool className="w-4 h-4" />
                Request Custom
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header - Mobile Responsive */}
      <div className="bg-slate-800 border-b border-slate-700 p-3 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="md:hidden p-2 hover:bg-slate-700 rounded-lg flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3 truncate">
                NGO Document Repository
              </h1>
              <p className="text-slate-300 text-base md:text-lg">
                System-powered document management
              </p>
            </div>
          </div>
          
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-5 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl text-base font-semibold"
            >
              <Upload className="w-5 h-5" />
              Upload Documents
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAnalytics(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-5 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl text-base font-semibold"
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCollaboration(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-5 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl text-base font-semibold"
            >
              <Users className="w-5 h-5" />
              Collaboration Hub
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('writer')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-5 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl text-base font-semibold"
            >
              <Sparkles className="w-5 h-5" />
              Create Document
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCustomRequestModal(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-5 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl text-base font-semibold"
            >
              <PenTool className="w-5 h-5" />
              Request Custom
            </motion.button>
          </div>
        </div>

        {/* Navigation Tabs - Desktop Only */}
        <div className="hidden md:flex space-x-1 bg-slate-700 p-1 rounded-lg">
          {[
            { id: 'documents', name: 'Documents', icon: FileText },
            { id: 'writer', name: 'System Writer', icon: PenTool },
            { id: 'templates', name: 'Templates', icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveTab('documents');
              setSelectedCategory('all');
            }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-4 md:p-6 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">{documents.length + uploadedDocuments.length}</div>
            <div className="text-base md:text-lg font-semibold text-blue-100">Total Documents</div>
            <div className="text-xs md:text-sm text-blue-200 mt-1">Click to view all</div>
          </motion.button>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveTab('documents');
              // Filter for expiring documents
              setSearchQuery('');
            }}
            className="bg-gradient-to-br from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 p-4 md:p-6 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">{documents.filter(d => isExpiringSoon(d.expiryDate)).length}</div>
            <div className="text-base md:text-lg font-semibold text-yellow-100">Expiring Soon</div>
            <div className="text-xs md:text-sm text-yellow-200 mt-1">Click to manage</div>
          </motion.button>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveTab('documents');
              // Filter for expired documents
              setSearchQuery('');
            }}
            className="bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 p-4 md:p-6 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">{documents.filter(d => d.status === 'expired').length}</div>
            <div className="text-base md:text-lg font-semibold text-red-100">Expired</div>
            <div className="text-xs md:text-sm text-red-200 mt-1">Click to review</div>
          </motion.button>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveTab('documents');
              // Filter for approved documents
              setSearchQuery('');
            }}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 p-4 md:p-6 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">{documents.filter(d => d.approvalStatus === 'approved').length}</div>
            <div className="text-base md:text-lg font-semibold text-emerald-100">Approved</div>
            <div className="text-xs md:text-sm text-emerald-200 mt-1">Click to view</div>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 md:p-6">
        {activeTab === 'documents' && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Document Folders */}
            <div className="w-full lg:w-80 bg-slate-800 rounded-lg p-4 md:p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-6 text-white">Document Categories</h3>
                <div className="space-y-3">
                  {documentFolders.map(folder => {
                    const Icon = folder.icon;
                    const isExpanded = expandedFolders.has(folder.id);
                    const folderDocuments = documents.filter(d => d.category === folder.id);
                  const uploadedFolderDocs = uploadedDocuments.filter(d => d.category === folder.id);
                    
                    return (
                      <motion.div 
                        key={folder.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleFolder(folder.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-300 hover:bg-slate-700/50`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-2xl">{isExpanded ? '📂' : '📁'}</div>
                            <span className="text-base md:text-lg font-semibold text-white">{folder.name.replace('📁 ', '')}</span>
                          </div>
                          <motion.span 
                            whileHover={{ scale: 1.1 }}
                            className="text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-full font-semibold shadow-lg"
                          >
                            {folderDocuments.length + uploadedFolderDocs.length}
                          </motion.span>
                        </motion.button>
                        
                        {isExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 pt-0"
                          >
                            <div className="space-y-2">
                              {folder.documents.map((docName, index) => {
                                const existingDoc = folderDocuments.find(d => d.name === docName);
                                return (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                                      existingDoc 
                                        ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 text-green-300 border border-green-600/30' 
                                        : 'bg-gradient-to-r from-slate-700/50 to-slate-800/50 text-slate-300 hover:from-slate-600/50 hover:to-slate-700/50 hover:text-white border border-slate-600/30 hover:border-blue-500/50'
                                    }`}
                                    onClick={async () => {
                                      if (!existingDoc) {
                                        // Start professional document writing with progress tracking
                                        await requestDocumentWriting(docName, folder.id, folder.name.replace('📁 ', ''));
                                      } else {
                                        setSelectedDocument(existingDoc);
                                        setShowDocumentWriter(true);
                                      }
                                    }}
                                  >
                                    <span className="truncate">{docName}</span>
                                    <motion.div 
                                      whileHover={{ scale: 1.2 }}
                                      className={`flex-shrink-0 ${existingDoc ? 'text-green-400' : 'text-blue-400'}`}
                                    >
                                      {existingDoc ? (
                                        <CheckCircle className="w-4 h-4" />
                                      ) : (
                                        <Plus className="w-4 h-4" />
                                      )}
                                    </motion.div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
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

            {/* Documents List */}
            <div className="flex-1">
              {/* Search and Controls - Mobile Friendly */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm md:text-base bg-slate-800 border border-slate-600 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 text-sm md:text-base bg-slate-800 border border-slate-600 rounded-lg focus:border-blue-500 focus:outline-none min-w-0 flex-1 sm:flex-none"
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
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Documents Grid - Mobile Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredDocuments.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 md:p-7 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="text-3xl md:text-4xl flex-shrink-0">{getFileIcon(doc.fileType)}</div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-white text-base md:text-lg truncate mb-1">{doc.name}</h3>
                          <p className="text-sm md:text-base text-slate-300 truncate">{doc.subcategory}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {doc.isConfidential && <Shield className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />}
                        {isExpiringSoon(doc.expiryDate) && <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />}
                      </div>
                    </div>

                    <div className="space-y-3 mb-5">
                      <div className="flex items-center justify-between text-sm md:text-base">
                        <span className="text-slate-400 font-medium">Version:</span>
                        <span className="text-white font-semibold">{doc.version}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm md:text-base">
                        <span className="text-slate-400 font-medium">Size:</span>
                        <span className="text-white font-semibold">{doc.fileSize}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm md:text-base">
                        <span className="text-slate-400 font-medium">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}>
                          {doc.status.replace('_', ' ')}
                        </span>
                      </div>
                      {doc.expiryDate && (
                        <div className="flex items-center justify-between text-sm md:text-base">
                          <span className="text-slate-400 font-medium">Expires:</span>
                          <span className={`font-semibold ${isExpiringSoon(doc.expiryDate) ? 'text-yellow-400' : 'text-white'}`}>
                            {new Date(doc.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-5 flex-wrap">
                      {doc.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-sm font-medium rounded-full text-white">
                          {tag}
                        </span>
                      ))}
                      {doc.tags.length > 2 && (
                        <span className="text-sm text-slate-300 font-medium">+{doc.tags.length - 2} more</span>
                      )}
                    </div>

                    <div className="space-y-3">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedDocument(doc);
                          setShowDocumentWriter(true);
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                        View & Edit
                      </motion.button>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedDocForVersioning(doc.id);
                            setShowVersioning(true);
                          }}
                          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                          title="Version History"
                        >
                          <GitBranch className="w-4 h-4 text-purple-400 mx-auto" />
                        </motion.button>
                        
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedDocForSharing({ id: doc.id, name: doc.name });
                            setShowSharing(true);
                          }}
                          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                          title="Share Document"
                        >
                          <Share2 className="w-4 h-4 text-blue-400 mx-auto" />
                        </motion.button>
                        
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            // Download functionality
                            console.log('Download:', doc.name);
                          }}
                          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                          title="Download"
                        >
                          <Download className="w-4 h-4 text-green-400 mx-auto" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Document Templates</h2>
              <p className="text-slate-400">Choose a template to create professional NGO documents and policies</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentTemplates.map(template => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => handleCreateDocument(template.id)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{template.name}</h3>
                      <p className="text-sm text-blue-400">{template.category}</p>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-4">{template.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>{template.estimatedTime}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      template.complexity === 'Advanced' ? 'bg-red-500/20 text-red-400' :
                      template.complexity === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {template.complexity}
                    </span>
                  </div>

                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Create Document
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'writer' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800 rounded-lg p-8 text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Intelligent Document Writer</h2>
              <p className="text-slate-400 mb-8">
                Create professional NGO documents and policies with our advanced writing system. 
                Choose from templates or describe what you need, and the system will generate comprehensive, 
                compliant documents tailored to your organization.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-700 p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Quick Templates</h3>
                  <p className="text-sm text-slate-400">Start with pre-built templates for common NGO documents</p>
                </div>
                <div className="bg-slate-700 p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Custom Creation</h3>
                  <p className="text-sm text-slate-400">Describe your requirements and get a custom document</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('templates')}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Document Request Modal */}
      {showCustomRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Request Custom Document</h3>
            <p className="text-slate-400 mb-4">
              Describe the document or policy you need, and our system will help you create it.
            </p>
            <textarea
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              placeholder="e.g., Digital Marketing Policy, Remote Work Guidelines, Volunteer Onboarding Manual..."
              className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white resize-none focus:border-blue-500 focus:outline-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCustomDocumentRequest}
                disabled={!customRequest.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
              >
                Create Document
              </button>
              <button
                onClick={() => {
                  setShowCustomRequestModal(false);
                  setCustomRequest('');
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Writer Modal */}
      {showDocumentWriter && selectedDocument && (
        <SystemDocumentWriter
          document={selectedDocument}
          onClose={() => {
            setShowDocumentWriter(false);
            setSelectedDocument(null);
          }}
          onSave={(updatedDocument) => {
            setDocuments(prev => {
              const existing = prev.find(d => d.id === updatedDocument.id);
              if (existing) {
                return prev.map(d => d.id === updatedDocument.id ? updatedDocument : d);
              }
              return [...prev, updatedDocument];
            });
            setShowDocumentWriter(false);
            setSelectedDocument(null);
          }}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-4 py-2 z-30">
        <div className="flex justify-around items-center">
          {[
            { id: 'documents', name: 'Docs', icon: FileText },
            { id: 'writer', name: 'Writer', icon: PenTool },
            { id: 'templates', name: 'Templates', icon: BookOpen },
            { id: 'menu', name: 'Menu', icon: Menu }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'menu') {
                    setShowMobileMenu(true);
                  } else {
                    setActiveTab(tab.id as any);
                  }
                }}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-blue-400 bg-blue-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Spacing for Bottom Navigation */}
      <div className="md:hidden h-20" />

      {/* Document Writing Progress Modal */}
      {showWritingProgress && currentJobId && (
        <DocumentWritingProgress
          jobId={currentJobId}
          onComplete={handleWritingComplete}
          onClose={() => setShowWritingProgress(false)}
        />
      )}

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleUploadComplete}
        userId="550e8400-e29b-41d4-a716-446655440000"
      />

      {/* Document Versioning Modal */}
      <DocumentVersioning
        documentId={selectedDocForVersioning}
        isOpen={showVersioning}
        onClose={() => setShowVersioning(false)}
      />

      {/* Document Sharing Modal */}
      <DocumentSharingSystem
        documentId={selectedDocForSharing.id}
        documentName={selectedDocForSharing.name}
        isOpen={showSharing}
        onClose={() => setShowSharing(false)}
      />

      {/* Document Analytics Modal */}
      <DocumentAnalytics
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      {/* Document Collaboration Hub */}
      <DocumentCollaborationHub
        isOpen={showCollaboration}
        onClose={() => setShowCollaboration(false)}
      />
    </div>
  );
};

export default NGODocumentSystem;