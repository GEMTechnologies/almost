/**
 * Granada OS - NGO Pipeline Management System
 * Complete automation toolkit with 15 specialized generators
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WebsiteGeneratorAdvanced from './generators/website/WebsiteGeneratorAdvanced';
import ProposalGenerator from './generators/ProposalGenerator';
import PolicyGenerator from './generators/PolicyGenerator';
import BrandingToolkitGenerator from './generators/BrandingToolkitGenerator';
import LetterheadGenerator from './generators/LetterheadGenerator';
import CertificateGenerator from './generators/CertificateGenerator';
import { 
  Globe,
  FileText,
  Shield,
  Palette,
  FileImage,
  CreditCard,
  Award,
  Calendar,
  Mail,
  Stamp,
  CheckSquare,
  Download,
  BarChart3,
  FileUp,
  GraduationCap,
  ArrowLeft,
  Sparkles,
  Zap,
  Settings,
  Plus,
  Users,
  Building
} from 'lucide-react';

interface PipelineModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'generator' | 'template' | 'automation';
  complexity: 'basic' | 'intermediate' | 'advanced';
  estimatedTime: string;
  outputs: string[];
  color: string;
}

const NGOPipelineSystem: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<PipelineModule | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'generator' | 'template' | 'automation'>('all');

  const pipelineModules: PipelineModule[] = [
    {
      id: 'website-generator',
      title: 'NGO Website Generator',
      description: 'Generate a complete professional website with About, Projects, Donate, and Reports sections',
      icon: Globe,
      category: 'generator',
      complexity: 'advanced',
      estimatedTime: '15-20 minutes',
      outputs: ['React Website', 'WordPress Theme', 'Static HTML'],
      color: 'blue'
    },
    {
      id: 'proposal-generator',
      title: 'Proposal Generator',
      description: 'Auto-generate donor-specific proposals with background, objectives, logframe, and budget',
      icon: FileText,
      category: 'generator',
      complexity: 'advanced',
      estimatedTime: '30-45 minutes',
      outputs: ['PDF Proposal', 'Word Document', 'EU Format', 'UN Format', 'USAID Format'],
      color: 'green'
    },
    {
      id: 'policy-generator',
      title: 'Policy Document Generator',
      description: 'Generate comprehensive organizational policies and procedures',
      icon: Shield,
      category: 'generator',
      complexity: 'intermediate',
      estimatedTime: '10-15 minutes',
      outputs: ['Code of Conduct', 'HR Manual', 'Safeguarding Policy', 'Financial Policy'],
      color: 'purple'
    },
    {
      id: 'branding-toolkit',
      title: 'Branding Toolkit Generator',
      description: 'Create complete brand identity including logo, colors, fonts, and social media templates',
      icon: Palette,
      category: 'generator',
      complexity: 'intermediate',
      estimatedTime: '20-25 minutes',
      outputs: ['Logo Design', 'Color Palette', 'Brand Guidelines', 'Social Media Templates'],
      color: 'pink'
    },
    {
      id: 'letterhead-generator',
      title: 'Letterhead Generator',
      description: 'Custom letterhead with logo, organization details, and professional formatting',
      icon: FileImage,
      category: 'generator',
      complexity: 'basic',
      estimatedTime: '5-10 minutes',
      outputs: ['DOCX Template', 'PDF Template', 'Print-Ready Design'],
      color: 'orange'
    },
    {
      id: 'id-card-generator',
      title: 'Staff ID & Business Card Generator',
      description: 'Create professional staff identification cards and business cards',
      icon: CreditCard,
      category: 'generator',
      complexity: 'basic',
      estimatedTime: '5-10 minutes',
      outputs: ['Staff ID Cards', 'Business Cards', 'Print-Ready Files'],
      color: 'teal'
    },
    {
      id: 'certificate-generator',
      title: 'Certificate Generator',
      description: 'Generate certificates for volunteers, training completion, and staff recognition',
      icon: Award,
      category: 'generator',
      complexity: 'basic',
      estimatedTime: '5-10 minutes',
      outputs: ['Volunteer Certificates', 'Training Certificates', 'Recognition Awards'],
      color: 'yellow'
    },
    {
      id: 'meeting-toolkit',
      title: 'Meeting Toolkit Generator',
      description: 'Complete meeting management tools including agendas, minutes, and attendance',
      icon: Calendar,
      category: 'template',
      complexity: 'intermediate',
      estimatedTime: '10-15 minutes',
      outputs: ['Agenda Templates', 'Minutes Format', 'Attendance Sheets', 'Decision Summaries'],
      color: 'indigo'
    },
    {
      id: 'communication-templates',
      title: 'Official Communication Templates',
      description: 'Standard letter templates for grants, partnerships, and donor communications',
      icon: Mail,
      category: 'template',
      complexity: 'intermediate',
      estimatedTime: '10-15 minutes',
      outputs: ['Grant Letters', 'Partnership MoUs', 'Thank You Letters', 'Appointment Letters'],
      color: 'cyan'
    },
    {
      id: 'signature-generator',
      title: 'Signature Block & Stamp Generator',
      description: 'Digital signature blocks and branded organizational stamps',
      icon: Stamp,
      category: 'generator',
      complexity: 'basic',
      estimatedTime: '5-10 minutes',
      outputs: ['Digital Signatures', 'Round Stamps', 'Rectangle Stamps', 'Letterhead Integration'],
      color: 'red'
    },
    {
      id: 'compliance-checklist',
      title: 'Compliance Checklist Builder',
      description: 'Donor-specific compliance checklists and tracking systems',
      icon: CheckSquare,
      category: 'automation',
      complexity: 'advanced',
      estimatedTime: '15-20 minutes',
      outputs: ['USAID Checklist', 'EU Checklist', 'GIZ Checklist', 'Tracking Dashboard'],
      color: 'emerald'
    },
    {
      id: 'template-library',
      title: 'Template Library Downloader',
      description: 'Download comprehensive template collections for various NGO operations',
      icon: Download,
      category: 'template',
      complexity: 'basic',
      estimatedTime: '5-10 minutes',
      outputs: ['Budget Templates', 'LogFrame Matrix', 'M&E Reports', 'HR Forms'],
      color: 'violet'
    },
    {
      id: 'dashboard-starter',
      title: 'Dashboard Starter Pack',
      description: 'Pre-configured dashboard widgets with role-based permissions',
      icon: BarChart3,
      category: 'automation',
      complexity: 'advanced',
      estimatedTime: '20-25 minutes',
      outputs: ['Widget Configuration', 'Role Permissions', 'Analytics Setup', 'KPI Tracking'],
      color: 'lime'
    },
    {
      id: 'pdf-formatter',
      title: 'PDF / Report Formatter',
      description: 'Professional PDF formatting with covers, logos, and design themes',
      icon: FileUp,
      category: 'automation',
      complexity: 'intermediate',
      estimatedTime: '10-15 minutes',
      outputs: ['Formatted PDFs', 'Cover Designs', 'Watermarks', 'Design Themes'],
      color: 'amber'
    },
    {
      id: 'training-toolkit',
      title: 'Training Toolkit Generator',
      description: 'Complete training packages with slides, handouts, and certificates',
      icon: GraduationCap,
      category: 'generator',
      complexity: 'advanced',
      estimatedTime: '30-40 minutes',
      outputs: ['PPT Slides', 'Training Handouts', 'Certificates', 'Assessment Forms'],
      color: 'rose'
    }
  ];

  const filteredModules = pipelineModules.filter(module => 
    activeCategory === 'all' || module.category === activeCategory
  );

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'green';
      case 'intermediate': return 'yellow';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'generator': return <Zap className="w-4 h-4" />;
      case 'template': return <FileText className="w-4 h-4" />;
      case 'automation': return <Settings className="w-4 h-4" />;
      default: return <Plus className="w-4 h-4" />;
    }
  };

  if (selectedModule) {
    // Route to specific generator components
    if (selectedModule.id === 'website-generator') {
      return <WebsiteGeneratorAdvanced onBack={() => setSelectedModule(null)} />;
    }
    if (selectedModule.id === 'proposal-generator') {
      return <ProposalGenerator onBack={() => setSelectedModule(null)} />;
    }
    if (selectedModule.id === 'policy-generator') {
      return <PolicyGenerator onBack={() => setSelectedModule(null)} />;
    }
    if (selectedModule.id === 'branding-toolkit') {
      return <BrandingToolkitGenerator onBack={() => setSelectedModule(null)} />;
    }
    if (selectedModule.id === 'letterhead-generator') {
      return <LetterheadGenerator onBack={() => setSelectedModule(null)} />;
    }
    if (selectedModule.id === 'certificate-generator') {
      return <CertificateGenerator onBack={() => setSelectedModule(null)} />;
    }
    
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedModule(null)}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold">{selectedModule.title}</h1>
              <p className="text-slate-400">{selectedModule.description}</p>
            </div>
          </div>

          {/* Module Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Configuration</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization Name</label>
                    <input
                      type="text"
                      placeholder="Enter your NGO name"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Focus Area</label>
                    <select className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none">
                      <option>Education</option>
                      <option>Healthcare</option>
                      <option>Environment</option>
                      <option>Poverty Alleviation</option>
                      <option>Human Rights</option>
                      <option>Disaster Relief</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <input
                      type="text"
                      placeholder="e.g., Children, Women, Rural Communities"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Geographic Coverage</label>
                    <input
                      type="text"
                      placeholder="e.g., Local, National, Regional, International"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Advanced Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Include branding guidelines</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Add multilingual support</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Include compliance notes</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Generate sample content</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Add professional styling</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Include best practices</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Module Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(selectedModule.category)}
                      <span className="capitalize">{selectedModule.category}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Complexity:</span>
                    <span className={`px-2 py-1 bg-${getComplexityColor(selectedModule.complexity)}-600 text-white text-xs rounded-full`}>
                      {selectedModule.complexity.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time:</span>
                    <span>{selectedModule.estimatedTime}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Outputs</h3>
                <div className="space-y-2">
                  {selectedModule.outputs.map((output, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{output}</span>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate {selectedModule.title.split(' ')[0]}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">NGO Pipeline System</h1>
              <p className="text-slate-400">Complete automation toolkit with 15 specialized generators</p>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All Modules', icon: Building },
              { id: 'generator', label: 'Generators', icon: Zap },
              { id: 'template', label: 'Templates', icon: FileText },
              { id: 'automation', label: 'Automation', icon: Settings }
            ].map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => setSelectedModule(module)}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
            >
              {/* Module Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  module.color === 'blue' ? 'bg-blue-600' :
                  module.color === 'green' ? 'bg-green-600' :
                  module.color === 'purple' ? 'bg-purple-600' :
                  module.color === 'pink' ? 'bg-pink-600' :
                  module.color === 'orange' ? 'bg-orange-600' :
                  module.color === 'teal' ? 'bg-teal-600' :
                  module.color === 'yellow' ? 'bg-yellow-600' :
                  module.color === 'indigo' ? 'bg-indigo-600' :
                  module.color === 'cyan' ? 'bg-cyan-600' :
                  module.color === 'red' ? 'bg-red-600' :
                  module.color === 'emerald' ? 'bg-emerald-600' :
                  module.color === 'violet' ? 'bg-violet-600' :
                  module.color === 'lime' ? 'bg-lime-600' :
                  module.color === 'amber' ? 'bg-amber-600' :
                  module.color === 'rose' ? 'bg-rose-600' :
                  'bg-gray-600'
                }`}>
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 bg-${getComplexityColor(module.complexity)}-600 text-white text-xs rounded-full`}>
                    {module.complexity.toUpperCase()}
                  </span>
                  <div className={`p-1 rounded-full ${
                    module.color === 'blue' ? 'bg-blue-600/20' :
                    module.color === 'green' ? 'bg-green-600/20' :
                    module.color === 'purple' ? 'bg-purple-600/20' :
                    module.color === 'pink' ? 'bg-pink-600/20' :
                    module.color === 'orange' ? 'bg-orange-600/20' :
                    module.color === 'teal' ? 'bg-teal-600/20' :
                    module.color === 'yellow' ? 'bg-yellow-600/20' :
                    module.color === 'indigo' ? 'bg-indigo-600/20' :
                    module.color === 'cyan' ? 'bg-cyan-600/20' :
                    module.color === 'red' ? 'bg-red-600/20' :
                    module.color === 'emerald' ? 'bg-emerald-600/20' :
                    module.color === 'violet' ? 'bg-violet-600/20' :
                    module.color === 'lime' ? 'bg-lime-600/20' :
                    module.color === 'amber' ? 'bg-amber-600/20' :
                    module.color === 'rose' ? 'bg-rose-600/20' :
                    'bg-gray-600/20'
                  }`}>
                    {getCategoryIcon(module.category)}
                  </div>
                </div>
              </div>

              {/* Module Content */}
              <h3 className="text-lg font-bold text-white mb-2">{module.title}</h3>
              <p className="text-slate-300 text-sm mb-4 line-clamp-2">{module.description}</p>

              {/* Module Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Estimated Time:</span>
                  <span className="text-white font-medium">{module.estimatedTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Outputs:</span>
                  <span className="text-white font-medium">{module.outputs.length} types</span>
                </div>
              </div>

              {/* Primary Outputs Preview */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex flex-wrap gap-1">
                  {module.outputs.slice(0, 2).map((output, idx) => (
                    <span key={idx} className={`px-2 py-1 text-xs rounded-full ${
                      module.color === 'blue' ? 'bg-blue-600/20 text-blue-300' :
                      module.color === 'green' ? 'bg-green-600/20 text-green-300' :
                      module.color === 'purple' ? 'bg-purple-600/20 text-purple-300' :
                      module.color === 'pink' ? 'bg-pink-600/20 text-pink-300' :
                      module.color === 'orange' ? 'bg-orange-600/20 text-orange-300' :
                      module.color === 'teal' ? 'bg-teal-600/20 text-teal-300' :
                      module.color === 'yellow' ? 'bg-yellow-600/20 text-yellow-300' :
                      module.color === 'indigo' ? 'bg-indigo-600/20 text-indigo-300' :
                      module.color === 'cyan' ? 'bg-cyan-600/20 text-cyan-300' :
                      module.color === 'red' ? 'bg-red-600/20 text-red-300' :
                      module.color === 'emerald' ? 'bg-emerald-600/20 text-emerald-300' :
                      module.color === 'violet' ? 'bg-violet-600/20 text-violet-300' :
                      module.color === 'lime' ? 'bg-lime-600/20 text-lime-300' :
                      module.color === 'amber' ? 'bg-amber-600/20 text-amber-300' :
                      module.color === 'rose' ? 'bg-rose-600/20 text-rose-300' :
                      'bg-gray-600/20 text-gray-300'
                    }`}>
                      {output}
                    </span>
                  ))}
                  {module.outputs.length > 2 && (
                    <span className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded-full">
                      +{module.outputs.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedModule(module);
                }}
                className={`w-full mt-4 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                  module.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                  module.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                  module.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                  module.color === 'pink' ? 'bg-pink-600 hover:bg-pink-700' :
                  module.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
                  module.color === 'teal' ? 'bg-teal-600 hover:bg-teal-700' :
                  module.color === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-700' :
                  module.color === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-700' :
                  module.color === 'cyan' ? 'bg-cyan-600 hover:bg-cyan-700' :
                  module.color === 'red' ? 'bg-red-600 hover:bg-red-700' :
                  module.color === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  module.color === 'violet' ? 'bg-violet-600 hover:bg-violet-700' :
                  module.color === 'lime' ? 'bg-lime-600 hover:bg-lime-700' :
                  module.color === 'amber' ? 'bg-amber-600 hover:bg-amber-700' :
                  module.color === 'rose' ? 'bg-rose-600 hover:bg-rose-700' :
                  'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Configure & Generate
              </motion.button>
            </motion.div>
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No modules found</h3>
            <p className="text-slate-400">Try adjusting your category filter</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="border-t border-slate-700 bg-slate-800/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{pipelineModules.length}</div>
              <div className="text-sm text-slate-400">Total Modules</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{pipelineModules.filter(m => m.category === 'generator').length}</div>
              <div className="text-sm text-slate-400">Generators</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{pipelineModules.filter(m => m.category === 'template').length}</div>
              <div className="text-sm text-slate-400">Templates</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">{pipelineModules.filter(m => m.category === 'automation').length}</div>
              <div className="text-sm text-slate-400">Automation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGOPipelineSystem;