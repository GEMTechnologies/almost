import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Type, AlignLeft, Bold, Italic, List, ListOrdered, Quote, Image, 
  Table, Link, Code, Eye, Save, MoreHorizontal, ChevronDown, 
  Palette, Layout, Settings, Zap, Brain, FileText, Download
} from 'lucide-react';

interface SectionStyle {
  fontSize: 'small' | 'medium' | 'large';
  fontWeight: 'normal' | 'semibold' | 'bold';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  spacing: 'tight' | 'normal' | 'relaxed';
  backgroundColor: string;
  borderStyle: 'none' | 'subtle' | 'prominent';
}

interface ProposalSection {
  id: string;
  title: string;
  content: string;
  order: number;
  required: boolean;
  wordLimit?: number;
  style: SectionStyle;
  aiSuggestions: string[];
  examples: string[];
}

interface ProposalSectionEditorProps {
  section: ProposalSection;
  onSectionUpdate: (section: ProposalSection) => void;
  template?: string;
  opportunityContext?: any;
}

export const ProposalSectionEditor: React.FC<ProposalSectionEditorProps> = ({
  section,
  onSectionUpdate,
  template,
  opportunityContext
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const updateContent = (newContent: string) => {
    onSectionUpdate({
      ...section,
      content: newContent
    });
  };

  const updateStyle = (styleUpdate: Partial<SectionStyle>) => {
    onSectionUpdate({
      ...section,
      style: { ...section.style, ...styleUpdate }
    });
  };

  const getWordCount = () => {
    return section.content.split(' ').filter(word => word.length > 0).length;
  };

  const getSectionStyleClasses = () => {
    const { fontSize, fontWeight, textAlign, spacing, backgroundColor, borderStyle } = section.style;
    
    let classes = 'p-4 rounded-lg transition-all ';
    
    // Font size
    if (fontSize === 'small') classes += 'text-sm ';
    else if (fontSize === 'large') classes += 'text-lg ';
    else classes += 'text-base ';
    
    // Font weight
    if (fontWeight === 'semibold') classes += 'font-semibold ';
    else if (fontWeight === 'bold') classes += 'font-bold ';
    else classes += 'font-normal ';
    
    // Text alignment
    if (textAlign === 'center') classes += 'text-center ';
    else if (textAlign === 'right') classes += 'text-right ';
    else if (textAlign === 'justify') classes += 'text-justify ';
    else classes += 'text-left ';
    
    // Line spacing
    if (spacing === 'tight') classes += 'leading-tight ';
    else if (spacing === 'relaxed') classes += 'leading-relaxed ';
    else classes += 'leading-normal ';
    
    // Background
    if (backgroundColor && backgroundColor !== 'transparent') {
      classes += `bg-${backgroundColor}-50 dark:bg-${backgroundColor}-900/20 `;
    } else {
      classes += 'bg-white dark:bg-gray-800 ';
    }
    
    // Border
    if (borderStyle === 'subtle') classes += 'border border-gray-200 dark:border-gray-700 ';
    else if (borderStyle === 'prominent') classes += 'border-2 border-blue-200 dark:border-blue-800 ';
    
    return classes;
  };

  const formatToolbar = [
    { icon: Bold, action: 'bold', tooltip: 'Bold' },
    { icon: Italic, action: 'italic', tooltip: 'Italic' },
    { icon: List, action: 'bullet', tooltip: 'Bullet List' },
    { icon: ListOrdered, action: 'number', tooltip: 'Numbered List' },
    { icon: Quote, action: 'quote', tooltip: 'Quote' },
    { icon: Link, action: 'link', tooltip: 'Link' },
    { icon: Table, action: 'table', tooltip: 'Table' },
    { icon: Image, action: 'image', tooltip: 'Image' },
  ];

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
      {/* Section Header */}
      <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {section.title}
              {section.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            {section.wordLimit && (
              <span className={`text-sm px-2 py-1 rounded-full ${
                getWordCount() > section.wordLimit 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {getWordCount()}/{section.wordLimit} words
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* AI Suggestions Button */}
            <button
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
              title="AI Suggestions"
            >
              <Brain className="w-5 h-5" />
            </button>
            
            {/* Style Panel Button */}
            <button
              onClick={() => setShowStylePanel(!showStylePanel)}
              className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title="Style Options"
            >
              <Palette className="w-5 h-5" />
            </button>
            
            {/* Preview Toggle */}
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`p-2 rounded-lg transition-colors ${
                isPreviewMode 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Preview Mode"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Style Panel */}
        {showStylePanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Size
                </label>
                <select
                  value={section.style.fontSize}
                  onChange={(e) => updateStyle({ fontSize: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              {/* Font Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Weight
                </label>
                <select
                  value={section.style.fontWeight}
                  onChange={(e) => updateStyle({ fontWeight: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="normal">Normal</option>
                  <option value="semibold">Semibold</option>
                  <option value="bold">Bold</option>
                </select>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alignment
                </label>
                <select
                  value={section.style.textAlign}
                  onChange={(e) => updateStyle({ textAlign: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Background
                </label>
                <select
                  value={section.style.backgroundColor}
                  onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="transparent">None</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                  <option value="purple">Purple</option>
                  <option value="gray">Gray</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Suggestions Panel */}
        {showAISuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
          >
            <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">
              AI Writing Suggestions
            </h4>
            <div className="space-y-2">
              {section.aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => updateContent(section.content + '\n\n' + suggestion)}
                  className="w-full text-left p-3 bg-white dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Editor/Preview Content */}
      <div className="p-6">
        {!isPreviewMode ? (
          <div className="space-y-4">
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              {formatToolbar.map((tool, index) => {
                const IconComponent = tool.icon;
                return (
                  <button
                    key={index}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    title={tool.tooltip}
                  >
                    <IconComponent className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            {/* Content Editor */}
            <textarea
              value={section.content}
              onChange={(e) => updateContent(e.target.value)}
              placeholder={`Write your ${section.title.toLowerCase()} here...`}
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ) : (
          /* Preview Mode */
          <div className={getSectionStyleClasses()}>
            <div className="prose dark:prose-invert max-w-none">
              {section.content ? (
                <div dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br>') }} />
              ) : (
                <p className="text-gray-500 italic">No content yet...</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section Footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Words: {getWordCount()}</span>
            <span>Characters: {section.content.length}</span>
            {section.required && (
              <span className="text-red-600 dark:text-red-400">Required Section</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
              <Save className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};