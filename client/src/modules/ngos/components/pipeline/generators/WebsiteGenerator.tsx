/**
 * Granada OS - NGO Website Generator
 * Generate complete professional websites for NGOs
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
  CheckCircle
} from 'lucide-react';

interface WebsiteGeneratorProps {
  onBack: () => void;
}

const WebsiteGenerator: React.FC<WebsiteGeneratorProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [websiteConfig, setWebsiteConfig] = useState({
    organizationName: '',
    tagline: '',
    primaryColor: '#3B82F6',
    websiteType: 'react',
    includeSections: {
      about: true,
      projects: true,
      donate: true,
      reports: true,
      contact: true,
      team: false,
      gallery: false,
      blog: false
    },
    features: {
      donationIntegration: true,
      projectShowcase: true,
      impactMetrics: true,
      newsletter: false,
      multilingual: false,
      accessibility: true
    }
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate website generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    setCurrentStep(4);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Organization Name</label>
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
                <label className="block text-sm font-medium mb-2">Primary Brand Color</label>
                <div className="flex gap-4">
                  <input
                    type="color"
                    value={websiteConfig.primaryColor}
                    onChange={(e) => setWebsiteConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-16 h-12 rounded-lg border border-slate-600"
                  />
                  <input
                    type="text"
                    value={websiteConfig.primaryColor}
                    onChange={(e) => setWebsiteConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'react', name: 'React App', desc: 'Modern, interactive' },
                    { id: 'wordpress', name: 'WordPress', desc: 'Easy to manage' },
                    { id: 'static', name: 'Static HTML', desc: 'Simple, fast' }
                  ].map(type => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setWebsiteConfig(prev => ({ ...prev, websiteType: type.id }))}
                      className={`p-4 border rounded-lg transition-colors ${
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
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Website Sections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'about', name: 'About Us', icon: Users, desc: 'Organization history and mission' },
                { key: 'projects', name: 'Projects', icon: BarChart3, desc: 'Current and past projects' },
                { key: 'donate', name: 'Donate', icon: Heart, desc: 'Donation and support page' },
                { key: 'reports', name: 'Reports', icon: FileText, desc: 'Annual reports and documents' },
                { key: 'contact', name: 'Contact', icon: Globe, desc: 'Contact information and form' },
                { key: 'team', name: 'Team', icon: Users, desc: 'Staff and board members' },
                { key: 'gallery', name: 'Gallery', icon: Layout, desc: 'Photos and media' },
                { key: 'blog', name: 'Blog/News', icon: FileText, desc: 'Updates and articles' }
              ].map(section => (
                <motion.div
                  key={section.key}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    websiteConfig.includeSections[section.key as keyof typeof websiteConfig.includeSections]
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-slate-600 bg-slate-800'
                  }`}
                  onClick={() => setWebsiteConfig(prev => ({
                    ...prev,
                    includeSections: {
                      ...prev.includeSections,
                      [section.key]: !prev.includeSections[section.key as keyof typeof prev.includeSections]
                    }
                  }))}
                >
                  <div className="flex items-start gap-3">
                    <section.icon className="w-5 h-5 text-blue-400 mt-1" />
                    <div>
                      <h4 className="font-medium">{section.name}</h4>
                      <p className="text-sm text-slate-400">{section.desc}</p>
                    </div>
                    {websiteConfig.includeSections[section.key as keyof typeof websiteConfig.includeSections] && (
                      <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Advanced Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'donationIntegration', name: 'Donation Integration', desc: 'Payment gateway integration' },
                { key: 'projectShowcase', name: 'Project Showcase', desc: 'Interactive project displays' },
                { key: 'impactMetrics', name: 'Impact Metrics', desc: 'Statistics and achievements' },
                { key: 'newsletter', name: 'Newsletter Signup', desc: 'Email subscription forms' },
                { key: 'multilingual', name: 'Multi-language', desc: 'Multiple language support' },
                { key: 'accessibility', name: 'Accessibility', desc: 'WCAG compliance features' }
              ].map(feature => (
                <motion.div
                  key={feature.key}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    websiteConfig.features[feature.key as keyof typeof websiteConfig.features]
                      ? 'border-green-500 bg-green-900/20'
                      : 'border-slate-600 bg-slate-800'
                  }`}
                  onClick={() => setWebsiteConfig(prev => ({
                    ...prev,
                    features: {
                      ...prev.features,
                      [feature.key]: !prev.features[feature.key as keyof typeof prev.features]
                    }
                  }))}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-sm text-slate-400">{feature.desc}</p>
                    </div>
                    {websiteConfig.features[feature.key as keyof typeof websiteConfig.features] && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Website Generated Successfully!</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Your professional NGO website has been generated with all the selected features and sections.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview Website
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Files
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Code className="w-4 h-4" />
                View Code
              </motion.button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
          />
          <h2 className="text-2xl font-bold">Generating Your Website...</h2>
          <p className="text-slate-400">Creating sections, styling components, and configuring features</p>
          <div className="max-w-md mx-auto bg-slate-800 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 2 }}
                className="bg-blue-500 h-2 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
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
              <p className="text-slate-400">Create a professional website for your organization</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {step}
                </div>
                {step < 4 && (
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
            {currentStep === 1 && "Basic Information"}
            {currentStep === 2 && "Website Sections"}
            {currentStep === 3 && "Advanced Features"}
            {currentStep === 4 && "Generation Complete"}
          </h2>
        </div>

        {/* Step Content */}
        <div className="bg-slate-800 rounded-lg p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 4 && (
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
                if (currentStep === 3) {
                  handleGenerate();
                } else {
                  setCurrentStep(currentStep + 1);
                }
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              {currentStep === 3 ? (
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

export default WebsiteGenerator;