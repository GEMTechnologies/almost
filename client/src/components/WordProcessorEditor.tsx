import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Save, Download, Printer, Undo, Redo, Bold, Italic, Underline, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered,
  Table, Image, Link, Strikethrough, Subscript, Superscript,
  ChevronDown, FileText, Settings, Palette
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProposalSection {
  id: string;
  title: string;
  content: string;
  wordLimit?: number;
  required: boolean;
  isStreaming?: boolean;
}

interface WordProcessorEditorProps {
  sections: ProposalSection[];
  onSectionsUpdate: (sections: ProposalSection[]) => void;
  opportunityContext?: any;
  onClose: () => void;
}

export const WordProcessorEditor: React.FC<WordProcessorEditorProps> = ({
  sections,
  onSectionsUpdate,
  opportunityContext,
  onClose
}) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  const [fontFamily, setFontFamily] = useState('Calibri');
  const [fontSize, setFontSize] = useState(11);
  const [currentFormat, setCurrentFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    alignment: 'left' as 'left' | 'center' | 'right' | 'justify'
  });
  
  const editorRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const hasStartedGeneration = useRef(false);

  // Realistic typing simulation that actually shows content
  const simulateRealTyping = useCallback(async (sectionId: string, fullContent: string) => {
    console.log(`🎯 Starting realistic typing for section: ${sectionId} - ${fullContent.length} characters`);
    setIsTyping(prev => ({ ...prev, [sectionId]: true }));
    
    // Don't clear existing content if user has already typed something
    const currentSection = sections.find(s => s.id === sectionId);
    if (!currentSection?.content) {
      onSectionsUpdate(sections.map(s => 
        s.id === sectionId ? { ...s, content: '' } : s
      ));
    }

    let currentText = currentSection?.content || '';
    let currentIndex = 0;
    
    const typeNext = () => {
      if (currentIndex >= fullContent.length) {
        setIsTyping(prev => ({ ...prev, [sectionId]: false }));
        console.log(`✅ Typing complete for ${sectionId}`);
        return;
      }

      // Type MASSIVE chunks for INSTANT STREAMING
      const charsToType = Math.floor(Math.random() * 25) + 15; // 15-40 chars at once (INSTANT)
      const nextChars = fullContent.slice(currentIndex, currentIndex + charsToType);
      currentText += nextChars;
      currentIndex += charsToType;

      // Update content in real-time
      onSectionsUpdate(prevSections => 
        prevSections.map(s => 
          s.id === sectionId ? { ...s, content: currentText } : s
        )
      );
      
      // Also update the DOM directly for immediate visual feedback
      if (editorRef.current && sectionId === activeSection) {
        editorRef.current.textContent = currentText;
      }

      // INSTANT typing speed - faster than any chatbot
      let delay = 3; // INSTANT base speed
      if (nextChars.includes('.') || nextChars.includes('!') || nextChars.includes('?')) {
        delay = Math.random() * 15 + 5; // Minimal pause after sentences
      } else if (nextChars.includes('\n')) {
        delay = Math.random() * 10 + 3; // Almost no pause for new lines
      } else {
        delay = Math.random() * 5 + 1; // INSTANT typing (1-6ms)
      }

      typingTimeoutRef.current = setTimeout(typeNext, delay);
    };

    // Start typing INSTANTLY - no delay
    typeNext();
  }, [sections, onSectionsUpdate]);

  // Auto-start content generation with multimedia - SIMPLIFIED
  const startContentGeneration = useCallback(async (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    
    console.log(`🚀 Generating content for: ${section.title}`);
    
    // Show typing indicator immediately
    setIsTyping(prev => ({ ...prev, [sectionId]: true }));
    
    try {
      const response = await fetch('/api/ai/generate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: section.title,
          opportunity_details: opportunityContext,
          organization_profile: user,
          generation_mode: 'database_personalized_content'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.generated_content) {
          console.log(`✍️ Starting typing simulation: ${data.generated_content.length} characters`);
          console.log(`📝 Content preview: "${data.generated_content.substring(0, 100)}..."`);
          
          // Generate multimedia content based on section type
          const multimediaContent = await generateMultimediaForSection(section.title, data.generated_content);
          const fullContent = combineContentWithMultimedia(data.generated_content, multimediaContent);
          
          await simulateRealTyping(sectionId, fullContent);
        } else {
          console.log(`❌ No content received for ${section.title}:`, data);
        }
      } else {
        console.log(`❌ API request failed for ${section.title}:`, response.status);
      }
    } catch (error) {
      console.error('Content generation failed:', error);
      // If generation fails, show placeholder content
      const fallbackContent = `# ${section.title}

This section will contain detailed information about ${section.title.toLowerCase()}. The AI system is working to generate comprehensive content based on your organization's profile and the funding opportunity requirements.

Key points to be covered:
• Professional analysis
• Evidence-based recommendations  
• Strategic implementation details
• Expected outcomes and impact

Content generation in progress...`;
      
      await simulateRealTyping(sectionId, fallbackContent);
    }
  }, [sections, opportunityContext, user, simulateRealTyping]);

  // Generate multimedia content for sections
  const generateMultimediaForSection = async (sectionTitle: string, content: string) => {
    try {
      // Generate charts and visuals based on section type
      if (sectionTitle.toLowerCase().includes('budget')) {
        return await generateBudgetChart();
      } else if (sectionTitle.toLowerCase().includes('timeline') || sectionTitle.toLowerCase().includes('implementation')) {
        return await generateTimelineChart();
      } else if (sectionTitle.toLowerCase().includes('impact') || sectionTitle.toLowerCase().includes('outcome')) {
        return await generateImpactMetrics();
      } else if (sectionTitle.toLowerCase().includes('process') || sectionTitle.toLowerCase().includes('methodology')) {
        return await generateProcessFlow();
      }
      return null;
    } catch (error) {
      console.log('Multimedia generation skipped:', error.message);
      return null;
    }
  };

  // Helper functions for different chart types
  const generateBudgetChart = async () => {
    try {
      const response = await fetch('http://localhost:8040/generate/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: 'chart',
          data: {
            chart_type: 'budget_breakdown',
            categories: ['Personnel', 'Equipment', 'Operations', 'Overhead'],
            amounts: [45000, 25000, 20000, 10000],
            title: 'Project Budget Breakdown'
          },
          proposal_context: opportunityContext || {},
          organization_branding: { sector: user?.sector || 'default' }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          type: 'image',
          data: data.image_data,
          description: data.description
        };
      }
    } catch (error) {
      console.log('Chart generation failed:', error);
    }
    return null;
  };

  const generateTimelineChart = async () => {
    try {
      const response = await fetch('http://localhost:8040/generate/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: 'chart',
          data: {
            chart_type: 'timeline',
            milestones: [
              { name: 'Project Initiation', date: '2024-01-01', duration: 0 },
              { name: 'Phase 1 Completion', date: '2024-03-01', duration: 60 },
              { name: 'Mid-term Review', date: '2024-06-01', duration: 120 },
              { name: 'Project Completion', date: '2024-12-01', duration: 330 }
            ],
            title: 'Project Implementation Timeline'
          },
          proposal_context: opportunityContext || {},
          organization_branding: { sector: user?.sector || 'default' }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          type: 'image',
          data: data.image_data,
          description: data.description
        };
      }
    } catch (error) {
      console.log('Timeline generation failed:', error);
    }
    return null;
  };

  const generateImpactMetrics = async () => {
    try {
      const response = await fetch('http://localhost:8040/generate/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: 'chart',
          data: {
            chart_type: 'impact_metrics',
            metrics: [
              { name: 'Beneficiaries Reached', current: 8500, target: 10000 },
              { name: 'Communities Served', current: 45, target: 50 },
              { name: 'Programs Launched', current: 12, target: 15 }
            ],
            title: 'Expected Impact Metrics'
          },
          proposal_context: opportunityContext || {},
          organization_branding: { sector: user?.sector || 'default' }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          type: 'image',
          data: data.image_data,
          description: data.description
        };
      }
    } catch (error) {
      console.log('Impact metrics generation failed:', error);
    }
    return null;
  };

  const generateProcessFlow = async () => {
    try {
      const response = await fetch('http://localhost:8040/generate/infographic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: 'infographic',
          data: {
            type: 'process_flow',
            steps: ['Assessment', 'Design', 'Implementation', 'Monitoring', 'Evaluation']
          },
          proposal_context: opportunityContext || {},
          organization_branding: { sector: user?.sector || 'default' }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          type: 'image',
          data: data.image_data,
          description: data.description
        };
      }
    } catch (error) {
      console.log('Process flow generation failed:', error);
    }
    return null;
  };

  // Combine text content with multimedia elements
  const combineContentWithMultimedia = (textContent: string, multimedia: any) => {
    if (!multimedia) return textContent;
    
    // Insert multimedia at appropriate position in content
    const sections = textContent.split('\n\n');
    const midPoint = Math.floor(sections.length / 2);
    
    const multimediaHtml = `

[CHART: ${multimedia.description}]
<img src="data:image/png;base64,${multimedia.data}" alt="${multimedia.description}" style="width: 100%; max-width: 600px; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />

`;
    
    sections.splice(midPoint, 0, multimediaHtml);
    return sections.join('\n\n');
  };

  // Start generation when component mounts
  useEffect(() => {
    if (!hasStartedGeneration.current && sections.length > 0) {
      hasStartedGeneration.current = true;
      console.log('⚡ INSTANT Auto-starting content generation');
      
      // Start IMMEDIATELY with no delay - begin with first section
      console.log(`🔥 Starting section 1: ${sections[0].title}`);
      startContentGeneration(sections[0].id);
      
      // Then start other sections with minimal stagger
      sections.slice(1).forEach((section, index) => {
        setTimeout(() => {
          console.log(`🔥 Starting section ${index + 2}: ${section.title}`);
          startContentGeneration(section.id);
        }, (index + 1) * 200); // Very short stagger
      });
    }
  }, [sections, startContentGeneration]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const getCurrentSection = () => {
    return sections.find(s => s.id === activeSection) || sections[0];
  };

  const currentSection = getCurrentSection();

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Microsoft Word Title Bar - Mobile Responsive */}
      <div className="bg-white border-b border-gray-300 px-2 sm:px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-1 rounded transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileText className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 flex-shrink-0" />
            <span className="font-medium text-gray-800 text-sm sm:text-base truncate">
              {opportunityContext?.title || 'Document'} - Word
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {Object.values(isTyping).some(typing => typing) ? (
            <div className="px-2 sm:px-4 py-1 sm:py-2 bg-green-500 text-white rounded text-xs sm:text-sm font-bold animate-pulse">
              <span className="hidden sm:inline">⚡ SYSTEM WRITING AUTOMATICALLY</span>
              <span className="sm:hidden">⚡ AUTO WRITING</span>
            </div>
          ) : (
            <button 
              onClick={() => {
                console.log('🚀 Manual System Start - Generating current section');
                startContentGeneration(activeSection);
              }}
              className="px-2 sm:px-4 py-1 sm:py-2 bg-purple-600 text-white rounded text-xs sm:text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              <span className="hidden sm:inline">📝 Generate Content</span>
              <span className="sm:hidden">📝 Generate</span>
            </button>
          )}
          <button className="p-1 sm:p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <Save className="w-3 sm:w-4 h-3 sm:h-4" />
          </button>
          <button className="hidden sm:block p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <Printer className="w-4 h-4" />
          </button>
          <button className="hidden sm:block p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Word Ribbon Toolbar - Mobile Responsive */}
      <div className="bg-gray-50 border-b border-gray-300 p-1 sm:p-2 overflow-x-auto">
        <div className="flex items-center gap-2 sm:gap-4 min-w-max">
          {/* File Operations */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2 sm:pr-4">
            <button className="p-1 sm:p-1.5 text-gray-600 hover:bg-gray-200 rounded">
              <Undo className="w-3 sm:w-4 h-3 sm:h-4" />
            </button>
            <button className="p-1 sm:p-1.5 text-gray-600 hover:bg-gray-200 rounded">
              <Redo className="w-3 sm:w-4 h-3 sm:h-4" />
            </button>
          </div>

          {/* Font Controls - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 border-r border-gray-300 pr-4">
            <select 
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
            >
              <option value="Calibri">Calibri</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Verdana">Verdana</option>
            </select>
            
            <select 
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white w-16"
            >
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="14">14</option>
              <option value="16">16</option>
              <option value="18">18</option>
              <option value="20">20</option>
              <option value="24">24</option>
            </select>
          </div>

          {/* Formatting - Compact on mobile */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2 sm:pr-4">
            <button
              onClick={() => setCurrentFormat({...currentFormat, bold: !currentFormat.bold})}
              className={`p-1 sm:p-1.5 rounded transition-colors ${
                currentFormat.bold ? 'bg-blue-200 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Bold className="w-3 sm:w-4 h-3 sm:h-4" />
            </button>
            <button
              onClick={() => setCurrentFormat({...currentFormat, italic: !currentFormat.italic})}
              className={`p-1 sm:p-1.5 rounded transition-colors ${
                currentFormat.italic ? 'bg-blue-200 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Italic className="w-3 sm:w-4 h-3 sm:h-4" />
            </button>
            <button
              onClick={() => setCurrentFormat({...currentFormat, underline: !currentFormat.underline})}
              className={`p-1 sm:p-1.5 rounded transition-colors ${
                currentFormat.underline ? 'bg-blue-200 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Underline className="w-3 sm:w-4 h-3 sm:h-4" />
            </button>
            <button className="hidden sm:block p-1.5 text-gray-600 hover:bg-gray-200 rounded">
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-4">
            <button
              onClick={() => setCurrentFormat({...currentFormat, alignment: 'left'})}
              className={`p-1.5 rounded transition-colors ${
                currentFormat.alignment === 'left' ? 'bg-blue-200 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentFormat({...currentFormat, alignment: 'center'})}
              className={`p-1.5 rounded transition-colors ${
                currentFormat.alignment === 'center' ? 'bg-blue-200 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentFormat({...currentFormat, alignment: 'right'})}
              className={`p-1.5 rounded transition-colors ${
                currentFormat.alignment === 'right' ? 'bg-blue-200 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentFormat({...currentFormat, alignment: 'justify'})}
              className={`p-1.5 rounded transition-colors ${
                currentFormat.alignment === 'justify' ? 'bg-blue-200 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          {/* Lists and Insert */}
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded">
              <List className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded">
              <ListOrdered className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded">
              <Table className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded">
              <Image className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Area - Mobile Responsive */}
      <div className="flex-1 bg-gray-200 p-2 sm:p-4 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full">
          {/* Section Tabs - Mobile Responsive */}
          <div className="flex gap-1 mb-2 sm:mb-4 overflow-x-auto scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-t-lg border-b-2 transition-colors whitespace-nowrap text-xs sm:text-sm ${
                  activeSection === section.id
                    ? 'bg-white border-blue-500 text-blue-600'
                    : 'bg-gray-100 border-transparent text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="truncate max-w-24 sm:max-w-none">{section.title}</span>
                {isTyping[section.id] && (
                  <span className="ml-1 sm:ml-2 inline-block w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full animate-pulse" title="System is writing this section" />
                )}
              </button>
            ))}
          </div>

          {/* Document Page */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full">
            <div className="h-full flex flex-col">
              {/* Document Header - Mobile Responsive */}
              <div className="p-3 sm:p-6 border-b border-gray-200">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2">
                  {currentSection?.title}
                </h1>
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 flex-wrap">
                  <span>{currentSection?.content?.length || 0} chars</span>
                  <span>{currentSection?.content?.split(' ').length || 0} words</span>
                  {isTyping[activeSection] && (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs">System writing...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Content - Editable & Mobile Responsive */}
              <div 
                ref={editorRef}
                contentEditable={true}
                suppressContentEditableWarning={true}
                className="flex-1 p-3 sm:p-6 overflow-y-auto outline-none focus:ring-2 focus:ring-blue-200 relative min-h-64 sm:min-h-96"
                style={{
                  fontFamily,
                  fontSize: `${Math.max(fontSize * 0.8, 10)}pt`, // Smaller on mobile
                  textAlign: currentFormat.alignment,
                  fontWeight: currentFormat.bold ? 'bold' : 'normal',
                  fontStyle: currentFormat.italic ? 'italic' : 'normal',
                  textDecoration: currentFormat.underline ? 'underline' : 'none',
                  lineHeight: '1.6'
                }}
                onInput={(e) => {
                  const newContent = e.currentTarget.textContent || '';
                  console.log(`👤 User edited content: ${newContent.length} characters`);
                  onSectionsUpdate(sections.map(s => 
                    s.id === activeSection ? { ...s, content: newContent } : s
                  ));
                }}
                onKeyDown={(e) => {
                  // Handle keyboard shortcuts
                  if (e.ctrlKey || e.metaKey) {
                    switch (e.key) {
                      case 'b':
                        e.preventDefault();
                        setCurrentFormat({...currentFormat, bold: !currentFormat.bold});
                        break;
                      case 'i':
                        e.preventDefault();
                        setCurrentFormat({...currentFormat, italic: !currentFormat.italic});
                        break;
                      case 'u':
                        e.preventDefault();
                        setCurrentFormat({...currentFormat, underline: !currentFormat.underline});
                        break;
                    }
                  }
                }}
              >
                {/* ULTRA FAST System Writing Indicator */}
                {isTyping[activeSection] && (
                  <div className="fixed top-16 sm:top-20 right-2 sm:right-4 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-300 rounded-lg p-2 sm:p-3 shadow-xl z-10 animate-pulse">
                    <div className="flex items-center gap-2 text-blue-700">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '100ms' }} />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '200ms' }} />
                      </div>
                      <span className="text-xs sm:text-sm font-bold">⚡ ULTRA FAST STREAMING</span>
                    </div>
                  </div>
                )}
                
                {/* Help Text - Show when system is writing - Mobile Responsive */}
                {isTyping[activeSection] && (
                  <div className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3 shadow-lg z-10 max-w-xs sm:max-w-sm">
                    <div className="text-xs text-gray-600">
                      <div className="font-semibold text-gray-700 mb-1">💡 System Help</div>
                      <div className="text-xs">You can edit content while the system writes. Click anywhere to type or make changes.</div>
                    </div>
                  </div>
                )}
                
                {/* Content display and placeholder */}
                {!currentSection?.content && !isTyping[activeSection] && (
                  <div className="text-gray-400 italic">
                    Click here to start typing or use the Generate Content button...
                  </div>
                )}
                
                {/* Show current content if available - properly formatted */}
                {currentSection?.content && (
                  <div 
                    className="whitespace-pre-wrap leading-relaxed formatted-content"
                    dangerouslySetInnerHTML={{
                      __html: currentSection.content
                        // Handle headers first
                        .replace(/### (.*?)(?=\n|$)/g, '<h3>$1</h3>')
                        .replace(/## (.*?)(?=\n|$)/g, '<h2>$1</h2>')
                        .replace(/# (.*?)(?=\n|$)/g, '<h1>$1</h1>')
                        // Handle bold and italic - more aggressive patterns
                        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        // Handle any remaining asterisks
                        .replace(/\*([^*\n]+)\*/g, '<strong>$1</strong>')
                        .replace(/\*{2,}/g, '')
                        // Handle bullet points
                        .replace(/^- (.*?)$/gm, '<li>$1</li>')
                        .replace(/^• (.*?)$/gm, '<li>$1</li>')
                        .replace(/^  - (.*?)$/gm, '<li style="margin-left: 20px;">$1</li>')
                        // Wrap lists
                        .replace(/(<li.*?<\/li>\s*)+/g, '<ul>$&</ul>')
                        .replace(/<\/ul>\s*<ul>/g, '')
                        // Handle paragraphs
                        .replace(/\n\n+/g, '</p><p>')
                        .replace(/\n/g, '<br>')
                        // Clean up and wrap in paragraph
                        .replace(/^(?!<[uh])/g, '<p>')
                        .replace(/(?!<\/[uh]>)$/g, '</p>')
                        // Remove empty paragraphs
                        .replace(/<p><\/p>/g, '')
                        .replace(/<p>\s*<\/p>/g, '')
                    }}
                  />
                )}
                {currentSection?.content && isTyping[activeSection] && (
                  <span className="inline-block w-0.5 h-5 bg-green-500 animate-pulse ml-0.5" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};