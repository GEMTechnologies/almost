import React from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Share2, Print, Camera, BarChart3, Table, Users, Sparkles } from 'lucide-react';
import MediaElementRenderer from './MediaElementRenderer';
import { MediaElement } from '../services/mediaProposalGenerator';

interface ProposalSection {
  id: string;
  title: string;
  content: string;
  wordLimit?: number;
  required: boolean;
  mediaElements?: MediaElement[];
}

interface RichProposalViewProps {
  sections: ProposalSection[];
  opportunityTitle: string;
  organizationName: string;
  isGenerating: boolean;
}

const RichProposalView: React.FC<RichProposalViewProps> = ({
  sections,
  opportunityTitle,
  organizationName,
  isGenerating
}) => {
  
  const getTotalMediaElements = () => {
    return sections.reduce((total, section) => total + (section.mediaElements?.length || 0), 0);
  };

  const getMediaTypeCount = (type: string) => {
    return sections.reduce((count, section) => {
      return count + (section.mediaElements?.filter(media => media.type === type).length || 0);
    }, 0);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{opportunityTitle}</h1>
            <p className="text-xl opacity-90">Submitted by {organizationName}</p>
            <p className="text-sm opacity-75 mt-2">AI-Generated Media-Rich Proposal</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{sections.length}</div>
            <div className="text-sm opacity-90">Sections</div>
          </div>
        </div>

        {/* Media Statistics */}
        {getTotalMediaElements() > 0 && (
          <div className="mt-6 grid grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-3">
              <Camera className="w-6 h-6 mx-auto mb-1" />
              <div className="text-lg font-bold">{getMediaTypeCount('image') + getMediaTypeCount('infographic')}</div>
              <div className="text-xs opacity-90">Images</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <BarChart3 className="w-6 h-6 mx-auto mb-1" />
              <div className="text-lg font-bold">{getMediaTypeCount('chart')}</div>
              <div className="text-xs opacity-90">Charts</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <Table className="w-6 h-6 mx-auto mb-1" />
              <div className="text-lg font-bold">{getMediaTypeCount('table')}</div>
              <div className="text-xs opacity-90">Tables</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <Users className="w-6 h-6 mx-auto mb-1" />
              <div className="text-lg font-bold">{getMediaTypeCount('scenario')}</div>
              <div className="text-xs opacity-90">Scenarios</div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center p-6 bg-gray-50 border-b">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>Generated with AI + Rich Media</span>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Proposal Content */}
      <div className="p-8 space-y-8">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              {section.mediaElements && section.mediaElements.length > 0 && (
                <div className="flex items-center text-sm text-purple-600">
                  <Sparkles className="w-4 h-4 mr-1" />
                  {section.mediaElements.length} Media Elements
                </div>
              )}
            </div>

            {/* Media Elements - Render before content */}
            {section.mediaElements && section.mediaElements.map((mediaElement) => (
              <MediaElementRenderer 
                key={mediaElement.id} 
                mediaElement={mediaElement}
                className="mb-6"
              />
            ))}

            {/* Section Content */}
            <div className="prose prose-lg max-w-none">
              {isGenerating ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ) : (
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {section.content || `AI is generating comprehensive content for ${section.title}...`}
                </div>
              )}
            </div>

            {/* Section Footer */}
            {section.wordLimit && (
              <div className="mt-4 text-right">
                <span className="text-xs text-gray-500">
                  Word limit: {section.wordLimit} words
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-6 text-center text-sm text-gray-600 rounded-b-lg">
        <p>This proposal was generated using Granada OS AI with rich media capabilities.</p>
        <p className="mt-1">Generated on {new Date().toLocaleDateString()} for {organizationName}</p>
      </div>
    </div>
  );
};

export default RichProposalView;