import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'wouter';
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Brain,
  User,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Send,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  amount: string;
  deadline: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  applicationProcess: string[];
}

const ApplyPage: React.FC = () => {
  const { opportunityId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [applicationMethod, setApplicationMethod] = useState<'manual' | 'ai' | 'human'>('manual');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    projectDescription: '',
    budget: '',
    timeline: '',
    attachments: [] as File[]
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockOpportunity: Opportunity = {
      id: opportunityId || '',
      title: 'Community Health Initiative Grant',
      organization: 'Global Health Foundation',
      amount: '$50,000 - $100,000',
      deadline: '2024-03-15',
      location: 'East Africa',
      type: 'Health & Medical',
      description: 'Supporting community-based health programs to improve access to healthcare in underserved communities.',
      requirements: [
        'Registered NGO with health focus',
        'Minimum 3 years operational experience',
        'Community partnerships established',
        'Clear health impact metrics'
      ],
      applicationProcess: [
        'Submit online application form',
        'Provide detailed project proposal',
        'Include organizational documents',
        'Submit budget breakdown',
        'Complete due diligence review'
      ]
    };
    
    setOpportunity(mockOpportunity);
    setLoading(false);
  }, [opportunityId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setApplicationData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...files]
      }));
    }
  };

  const removeFile = (index: number) => {
    setApplicationData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitApplication = async () => {
    setApplying(true);
    
    try {
      const formData = new FormData();
      formData.append('opportunityId', opportunityId || '');
      formData.append('method', applicationMethod);
      formData.append('coverLetter', applicationData.coverLetter);
      formData.append('projectDescription', applicationData.projectDescription);
      formData.append('budget', applicationData.budget);
      formData.append('timeline', applicationData.timeline);
      
      applicationData.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });

      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Success - redirect to applications dashboard
        setTimeout(() => {
          navigate('/applications');
        }, 2000);
      }
    } catch (error) {
      console.error('Application submission failed:', error);
    } finally {
      setApplying(false);
    }
  };

  const handleAIApplication = () => {
    // Navigate to AI-powered application flow
    navigate(`/apply/${opportunityId}/ai-writer`);
  };

  const handleHumanHelp = () => {
    // Navigate to human expert assistance
    navigate(`/apply/${opportunityId}/human-help`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-400">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Opportunity Not Found</h2>
          <p className="text-slate-400 mb-4">The requested funding opportunity could not be found.</p>
          <Link href="/opportunities">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg">
              Browse Opportunities
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/opportunities">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Opportunities
              </motion.button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Apply for Funding</h1>
              <p className="text-slate-400">{opportunity.title}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Your Credits</p>
            <p className="text-2xl font-bold text-yellow-300">{user?.creditBalance || 0}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Application Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Method Selection */}
            <div className="bg-slate-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Choose Application Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Manual Application */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setApplicationMethod('manual')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    applicationMethod === 'manual'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <FileText className="w-8 h-8 text-slate-400 mb-3" />
                  <h3 className="font-semibold mb-2">Manual Application</h3>
                  <p className="text-sm text-slate-400">Create your application manually with our guided form</p>
                  <div className="mt-3 text-xs text-green-400 font-medium">FREE</div>
                </motion.div>

                {/* AI-Powered Application */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setApplicationMethod('ai')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    applicationMethod === 'ai'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <Sparkles className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="font-semibold mb-2">AI Writer</h3>
                  <p className="text-sm text-slate-400">Let AI generate a professional application for you</p>
                  <div className="mt-3 text-xs text-yellow-400 font-medium">25 CREDITS</div>
                </motion.div>

                {/* Human Expert Help */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setApplicationMethod('human')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    applicationMethod === 'human'
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <User className="w-8 h-8 text-emerald-400 mb-3" />
                  <h3 className="font-semibold mb-2">Expert Help</h3>
                  <p className="text-sm text-slate-400">Get personalized assistance from funding experts</p>
                  <div className="mt-3 text-xs text-orange-400 font-medium">50 CREDITS</div>
                </motion.div>
              </div>
            </div>

            {/* Application Form (Manual Method) */}
            {applicationMethod === 'manual' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 rounded-xl p-6 space-y-6"
              >
                <h2 className="text-xl font-bold">Application Details</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Cover Letter</label>
                  <textarea
                    rows={4}
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Introduce your organization and explain why you're applying..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Description</label>
                  <textarea
                    rows={6}
                    value={applicationData.projectDescription}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, projectDescription: e.target.value }))}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your project in detail..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget Overview</label>
                    <textarea
                      rows={3}
                      value={applicationData.budget}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Provide a high-level budget breakdown..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Timeline</label>
                    <textarea
                      rows={3}
                      value={applicationData.timeline}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, timeline: e.target.value }))}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Project timeline and key milestones..."
                    />
                  </div>
                </div>

                {/* File Attachments */}
                <div>
                  <label className="block text-sm font-medium mb-2">Attachments</label>
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-400 mb-2">Drag files here or click to browse</p>
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg cursor-pointer text-sm">
                      Select Files
                    </label>
                  </div>
                  
                  {applicationData.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {applicationData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
                          <span className="text-sm">{file.name}</span>
                          <button 
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitApplication}
                  disabled={applying}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  {applying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* AI Application Method */}
            {applicationMethod === 'ai' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 rounded-xl p-6 text-center"
              >
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">AI-Powered Application</h2>
                <p className="text-slate-400 mb-6">
                  Our AI will analyze the opportunity requirements and your organization profile 
                  to generate a professional, tailored application automatically.
                </p>
                <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-purple-300 text-sm">
                    <Brain className="w-4 h-4" />
                    <span>AI will use your organization profile and past successful applications</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAIApplication}
                  className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
                >
                  <Zap className="w-4 h-4" />
                  Generate AI Application (25 Credits)
                </motion.button>
              </motion.div>
            )}

            {/* Human Help Method */}
            {applicationMethod === 'human' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 rounded-xl p-6 text-center"
              >
                <User className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Expert Assistance</h2>
                <p className="text-slate-400 mb-6">
                  Connect with experienced funding experts who will help you craft 
                  a winning application with personalized guidance and feedback.
                </p>
                <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-lg p-4 mb-6">
                  <div className="space-y-2 text-emerald-300 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>1-on-1 consultation call</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Professional application review</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Success rate improvement tips</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleHumanHelp}
                  className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
                >
                  <User className="w-4 h-4" />
                  Get Expert Help (50 Credits)
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Opportunity Summary Sidebar */}
          <div className="space-y-6">
            {/* Opportunity Details */}
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Opportunity Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Funding Amount</p>
                    <p className="text-slate-400 text-sm">{opportunity.amount}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Application Deadline</p>
                    <p className="text-slate-400 text-sm">{new Date(opportunity.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-slate-400 text-sm">{opportunity.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Requirements</h3>
              <ul className="space-y-2">
                {opportunity.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Application Process */}
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Application Process</h3>
              <ol className="space-y-2">
                {opportunity.applicationProcess.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-slate-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;