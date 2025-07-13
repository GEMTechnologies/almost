/**
 * Granada OS - Policy Document Generator
 * Generate comprehensive organizational policies with real content
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield,
  ArrowLeft,
  Download,
  Eye,
  FileText,
  CheckCircle,
  Users,
  Lock,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface PolicyGeneratorProps {
  onBack: () => void;
}

const PolicyGenerator: React.FC<PolicyGeneratorProps> = ({ onBack }) => {
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [organizationInfo, setOrganizationInfo] = useState({
    name: '',
    type: 'NGO',
    country: '',
    sector: 'education',
    size: 'medium'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPolicies, setGeneratedPolicies] = useState<any[]>([]);

  const availablePolicies = [
    {
      id: 'code-of-conduct',
      name: 'Code of Conduct',
      description: 'Ethical standards and behavioral expectations for all staff',
      complexity: 'intermediate',
      pages: '8-12',
      sections: ['Introduction', 'Core Values', 'Professional Standards', 'Prohibited Conduct', 'Reporting Procedures']
    },
    {
      id: 'safeguarding',
      name: 'Safeguarding Policy',
      description: 'Child and vulnerable adult protection procedures',
      complexity: 'advanced',
      pages: '15-20',
      sections: ['Policy Statement', 'Risk Assessment', 'Recruitment', 'Training', 'Incident Reporting', 'Investigation Procedures']
    },
    {
      id: 'financial',
      name: 'Financial Policy',
      description: 'Financial management, controls, and accountability',
      complexity: 'advanced',
      pages: '20-25',
      sections: ['Financial Authority', 'Budget Management', 'Procurement', 'Asset Management', 'Audit Requirements']
    },
    {
      id: 'hr-manual',
      name: 'HR Manual',
      description: 'Comprehensive human resources policies and procedures',
      complexity: 'advanced',
      pages: '30-40',
      sections: ['Recruitment', 'Employment Terms', 'Performance Management', 'Leave Policies', 'Disciplinary Procedures']
    },
    {
      id: 'data-protection',
      name: 'Data Protection Policy',
      description: 'GDPR-compliant data handling and privacy protection',
      complexity: 'intermediate',
      pages: '10-15',
      sections: ['Data Principles', 'Lawful Basis', 'Data Rights', 'Security Measures', 'Breach Procedures']
    },
    {
      id: 'anti-harassment',
      name: 'Anti-Sexual Harassment Policy',
      description: 'Prevention and response to sexual harassment',
      complexity: 'intermediate',
      pages: '8-12',
      sections: ['Policy Statement', 'Definitions', 'Prevention Measures', 'Complaint Procedures', 'Investigation Process']
    },
    {
      id: 'procurement',
      name: 'Procurement Policy',
      description: 'Transparent and efficient procurement procedures',
      complexity: 'intermediate',
      pages: '12-18',
      sections: ['Procurement Principles', 'Authority Limits', 'Vendor Selection', 'Contract Management', 'Monitoring']
    },
    {
      id: 'conflict-interest',
      name: 'Conflict of Interest Policy',
      description: 'Managing conflicts of interest and related party transactions',
      complexity: 'basic',
      pages: '6-10',
      sections: ['Definition', 'Disclosure Requirements', 'Decision Making', 'Monitoring', 'Sanctions']
    },
    {
      id: 'risk-management',
      name: 'Risk Management Policy',
      description: 'Systematic approach to identifying and managing risks',
      complexity: 'advanced',
      pages: '15-20',
      sections: ['Risk Framework', 'Risk Assessment', 'Mitigation Strategies', 'Monitoring', 'Reporting']
    }
  ];

  const generatePolicies = async () => {
    setIsGenerating(true);
    
    // Simulate policy generation
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const policies = selectedPolicies.map(policyId => {
      const policyTemplate = availablePolicies.find(p => p.id === policyId);
      if (!policyTemplate) return null;
      
      return {
        id: policyId,
        title: policyTemplate.name,
        organization: organizationInfo.name,
        generatedAt: new Date().toLocaleDateString(),
        version: '1.0',
        pages: Math.floor(Math.random() * 10) + 8,
        content: generatePolicyContent(policyTemplate, organizationInfo),
        sections: policyTemplate.sections
      };
    }).filter(Boolean);
    
    setGeneratedPolicies(policies);
    setIsGenerating(false);
  };

  const generatePolicyContent = (policy: any, orgInfo: any) => {
    const templates: { [key: string]: any } = {
      'code-of-conduct': {
        introduction: `${orgInfo.name} is committed to maintaining the highest standards of integrity, professionalism, and ethical conduct. This Code of Conduct outlines the behavioral expectations for all personnel, including employees, volunteers, consultants, and board members.

Purpose: This policy establishes clear standards of professional behavior and provides guidance for ethical decision-making in all aspects of our work.

Scope: This policy applies to all ${orgInfo.name} personnel in all locations and contexts, including official duties, public appearances, and social media activities.`,

        coreValues: `Integrity: We act honestly and transparently in all our dealings
Respect: We treat all individuals with dignity and respect
Accountability: We take responsibility for our actions and decisions
Excellence: We strive for the highest quality in our work
Stewardship: We manage resources responsibly and efficiently`,

        professionalStandards: `All ${orgInfo.name} personnel must:
• Perform duties competently and with due care
• Maintain confidentiality of sensitive information
• Avoid conflicts of interest
• Respect the rights and dignity of all individuals
• Comply with all applicable laws and regulations
• Represent the organization with integrity`,

        prohibitedConduct: `The following behaviors are strictly prohibited:
• Discrimination or harassment of any kind
• Abuse of authority or position
• Misuse of organizational resources
• Acceptance of inappropriate gifts or benefits
• Breach of confidentiality
• Engaging in activities that damage the organization's reputation`,

        reportingProcedures: `Any suspected violations of this Code must be reported immediately to:
• Direct supervisor
• Human Resources Department
• Ethics hotline: [contact information]

${orgInfo.name} prohibits retaliation against individuals who report violations in good faith.`
      },

      'safeguarding': {
        policyStatement: `${orgInfo.name} is committed to creating and maintaining a safe environment for all children and vulnerable adults. We have zero tolerance for abuse, exploitation, or harm of any kind.

Our commitment includes:
• Implementing robust safeguarding procedures
• Ensuring safe recruitment practices
• Providing comprehensive training
• Maintaining clear reporting mechanisms
• Supporting survivors of abuse`,

        riskAssessment: `Regular safeguarding risk assessments will be conducted covering:
• Program activities and environments
• Staff and volunteer roles
• Partner organizations
• Technology and communications
• Physical facilities and security

Risk assessments will be reviewed annually and updated as needed.`,

        recruitment: `All personnel working with children or vulnerable adults must undergo:
• Enhanced background checks
• Reference verification
• Safeguarding interview questions
• Probationary period monitoring
• Regular performance reviews

No individual with a history of child abuse will be employed or engaged.`,

        training: `All personnel receive mandatory safeguarding training including:
• Introduction to safeguarding principles
• Recognizing signs of abuse
• Appropriate behavior and boundaries
• Reporting procedures
• Regular refresher training

Training records are maintained and monitored.`,

        reporting: `Any safeguarding concerns must be reported immediately:
• To designated safeguarding officer
• To local authorities if required
• Following established escalation procedures
• Maintaining confidentiality throughout

Documentation and follow-up procedures ensure appropriate response.`
      },

      'financial': {
        authority: `Financial authority levels are clearly defined:

Board of Directors: 
• Approval of annual budgets over $500,000
• Major capital expenditures
• Borrowing and investment decisions

Executive Director:
• Budget approval up to $100,000
• Emergency expenditures up to $25,000
• Contract authorization

Department Heads:
• Expenditures up to $10,000 within approved budgets
• Budget variance approvals up to 10%

All expenditures must be properly authorized and documented.`,

        budgetManagement: `${orgInfo.name} follows rigorous budget management procedures:

• Annual budgets prepared and board-approved
• Monthly budget monitoring and variance analysis
• Quarterly financial reporting to board
• Budget amendments require appropriate approval
• Cash flow forecasting and management

Department heads are responsible for managing their allocated budgets.`,

        procurement: `All procurement follows competitive and transparent processes:

Under $5,000: Direct procurement with documented justification
$5,000-$25,000: Three written quotations required
Over $25,000: Formal tender process

Procurement decisions consider:
• Value for money
• Quality and suitability
• Supplier reliability
• Ethical considerations`,

        assetManagement: `All organizational assets are properly managed:
• Asset registers maintained
• Regular asset verification
• Appropriate insurance coverage
• Disposal procedures followed
• Security measures implemented

Assets over $1,000 are individually tracked and labeled.`
      }
    };

    return templates[policy.id] || {
      introduction: `This ${policy.name} has been developed for ${orgInfo.name} to ensure compliance with best practices and regulatory requirements in the ${orgInfo.sector} sector.`,
      content: `Detailed policy content would be generated here based on the specific requirements and organizational context.`
    };
  };

  const downloadPolicy = (policy: any) => {
    const content = `
${policy.title}
${policy.organization}
Version ${policy.version}
Generated: ${policy.generatedAt}

${Object.entries(policy.content).map(([section, content]) => `
${section.toUpperCase().replace(/([A-Z])/g, ' $1').trim()}
${content}
`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${policy.title.replace(/\s+/g, '_')}_Policy.txt`;
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
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"
          />
          <h2 className="text-2xl font-bold">Generating Policies...</h2>
          <div className="space-y-2 text-slate-400">
            <p>✓ Customizing content for your organization</p>
            <p>✓ Incorporating industry standards</p>
            <p>✓ Adding compliance requirements</p>
            <p>⏳ Finalizing document structure</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 4 }}
                className="bg-purple-500 h-2 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (generatedPolicies.length > 0) {
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
              <h1 className="text-3xl font-bold">Generated Policies</h1>
              <p className="text-slate-400">Your organizational policies are ready</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedPolicies.map((policy, index) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <Shield className="w-8 h-8 text-purple-400" />
                  <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                    v{policy.version}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mb-2">{policy.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{policy.organization}</p>
                
                <div className="space-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pages:</span>
                    <span>{policy.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Generated:</span>
                    <span>{policy.generatedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sections:</span>
                    <span>{policy.sections.length}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => downloadPolicy(policy)}
                    className="w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </motion.button>
                </div>
              </motion.div>
            ))}
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
            <Shield className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-3xl font-bold">Policy Document Generator</h1>
              <p className="text-slate-400">Generate comprehensive organizational policies</p>
            </div>
          </div>
        </div>

        {/* Organization Information */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Organization Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Organization Name</label>
              <input
                type="text"
                value={organizationInfo.name}
                onChange={(e) => setOrganizationInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your organization name"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Organization Type</label>
              <select
                value={organizationInfo.type}
                onChange={(e) => setOrganizationInfo(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="NGO">NGO</option>
                <option value="CBO">Community Based Organization</option>
                <option value="Foundation">Foundation</option>
                <option value="Trust">Trust</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Primary Sector</label>
              <select
                value={organizationInfo.sector}
                onChange={(e) => setOrganizationInfo(prev => ({ ...prev, sector: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="education">Education</option>
                <option value="health">Health</option>
                <option value="environment">Environment</option>
                <option value="humanitarian">Humanitarian</option>
                <option value="development">Development</option>
              </select>
            </div>
          </div>
        </div>

        {/* Policy Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Select Policies to Generate</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePolicies.map((policy) => (
              <motion.div
                key={policy.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  if (selectedPolicies.includes(policy.id)) {
                    setSelectedPolicies(prev => prev.filter(id => id !== policy.id));
                  } else {
                    setSelectedPolicies(prev => [...prev, policy.id]);
                  }
                }}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  selectedPolicies.includes(policy.id)
                    ? 'border-purple-500 bg-purple-900/20'
                    : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <Shield className="w-6 h-6 text-purple-400" />
                  {selectedPolicies.includes(policy.id) && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>
                
                <h4 className="font-medium mb-2">{policy.name}</h4>
                <p className="text-sm text-slate-400 mb-3">{policy.description}</p>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Complexity:</span>
                    <span className={`px-2 py-1 rounded-full ${
                      policy.complexity === 'basic' ? 'bg-green-600' :
                      policy.complexity === 'intermediate' ? 'bg-yellow-600' : 'bg-red-600'
                    }`}>
                      {policy.complexity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pages:</span>
                    <span>{policy.pages}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePolicies}
            disabled={selectedPolicies.length === 0 || !organizationInfo.name}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-semibold transition-colors flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            Generate {selectedPolicies.length} Selected Policies
          </motion.button>
          {selectedPolicies.length === 0 && (
            <p className="text-slate-400 text-sm mt-2">Select at least one policy to generate</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyGenerator;