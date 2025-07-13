/**
 * Granada OS - Advanced NGO Website Generator
 * Complete website generation system with React, WordPress, and Static HTML options
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe,
  ArrowLeft,
  Download,
  Eye,
  Code,
  Palette,
  Layout,
  Users,
  Heart,
  BarChart3,
  FileText,
  Settings,
  Sparkles,
  CheckCircle,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { WebsiteTemplateGenerator } from './WebsiteTemplateGenerator';
import { WebsitePreview } from './WebsitePreview';
import { WebsiteGenerationProgress } from './WebsiteGenerationProgress';

interface WebsiteGeneratorAdvancedProps {
  onBack: () => void;
}

const WebsiteGeneratorAdvanced: React.FC<WebsiteGeneratorAdvancedProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWebsite, setGeneratedWebsite] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [websiteConfig, setWebsiteConfig] = useState({
    // Basic Information
    organizationName: '',
    tagline: '',
    description: '',
    sector: 'education',
    location: '',
    
    // Website Type
    websiteType: 'react',
    framework: 'react',
    
    // Design & Branding
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    colorScheme: 'modern',
    fontStyle: 'professional',
    layoutStyle: 'modern',
    
    // Content Sections
    sections: {
      about: { enabled: true, priority: 1 },
      projects: { enabled: true, priority: 2 },
      donate: { enabled: true, priority: 3 },
      reports: { enabled: true, priority: 4 },
      contact: { enabled: true, priority: 5 },
      team: { enabled: false, priority: 6 },
      gallery: { enabled: false, priority: 7 },
      blog: { enabled: false, priority: 8 },
      events: { enabled: false, priority: 9 },
      impact: { enabled: true, priority: 10 }
    },
    
    // Features & Functionality
    features: {
      donationIntegration: true,
      projectShowcase: true,
      impactMetrics: true,
      newsletter: true,
      multilingual: false,
      accessibility: true,
      seo: true,
      analytics: true,
      socialMedia: true,
      memberPortal: false
    },
    
    // Content Generation
    generateContent: {
      aboutContent: true,
      projectDescriptions: true,
      teamProfiles: false,
      blogPosts: false,
      impactStories: true
    },
    
    // Technical Configuration
    hosting: 'static',
    cms: false,
    database: false,
    authentication: false
  });

  const generateWebsite = async () => {
    setIsGenerating(true);
    
    // Store user details for admin notifications
    localStorage.setItem('userEmail', 'user@example.com'); // In real app, get from auth context
    localStorage.setItem('organizationName', websiteConfig.organizationName);
    localStorage.setItem('currentWebsiteType', websiteConfig.websiteType);
    localStorage.setItem('selectedFeatures', JSON.stringify(Object.keys(websiteConfig.features).filter(key => websiteConfig.features[key])));
    
    try {
      const templateGenerator = new WebsiteTemplateGenerator(websiteConfig);
      const website = await templateGenerator.generateComplete();
      
      setGeneratedWebsite(website);
      setCurrentStep(5);
    } catch (error) {
      console.error('Website generation failed:', error);
      // Admin will be notified via the progress component
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadWebsite = (format: string) => {
    if (!generatedWebsite) return;
    
    let content = '';
    let filename = '';
    let mimeType = 'application/zip';

    switch (format) {
      case 'react':
        content = generatedWebsite.reactCode;
        filename = `${websiteConfig.organizationName.replace(/\s+/g, '_')}_React_Website.zip`;
        break;
      case 'html':
        content = generatedWebsite.htmlCode;
        filename = `${websiteConfig.organizationName.replace(/\s+/g, '_')}_HTML_Website.zip`;
        mimeType = 'text/html';
        break;
      case 'wordpress':
        content = generatedWebsite.wordpressTheme;
        filename = `${websiteConfig.organizationName.replace(/\s+/g, '_')}_WordPress_Theme.zip`;
        break;
      default:
        return;
    }

    // For demo purposes, download the main HTML file
    const blob = new Blob([generatedWebsite.htmlPreview], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${websiteConfig.organizationName.replace(/\s+/g, '_')}_Website.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Organization Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Organization Name *</label>
                  <input
                    type="text"
                    value={websiteConfig.organizationName}
                    onChange={(e) => setWebsiteConfig(prev => ({ ...prev, organizationName: e.target.value }))}
                    placeholder="Enter your NGO name"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tagline/Mission Statement</label>
                  <input
                    type="text"
                    value={websiteConfig.tagline}
                    onChange={(e) => setWebsiteConfig(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="e.g., Empowering communities through education"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Sector</label>
                  <select
                    value={websiteConfig.sector}
                    onChange={(e) => setWebsiteConfig(prev => ({ ...prev, sector: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="education">Education</option>
                    <option value="health">Healthcare</option>
                    <option value="environment">Environment</option>
                    <option value="poverty">Poverty Alleviation</option>
                    <option value="human-rights">Human Rights</option>
                    <option value="disaster-relief">Disaster Relief</option>
                    <option value="community">Community Development</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={websiteConfig.location}
                    onChange={(e) => setWebsiteConfig(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Northern Uganda, East Africa"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website Type</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'react', name: 'React Application', desc: 'Modern, interactive single-page app' },
                      { id: 'wordpress', name: 'WordPress Site', desc: 'Content management system' },
                      { id: 'static', name: 'Static HTML', desc: 'Fast, simple website' }
                    ].map(type => (
                      <motion.button
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setWebsiteConfig(prev => ({ ...prev, websiteType: type.id }))}
                        className={`p-4 border rounded-lg transition-colors text-left ${
                          websiteConfig.websiteType === type.id
                            ? 'border-blue-500 bg-blue-900/20'
                            : 'border-slate-600 bg-slate-800'
                        }`}
                      >
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-slate-400">{type.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={websiteConfig.description}
                    onChange={(e) => setWebsiteConfig(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your organization's work and impact"
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Design & Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Color Scheme</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Primary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={websiteConfig.primaryColor}
                          onChange={(e) => setWebsiteConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-12 h-10 rounded border border-slate-600"
                        />
                        <input
                          type="text"
                          value={websiteConfig.primaryColor}
                          onChange={(e) => setWebsiteConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Secondary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={websiteConfig.secondaryColor}
                          onChange={(e) => setWebsiteConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="w-12 h-10 rounded border border-slate-600"
                        />
                        <input
                          type="text"
                          value={websiteConfig.secondaryColor}
                          onChange={(e) => setWebsiteConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Design Style</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'modern', name: 'Modern', desc: 'Clean, minimal' },
                      { id: 'classic', name: 'Classic', desc: 'Traditional, formal' },
                      { id: 'creative', name: 'Creative', desc: 'Artistic, unique' },
                      { id: 'corporate', name: 'Corporate', desc: 'Professional, structured' }
                    ].map(style => (
                      <motion.button
                        key={style.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setWebsiteConfig(prev => ({ ...prev, layoutStyle: style.id }))}
                        className={`p-3 border rounded-lg transition-colors ${
                          websiteConfig.layoutStyle === style.id
                            ? 'border-blue-500 bg-blue-900/20'
                            : 'border-slate-600 bg-slate-800'
                        }`}
                      >
                        <h4 className="font-medium text-sm">{style.name}</h4>
                        <p className="text-xs text-slate-400">{style.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Typography</label>
                  <select
                    value={websiteConfig.fontStyle}
                    onChange={(e) => setWebsiteConfig(prev => ({ ...prev, fontStyle: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="professional">Professional (Roboto + Open Sans)</option>
                    <option value="modern">Modern (Inter + Source Sans Pro)</option>
                    <option value="elegant">Elegant (Playfair + Lato)</option>
                    <option value="friendly">Friendly (Poppins + Nunito)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Preview</label>
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                    <div 
                      className="h-32 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${websiteConfig.primaryColor}, ${websiteConfig.secondaryColor})`
                      }}
                    >
                      {websiteConfig.organizationName || 'Your NGO'}
                    </div>
                    <p className="text-center text-slate-400 text-sm mt-2">
                      {websiteConfig.tagline || 'Making a difference in the world'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Website Sections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(websiteConfig.sections).map(([key, section]) => {
                const sectionInfo = {
                  about: { name: 'About Us', icon: Users, desc: 'Organization story and mission' },
                  projects: { name: 'Our Projects', icon: BarChart3, desc: 'Current and completed projects' },
                  donate: { name: 'Donate', icon: Heart, desc: 'Support and funding page' },
                  reports: { name: 'Reports', icon: FileText, desc: 'Annual reports and publications' },
                  contact: { name: 'Contact', icon: Globe, desc: 'Contact information and form' },
                  team: { name: 'Our Team', icon: Users, desc: 'Staff and leadership profiles' },
                  gallery: { name: 'Gallery', icon: Layout, desc: 'Photos and media content' },
                  blog: { name: 'Blog', icon: FileText, desc: 'News and updates' },
                  events: { name: 'Events', icon: BarChart3, desc: 'Upcoming and past events' },
                  impact: { name: 'Impact', icon: BarChart3, desc: 'Metrics and success stories' }
                }[key];

                if (!sectionInfo) return null;

                return (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      section.enabled
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                    }`}
                    onClick={() => setWebsiteConfig(prev => ({
                      ...prev,
                      sections: {
                        ...prev.sections,
                        [key]: { ...section, enabled: !section.enabled }
                      }
                    }))}
                  >
                    <div className="flex items-start gap-3">
                      <sectionInfo.icon className="w-6 h-6 text-blue-400 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium">{sectionInfo.name}</h4>
                        <p className="text-sm text-slate-400">{sectionInfo.desc}</p>
                      </div>
                      {section.enabled && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Features & Functionality</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">Core Features</h4>
                <div className="space-y-3">
                  {Object.entries(websiteConfig.features).slice(0, 5).map(([key, enabled]) => {
                    const featureInfo = {
                      donationIntegration: 'Online Donation System',
                      projectShowcase: 'Project Portfolio Display',
                      impactMetrics: 'Impact Statistics Dashboard',
                      newsletter: 'Email Newsletter Signup',
                      multilingual: 'Multiple Language Support'
                    }[key];

                    return (
                      <label key={key} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setWebsiteConfig(prev => ({
                            ...prev,
                            features: { ...prev.features, [key]: e.target.checked }
                          }))}
                          className="rounded"
                        />
                        <span className="text-sm">{featureInfo}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Advanced Features</h4>
                <div className="space-y-3">
                  {Object.entries(websiteConfig.features).slice(5).map(([key, enabled]) => {
                    const featureInfo = {
                      accessibility: 'WCAG Accessibility Compliance',
                      seo: 'Search Engine Optimization',
                      analytics: 'Google Analytics Integration',
                      socialMedia: 'Social Media Integration',
                      memberPortal: 'Member/Volunteer Portal'
                    }[key];

                    return (
                      <label key={key} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setWebsiteConfig(prev => ({
                            ...prev,
                            features: { ...prev.features, [key]: e.target.checked }
                          }))}
                          className="rounded"
                        />
                        <span className="text-sm">{featureInfo}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Content Generation</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(websiteConfig.generateContent).map(([key, enabled]) => {
                  const contentInfo = {
                    aboutContent: 'About Page Content',
                    projectDescriptions: 'Project Descriptions',
                    teamProfiles: 'Team Member Profiles',
                    blogPosts: 'Sample Blog Posts',
                    impactStories: 'Impact Success Stories'
                  }[key];

                  return (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setWebsiteConfig(prev => ({
                          ...prev,
                          generateContent: { ...prev.generateContent, [key]: e.target.checked }
                        }))}
                        className="rounded"
                      />
                      <span className="text-xs">{contentInfo}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 5:
        if (!generatedWebsite) return null;
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Website Generated Successfully!</h3>
              <p className="text-slate-400">Your professional NGO website is ready with all selected features</p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h4 className="text-lg font-bold mb-4">Generated Website Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Website Type:</span>
                    <span className="capitalize">{generatedWebsite.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pages Generated:</span>
                    <span>{generatedWebsite.pages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Features Included:</span>
                    <span>{generatedWebsite.features.length}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">File Size:</span>
                    <span>{generatedWebsite.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Responsive:</span>
                    <span className="text-green-400">✓ Mobile Ready</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SEO Ready:</span>
                    <span className="text-green-400">✓ Optimized</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPreview(true)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Live Preview
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => downloadWebsite('html')}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Code className="w-4 h-4" />
                View Code
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Deploy
              </motion.button>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h4 className="text-lg font-bold mb-4">Next Steps</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>• Download and extract the website files</p>
                <p>• Upload to your web hosting service</p>
                <p>• Configure domain name and SSL certificate</p>
                <p>• Add your content and customize as needed</p>
                <p>• Set up analytics and monitoring</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showPreview && generatedWebsite) {
    return (
      <WebsitePreview
        website={generatedWebsite}
        onClose={() => setShowPreview(false)}
        onBack={onBack}
      />
    );
  }

  if (isGenerating) {
    return <WebsiteGenerationProgress onCancel={() => setIsGenerating(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold">NGO Website Generator</h1>
              <p className="text-slate-400">Create a complete professional website for your organization</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Titles */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold">
            {currentStep === 1 && "Organization Information"}
            {currentStep === 2 && "Design & Branding"}
            {currentStep === 3 && "Website Sections"}
            {currentStep === 4 && "Features & Functionality"}
            {currentStep === 5 && "Website Generated"}
          </h2>
        </div>

        {/* Step Content */}
        <div className="bg-slate-800 rounded-xl p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Previous
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (currentStep === 4) {
                  generateWebsite();
                } else {
                  setCurrentStep(currentStep + 1);
                }
              }}
              disabled={currentStep === 1 && !websiteConfig.organizationName}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
            >
              {currentStep === 4 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Website
                </>
              ) : (
                'Next'
              )}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteGeneratorAdvanced;