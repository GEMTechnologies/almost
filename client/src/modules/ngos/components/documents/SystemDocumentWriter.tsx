import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Download,
  Share2,
  Eye,
  EyeOff,
  Settings,
  Sparkles,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Wand2,
  FileText,
  Globe,
  Shield,
  Users,
  PenTool,
  Loader,
  RefreshCw
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  content?: string;
}

interface SystemDocumentWriterProps {
  document: Document | null;
  onClose: () => void;
  onSave: (document: Document) => void;
}

interface DocumentSection {
  id: string;
  title: string;
  content: string;
  isGenerating: boolean;
  isCompleted: boolean;
  wordCount: number;
}

const SystemDocumentWriter: React.FC<SystemDocumentWriterProps> = ({
  document,
  onClose,
  onSave
}) => {
  const [documentSections, setDocumentSections] = useState<DocumentSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneratingSection, setCurrentGeneratingSection] = useState<string | null>(null);
  const [organizationContext, setOrganizationContext] = useState({
    name: 'Smart Health Solutions Uganda',
    type: 'Health NGO',
    sector: 'Healthcare',
    country: 'Uganda',
    size: 'Medium (50-100 staff)',
    focus: 'Community health programs'
  });
  const [documentSettings, setDocumentSettings] = useState({
    tone: 'formal',
    complexity: 'professional',
    includeExamples: true,
    includeProcedures: true,
    complianceLevel: 'high'
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize document sections based on document type
  useEffect(() => {
    if (document) {
      initializeDocumentSections(document.name);
    }
  }, [document]);

  const initializeDocumentSections = (documentType: string) => {
    let sections: DocumentSection[] = [];

    switch (documentType.toLowerCase()) {
      case 'child protection policy':
        sections = [
          { id: 'introduction', title: '1. Introduction & Purpose', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'definitions', title: '2. Definitions & Key Terms', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'policy-statement', title: '3. Policy Statement', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'responsibilities', title: '4. Roles & Responsibilities', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'safeguarding-procedures', title: '5. Safeguarding Procedures', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'reporting-mechanisms', title: '6. Reporting Mechanisms', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'investigation-process', title: '7. Investigation Process', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'training-awareness', title: '8. Training & Awareness', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'monitoring-review', title: '9. Monitoring & Review', content: '', isGenerating: false, isCompleted: false, wordCount: 0 }
        ];
        break;
      case 'financial policy manual':
        sections = [
          { id: 'introduction', title: '1. Introduction & Scope', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'financial-framework', title: '2. Financial Management Framework', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'budgeting-procedures', title: '3. Budgeting Procedures', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'expenditure-controls', title: '4. Expenditure Controls', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'procurement-procedures', title: '5. Procurement Procedures', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'financial-reporting', title: '6. Financial Reporting', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'audit-compliance', title: '7. Audit & Compliance', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'risk-management', title: '8. Financial Risk Management', content: '', isGenerating: false, isCompleted: false, wordCount: 0 }
        ];
        break;
      case 'code of conduct':
        sections = [
          { id: 'introduction', title: '1. Introduction & Values', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'professional-conduct', title: '2. Professional Conduct', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'ethical-standards', title: '3. Ethical Standards', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'conflicts-interest', title: '4. Conflicts of Interest', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'confidentiality', title: '5. Confidentiality & Data Protection', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'anti-corruption', title: '6. Anti-Corruption & Fraud', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'reporting-violations', title: '7. Reporting Violations', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'disciplinary-action', title: '8. Disciplinary Action', content: '', isGenerating: false, isCompleted: false, wordCount: 0 }
        ];
        break;
      default:
        sections = [
          { id: 'introduction', title: '1. Introduction', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'scope', title: '2. Scope & Purpose', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'policy', title: '3. Policy Statement', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'procedures', title: '4. Procedures', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'responsibilities', title: '5. Roles & Responsibilities', content: '', isGenerating: false, isCompleted: false, wordCount: 0 },
          { id: 'compliance', title: '6. Compliance & Monitoring', content: '', isGenerating: false, isCompleted: false, wordCount: 0 }
        ];
    }

    setDocumentSections(sections);
  };

  const generateSection = async (sectionId: string) => {
    const section = documentSections.find(s => s.id === sectionId);
    if (!section) return;

    setCurrentGeneratingSection(sectionId);
    setDocumentSections(prev => 
      prev.map(s => s.id === sectionId ? { ...s, isGenerating: true } : s)
    );

    try {
      // Call the DeepSeek API through our backend
      const response = await fetch('/api/ai/generate-document-section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentType: document?.name,
          sectionTitle: section.title,
          sectionId: sectionId,
          organizationContext,
          documentSettings,
          existingSections: documentSections.filter(s => s.isCompleted).map(s => ({
            title: s.title,
            content: s.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate section content');
      }

      const data = await response.json();
      
      setDocumentSections(prev => 
        prev.map(s => s.id === sectionId ? {
          ...s,
          content: data.content,
          isGenerating: false,
          isCompleted: true,
          wordCount: data.content.split(' ').length
        } : s)
      );

    } catch (error) {
      console.error('Error generating section:', error);
      setDocumentSections(prev => 
        prev.map(s => s.id === sectionId ? { ...s, isGenerating: false } : s)
      );
    }

    setCurrentGeneratingSection(null);
  };

  const generateAllSections = async () => {
    setIsGenerating(true);
    
    for (const section of documentSections) {
      if (!section.isCompleted) {
        await generateSection(section.id);
        // Small delay between sections
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setIsGenerating(false);
  };

  const handleSave = () => {
    if (document) {
      const fullContent = documentSections
        .map(section => `${section.title}\n\n${section.content}`)
        .join('\n\n---\n\n');
      
      onSave({
        ...document,
        content: fullContent
      });
    }
  };

  const getTotalWordCount = () => {
    return documentSections.reduce((total, section) => total + section.wordCount, 0);
  };

  const getCompletionPercentage = () => {
    const completed = documentSections.filter(s => s.isCompleted).length;
    return Math.round((completed / documentSections.length) * 100);
  };

  if (!document) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 text-white z-50 flex flex-col">
      {/* Header - Mobile Friendly */}
      <div className="bg-slate-800 border-b border-slate-700 p-3 md:p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-2xl font-bold text-white truncate">{document.name}</h1>
              <p className="text-slate-400 text-sm hidden md:block">DeepSeek AI-powered document generation</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-2 md:px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-2"
            >
              {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden md:inline">{previewMode ? 'Edit' : 'Preview'}</span>
            </button>
            <button
              onClick={handleSave}
              className="px-2 md:px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span className="hidden md:inline">Save</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Document Progress</span>
            <span className="text-sm text-slate-400">{getCompletionPercentage()}% Complete</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getCompletionPercentage()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Stats - Mobile Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4">
          <div className="bg-slate-700 p-2 md:p-3 rounded-lg text-center">
            <div className="text-sm md:text-lg font-bold text-blue-400">{documentSections.length}</div>
            <div className="text-xs text-slate-400">Sections</div>
          </div>
          <div className="bg-slate-700 p-2 md:p-3 rounded-lg text-center">
            <div className="text-sm md:text-lg font-bold text-green-400">{documentSections.filter(s => s.isCompleted).length}</div>
            <div className="text-xs text-slate-400">Completed</div>
          </div>
          <div className="bg-slate-700 p-2 md:p-3 rounded-lg text-center">
            <div className="text-sm md:text-lg font-bold text-yellow-400">{getTotalWordCount()}</div>
            <div className="text-xs text-slate-400">Words</div>
          </div>
          <div className="bg-slate-700 p-2 md:p-3 rounded-lg text-center">
            <div className="text-sm md:text-lg font-bold text-purple-400">
              {Math.round(getTotalWordCount() / 250)} min
            </div>
            <div className="text-xs text-slate-400">Read Time</div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar - Mobile Responsive */}
        <div className="w-full md:w-80 bg-slate-800 border-r border-slate-700 p-4 md:p-6 overflow-y-auto flex-shrink-0 md:block hidden">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              System Controls
            </h3>
            <button
              onClick={generateAllSections}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mb-4"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Generate All Sections
                </>
              )}
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Document Sections</h3>
            <div className="space-y-2">
              {documentSections.map(section => (
                <div
                  key={section.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    activeSection === section.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{section.title}</h4>
                    {section.isGenerating ? (
                      <Loader className="w-4 h-4 animate-spin text-blue-400" />
                    ) : section.isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    {section.wordCount > 0 ? `${section.wordCount} words` : 'Not generated'}
                  </div>
                  {!section.isCompleted && !section.isGenerating && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateSection(section.id);
                      }}
                      className="mt-2 w-full bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-xs transition-colors"
                    >
                      Generate
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Organization Context</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-slate-400">Organization:</label>
                <p className="text-white">{organizationContext.name}</p>
              </div>
              <div>
                <label className="text-slate-400">Sector:</label>
                <p className="text-white">{organizationContext.sector}</p>
              </div>
              <div>
                <label className="text-slate-400">Country:</label>
                <p className="text-white">{organizationContext.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Mobile Responsive */}
        <div className="flex-1 p-3 md:p-6 overflow-y-auto" ref={contentRef}>
          {previewMode ? (
            <div className="max-w-4xl mx-auto bg-white text-black p-8 rounded-lg">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">{document.name}</h1>
                <p className="text-gray-600">{organizationContext.name}</p>
                <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
              </div>
              
              {documentSections.map(section => (
                section.isCompleted && (
                  <div key={section.id} className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-blue-900">{section.title}</h2>
                    <div className="prose prose-sm max-w-none">
                      {section.content.split('\n').map((paragraph, index) => (
                        paragraph.trim() && (
                          <p key={index} className="mb-4 leading-relaxed">
                            {paragraph}
                          </p>
                        )
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {documentSections.map(section => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 md:mb-8 p-4 md:p-6 rounded-lg border transition-colors ${
                    activeSection === section.id
                      ? 'border-blue-500 bg-blue-500/5'
                      : 'border-slate-700 bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg md:text-xl font-bold">{section.title}</h2>
                    <div className="flex items-center gap-2">
                      {section.isGenerating && (
                        <div className="flex items-center gap-2 text-blue-400">
                          <Loader className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Generating...</span>
                        </div>
                      )}
                      {section.isCompleted && (
                        <button
                          onClick={() => generateSection(section.id)}
                          className="p-1 hover:bg-slate-700 rounded transition-colors"
                          title="Regenerate section"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {section.isCompleted ? (
                    <div className="space-y-4">
                      <textarea
                        value={section.content}
                        onChange={(e) => {
                          const newContent = e.target.value;
                          setDocumentSections(prev =>
                            prev.map(s => s.id === section.id ? {
                              ...s,
                              content: newContent,
                              wordCount: newContent.split(' ').length
                            } : s)
                          );
                        }}
                        className="w-full h-64 bg-slate-900 border border-slate-600 rounded-lg p-4 text-white resize-none focus:border-blue-500 focus:outline-none"
                        placeholder="Section content will appear here..."
                      />
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>{section.wordCount} words</span>
                        <span>Est. {Math.round(section.wordCount / 250)} min read</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                      <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400 mb-4">This section hasn't been generated yet</p>
                      <button
                        onClick={() => generateSection(section.id)}
                        disabled={section.isGenerating}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                      >
                        <Wand2 className="w-4 h-4" />
                        Generate Section
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemDocumentWriter;