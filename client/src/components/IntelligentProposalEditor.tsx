import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, Download, Eye, EyeOff, Zap, Brain, BarChart3, Target,
  Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Link, Image, Table, Code, Undo, Redo,
  Settings, Palette, Layout, FileText, CheckCircle, AlertCircle,
  TrendingUp, Users, Award, Globe, Activity, Sparkles, RefreshCw, X, Lightbulb,
  Camera, PieChart, Play, Printer, Share2, Mail, ChevronDown, 
  Highlighter, Subscript, Superscript, Plus, Copy, Paste, Search,
  Font, Columns, AlignJustify, Strikethrough, Heading1, Heading2, Heading3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MediaProposalGenerator, { MediaElement } from '../services/mediaProposalGenerator';
import MediaElementRenderer from './MediaElementRenderer';
import RichProposalView from './RichProposalView';
import { WordProcessorEditor } from './WordProcessorEditor';

interface WritingAnalysis {
  quality_score: number;
  readability_score: number;
  persuasiveness_score: number;
  compliance_score: number;
  word_count: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

interface ProposalSection {
  id: string;
  title: string;
  content: string;
  wordLimit?: number;
  required: boolean;
  analysis?: WritingAnalysis;
  isStreaming?: boolean;
  mediaElements?: MediaElement[];
}

interface IntelligentProposalEditorProps {
  sections: ProposalSection[];
  onSectionsUpdate: (sections: ProposalSection[]) => void;
  opportunityContext?: any;
  template?: string;
  onClose: () => void;
}

export const IntelligentProposalEditor: React.FC<IntelligentProposalEditorProps> = ({
  sections: initialSections,
  onSectionsUpdate,
  opportunityContext,
  template,
  onClose
}) => {
  const { user } = useAuth();
  const [sections, setSections] = useState(initialSections);
  const [activeSection, setActiveSection] = useState<string>(initialSections[0]?.id);
  const [isStreaming, setIsStreaming] = useState<Record<string, boolean>>({});
  const [streamingContent, setStreamingContent] = useState<Record<string, string>>({});
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [editorMode, setEditorMode] = useState<'write' | 'edit' | 'preview'>('write');
  const [showRichPreview, setShowRichPreview] = useState(false);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [documentZoom, setDocumentZoom] = useState(100);
  const [showFormatting, setShowFormatting] = useState(true);
  const [currentFormat, setCurrentFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    alignment: 'left' as 'left' | 'center' | 'right' | 'justify',
    textColor: '#000000',
    backgroundColor: '#ffffff',
    heading: 'normal' as 'normal' | 'h1' | 'h2' | 'h3'
  });
  const [typingSimulation, setTypingSimulation] = useState<Record<string, {
    isTyping: boolean;
    currentText: string;
    targetText: string;
    cursorPosition: number;
    typingSpeed: number;
  }>>({});
  const [showTypingIndicator, setShowTypingIndicator] = useState<Record<string, boolean>>({});
  
  const editorRefs = useRef<Record<string, HTMLTextAreaElement>>({});
  const streamBufferRef = useRef<Record<string, string>>({});
  const hasStartedGeneration = useRef(false);

