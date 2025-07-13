/**
 * Granada OS - Certificate Generator
 * Generate professional certificates for volunteers, training, and staff recognition
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award,
  ArrowLeft,
  Download,
  Eye,
  Sparkles,
  CheckCircle,
  User,
  Calendar,
  FileText
} from 'lucide-react';

interface CertificateGeneratorProps {
  onBack: () => void;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCertificates, setGeneratedCertificates] = useState<any[]>([]);
  const [certificateData, setCertificateData] = useState({
    type: 'volunteer',
    organizationName: '',
    recipientName: '',
    achievementTitle: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    signatory: '',
    signatoryTitle: '',
    template: 'formal',
    includeSignature: true,
    includeLogo: true,
    certificateNumber: ''
  });

  const certificateTypes = {
    volunteer: {
      title: 'Volunteer Appreciation Certificate',
      defaultAchievement: 'Outstanding Volunteer Service',
      defaultDescription: 'In recognition of dedicated volunteer service and commitment to our mission'
    },
    training: {
      title: 'Training Completion Certificate',
      defaultAchievement: 'Training Program Completion',
      defaultDescription: 'Has successfully completed the training program and demonstrated competency'
    },
    recognition: {
      title: 'Staff Recognition Certificate',
      defaultAchievement: 'Excellence in Service',
      defaultDescription: 'In recognition of exceptional performance and dedication to organizational goals'
    }
  };

  const generateCertificates = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const certificateType = certificateTypes[certificateData.type as keyof typeof certificateTypes];
    
    const certificate = {
      type: certificateData.type,
      title: certificateType.title,
      organizationName: certificateData.organizationName,
      recipientName: certificateData.recipientName,
      achievementTitle: certificateData.achievementTitle || certificateType.defaultAchievement,
      description: certificateData.description || certificateType.defaultDescription,
      date: new Date(certificateData.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      signatory: certificateData.signatory,
      signatoryTitle: certificateData.signatoryTitle,
      template: certificateData.template,
      certificateNumber: certificateData.certificateNumber || `CERT-${Date.now()}`,
      generatedAt: new Date().toLocaleDateString(),
      htmlTemplate: generateCertificateHTML()
    };

    setGeneratedCertificates([certificate]);
    setIsGenerating(false);
    setCurrentStep(3);
  };

  const generateCertificateHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Open+Sans:wght@400;600&display=swap');
        
        .certificate {
            width: 11in;
            height: 8.5in;
            margin: 0 auto;
            padding: 40px;
            box-sizing: border-box;
            border: 8px solid #${certificateData.template === 'formal' ? '2c3e50' : certificateData.template === 'elegant' ? '8b4513' : '1e40af'};
            background: ${certificateData.template === 'formal' ? 'linear-gradient(45deg, #f8f9fa, #ffffff)' : 
                        certificateData.template === 'elegant' ? 'linear-gradient(45deg, #fff8dc, #ffffff)' : 
                        'linear-gradient(45deg, #f0f9ff, #ffffff)'};
            font-family: 'Open Sans', sans-serif;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
        }
        
        .certificate::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid #${certificateData.template === 'formal' ? '34495e' : certificateData.template === 'elegant' ? 'a0522d' : '2563eb'};
            pointer-events: none;
        }
        
        .header {
            margin-bottom: 30px;
        }
        
        .organization-name {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            font-weight: 700;
            color: #${certificateData.template === 'formal' ? '2c3e50' : certificateData.template === 'elegant' ? '8b4513' : '1e40af'};
            margin-bottom: 10px;
        }
        
        .certificate-title {
            font-size: 20px;
            color: #666;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 40px;
        }
        
        .certificate-text {
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 30px;
            color: #333;
        }
        
        .recipient-name {
            font-family: 'Playfair Display', serif;
            font-size: 36px;
            font-weight: 700;
            color: #${certificateData.template === 'formal' ? '2c3e50' : certificateData.template === 'elegant' ? '8b4513' : '1e40af'};
            margin: 20px 0;
            border-bottom: 2px solid #${certificateData.template === 'formal' ? '34495e' : certificateData.template === 'elegant' ? 'a0522d' : '2563eb'};
            padding-bottom: 10px;
            display: inline-block;
        }
        
        .achievement {
            font-size: 24px;
            font-weight: 600;
            color: #${certificateData.template === 'formal' ? '2c3e50' : certificateData.template === 'elegant' ? '8b4513' : '1e40af'};
            margin: 20px 0;
        }
        
        .description {
            font-size: 16px;
            color: #555;
            margin: 30px 0;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: end;
            margin-top: 50px;
            padding: 0 40px;
        }
        
        .signature-section {
            text-align: center;
            flex: 1;
        }
        
        .signature-line {
            border-top: 2px solid #333;
            width: 200px;
            margin: 0 auto 10px;
        }
        
        .signatory-name {
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .signatory-title {
            font-size: 14px;
            color: #666;
        }
        
        .date-section {
            text-align: center;
            flex: 1;
        }
        
        .certificate-number {
            position: absolute;
            bottom: 20px;
            right: 30px;
            font-size: 12px;
            color: #888;
        }
        
        .award-icon {
            font-size: 48px;
            color: #${certificateData.template === 'formal' ? '2c3e50' : certificateData.template === 'elegant' ? '8b4513' : '1e40af'};
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <div class="organization-name">${certificateData.organizationName}</div>
        </div>
        
        <div class="award-icon">🏆</div>
        
        <div class="certificate-title">${certificateTypes[certificateData.type as keyof typeof certificateTypes].title}</div>
        
        <div class="certificate-text">
            This is to certify that
        </div>
        
        <div class="recipient-name">${certificateData.recipientName}</div>
        
        <div class="achievement">${certificateData.achievementTitle || certificateTypes[certificateData.type as keyof typeof certificateTypes].defaultAchievement}</div>
        
        <div class="description">
            ${certificateData.description || certificateTypes[certificateData.type as keyof typeof certificateTypes].defaultDescription}
        </div>
        
        <div class="footer">
            <div class="date-section">
                <div style="font-weight: 600; margin-bottom: 5px;">Date</div>
                <div>${new Date(certificateData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            
            ${certificateData.includeSignature && certificateData.signatory ? `
            <div class="signature-section">
                <div class="signature-line"></div>
                <div class="signatory-name">${certificateData.signatory}</div>
                <div class="signatory-title">${certificateData.signatoryTitle}</div>
            </div>
            ` : ''}
        </div>
        
        <div class="certificate-number">
            Certificate No: ${certificateData.certificateNumber || `CERT-${Date.now()}`}
        </div>
    </div>
</body>
</html>`;
  };

  const downloadCertificate = (certificate: any) => {
    const content = certificate.htmlTemplate;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${certificate.recipientName.replace(/\s+/g, '_')}_Certificate.html`;
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
            <h3 className="text-xl font-bold mb-4">Certificate Type & Recipient</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(certificateTypes).map(([key, type]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCertificateData(prev => ({ ...prev, type: key }))}
                  className={`p-4 border rounded-lg transition-colors ${
                    certificateData.type === key
                      ? 'border-yellow-500 bg-yellow-900/20'
                      : 'border-slate-600 bg-slate-800'
                  }`}
                >
                  <Award className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <h4 className="font-medium text-sm">{type.title}</h4>
                </motion.button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Organization Name *</label>
                  <input
                    type="text"
                    value={certificateData.organizationName}
                    onChange={(e) => setCertificateData(prev => ({ ...prev, organizationName: e.target.value }))}
                    placeholder="Your organization name"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Recipient Name *</label>
                  <input
                    type="text"
                    value={certificateData.recipientName}
                    onChange={(e) => setCertificateData(prev => ({ ...prev, recipientName: e.target.value }))}
                    placeholder="Name of the certificate recipient"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Achievement Title</label>
                  <input
                    type="text"
                    value={certificateData.achievementTitle}
                    onChange={(e) => setCertificateData(prev => ({ ...prev, achievementTitle: e.target.value }))}
                    placeholder={certificateTypes[certificateData.type as keyof typeof certificateTypes].defaultAchievement}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={certificateData.date}
                    onChange={(e) => setCertificateData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Certificate Number</label>
                  <input
                    type="text"
                    value={certificateData.certificateNumber}
                    onChange={(e) => setCertificateData(prev => ({ ...prev, certificateNumber: e.target.value }))}
                    placeholder="Auto-generated if empty"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Template Style</label>
                  <select
                    value={certificateData.template}
                    onChange={(e) => setCertificateData(prev => ({ ...prev, template: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  >
                    <option value="formal">Formal</option>
                    <option value="elegant">Elegant</option>
                    <option value="modern">Modern</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={certificateData.description}
                onChange={(e) => setCertificateData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={certificateTypes[certificateData.type as keyof typeof certificateTypes].defaultDescription}
                rows={3}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Signature & Authorization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Signatory Name</label>
                  <input
                    type="text"
                    value={certificateData.signatory}
                    onChange={(e) => setCertificateData(prev => ({ ...prev, signatory: e.target.value }))}
                    placeholder="Name of the person signing"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Signatory Title</label>
                  <input
                    type="text"
                    value={certificateData.signatoryTitle}
                    onChange={(e) => setCertificateData(prev => ({ ...prev, signatoryTitle: e.target.value }))}
                    placeholder="e.g., Executive Director, Program Manager"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={certificateData.includeSignature}
                      onChange={(e) => setCertificateData(prev => ({ ...prev, includeSignature: e.target.checked }))}
                      className="rounded"
                    />
                    <span>Include signature block</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={certificateData.includeLogo}
                      onChange={(e) => setCertificateData(prev => ({ ...prev, includeLogo: e.target.checked }))}
                      className="rounded"
                    />
                    <span>Include organization logo</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {generatedCertificates.length > 0 && (
              <>
                <div className="text-center">
                  <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Certificate Generated!</h3>
                  <p className="text-slate-400">Professional certificate ready for download</p>
                </div>

                {generatedCertificates.map((cert, index) => (
                  <div key={index} className="bg-slate-800 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-bold mb-4">Certificate Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Type:</span>
                            <span className="capitalize">{cert.type} Certificate</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Recipient:</span>
                            <span>{cert.recipientName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Achievement:</span>
                            <span>{cert.achievementTitle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Date:</span>
                            <span>{cert.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Certificate No:</span>
                            <span>{cert.certificateNumber}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => downloadCertificate(cert)}
                          className="w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Certificate
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Preview Certificate
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ))}
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
            className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto"
          />
          <h2 className="text-2xl font-bold">Creating Your Certificate...</h2>
          <div className="space-y-2 text-slate-400">
            <p>✓ Formatting certificate layout</p>
            <p>✓ Adding recipient details</p>
            <p>⏳ Generating final document</p>
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
            <Award className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-3xl font-bold">Certificate Generator</h1>
              <p className="text-slate-400">Create professional certificates for various achievements</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  currentStep >= step ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-yellow-600' : 'bg-slate-700'
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
                  generateCertificates();
                } else {
                  setCurrentStep(currentStep + 1);
                }
              }}
              disabled={!certificateData.organizationName || !certificateData.recipientName}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
            >
              {currentStep === 2 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Certificate
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

export default CertificateGenerator;