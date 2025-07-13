/**
 * Granada OS - Letterhead Generator
 * Generate professional letterheads with organization details
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileImage,
  ArrowLeft,
  Download,
  Eye,
  Sparkles,
  CheckCircle,
  Building,
  Mail,
  Phone,
  Globe
} from 'lucide-react';

interface LetterheadGeneratorProps {
  onBack: () => void;
}

const LetterheadGenerator: React.FC<LetterheadGeneratorProps> = ({ onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetterhead, setGeneratedLetterhead] = useState<any>(null);
  const [letterheadData, setLetterheadData] = useState({
    organizationName: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    registrationNumber: '',
    slogan: '',
    headerStyle: 'centered',
    colorScheme: 'blue',
    includeFooter: true,
    includeWatermark: false,
    logoPosition: 'left'
  });

  const generateLetterhead = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const letterhead = {
      organizationName: letterheadData.organizationName,
      contactInfo: {
        address: `${letterheadData.address}, ${letterheadData.city}, ${letterheadData.country}`,
        phone: letterheadData.phone,
        email: letterheadData.email,
        website: letterheadData.website,
        registration: letterheadData.registrationNumber
      },
      design: {
        headerStyle: letterheadData.headerStyle,
        colorScheme: letterheadData.colorScheme,
        logoPosition: letterheadData.logoPosition,
        includeFooter: letterheadData.includeFooter,
        includeWatermark: letterheadData.includeWatermark
      },
      slogan: letterheadData.slogan,
      formats: ['DOCX Template', 'PDF Template', 'PNG Image'],
      generatedAt: new Date().toLocaleDateString(),
      template: generateLetterheadTemplate()
    };

    setGeneratedLetterhead(letterhead);
    setIsGenerating(false);
  };

  const generateLetterheadTemplate = () => {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        .letterhead {
            font-family: Arial, sans-serif;
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 20mm;
            box-sizing: border-box;
        }
        .header {
            border-bottom: 3px solid #${letterheadData.colorScheme === 'blue' ? '2563EB' : letterheadData.colorScheme === 'green' ? '059669' : '7C3AED'};
            padding-bottom: 20px;
            margin-bottom: 30px;
            text-align: ${letterheadData.headerStyle === 'centered' ? 'center' : 'left'};
        }
        .org-name {
            font-size: 24px;
            font-weight: bold;
            color: #${letterheadData.colorScheme === 'blue' ? '2563EB' : letterheadData.colorScheme === 'green' ? '059669' : '7C3AED'};
            margin-bottom: 5px;
        }
        .slogan {
            font-style: italic;
            color: #666;
            margin-bottom: 15px;
        }
        .contact-info {
            font-size: 12px;
            line-height: 1.4;
            color: #555;
        }
        .footer {
            position: fixed;
            bottom: 20mm;
            left: 20mm;
            right: 20mm;
            border-top: 1px solid #ccc;
            padding-top: 10px;
            font-size: 10px;
            text-align: center;
            color: #888;
        }
        .content-area {
            min-height: 180mm;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="letterhead">
        <div class="header">
            <div class="org-name">${letterheadData.organizationName}</div>
            ${letterheadData.slogan ? `<div class="slogan">${letterheadData.slogan}</div>` : ''}
            <div class="contact-info">
                ${letterheadData.address ? `${letterheadData.address}, ${letterheadData.city}, ${letterheadData.country}<br>` : ''}
                ${letterheadData.phone ? `Tel: ${letterheadData.phone} | ` : ''}
                ${letterheadData.email ? `Email: ${letterheadData.email} | ` : ''}
                ${letterheadData.website ? `Web: ${letterheadData.website}` : ''}
                ${letterheadData.registrationNumber ? `<br>Registration No: ${letterheadData.registrationNumber}` : ''}
            </div>
        </div>
        
        <div class="content-area">
            <!-- Letter content goes here -->
        </div>
        
        ${letterheadData.includeFooter ? `
        <div class="footer">
            ${letterheadData.organizationName} | ${letterheadData.email}
            ${letterheadData.registrationNumber ? ` | Reg. No: ${letterheadData.registrationNumber}` : ''}
        </div>
        ` : ''}
    </div>
</body>
</html>`;
  };

  const downloadLetterhead = (format: string) => {
    if (!generatedLetterhead) return;
    
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'HTML':
        content = generatedLetterhead.template;
        filename = `${letterheadData.organizationName.replace(/\s+/g, '_')}_Letterhead.html`;
        mimeType = 'text/html';
        break;
      case 'DOCX':
        content = `${letterheadData.organizationName} Letterhead Template
        
HEADER DESIGN:
${letterheadData.organizationName}
${letterheadData.slogan}

CONTACT INFORMATION:
Address: ${letterheadData.address}, ${letterheadData.city}, ${letterheadData.country}
Phone: ${letterheadData.phone}
Email: ${letterheadData.email}
Website: ${letterheadData.website}
Registration: ${letterheadData.registrationNumber}

DESIGN SPECIFICATIONS:
Header Style: ${letterheadData.headerStyle}
Color Scheme: ${letterheadData.colorScheme}
Logo Position: ${letterheadData.logoPosition}
Include Footer: ${letterheadData.includeFooter ? 'Yes' : 'No'}
Include Watermark: ${letterheadData.includeWatermark ? 'Yes' : 'No'}

Generated: ${generatedLetterhead.generatedAt}`;
        filename = `${letterheadData.organizationName.replace(/\s+/g, '_')}_Letterhead_Template.txt`;
        mimeType = 'text/plain';
        break;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"
          />
          <h2 className="text-2xl font-bold">Designing Your Letterhead...</h2>
          <div className="space-y-2 text-slate-400">
            <p>✓ Formatting organization details</p>
            <p>✓ Applying design layout</p>
            <p>⏳ Generating templates</p>
          </div>
        </div>
      </div>
    );
  }

  if (generatedLetterhead) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold">Letterhead Generated!</h1>
              <p className="text-slate-400">Professional letterhead for {generatedLetterhead.organizationName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white text-black p-8 rounded-lg shadow-lg">
                <div className={`border-b-4 pb-6 mb-8 ${
                  letterheadData.colorScheme === 'blue' ? 'border-blue-600' :
                  letterheadData.colorScheme === 'green' ? 'border-green-600' :
                  'border-purple-600'
                } ${letterheadData.headerStyle === 'centered' ? 'text-center' : 'text-left'}`}>
                  <h1 className={`text-2xl font-bold mb-2 ${
                    letterheadData.colorScheme === 'blue' ? 'text-blue-600' :
                    letterheadData.colorScheme === 'green' ? 'text-green-600' :
                    'text-purple-600'
                  }`}>
                    {generatedLetterhead.organizationName}
                  </h1>
                  {letterheadData.slogan && (
                    <p className="italic text-gray-600 mb-4">{letterheadData.slogan}</p>
                  )}
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>{generatedLetterhead.contactInfo.address}</p>
                    <p>
                      {generatedLetterhead.contactInfo.phone && `Tel: ${generatedLetterhead.contactInfo.phone} | `}
                      {generatedLetterhead.contactInfo.email && `Email: ${generatedLetterhead.contactInfo.email}`}
                    </p>
                    {generatedLetterhead.contactInfo.website && (
                      <p>Website: {generatedLetterhead.contactInfo.website}</p>
                    )}
                    {generatedLetterhead.contactInfo.registration && (
                      <p>Registration No: {generatedLetterhead.contactInfo.registration}</p>
                    )}
                  </div>
                </div>
                
                <div className="min-h-[300px] text-gray-500 italic">
                  [Letter content will appear here]
                </div>
                
                {letterheadData.includeFooter && (
                  <div className="border-t border-gray-300 pt-4 mt-8 text-center text-xs text-gray-500">
                    {generatedLetterhead.organizationName} | {generatedLetterhead.contactInfo.email}
                    {generatedLetterhead.contactInfo.registration && 
                      ` | Reg. No: ${generatedLetterhead.contactInfo.registration}`
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Details & Download */}
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Letterhead Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Style:</span>
                    <span className="capitalize">{generatedLetterhead.design.headerStyle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Color:</span>
                    <span className="capitalize">{generatedLetterhead.design.colorScheme}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Footer:</span>
                    <span>{generatedLetterhead.design.includeFooter ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Generated:</span>
                    <span>{generatedLetterhead.generatedAt}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Download Templates</h3>
                <div className="space-y-3">
                  {generatedLetterhead.formats.map((format: string, index: number) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => downloadLetterhead(format.split(' ')[0])}
                      className="w-full bg-orange-600 hover:bg-orange-700 px-4 py-3 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      {format}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Usage Instructions</h3>
                <div className="text-sm text-slate-300 space-y-2">
                  <p>• Use DOCX template for Microsoft Word</p>
                  <p>• PDF template for digital letterhead</p>
                  <p>• PNG image for email signatures</p>
                  <p>• Maintain logo quality at 300 DPI for print</p>
                  <p>• Keep contact information updated</p>
                </div>
              </div>
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
            <FileImage className="w-8 h-8 text-orange-400" />
            <div>
              <h1 className="text-3xl font-bold">Letterhead Generator</h1>
              <p className="text-slate-400">Create professional letterheads with your organization details</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-slate-800 rounded-xl p-8 space-y-8">
          {/* Organization Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Organization Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Organization Name *</label>
                  <input
                    type="text"
                    value={letterheadData.organizationName}
                    onChange={(e) => setLetterheadData(prev => ({ ...prev, organizationName: e.target.value }))}
                    placeholder="Your organization name"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    value={letterheadData.address}
                    onChange={(e) => setLetterheadData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Street address"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      value={letterheadData.city}
                      onChange={(e) => setLetterheadData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="City"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <input
                      type="text"
                      value={letterheadData.country}
                      onChange={(e) => setLetterheadData(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="Country"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="text"
                    value={letterheadData.phone}
                    onChange={(e) => setLetterheadData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={letterheadData.email}
                    onChange={(e) => setLetterheadData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="info@organization.org"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <input
                    type="url"
                    value={letterheadData.website}
                    onChange={(e) => setLetterheadData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="www.organization.org"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Registration Number</label>
                  <input
                    type="text"
                    value={letterheadData.registrationNumber}
                    onChange={(e) => setLetterheadData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                    placeholder="REG123456"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Slogan/Tagline</label>
              <input
                type="text"
                value={letterheadData.slogan}
                onChange={(e) => setLetterheadData(prev => ({ ...prev, slogan: e.target.value }))}
                placeholder="Your organization's motto or tagline"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Design Options */}
          <div>
            <h3 className="text-xl font-bold mb-4">Design Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Header Style</label>
                <select
                  value={letterheadData.headerStyle}
                  onChange={(e) => setLetterheadData(prev => ({ ...prev, headerStyle: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="centered">Centered</option>
                  <option value="left">Left Aligned</option>
                  <option value="right">Right Aligned</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color Scheme</label>
                <select
                  value={letterheadData.colorScheme}
                  onChange={(e) => setLetterheadData(prev => ({ ...prev, colorScheme: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={letterheadData.includeFooter}
                  onChange={(e) => setLetterheadData(prev => ({ ...prev, includeFooter: e.target.checked }))}
                  className="rounded"
                />
                <span>Include footer</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={letterheadData.includeWatermark}
                  onChange={(e) => setLetterheadData(prev => ({ ...prev, includeWatermark: e.target.checked }))}
                  className="rounded"
                />
                <span>Include watermark</span>
              </label>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateLetterhead}
            disabled={!letterheadData.organizationName}
            className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-semibold transition-colors flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            Generate Letterhead
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default LetterheadGenerator;