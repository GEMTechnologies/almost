import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { intelligentAutoFill } from '../../services/intelligentAutoFill';
import { useOpportunity } from '../../contexts/OpportunityContext';
import { transformOpportunityToProposalData, getOpportunityContext } from '../../utils/opportunityDataFlow';
import { OpportunityBanner } from '../../components/OpportunityBanner';
import { ProposalTemplateSelector } from './components/ProposalTemplateSelector';
import { ProposalSectionEditor } from './components/ProposalSectionEditor';
import { IntelligentProposalEditor } from '../../components/IntelligentProposalEditor';
import {
  FileText,
  Download,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Building,
  DollarSign,
  Calendar,
  Target,
  FileCheck,
  Loader,
  Brain,
  X
} from 'lucide-react';

interface ProposalFormData {
  opportunityId: string;
  organizationName: string;
  organizationType: string;
  projectTitle: string;
  projectDescription: string;
  requestedAmount: string;
  projectDuration: string;
  targetBeneficiaries: string;
  problemStatement: string;
  solutionApproach: string;
  expectedOutcomes: string;
  documentFormat: string;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'generating' | 'completed' | 'submitted';
  content: any;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  opportunityTitle?: string;
  fundingAmount?: string;
  totalWords?: number;
  totalPages?: number;
}

