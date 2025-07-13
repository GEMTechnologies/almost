import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Globe, Building, Heart, Zap, CheckCircle, Star, Award } from 'lucide-react';

interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  color: string;
  sections: string[];
  requirements: string[];
  maxPages: number;
  funderType: string;
  popularity: number;
}

const proposalTemplates: ProposalTemplate[] = [
  {
    id: 'who-standard',
    name: 'WHO Health Grant Template',
    description: 'World Health Organization standard health project proposal format',
    category: 'Health',
    icon: Heart,
    color: 'red',
    sections: [
      'Executive Summary',
      'Project Background & Rationale',
      'Health Situation Analysis',
      'Project Description & Methodology',
      'Target Population & Beneficiaries',
      'Implementation Plan & Timeline',
      'Budget & Financial Plan',
      'Monitoring & Evaluation Framework',
      'Risk Assessment & Mitigation',
      'Sustainability Plan',
      'Expected Outcomes & Impact'
    ],
    requirements: [
      'Health data and statistics',
      'Community health assessment',
      'Partnership agreements',
      'Regulatory compliance documentation',
      'Technical expertise credentials'
    ],
    maxPages: 25,
    funderType: 'International Organization',
    popularity: 95
  },
  {
    id: 'usaid-education',
    name: 'USAID Education Initiative',
    description: 'United States Agency for International Development education funding template',
    category: 'Education',
    icon: Award,
    color: 'blue',
    sections: [
      'Project Summary',
      'Problem Statement',
      'Program Description',
      'Results Framework',
      'Implementation Approach',
      'Management & Organizational Capacity',
      'Budget Narrative',
      'Sustainability & Scale-up Strategy',
      'Gender Integration Plan',
      'Environmental Compliance'
    ],
    requirements: [
      'Education sector analysis',
      'Gender mainstreaming plan',
      'Environmental screening',
      'Partnership documentation',
      'Organizational capacity assessment'
    ],
    maxPages: 30,
    funderType: 'Government Agency',
    popularity: 88
  },
  {
    id: 'eu-horizon',
    name: 'EU Horizon Europe',
    description: 'European Union research and innovation program template',
    category: 'Research',
    icon: Zap,
    color: 'purple',
    sections: [
      'Excellence',
      'Impact',
      'Implementation',
      'Consortium Description',
      'Work Package Structure',
      'Innovation Management',
      'Risk Management',
      'Ethics & Security',
      'Communication & Dissemination',
      'Data Management Plan'
    ],
    requirements: [
      'Innovation potential assessment',
      'Consortium agreements',
      'Ethics approval',
      'Data management strategy',
      'IP management plan'
    ],
    maxPages: 70,
    funderType: 'Research Council',
    popularity: 92
  },
  {
    id: 'gates-foundation',
    name: 'Gates Foundation Global Health',
    description: 'Bill & Melinda Gates Foundation health innovation template',
    category: 'Health Innovation',
    icon: Globe,
    color: 'green',
    sections: [
      'Project Overview',
      'Global Health Challenge',
      'Innovation Approach',
      'Evidence & Feasibility',
      'Implementation Strategy',
      'Partnership & Collaboration',
      'Budget & Resource Plan',
      'Impact Measurement',
      'Scalability Assessment',
      'Theory of Change'
    ],
    requirements: [
      'Innovation evidence',
      'Global health metrics',
      'Partnership framework',
      'Scalability analysis',
      'Impact measurement plan'
    ],
    maxPages: 20,
    funderType: 'Private Foundation',
    popularity: 85
  },
  {
    id: 'world-bank',
    name: 'World Bank Development Project',
    description: 'World Bank standard development project template',
    category: 'Development',
    icon: Building,
    color: 'indigo',
    sections: [
      'Project Development Objective',
      'Project Description',
      'Implementation Arrangements',
      'Results Framework',
      'Financing Plan',
      'Economic Analysis',
      'Financial Management',
      'Procurement Plan',
      'Environmental & Social Standards',
      'Risk Assessment'
    ],
    requirements: [
      'Economic impact analysis',
      'Environmental assessment',
      'Social safeguards plan',
      'Procurement documentation',
      'Financial management systems'
    ],
    maxPages: 50,
    funderType: 'Multilateral Bank',
    popularity: 78
  },
  {
    id: 'generic-ngo',
    name: 'General NGO Template',
    description: 'Flexible template suitable for most NGO funding applications',
    category: 'General',
    icon: FileText,
    color: 'gray',
    sections: [
      'Executive Summary',
      'Organization Background',
      'Project Description',
      'Needs Assessment',
      'Goals & Objectives',
      'Activities & Timeline',
      'Budget',
      'Evaluation Plan',
      'Sustainability',
      'Appendices'
    ],
    requirements: [
      'Organization registration',
      'Financial statements',
      'Board resolution',
      'Tax exemption certificate',
      'References'
    ],
    maxPages: 15,
    funderType: 'Various',
    popularity: 70
  }
];

