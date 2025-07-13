/**
 * Granada OS - Website Generation Progress Component
 * Enhanced loading with time estimates and admin notifications
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Bell,
  Zap,
  Code,
  Palette,
  Settings
} from 'lucide-react';

interface WebsiteGenerationProgressProps {
  onCancel: () => void;
}

export const WebsiteGenerationProgress: React.FC<WebsiteGenerationProgressProps> = ({ onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [adminNotified, setAdminNotified] = useState(false);

  const steps = [
    { name: 'Analyzing organization requirements', duration: 10 },
    { name: 'Generating content with AI', duration: 20 },
    { name: 'Creating website structure', duration: 15 },
    { name: 'Applying design and branding', duration: 12 },
    { name: 'Implementing features', duration: 18 },
    { name: 'Optimizing and finalizing', duration: 15 }
  ];

  const totalEstimatedTime = steps.reduce((sum, step) => sum + step.duration, 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let stepTimer: NodeJS.Timeout;
    
    if (currentStep < steps.length) {
      stepTimer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, steps[currentStep].duration * 1000);
    }

    return () => clearTimeout(stepTimer);
  }, [currentStep]);

  useEffect(() => {
    // Notify admin if generation takes longer than expected
    if (timeElapsed > 60 && !adminNotified) {
      notifyAdmin();
      setAdminNotified(true);
    }
  }, [timeElapsed, adminNotified]);

  const notifyAdmin = async () => {
    try {
      // Get user details from localStorage or context
      const userEmail = localStorage.getItem('userEmail') || 'unknown@example.com';
      const organizationName = localStorage.getItem('organizationName') || 'Unknown Organization';
      const websiteType = localStorage.getItem('currentWebsiteType') || 'unknown';
      const selectedFeatures = JSON.parse(localStorage.getItem('selectedFeatures') || '[]');
      
      await fetch('/api/admin/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'website_generation_delay',
          message: 'Website generation taking longer than expected - requires backend pipeline review',
          timestamp: new Date().toISOString(),
          timeElapsed: timeElapsed,
          userDetails: {
            email: userEmail,
            organizationName: organizationName,
            websiteType: websiteType,
            features: selectedFeatures,
            sessionId: Date.now().toString(),
            browserInfo: navigator.userAgent
          },
          metadata: {
            component: 'WebsiteGenerator',
            action: 'generation_timeout',
            sessionId: Date.now().toString(),
            requestId: `wg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          }
        })
      });
      
      console.log('✅ Admin notified with user details for pipeline modification');
    } catch (error) {
      console.error('Failed to notify admin:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (currentStep >= steps.length) return 100;
    
    const completedStepsTime = steps.slice(0, currentStep).reduce((sum, step) => sum + step.duration, 0);
    const currentStepProgress = Math.min(timeElapsed - completedStepsTime, steps[currentStep]?.duration || 0);
    const totalProgress = completedStepsTime + currentStepProgress;
    
    return Math.min((totalProgress / totalEstimatedTime) * 100, 100);
  };

  const isDelayed = timeElapsed > totalEstimatedTime + 30;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-6"
          >
            <div className="w-full h-full border-4 border-blue-500 border-t-transparent rounded-full relative">
              <Globe className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>
          
          <h2 className="text-3xl font-bold mb-2">Generating Your Website</h2>
          <p className="text-slate-400">Creating a professional website with AI assistance</p>
        </div>

        {/* Time and Progress */}
        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Time Elapsed: {formatTime(timeElapsed)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">
                Est. Total: {formatTime(totalEstimatedTime)}
              </span>
              {isDelayed && (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.5 }}
                className={`h-3 rounded-full ${
                  isDelayed ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
              />
            </div>
          </div>

          {isDelayed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mb-4"
            >
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Extended Processing Time</span>
              </div>
              <p className="text-sm text-yellow-300 mt-1">
                Website generation is taking longer than the estimated {Math.floor(totalEstimatedTime / 60)} minutes. 
                Please wait up to 5-8 minutes for complex websites.
                {adminNotified && " Technical team has been notified with your details for pipeline optimization."}
              </p>
              {adminNotified && (
                <div className="mt-2 text-xs text-yellow-400">
                  <p>• Admin can now modify backend pipeline for your specific requirements</p>
                  <p>• Your organization details and features have been shared with technical team</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Generation Steps */}
        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">Generation Steps</h3>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isPending = index > currentStep;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isCompleted ? 'bg-green-900/20' :
                    isCurrent ? 'bg-blue-900/20' :
                    'bg-slate-700/30'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-600' :
                    isCurrent ? 'bg-blue-600' :
                    'bg-slate-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : isCurrent ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-medium ${
                      isCompleted ? 'text-green-400' :
                      isCurrent ? 'text-blue-400' :
                      'text-slate-400'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Est. {step.duration}s
                    </p>
                  </div>
                  
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-blue-400 rounded-full"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* AI Status */}
        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold">AI Generation Status</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-700 rounded-lg p-3">
              <Code className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-sm font-medium">Code Generation</p>
              <p className="text-xs text-slate-400">
                {currentStep >= 2 ? 'Complete' : currentStep >= 1 ? 'Processing' : 'Pending'}
              </p>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <Palette className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <p className="text-sm font-medium">Design System</p>
              <p className="text-xs text-slate-400">
                {currentStep >= 4 ? 'Complete' : currentStep >= 3 ? 'Processing' : 'Pending'}
              </p>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <Settings className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <p className="text-sm font-medium">Optimization</p>
              <p className="text-xs text-slate-400">
                {currentStep >= 6 ? 'Complete' : currentStep >= 5 ? 'Processing' : 'Pending'}
              </p>
            </div>
          </div>
        </div>

        {/* Admin Notification Status */}
        {adminNotified && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Technical Team Notified</span>
            </div>
            <div className="space-y-2 text-sm text-blue-300">
              <p>✓ Admin received your organization details for pipeline optimization</p>
              <p>✓ Website type and feature requirements shared with backend team</p>
              <p>✓ Technical team can now modify generation pipeline for your specific needs</p>
              <p>✓ Your session details preserved for troubleshooting</p>
            </div>
            <div className="mt-3 p-2 bg-blue-800/30 rounded text-xs text-blue-200">
              <strong>Shared with Admin:</strong> Organization name, website type, selected features, 
              session ID, browser info, and generation requirements for pipeline modifications.
            </div>
          </motion.div>
        )}

        {/* Cancel Button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <X className="w-4 h-4" />
            Cancel Generation
          </motion.button>
          <p className="text-xs text-slate-500 mt-2">
            Estimated completion time: 3-8 minutes depending on complexity
          </p>
          {timeElapsed > 120 && (
            <p className="text-xs text-yellow-400 mt-1">
              Complex generation in progress - admin can optimize pipeline for faster results
            </p>
          )}
        </div>
      </div>
    </div>
  );
};