const ProposalGenerator: React.FC = () => {
  const { user } = useAuth();
  const { selectedOpportunity, isFromDiscovery } = useOpportunity();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});
  const [showSuggestions, setShowSuggestions] = useState<Record<string, boolean>>({});
  const [fieldValidation, setFieldValidation] = useState<Record<string, any>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showIntelligentEditor, setShowIntelligentEditor] = useState(false);
  const [proposalSections, setProposalSections] = useState<any[]>([]);
  const [formData, setFormData] = useState<ProposalFormData>({
    opportunityId: '',
    organizationName: user?.firstName ? `${user.firstName} Organization` : '',
    organizationType: 'Non-Profit Organization',
    projectTitle: '',
    projectDescription: '',
    requestedAmount: '',
    projectDuration: '24 months',
    targetBeneficiaries: '',
    problemStatement: '',
    solutionApproach: '',
    expectedOutcomes: '',
    documentFormat: 'docx'
  });

  const organizationTypes = [
    'Non-Profit Organization',
    'Research Institution',
    'University',
    'Government Agency',
    'Community Organization',
    'Social Enterprise',
    'International NGO',
    'Healthcare Organization',
    'Educational Institution'
  ];

  // Load existing proposals and user profile on component mount
  useEffect(() => {
    loadProposals();
    initializeIntelligentAutoFill();
    initializeProposalSections();
    
    // Auto-populate if coming from donor discovery
    if (selectedOpportunity && isFromDiscovery) {
      populateFromOpportunity();
    }
  }, [selectedOpportunity, isFromDiscovery]);

  // Check for auto-start from Real-time AI button
  useEffect(() => {
    const checkAutoStart = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const autoStart = urlParams.get('autoStart');
      
      if (selectedOpportunity?.auto_start_generation || autoStart === 'true') {
        console.log('🚀 AUTO-START DETECTED - Bypassing all forms and starting AI generation');
        console.log('👤 Using database profile for:', selectedOpportunity?.user_profile?.organization_name);
        
        // Skip form completely and go directly to intelligent editor
        setShowIntelligentEditor(true);
        setShowCreateForm(false);
        
        // Generate dynamic sections based on opportunity
        generateDynamicSections();
      }
    };

    // Check immediately and also when selectedOpportunity changes
    if (selectedOpportunity) {
      checkAutoStart();
    }
  }, [selectedOpportunity]);

  const generateDynamicSections = async () => {
    try {
      console.log('🔄 Generating dynamic sections for:', selectedOpportunity?.sector);
      
      // Generate smart sections based on opportunity and sector
      const dynamicSections = generateSmartSections(selectedOpportunity);
      
      console.log('✅ Generated', dynamicSections.length, 'dynamic sections');
      setProposalSections(dynamicSections);
    } catch (error) {
      console.error('❌ Failed to generate dynamic sections:', error);
      // Fallback to default sections
      setProposalSections(getDefaultSections());
    }
  };

  const generateSmartSections = (opportunity: any) => {
    const baseSections = [
      { 
        id: 'executive_summary', 
        title: 'Executive Summary', 
        content: '', 
        required: true, 
        wordLimit: 500,
        description: 'Compelling overview highlighting key impact and organizational strengths'
      },
      { 
        id: 'organization_background', 
        title: 'Organization Background', 
        content: '', 
        required: true, 
        wordLimit: 800,
        description: 'Organizational capacity, track record, and credibility'
      }
    ];

    // Add sector-specific sections
    const sectorSections = getSectorSections(opportunity?.sector);
    
    // Add requirement-based sections
    const requirementSections = getRequirementSections(opportunity?.requirements || []);
    
    // Add funding-specific sections
    const fundingSections = getFundingSections(opportunity?.fundingAmount);

    return [...baseSections, ...sectorSections, ...requirementSections, ...fundingSections];
  };

  const getSectorSections = (sector: string) => {
    const sectorMap = {
      'Health': [
        { id: 'health_needs', title: 'Health Needs Assessment', content: '', required: true, wordLimit: 1000 },
        { id: 'clinical_approach', title: 'Clinical Methodology', content: '', required: true, wordLimit: 1200 },
        { id: 'community_health', title: 'Community Engagement Strategy', content: '', required: true, wordLimit: 800 }
      ],
      'Education': [
        { id: 'educational_context', title: 'Educational Context & Challenges', content: '', required: true, wordLimit: 1000 },
        { id: 'pedagogical_approach', title: 'Pedagogical Innovation', content: '', required: true, wordLimit: 1200 },
        { id: 'learning_outcomes', title: 'Expected Learning Outcomes', content: '', required: true, wordLimit: 800 }
      ],
      'Technology': [
        { id: 'technical_innovation', title: 'Technical Innovation & Approach', content: '', required: true, wordLimit: 1200 },
        { id: 'implementation_plan', title: 'Implementation & Deployment', content: '', required: true, wordLimit: 1000 },
        { id: 'technology_sustainability', title: 'Technology Sustainability', content: '', required: true, wordLimit: 800 }
      ]
    };

    return sectorMap[sector] || [
      { id: 'project_methodology', title: 'Project Methodology', content: '', required: true, wordLimit: 1200 },
      { id: 'implementation_strategy', title: 'Implementation Strategy', content: '', required: true, wordLimit: 1000 }
    ];
  };

  const getRequirementSections = (requirements: string[]) => {
    const sections = [];
    
    if (requirements.some(req => req.toLowerCase().includes('budget'))) {
      sections.push({
        id: 'detailed_budget',
        title: 'Detailed Budget Breakdown',
        content: '',
        required: true,
        wordLimit: 1000
      });
    }
    
    if (requirements.some(req => req.toLowerCase().includes('evaluation'))) {
      sections.push({
        id: 'monitoring_evaluation',
        title: 'Monitoring & Evaluation Framework',
        content: '',
        required: true,
        wordLimit: 1200
      });
    }
    
    return sections;
  };

  const getFundingSections = (fundingAmount: string) => {
    const sections = [];
    
    // Always include impact section
    sections.push({
      id: 'expected_impact',
      title: 'Expected Impact & Outcomes',
      content: '',
      required: true,
      wordLimit: 1200
    });

    // Add sustainability section for larger grants
    const amount = fundingAmount?.match(/\$?[\d,]+/)?.[0]?.replace(/[^\d]/g, '');
    const numericAmount = amount ? parseInt(amount) : 0;
    
    if (numericAmount > 100000) {
      sections.push({
        id: 'sustainability_plan',
        title: 'Sustainability & Long-term Impact',
        content: '',
        required: true,
        wordLimit: 1000
      });
    }

    return sections;
  };

  const populateFromOpportunity = () => {
    if (!selectedOpportunity) return;
    
    const transformedData = transformOpportunityToProposalData(selectedOpportunity, user);
    setFormData(prev => ({ ...prev, ...transformedData }));
    
    // Initialize proposal sections
    initializeProposalSections();
    
    // Show the form automatically (unless auto-start is enabled)
    if (!selectedOpportunity?.auto_start_generation) {
      setShowCreateForm(true);
    }
  };

  const initializeProposalSections = async () => {
    if (selectedOpportunity) {
      // Use AI to analyze requirements and generate dynamic outline
      try {
        const { requirementAnalyzer } = await import('../../services/requirementAnalyzer');
        const outline = await requirementAnalyzer.analyzeOpportunityRequirements(selectedOpportunity);
        
        const dynamicSections = outline.sections.map(section => ({
          id: section.id,
          title: section.title,
          content: '',
          wordLimit: section.wordLimit,
          required: section.required,
          analysis: null,
          aiSuggestions: section.aiSuggestions,
          requirements: section.requirements,
          category: section.category
        }));
        
        setProposalSections(dynamicSections);
      } catch (error) {
        console.error('Failed to analyze requirements:', error);
        setProposalSections(getDefaultSections());
      }
    } else {
      setProposalSections(getDefaultSections());
    }
  };

  const getDefaultSections = () => [
    {
      id: '1',
      title: 'Executive Summary',
      content: '',
      wordLimit: 500,
      required: true,
      analysis: null,
      aiSuggestions: ['Keep it concise and compelling', 'Include key objectives and outcomes'],
      requirements: ['Maximum 500 words'],
      category: 'project'
    },
    {
      id: '2', 
      title: 'Organization Background',
      content: '',
      wordLimit: 800,
      required: true,
      analysis: null,
      aiSuggestions: ['Highlight relevant experience', 'Include mission and vision'],
      requirements: ['Maximum 800 words'],
      category: 'organizational'
    },
    {
      id: '3',
      title: 'Problem Statement',
      content: '',
      wordLimit: 1000,
      required: true,
      analysis: null,
      aiSuggestions: ['Use data and evidence', 'Clearly define the problem'],
      requirements: ['Maximum 1000 words'],
      category: 'project'
    },
    {
      id: '4',
      title: 'Project Description',
      content: '',
      wordLimit: 1500,
      required: true,
      analysis: null,
      aiSuggestions: ['Explain methodology clearly', 'Include timeline and milestones'],
      requirements: ['Maximum 1500 words'],
      category: 'project'
    },
    {
      id: '5',
      title: 'Implementation Plan',
      content: '',
      wordLimit: 1200,
      required: true,
      analysis: null,
      aiSuggestions: ['Detail phases and activities', 'Include risk mitigation'],
      requirements: ['Maximum 1200 words'],
      category: 'project'
    },
    {
      id: '6',
      title: 'Budget & Financial Plan',
      content: '',
      wordLimit: 800,
      required: true,
      analysis: null,
      aiSuggestions: ['Provide detailed breakdown', 'Justify major expenses'],
      requirements: ['Maximum 800 words'],
      category: 'financial'
    }
  ];

  const initializeIntelligentAutoFill = async () => {
    if (user) {
      await intelligentAutoFill.loadUserProfile(user.id);
    }
  };

  const loadProposals = async () => {
    try {
      // Load from local storage or API
      const savedProposals = localStorage.getItem('user_proposals');
      if (savedProposals) {
        setProposals(JSON.parse(savedProposals));
      }
    } catch (error) {
      console.error('Error loading proposals:', error);
    }
  };

  const handleInputChange = async (field: keyof ProposalFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Get smart suggestions
    if (value.length > 2) {
      const fieldSuggestions = await intelligentAutoFill.getAutoFillSuggestions(field, value);
      setSuggestions(prev => ({ ...prev, [field]: fieldSuggestions }));
      setShowSuggestions(prev => ({ ...prev, [field]: true }));
    } else {
      setShowSuggestions(prev => ({ ...prev, [field]: false }));
    }

    // Real-time validation
    if (['problemStatement', 'solutionApproach', 'expectedOutcomes'].includes(field)) {
      const validation = await intelligentAutoFill.validateAndEnhance(field, value);
      setFieldValidation(prev => ({ ...prev, [field]: validation }));
    }
  };

  const selectSuggestion = (field: keyof ProposalFormData, suggestion: string) => {
    setFormData(prev => ({ ...prev, [field]: suggestion }));
    setShowSuggestions(prev => ({ ...prev, [field]: false }));
  };

  const generateSmartContent = async (field: keyof ProposalFormData) => {
    const context = {
      sector: user?.sector || 'Health',
      country: user?.country || 'Uganda',
      organizationType: formData.organizationType,
      problemStatement: formData.problemStatement,
      solutionApproach: formData.solutionApproach
    };

    const smartContent = await intelligentAutoFill.generateSmartContent(field, context);
    setFormData(prev => ({ ...prev, [field]: smartContent }));
  };

  const generateProposal = async () => {
    if (!formData.projectTitle || !formData.problemStatement) {
      alert('Please fill in the required fields');
      return;
    }

    setIsGenerating(true);

    try {
      // Create proposal request for DeepSeek backend
      const proposalRequest = {
        opportunity_id: formData.opportunityId || 'general',
        organization_name: formData.organizationName,
        organization_type: formData.organizationType,
        project_title: formData.projectTitle,
        project_description: formData.projectDescription,
        requested_amount: parseFloat(formData.requestedAmount) || 50000,
        project_duration: formData.projectDuration,
        target_beneficiaries: formData.targetBeneficiaries,
        problem_statement: formData.problemStatement,
        solution_approach: formData.solutionApproach,
        expected_outcomes: formData.expectedOutcomes,
        budget_breakdown: {},
        team_information: {},
        additional_requirements: '',
        document_format: formData.documentFormat,
        template_type: 'comprehensive'
      };

      // Create mock proposal response for demonstration
      const response = {
        ok: true,
        json: async () => ({
          id: `prop_${Date.now()}`,
          title: proposalRequest.project_title,
          proposal_type: 'grant',
          status: 'draft',
          progress_percentage: 25,
          word_count: 2500,
          sections_count: 3,
          last_modified: new Date().toISOString(),
          deadline: null,
          created_at: new Date().toISOString()
        })
      };

      if (response.ok) {
        const result = await response.json();
        
        // Create new proposal entry
        const newProposal: Proposal = {
          id: result.proposal_id || Date.now().toString(),
          title: formData.projectTitle,
          description: formData.projectDescription,
          status: 'completed',
          content: result,
          createdBy: user?.firstName || 'User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          opportunityTitle: formData.opportunityId,
          fundingAmount: formData.requestedAmount,
          totalWords: result.total_words,
          totalPages: result.total_pages
        };

        // Update proposals list
        const updatedProposals = [newProposal, ...proposals];
        setProposals(updatedProposals);
        localStorage.setItem('user_proposals', JSON.stringify(updatedProposals));

        // Reset form and close
        setFormData({
          opportunityId: '',
          organizationName: user?.firstName ? `${user.firstName} Organization` : '',
          organizationType: 'Non-Profit Organization',
          projectTitle: '',
          projectDescription: '',
          requestedAmount: '',
          projectDuration: '24 months',
          targetBeneficiaries: '',
          problemStatement: '',
          solutionApproach: '',
          expectedOutcomes: '',
          documentFormat: 'docx'
        });
        setShowCreateForm(false);

      } else {
        throw new Error('Failed to generate proposal');
      }

    } catch (error) {
      console.error('Proposal generation error:', error);
      alert('Failed to generate proposal. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadProposal = async (proposalId: string) => {
    try {
      const response = await fetch(`http://localhost:8002/download-proposal/${proposalId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `proposal_${proposalId}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'generating':
        return <Loader className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'draft':
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h3>
          <p className="text-gray-600 dark:text-gray-400">Please log in to access the proposal generator</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Expert Proposal Generator</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
              {selectedOpportunity && isFromDiscovery ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="truncate">Auto-populated from: {selectedOpportunity.title}</span>
                </span>
              ) : (
                'Create comprehensive funding proposals with expert assistance'
              )}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <motion.button
              onClick={() => setShowIntelligentEditor(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base"
            >
              <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">Intelligent Editor</span>
            </motion.button>
            
            <motion.button
              onClick={() => setShowTemplateSelector(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg text-sm sm:text-base"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">Choose Template</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateForm(true)}
              className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">Quick Start</span>
            </motion.button>
          </div>
        </div>

        {/* Opportunity Banner */}
        {selectedOpportunity && isFromDiscovery && (
          <OpportunityBanner opportunity={selectedOpportunity} />
        )}

        {/* Intelligent Editor Modal */}
        {showIntelligentEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full h-full"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setShowIntelligentEditor(false)}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <IntelligentProposalEditor
                sections={proposalSections}
                onSectionsUpdate={setProposalSections}
                opportunityContext={selectedOpportunity ? {
                  ...selectedOpportunity,
                  funding_type: selectedOpportunity.sector,
                  funder_name: selectedOpportunity.sourceName,
                  amount: selectedOpportunity.fundingAmount,
                  location: selectedOpportunity.country,
                  duration: formData.projectDuration
                } : undefined}
                template={selectedTemplate || undefined}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Template Selector Modal */}
        {showTemplateSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setShowTemplateSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Select Proposal Template
                </h2>
                <button
                  onClick={() => setShowTemplateSelector(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <ProposalTemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateSelect={(template) => {
                  setSelectedTemplate(template.id);
                  setShowTemplateSelector(false);
                  initializeProposalSections();
                  setShowIntelligentEditor(true);
                }}
                opportunityContext={selectedOpportunity ? {
                  sector: selectedOpportunity.sector,
                  sourceName: selectedOpportunity.sourceName,
                  fundingType: selectedOpportunity.fundingType
                } : undefined}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Create Form Modal - Hidden during auto-start */}
        {showCreateForm && !selectedOpportunity?.auto_start_generation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generate New Proposal</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    <span>Organization Information</span>
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter organization name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Organization Type
                    </label>
                    <select
                      value={formData.organizationType}
                      onChange={(e) => handleInputChange('organizationType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {organizationTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Beneficiaries
                    </label>
                    <input
                      type="text"
                      value={formData.targetBeneficiaries}
                      onChange={(e) => handleInputChange('targetBeneficiaries', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., Rural communities in East Africa"
                    />
                  </div>
                </div>

                {/* Project Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    <span>Project Information</span>
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={formData.projectTitle}
                      onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter project title"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Requested Amount
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={formData.requestedAmount}
                          onChange={(e) => handleInputChange('requestedAmount', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="50000"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration
                      </label>
                      <select
                        value={formData.projectDuration}
                        onChange={(e) => handleInputChange('projectDuration', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="12 months">12 months</option>
                        <option value="18 months">18 months</option>
                        <option value="24 months">24 months</option>
                        <option value="36 months">36 months</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Document Format
                    </label>
                    <select
                      value={formData.documentFormat}
                      onChange={(e) => handleInputChange('documentFormat', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="docx">Microsoft Word (.docx)</option>
                      <option value="pdf">PDF Document (.pdf)</option>
                      <option value="markdown">Markdown (.md)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="mt-6 space-y-4">
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Problem Statement *
                    </label>
                    <button
                      type="button"
                      onClick={() => generateSmartContent('problemStatement')}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                    >
                      AI Assist
                    </button>
                  </div>
                  <textarea
                    value={formData.problemStatement}
                    onChange={(e) => handleInputChange('problemStatement', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none ${
                      fieldValidation.problemStatement?.isValid === false 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Describe the problem your project addresses..."
                  />
                  
                  {/* Validation feedback */}
                  {fieldValidation.problemStatement?.suggestions && (
                    <div className="mt-1 text-xs text-gray-500">
                      💡 {fieldValidation.problemStatement.suggestions[0]}
                    </div>
                  )}
                  
                  {/* Auto-suggestions */}
                  {showSuggestions.problemStatement && suggestions.problemStatement?.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {suggestions.problemStatement.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => selectSuggestion('problemStatement', suggestion)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Solution Approach
                    </label>
                    <button
                      type="button"
                      onClick={() => generateSmartContent('solutionApproach')}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                    >
                      AI Assist
                    </button>
                  </div>
                  <textarea
                    value={formData.solutionApproach}
                    onChange={(e) => handleInputChange('solutionApproach', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none ${
                      fieldValidation.solutionApproach?.isValid === false 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Describe your proposed solution..."
                  />
                  
                  {/* Validation feedback */}
                  {fieldValidation.solutionApproach?.suggestions && (
                    <div className="mt-1 text-xs text-gray-500">
                      💡 {fieldValidation.solutionApproach.suggestions[0]}
                    </div>
                  )}
                  
                  {/* Auto-suggestions */}
                  {showSuggestions.solutionApproach && suggestions.solutionApproach?.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {suggestions.solutionApproach.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => selectSuggestion('solutionApproach', suggestion)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Expected Outcomes
                    </label>
                    <button
                      type="button"
                      onClick={() => generateSmartContent('expectedOutcomes')}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                    >
                      AI Assist
                    </button>
                  </div>
                  <textarea
                    value={formData.expectedOutcomes}
                    onChange={(e) => handleInputChange('expectedOutcomes', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none ${
                      fieldValidation.expectedOutcomes?.isValid === false 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Describe the expected outcomes and impact..."
                  />
                  
                  {/* Validation feedback */}
                  {fieldValidation.expectedOutcomes?.suggestions && (
                    <div className="mt-1 text-xs text-gray-500">
                      💡 {fieldValidation.expectedOutcomes.suggestions[0]}
                    </div>
                  )}
                  
                  {/* Auto-suggestions */}
                  {showSuggestions.expectedOutcomes && suggestions.expectedOutcomes?.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {suggestions.expectedOutcomes.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => selectSuggestion('expectedOutcomes', suggestion)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 mt-8">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateProposal}
                  disabled={isGenerating}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    'Generate Proposal'
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* Proposals List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Proposals</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and download your generated proposals</p>
          </div>

          <div className="p-6">
            {proposals.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No proposals yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first proposal to get started</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Create Your First Proposal
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proposals.map((proposal) => (
                  <motion.div
                    key={proposal.id}
                    whileHover={{ y: -2 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {proposal.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {proposal.description}
                        </p>
                      </div>
                      <div className="ml-4">
                        {getStatusIcon(proposal.status)}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </span>
                      </div>
                      
                      {proposal.totalWords && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Words:</span>
                          <span className="text-gray-900 dark:text-white">{proposal.totalWords.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {proposal.totalPages && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Pages:</span>
                          <span className="text-gray-900 dark:text-white">{proposal.totalPages}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Created:</span>
                        <span className="text-gray-900 dark:text-white">
                          {new Date(proposal.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {proposal.status === 'completed' && (
                      <button
                        onClick={() => downloadProposal(proposal.id)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalGenerator;