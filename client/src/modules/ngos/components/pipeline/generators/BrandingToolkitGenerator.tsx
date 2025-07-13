/**
 * Granada OS - Branding Toolkit Generator
 * Generate complete brand identity including logo, colors, fonts, and social media templates
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette,
  ArrowLeft,
  Download,
  Eye,
  Sparkles,
  CheckCircle,
  Type,
  Hash,
  Image,
  MessageSquare
} from 'lucide-react';

interface BrandingToolkitGeneratorProps {
  onBack: () => void;
}

const BrandingToolkitGenerator: React.FC<BrandingToolkitGeneratorProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBranding, setGeneratedBranding] = useState<any>(null);
  const [brandingData, setBrandingData] = useState({
    organizationName: '',
    tagline: '',
    sector: 'education',
    targetAudience: '',
    brandPersonality: 'professional',
    colorPreference: 'blue',
    logoStyle: 'modern',
    socialMediaPlatforms: {
      facebook: true,
      twitter: true,
      instagram: true,
      linkedin: true,
      youtube: false
    }
  });

  const generateBranding = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const colorPalettes = {
      blue: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
      green: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#D1FAE5'],
      purple: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#EDE9FE'],
      orange: ['#EA580C', '#F97316', '#FB923C', '#FDBA74', '#FED7AA'],
      red: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FEE2E2']
    };

    const fontPairings = {
      modern: { primary: 'Inter', secondary: 'Source Sans Pro' },
      classic: { primary: 'Playfair Display', secondary: 'Lato' },
      creative: { primary: 'Poppins', secondary: 'Open Sans' },
      professional: { primary: 'Roboto', secondary: 'Nunito' }
    };

    const slogans = [
      `Empowering ${brandingData.targetAudience || 'communities'} through ${brandingData.sector}`,
      `Building a better tomorrow for ${brandingData.targetAudience || 'everyone'}`,
      `Making ${brandingData.sector} accessible to all`,
      `Transforming lives through ${brandingData.sector}`,
      `Your partner in ${brandingData.sector} excellence`
    ];

    const branding = {
      organizationName: brandingData.organizationName,
      tagline: brandingData.tagline || slogans[Math.floor(Math.random() * slogans.length)],
      colorPalette: colorPalettes[brandingData.colorPreference as keyof typeof colorPalettes],
      fonts: fontPairings[brandingData.logoStyle as keyof typeof fontPairings],
      logo: {
        style: brandingData.logoStyle,
        format: 'SVG',
        variations: ['Horizontal', 'Vertical', 'Icon only', 'Monochrome']
      },
      socialMediaTemplates: Object.entries(brandingData.socialMediaPlatforms)
        .filter(([_, enabled]) => enabled)
        .map(([platform]) => ({
          platform: platform.charAt(0).toUpperCase() + platform.slice(1),
          templates: ['Cover Photo', 'Post Template', 'Profile Picture', 'Story Template']
        })),
      brandGuidelines: {
        logoUsage: 'Maintain clear space equal to the height of the logo',
        colorUsage: 'Primary color for main elements, secondary for accents',
        typography: 'Use primary font for headings, secondary for body text',
        voiceTone: brandingData.brandPersonality
      },
      generatedAt: new Date().toLocaleDateString()
    };

    setGeneratedBranding(branding);
    setIsGenerating(false);
    setCurrentStep(3);
  };

  const downloadBrandingKit = () => {
    if (!generatedBranding) return;
    
    const content = `
${generatedBranding.organizationName} - Brand Toolkit
Generated: ${generatedBranding.generatedAt}

BRAND IDENTITY
Organization: ${generatedBranding.organizationName}
Tagline: ${generatedBranding.tagline}

COLOR PALETTE
Primary: ${generatedBranding.colorPalette[0]}
Secondary: ${generatedBranding.colorPalette[1]}
Accent 1: ${generatedBranding.colorPalette[2]}
Accent 2: ${generatedBranding.colorPalette[3]}
Light: ${generatedBranding.colorPalette[4]}

TYPOGRAPHY
Primary Font: ${generatedBranding.fonts.primary}
Secondary Font: ${generatedBranding.fonts.secondary}

LOGO SPECIFICATIONS
Style: ${generatedBranding.logo.style}
Format: ${generatedBranding.logo.format}
Variations: ${generatedBranding.logo.variations.join(', ')}

SOCIAL MEDIA TEMPLATES
${generatedBranding.socialMediaTemplates.map((sm: any) => 
`${sm.platform}: ${sm.templates.join(', ')}`).join('\n')}

BRAND GUIDELINES
${Object.entries(generatedBranding.brandGuidelines).map(([key, value]) => 
`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedBranding.organizationName.replace(/\s+/g, '_')}_Brand_Toolkit.txt`;
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
            <h3 className="text-xl font-bold mb-4">Brand Basics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Organization Name *</label>
                  <input
                    type="text"
                    value={brandingData.organizationName}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, organizationName: e.target.value }))}
                    placeholder="Your organization name"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tagline/Mission</label>
                  <input
                    type="text"
                    value={brandingData.tagline}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="Brief mission statement or tagline"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Sector</label>
                  <select
                    value={brandingData.sector}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, sector: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-pink-500 focus:outline-none"
                  >
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="environment">Environment</option>
                    <option value="humanitarian">Humanitarian</option>
                    <option value="development">Development</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Target Audience</label>
                  <input
                    type="text"
                    value={brandingData.targetAudience}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    placeholder="e.g., children, women, rural communities"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Brand Personality</label>
                  <select
                    value={brandingData.brandPersonality}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, brandPersonality: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-pink-500 focus:outline-none"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="innovative">Innovative</option>
                    <option value="trustworthy">Trustworthy</option>
                    <option value="inspiring">Inspiring</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color Preference</label>
                  <div className="grid grid-cols-5 gap-2">
                    {['blue', 'green', 'purple', 'orange', 'red'].map(color => (
                      <button
                        key={color}
                        onClick={() => setBrandingData(prev => ({ ...prev, colorPreference: color }))}
                        className={`w-full h-12 rounded-lg border-2 ${
                          brandingData.colorPreference === color ? 'border-white' : 'border-transparent'
                        } ${
                          color === 'blue' ? 'bg-blue-600' :
                          color === 'green' ? 'bg-green-600' :
                          color === 'purple' ? 'bg-purple-600' :
                          color === 'orange' ? 'bg-orange-600' :
                          'bg-red-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Design Preferences</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-4">Logo Style</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: 'modern', name: 'Modern', desc: 'Clean, minimalist design' },
                    { id: 'classic', name: 'Classic', desc: 'Traditional, elegant style' },
                    { id: 'creative', name: 'Creative', desc: 'Artistic, unique approach' },
                    { id: 'professional', name: 'Professional', desc: 'Corporate, reliable look' }
                  ].map(style => (
                    <motion.button
                      key={style.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setBrandingData(prev => ({ ...prev, logoStyle: style.id }))}
                      className={`p-4 border rounded-lg transition-colors ${
                        brandingData.logoStyle === style.id
                          ? 'border-pink-500 bg-pink-900/20'
                          : 'border-slate-600 bg-slate-800'
                      }`}
                    >
                      <h4 className="font-medium mb-1">{style.name}</h4>
                      <p className="text-sm text-slate-400">{style.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-4">Social Media Platforms</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(brandingData.socialMediaPlatforms).map(([platform, enabled]) => (
                    <motion.div
                      key={platform}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setBrandingData(prev => ({
                        ...prev,
                        socialMediaPlatforms: {
                          ...prev.socialMediaPlatforms,
                          [platform]: !enabled
                        }
                      }))}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        enabled
                          ? 'border-pink-500 bg-pink-900/20'
                          : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{platform}</span>
                        {enabled && <CheckCircle className="w-5 h-5 text-pink-400" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {generatedBranding && (
              <>
                <div className="text-center">
                  <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Brand Toolkit Generated!</h3>
                  <p className="text-slate-400">Complete branding package for {generatedBranding.organizationName}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-pink-400" />
                      Color Palette
                    </h4>
                    <div className="flex gap-2 mb-4">
                      {generatedBranding.colorPalette.map((color: string, idx: number) => (
                        <div key={idx} className="text-center">
                          <div 
                            className="w-12 h-12 rounded-lg mb-2"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs text-slate-400">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Type className="w-5 h-5 text-pink-400" />
                      Typography
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-slate-400">Primary Font:</span>
                        <p className="font-semibold">{generatedBranding.fonts.primary}</p>
                      </div>
                      <div>
                        <span className="text-sm text-slate-400">Secondary Font:</span>
                        <p className="font-medium">{generatedBranding.fonts.secondary}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Image className="w-5 h-5 text-pink-400" />
                      Logo Package
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Style:</span>
                        <span className="capitalize">{generatedBranding.logo.style}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Format:</span>
                        <span>{generatedBranding.logo.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Variations:</span>
                        <span>{generatedBranding.logo.variations.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-pink-400" />
                      Social Media
                    </h4>
                    <div className="space-y-2">
                      {generatedBranding.socialMediaTemplates.map((sm: any, idx: number) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-slate-400">{sm.platform}:</span>
                          <span>{sm.templates.length} templates</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadBrandingKit}
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Kit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview Assets
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Hash className="w-4 h-4" />
                    Brand Guidelines
                  </motion.button>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"
          />
          <h2 className="text-2xl font-bold">Creating Your Brand Toolkit...</h2>
          <div className="space-y-2 text-slate-400">
            <p>✓ Generating color palette</p>
            <p>✓ Selecting typography</p>
            <p>✓ Creating logo concepts</p>
            <p>⏳ Preparing social media templates</p>
          </div>
        </div>
      </div>
    );
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
            <Palette className="w-8 h-8 text-pink-400" />
            <div>
              <h1 className="text-3xl font-bold">Branding Toolkit Generator</h1>
              <p className="text-slate-400">Create a complete brand identity for your organization</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  currentStep >= step ? 'bg-pink-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-pink-600' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-slate-800 rounded-xl p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        {currentStep < 3 && (
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
                if (currentStep === 2) {
                  generateBranding();
                } else {
                  setCurrentStep(currentStep + 1);
                }
              }}
              disabled={!brandingData.organizationName}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
            >
              {currentStep === 2 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Toolkit
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

export default BrandingToolkitGenerator;