interface ProposalTemplateSelectorProps {
  selectedTemplate: string | null;
  onTemplateSelect: (template: ProposalTemplate) => void;
  opportunityContext?: {
    sector: string;
    sourceName: string;
    fundingType?: string;
  };
}

export const ProposalTemplateSelector: React.FC<ProposalTemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  opportunityContext
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const getRecommendedTemplates = () => {
    if (!opportunityContext) return proposalTemplates;
    
    const { sector, sourceName, fundingType } = opportunityContext;
    
    return proposalTemplates
      .map(template => {
        let score = template.popularity;
        
        // Boost score for matching sector
        if (template.category.toLowerCase().includes(sector.toLowerCase()) ||
            sector.toLowerCase().includes(template.category.toLowerCase())) {
          score += 20;
        }
        
        // Boost score for matching funder type
        if (fundingType && template.funderType.toLowerCase().includes(fundingType.toLowerCase())) {
          score += 15;
        }
        
        // Boost score for specific funder matches
        if (sourceName.toLowerCase().includes('who') && template.id === 'who-standard') score += 30;
        if (sourceName.toLowerCase().includes('usaid') && template.id === 'usaid-education') score += 30;
        if (sourceName.toLowerCase().includes('eu') && template.id === 'eu-horizon') score += 30;
        if (sourceName.toLowerCase().includes('gates') && template.id === 'gates-foundation') score += 30;
        if (sourceName.toLowerCase().includes('world bank') && template.id === 'world-bank') score += 30;
        
        return { ...template, recommendationScore: score };
      })
      .sort((a, b) => (b.recommendationScore || 0) - (a.recommendationScore || 0));
  };

  const filteredTemplates = getRecommendedTemplates().filter(template => 
    filterCategory === 'all' || template.category.toLowerCase() === filterCategory
  );

  const categories = ['all', ...Array.from(new Set(proposalTemplates.map(t => t.category.toLowerCase())))];

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: 'bg-red-500 border-red-200 text-red-700',
      blue: 'bg-blue-500 border-blue-200 text-blue-700',
      green: 'bg-green-500 border-green-200 text-green-700',
      purple: 'bg-purple-500 border-purple-200 text-purple-700',
      indigo: 'bg-indigo-500 border-indigo-200 text-indigo-700',
      gray: 'bg-gray-500 border-gray-200 text-gray-700'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Your Proposal Template
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Select a template that matches your funder's requirements
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setFilterCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterCategory === category
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category === 'all' ? 'All Templates' : category}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => {
          const IconComponent = template.icon;
          const isRecommended = opportunityContext && (template.recommendationScore || 0) > template.popularity + 10;
          const isSelected = selectedTemplate === template.id;
          
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white dark:bg-gray-800 rounded-xl border-2 p-6 cursor-pointer transition-all hover:shadow-xl ${
                isSelected 
                  ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
              onClick={() => onTemplateSelect(template)}
            >
              {/* Recommendation Badge */}
              {isRecommended && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Recommended
                </div>
              )}

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              )}

              {/* Template Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(template.color).split(' ')[0]} text-white`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getColorClasses(template.color)}`}>
                      {template.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {template.maxPages} pages max
                    </span>
                  </div>
                </div>
              </div>

              {/* Template Details */}
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Key Sections ({template.sections.length})
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {template.sections.slice(0, 3).map(section => (
                      <span 
                        key={section}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                      >
                        {section}
                      </span>
                    ))}
                    {template.sections.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{template.sections.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Requirements
                  </h5>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {template.requirements.slice(0, 2).map(req => (
                      <li key={req} className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {req}
                      </li>
                    ))}
                    {template.requirements.length > 2 && (
                      <li className="text-gray-500">
                        +{template.requirements.length - 2} more requirements
                      </li>
                    )}
                  </ul>
                </div>

                {/* Popularity Score */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500">
                    Funder: {template.funderType}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {template.popularity}% success rate
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No templates found for the selected category.
          </p>
        </div>
      )}
    </div>
  );
};