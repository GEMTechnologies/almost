/**
 * Granada OS - Document Writing Progress Component
 * Shows real-time progress of document generation with admin notifications
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  User, 
  CreditCard,
  Loader2,
  Download,
  Eye
} from 'lucide-react';

interface WritingProgress {
  jobId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  estimatedDuration: number;
  estimatedCompletion: Date;
  message: string;
}

interface DocumentWritingProgressProps {
  jobId: string;
  onComplete?: (jobId: string) => void;
  onClose?: () => void;
}

export const DocumentWritingProgress: React.FC<DocumentWritingProgressProps> = ({
  jobId,
  onComplete,
  onClose
}) => {
  const [progress, setProgress] = useState<WritingProgress | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Fetch progress data
  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/document-writing/progress/${jobId}`);
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
        
        if (data.status === 'completed' && onComplete) {
          onComplete(jobId);
        }
      } else {
        setError('Failed to fetch progress');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  // Update time remaining
  const updateTimeRemaining = () => {
    if (progress?.estimatedCompletion) {
      const now = new Date();
      const completion = new Date(progress.estimatedCompletion);
      const diffMs = completion.getTime() - now.getTime();
      
      if (diffMs > 0) {
        const minutes = Math.floor(diffMs / 60000);
        const seconds = Math.floor((diffMs % 60000) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeRemaining('Any moment now...');
      }
    }
  };

  useEffect(() => {
    fetchProgress();
    const progressInterval = setInterval(fetchProgress, 2000); // Check every 2 seconds
    const timeInterval = setInterval(updateTimeRemaining, 1000); // Update time every second

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, [jobId]);

  useEffect(() => {
    updateTimeRemaining();
  }, [progress]);

  const getStatusIcon = () => {
    switch (progress?.status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-400" />;
      case 'in_progress':
        return <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      default:
        return <FileText className="w-6 h-6 text-slate-400" />;
    }
  };

  const getStatusColor = () => {
    switch (progress?.status) {
      case 'pending': return 'yellow';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'failed': return 'red';
      default: return 'slate';
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-red-500">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Error</h3>
          </div>
          <p className="text-slate-300 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    );
  }

  if (!progress) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div className="bg-slate-800 rounded-2xl p-8">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
          <p className="text-white mt-4">Loading progress...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 max-w-lg w-full border border-slate-700 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: progress.status === 'in_progress' ? 360 : 0 }}
              transition={{ duration: 2, repeat: progress.status === 'in_progress' ? Infinity : 0 }}
            >
              {getStatusIcon()}
            </motion.div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">System Document Writer</h3>
              <p className="text-slate-400">Professional document generation in progress</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Progress</span>
              <span className="text-sm font-bold text-white">{progress.progress}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r from-${getStatusColor()}-500 to-${getStatusColor()}-600 rounded-full`}
                initial={{ width: '0%' }}
                animate={{ width: `${progress.progress || 0}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Status Message */}
          <motion.div
            key={progress.message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-700/50 rounded-lg p-4 mb-6"
          >
            <p className="text-white font-medium">{progress.message}</p>
          </motion.div>

          {/* Time Information */}
          {progress.status === 'in_progress' && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-sm text-slate-400">Estimated Time</div>
                <div className="text-white font-semibold">{progress.estimatedDuration} min</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                <Clock className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <div className="text-sm text-slate-400">Time Remaining</div>
                <div className="text-white font-semibold">{timeRemaining}</div>
              </div>
            </div>
          )}

          {/* Credit Information */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 mb-6 border border-blue-600/30">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm text-slate-400">Document Writing Cost</div>
                <div className="text-white font-semibold">50-80 Credits (Deducted automatically)</div>
              </div>
            </div>
          </div>

          {/* Admin Notification Status */}
          <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-sm text-slate-400">Admin Notification</div>
                <div className="text-white font-medium">
                  {progress.status === 'completed' ? 'Admin notified of completion' : 'Admin will be notified upon completion'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {progress.status === 'completed' ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  View Document
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </motion.button>
              </>
            ) : progress.status === 'failed' ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Close
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 px-4 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Minimize (Continue in background)
              </motion.button>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 text-center text-xs text-slate-500">
            Job ID: {jobId.slice(0, 8)}... • All activities logged for admin review
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};