  // Initialize WebSocket connection
  useEffect(() => {
    const clientId = `${user?.id || 'anonymous'}_${Date.now()}`;
    const ws = new WebSocket(`ws://localhost:8030/ws/stream-writing/${clientId}`);
    
    ws.onopen = () => {
      console.log('Connected to AI Writing Service');
      setWsConnection(ws);
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };
    
    ws.onclose = () => {
      console.log('Disconnected from AI Writing Service');
      setWsConnection(null);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [user?.id]);

  // Check for auto-start from donor discovery
  useEffect(() => {
    if (opportunityContext?.auto_start_generation && opportunityContext?.skip_all_questions) {
      console.log('🚀 AUTO-START DETECTED - Beginning immediate AI generation');
      console.log('📊 Streaming will start automatically with real-time updates');
      
      // Start generating sections immediately
      setTimeout(() => {
        startFullAutomationGeneration();
      }, 1000);
    }
  }, [opportunityContext]);

  // Auto-start complete proposal generation when WebSocket connects
  useEffect(() => {
    if (sections.length > 0 && wsConnection && !hasStartedGeneration.current && 
        !opportunityContext?.auto_start_generation) { // Don't auto-start if manual automation is triggered
      hasStartedGeneration.current = true;
      console.log('🚀 AI System taking complete control - starting automated proposal generation...');
      
      setTimeout(() => {
        startFullProposalGeneration();
      }, 2000);
    }
  }, [sections, wsConnection]);

  const startFullAutomationGeneration = async () => {
    console.log('🤖 FULL AUTOMATION STARTED - AI taking complete control');
    hasStartedGeneration.current = true;
    
    // Generate sections automatically one by one with real-time streaming
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      console.log(`🔄 Starting generation for: ${section.title} (${i + 1}/${sections.length})`);
      
      setActiveSection(section.id);
      await generateSectionWithStreaming(section.id);
      
      // Small delay between sections for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    console.log('✅ Full automation complete - all sections generated');
  };

  const generateSectionWithStreaming = async (sectionId: string) => {
    setIsStreaming(prev => ({ ...prev, [sectionId]: true }));
    setStreamingContent(prev => ({ ...prev, [sectionId]: '' }));

    try {
      console.log(`🔄 Generating "${sections.find(s => s.id === sectionId)?.title}" using database profile:`, 
        opportunityContext?.user_profile?.organization_name);

      // Call backend AI for real content generation using database profile
      const response = await fetch('/api/ai/generate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: sections.find(s => s.id === sectionId)?.title,
          opportunity_details: opportunityContext,
          organization_profile: opportunityContext?.user_profile,
          generation_mode: 'database_personalized_content',
          use_real_profile: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`🔄 Backend generated content for ${sections.find(s => s.id === sectionId)?.title}:`, {
          content_length: data.generated_content.length,
          media_count: data.media_elements?.length || 0,
          quality_score: data.quality_metrics?.relevance_score
        });
        
        // Start realistic human-like typing simulation
        console.log(`✍️ AI is actively writing like a human user - ${content.length} characters`);
        simulateRealisticTyping(sectionId, content);

        // Media elements will be added after typing completes
        setTimeout(() => {
          const updatedSections = sections.map(section => 
            section.id === sectionId 
              ? { 
                  ...section, 
                  mediaElements: data.media_elements || [],
                  analysis: {
                    quality_score: data.quality_metrics?.relevance_score || 90,
                    readability_score: data.quality_metrics?.readability || 85,
                    persuasiveness_score: 88,
                    compliance_score: 92,
                    word_count: data.generated_content?.length || 0,
                    strengths: ["Well structured", "Professional tone"],
                    improvements: [],
                    suggestions: data.ai_suggestions || []
                  }
                }
              : section
          );
          setSections(updatedSections);
          onSectionsUpdate(updatedSections);
        }, (data.generated_content.length * 80) + 2000);

        console.log(`✅ Section "${sections.find(s => s.id === sectionId)?.title}" completed with ${data.media_elements?.length || 0} media elements`);
      }
    } catch (error) {
      console.error('❌ Section generation failed:', error);
    } finally {
      setIsStreaming(prev => ({ ...prev, [sectionId]: false }));
      setStreamingContent(prev => ({ ...prev, [sectionId]: '' }));
    }
  };

  const handleWebSocketMessage = (message: any) => {
    const { type, section_id, content, analysis } = message;
    
    switch (type) {
      case 'writing_start':
        setIsStreaming(prev => ({ ...prev, [section_id]: true }));
        setStreamingContent(prev => ({ ...prev, [section_id]: '' }));
        streamBufferRef.current[section_id] = '';
        break;
        
      case 'writing_chunk':
        streamBufferRef.current[section_id] += content;
        setStreamingContent(prev => ({ 
          ...prev, 
          [section_id]: streamBufferRef.current[section_id] 
        }));
        break;
        
      case 'writing_complete':
        setIsStreaming(prev => ({ ...prev, [section_id]: false }));
        const finalContent = streamBufferRef.current[section_id];
        
        // Update section with generated content and analysis
        updateSectionContent(section_id, finalContent, analysis);
        setStreamingContent(prev => ({ ...prev, [section_id]: '' }));
        break;
        
      case 'analysis_result':
        // Update section analysis
        updateSectionAnalysis(activeSection, analysis);
        break;
    }
  };

  const updateSectionContent = (sectionId: string, content: string, analysis?: WritingAnalysis) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, content, analysis }
        : section
    );
    setSections(updatedSections);
    onSectionsUpdate(updatedSections);
  };

  const updateSectionAnalysis = (sectionId: string, analysis: WritingAnalysis) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, analysis }
        : section
    );
    setSections(updatedSections);
    onSectionsUpdate(updatedSections);
  };

  const handleContentChange = (sectionId: string, content: string) => {
    updateSectionContent(sectionId, content);
    
    // Debounced analysis
    setTimeout(() => {
      if (wsConnection && content.trim()) {
        wsConnection.send(JSON.stringify({
          type: 'analyze',
          payload: {
            content,
            context: opportunityContext || {}
          }
        }));
      }
    }, 1000);
  };

  const generateSectionContent = async (sectionId: string) => {
    if (!wsConnection) return;
    
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const request = {
      type: 'write',
      section_id: sectionId,
      payload: {
        prompt: `Write a compelling ${section.title} section for this funding proposal.`,
        context: {
          ...opportunityContext,
          section_title: section.title,
          current_content: section.content,
          word_limit: section.wordLimit
        },
        style_preferences: {
          style: 'professional',
          tone: 'formal',
          complexity: 'advanced'
        },
        max_tokens: section.wordLimit || 1000
      }
    };
    
    wsConnection.send(JSON.stringify(request));
  };

  // Realistic typing simulation
  const simulateRealisticTyping = useCallback((sectionId: string, fullContent: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    console.log(`✍️ Starting realistic typing simulation for ${fullContent.length} characters`);
    
    // Clear any existing content first
    onSectionsUpdate(sections.map(s => 
      s.id === sectionId ? { ...s, content: '' } : s
    ));

    setShowTypingIndicator(prev => ({ ...prev, [sectionId]: true }));
    setTypingSimulation(prev => ({
      ...prev,
      [sectionId]: {
        isTyping: true,
        currentText: '',
        targetText: fullContent,
        cursorPosition: 0,
        typingSpeed: Math.random() * 50 + 30
      }
    }));

    let currentIndex = 0;
    let currentText = '';
    
    const typeNextCharacter = () => {
      if (currentIndex >= fullContent.length) {
        setTypingSimulation(prev => ({
          ...prev,
          [sectionId]: { ...prev[sectionId], isTyping: false }
        }));
        setShowTypingIndicator(prev => ({ ...prev, [sectionId]: false }));
        console.log('✅ Human-like typing simulation complete');
        return;
      }

      // Sometimes type multiple characters for realism
      const burstSize = Math.random() < 0.8 ? 1 : Math.floor(Math.random() * 3) + 1;
      const nextChars = fullContent.slice(currentIndex, currentIndex + burstSize);
      currentText += nextChars;
      currentIndex += burstSize;

      // Update the section content in real-time
      onSectionsUpdate(prevSections => 
        prevSections.map(s => 
          s.id === sectionId ? { ...s, content: currentText } : s
        )
      );

      // Variable speed: slower for punctuation, faster for normal text
      let delay = 50;
      if (nextChars.includes('.') || nextChars.includes(',') || nextChars.includes(';')) {
        delay = Math.random() * 300 + 200; // Longer pause at punctuation
      } else if (nextChars.includes(' ')) {
        delay = Math.random() * 150 + 80; // Pause at spaces
      } else if (nextChars.includes('\n')) {
        delay = Math.random() * 400 + 300; // Pause at line breaks
      } else {
        delay = Math.random() * 120 + 40; // Normal typing speed
      }

      setTimeout(typeNextCharacter, delay);
    };

    // Start typing with a small initial delay to show "thinking"
    setTimeout(typeNextCharacter, 800);
  }, [sections, onSectionsUpdate]);

  const getCurrentSection = () => {
    return sections.find(s => s.id === activeSection) || sections[0];
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const formatToolbar = [
    { icon: Bold, action: 'bold', tooltip: 'Bold (Ctrl+B)' },
    { icon: Italic, action: 'italic', tooltip: 'Italic (Ctrl+I)' },
    { icon: Underline, action: 'underline', tooltip: 'Underline (Ctrl+U)' },
    null, // Separator
    { icon: AlignLeft, action: 'alignLeft', tooltip: 'Align Left' },
    { icon: AlignCenter, action: 'alignCenter', tooltip: 'Align Center' },
    { icon: AlignRight, action: 'alignRight', tooltip: 'Align Right' },
    null, // Separator
    { icon: List, action: 'bulletList', tooltip: 'Bullet List' },
    { icon: ListOrdered, action: 'numberedList', tooltip: 'Numbered List' },
    { icon: Quote, action: 'blockquote', tooltip: 'Quote' },
    null, // Separator
    { icon: Link, action: 'link', tooltip: 'Insert Link' },
    { icon: Image, action: 'image', tooltip: 'Insert Image' },
    { icon: Table, action: 'table', tooltip: 'Insert Table' },
  ];

  // Handle sections update function
  const handleSectionsUpdate = (updatedSections: ProposalSection[]) => {
    console.log('Sections updated:', updatedSections);
    onSectionsUpdate(updatedSections);
  };

  const currentSection = getCurrentSection();

  // Use the new Word Processor interface
  return (
    <WordProcessorEditor
      sections={sections}
      onSectionsUpdate={handleSectionsUpdate}
      opportunityContext={opportunityContext}
      onClose={onClose}
    />
  );

  // Old interface preserved for reference (remove if not needed)
  const oldInterfaceReference = (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Mobile/Desktop Header - Close Button and Title */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {opportunityContext?.title || 'Proposal Application'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {opportunityContext?.sourceName} • {opportunityContext?.fundingAmount}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditorMode('write')}
                className={`p-2 rounded-lg transition-colors ${
                  editorMode === 'write' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Brain className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditorMode('edit')}
                className={`p-2 rounded-lg transition-colors ${
                  editorMode === 'edit' 
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditorMode('preview')}
                className={`p-2 rounded-lg transition-colors ${
                  editorMode === 'preview' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              className={`p-2 rounded-lg transition-colors ${
                showAnalysis 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Section Navigation - Mobile Horizontal Scroll */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sections ({sections.filter(s => s.content.trim()).length}/{sections.length})
          </h2>
          <span className="text-xs text-gray-500">
            Swipe to navigate →
          </span>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {sections.map((section, index) => {
            const isActive = section.id === activeSection;
            const hasContent = section.content.trim().length > 0;
            const isCurrentlyStreaming = isStreaming[section.id];
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors min-w-fit ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-2 border-blue-300' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>{index + 1}.</span>
                  <span className="max-w-20 sm:max-w-none truncate">{section.title}</span>
                  {isCurrentlyStreaming ? (
                    <RefreshCw className="w-3 h-3 animate-spin flex-shrink-0" />
                  ) : hasContent ? (
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Section Title and AI Generate */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white truncate">
            {currentSection?.title}
          </h2>
          
          <button
            onClick={() => generateSectionContent(activeSection)}
            disabled={isStreaming[activeSection]}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm"
          >
            <Brain className="w-4 h-4" />
            <span>{isStreaming[activeSection] ? 'Generating...' : 'AI Generate'}</span>
          </button>
        </div>
        
        {/* Section Info */}
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span>
            {currentSection?.content ? `${currentSection.content.split(' ').length} words` : '0 words'}
          </span>
          {currentSection?.wordLimit && (
            <span>Max: {currentSection.wordLimit}</span>
          )}
          {currentSection?.required && (
            <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded">
              Required
            </span>
          )}
        </div>
      </div>

      {/* Mobile Formatting Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0">
            <Bold className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0">
            <Italic className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0">
            <Underline className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 flex-shrink-0" />
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0">
            <List className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0">
            <ListOrdered className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 flex-shrink-0" />
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0">
            <AlignLeft className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0">
            <AlignCenter className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0">
            <Quote className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Writing Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-3 sm:p-4">
            {editorMode === 'write' ? (
              <div className="relative h-full">
                {/* Auto-Writing Display - No Manual Editing */}
                <div className="w-full h-full p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-y-auto">
                  {/* AI Writing Header */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Brain className="w-6 h-6 text-blue-500" />
                        {isStreaming[activeSection] && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {isStreaming[activeSection] ? 'AI is actively writing...' : 'AI-Generated Content'}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {isStreaming[activeSection] 
                            ? `Creating ${currentSection?.title} based on your profile and opportunity requirements`
                            : `Intelligent content for ${currentSection?.title}`
                          }
                        </p>
                      </div>
                    </div>
                    
                    {!isStreaming[activeSection] && currentSection?.content && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startAutoGeneration(activeSection)}
                          className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors"
                        >
                          Regenerate
                        </button>
                        <button
                          onClick={() => setEditorMode('edit')}
                          className="px-3 py-1 bg-gray-500 text-white text-xs rounded-full hover:bg-gray-600 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Streaming Content Display */}
                  <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    {currentSection?.content ? (
                      <div className="whitespace-pre-wrap">
                        {currentSection.content}
                        {isStreaming[activeSection] && (
                          <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1" />
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          Ready to generate intelligent content for {currentSection?.title}
                        </p>
                        <button
                          onClick={() => startAutoGeneration(activeSection)}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          Start AI Writing
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : editorMode === 'edit' ? (
              <div className="relative h-full">
                {/* Manual Edit Mode - Only available when user explicitly chooses to edit */}
                <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
                    <AlertCircle className="w-4 h-4" />
                    <span>Manual editing mode - Changes will override AI content</span>
                    <button
                      onClick={() => setEditorMode('write')}
                      className="ml-auto px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded text-xs hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-colors"
                    >
                      Back to AI Mode
                    </button>
                  </div>
                </div>
                
                <textarea
                  ref={(el) => {
                    if (el) editorRefs.current[activeSection] = el;
                  }}
                  value={currentSection?.content || ''}
                  onChange={(e) => handleContentChange(activeSection, e.target.value)}
                  placeholder={`Edit your ${currentSection?.title.toLowerCase()} here...`}
                  className="w-full h-full p-3 border border-gray-200 dark:border-gray-700 outline-none resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base leading-relaxed rounded-lg"
                  style={{ fontFamily: 'Georgia, serif' }}
                />
              </div>
            ) : (
              /* Preview Mode */
              <div className="h-full overflow-y-auto bg-white dark:bg-gray-800 p-3 sm:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="prose dark:prose-invert max-w-none">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">{currentSection?.title}</h2>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {currentSection?.content || 'No content yet...'}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Bottom Analysis Panel - Mobile */}
      {showAnalysis && (
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 max-h-60 overflow-y-auto">
              {/* Quality Analysis */}
              {currentSection?.analysis && (
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
                    <BarChart3 className="w-4 h-4" />
                    Quality Analysis
                  </h3>
                  
                  <div className="space-y-2">
                    {[
                      { label: 'Quality', score: currentSection.analysis.quality_score },
                      { label: 'Readability', score: currentSection.analysis.readability_score },
                      { label: 'Persuasive', score: currentSection.analysis.persuasiveness_score },
                      { label: 'Compliance', score: currentSection.analysis.compliance_score }
                    ].map((metric) => (
                      <div key={metric.label} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {metric.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                metric.score >= 80 ? 'bg-green-500' :
                                metric.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${metric.score}%` }}
                            />
                          </div>
                          <span className={`text-sm font-semibold ${getQualityColor(metric.score)}`}>
                            {metric.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Word count: {currentSection.analysis?.word_count || 0}
                    {currentSection.wordLimit && (
                      <span className={`ml-2 ${
                        (currentSection.analysis?.word_count || 0) > currentSection.wordLimit 
                          ? 'text-red-500' : 'text-green-500'
                      }`}>
                        / {currentSection.wordLimit}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* AI Suggestions */}
              {showSuggestions && currentSection?.analysis?.suggestions && (
                <div className="pt-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4" />
                    AI Suggestions
                  </h3>
                  
                  <div className="space-y-2">
                    {currentSection.analysis?.suggestions?.map((suggestion, index) => (
                      <div key={index} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          {suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {currentSection.analysis?.improvements?.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-xs">
                        Improvements
                      </h4>
                      <div className="space-y-1">
                        {currentSection.analysis?.improvements?.map((improvement, index) => (
                          <div key={index} className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {improvement}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
        </div>
      )}
    </div>
  );
};