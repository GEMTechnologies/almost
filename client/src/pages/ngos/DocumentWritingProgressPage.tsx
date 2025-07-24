import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Users,
  Calendar,
  Edit3,
  Save,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Download,
  Share2
} from 'lucide-react';

interface WritingSession {
  id: string;
  date: string;
  duration: number;
  wordsWritten: number;
  sectionsCompleted: string[];
  status: 'active' | 'paused' | 'completed';
}

interface WritingGoal {
  id: string;
  title: string;
  targetWords: number;
  currentWords: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on_track' | 'behind' | 'completed' | 'overdue';
}

interface DocumentSection {
  id: string;
  title: string;
  wordCount: number;
  targetWords: number;
  status: 'not_started' | 'in_progress' | 'review' | 'completed';
  lastModified: string;
  assignedTo?: string;
}

const DocumentWritingProgressPage: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<WritingSession | null>(null);
  const [writingGoals, setWritingGoals] = useState<WritingGoal[]>([]);
  const [documentSections, setDocumentSections] = useState<DocumentSection[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [targetWords, setTargetWords] = useState(5000);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(500);
  const [todayWords, setTodayWords] = useState(0);

  useEffect(() => {
    loadWritingData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const loadWritingData = () => {
    // Mock writing goals
    setWritingGoals([
      {
        id: '1',
        title: 'Complete Introduction Section',
        targetWords: 800,
        currentWords: 650,
        deadline: '2024-01-25',
        priority: 'high',
        status: 'on_track'
      },
      {
        id: '2',
        title: 'Finish Policy Framework',
        targetWords: 1200,
        currentWords: 800,
        deadline: '2024-01-30',
        priority: 'medium',
        status: 'behind'
      },
      {
        id: '3',
        title: 'Draft Implementation Guidelines',
        targetWords: 1500,
        currentWords: 1500,
        deadline: '2024-01-22',
        priority: 'high',
        status: 'completed'
      }
    ]);

    // Mock document sections
    setDocumentSections([
      {
        id: '1',
        title: 'Executive Summary',
        wordCount: 450,
        targetWords: 500,
        status: 'review',
        lastModified: '2024-01-20T14:30:00Z',
        assignedTo: 'Sarah Johnson'
      },
      {
        id: '2',
        title: 'Introduction',
        wordCount: 650,
        targetWords: 800,
        status: 'in_progress',
        lastModified: '2024-01-20T16:45:00Z',
        assignedTo: 'Current User'
      },
      {
        id: '3',
        title: 'Policy Framework',
        wordCount: 800,
        targetWords: 1200,
        status: 'in_progress',
        lastModified: '2024-01-19T11:20:00Z',
        assignedTo: 'Michael Chen'
      },
      {
        id: '4',
        title: 'Implementation Guidelines',
        wordCount: 1500,
        targetWords: 1500,
        status: 'completed',
        lastModified: '2024-01-18T09:15:00Z',
        assignedTo: 'Emma Wilson'
      },
      {
        id: '5',
        title: 'Monitoring & Evaluation',
        wordCount: 0,
        targetWords: 600,
        status: 'not_started',
        lastModified: '',
        assignedTo: 'David Kim'
      }
    ]);

    // Calculate totals
    const total = documentSections.reduce((sum, section) => sum + section.wordCount, 0);
    setTotalWords(total);
    setTodayWords(450); // Mock today's words
  };

  const startSession = () => {
    const newSession: WritingSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: 0,
      wordsWritten: 0,
      sectionsCompleted: [],
      status: 'active'
    };
    setCurrentSession(newSession);
    setIsSessionActive(true);
    setSessionTimer(0);
  };

  const pauseSession = () => {
    setIsSessionActive(false);
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        status: 'paused',
        duration: sessionTimer
      });
    }
  };

  const endSession = () => {
    setIsSessionActive(false);
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        status: 'completed',
        duration: sessionTimer
      });
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-900/30 text-green-400 border-green-500/30';
      case 'on_track': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
      case 'behind': return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30';
      case 'overdue': return 'bg-red-900/30 text-red-400 border-red-500/30';
      case 'in_progress': return 'bg-purple-900/30 text-purple-400 border-purple-500/30';
      case 'review': return 'bg-orange-900/30 text-orange-400 border-orange-500/30';
      case 'not_started': return 'bg-gray-900/30 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const overallProgress = (totalWords / targetWords) * 100;
  const dailyProgress = (todayWords / dailyGoal) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/ngos/documents">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Documents
              </motion.button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Edit3 className="w-8 h-8 text-blue-400" />
                Writing Progress
              </h1>
              <p className="text-slate-400">Child Protection Policy v3.2</p>
            </div>
          </div>
          
          {/* Session Controls */}
          <div className="flex items-center gap-4">
            {!isSessionActive && !currentSession && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startSession}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Writing
              </motion.button>
            )}
            {isSessionActive && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={pauseSession}
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause
              </motion.button>
            )}
            {currentSession && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={endSession}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                End Session
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Current Session */}
        {currentSession && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 mb-6 border border-blue-500/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-400 mb-2">Active Writing Session</h2>
                <div className="flex items-center gap-6 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(sessionTimer)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    <span>{currentSession.wordsWritten} words</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(currentSession.status)}`}>
                    {currentSession.status.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-400">{formatTime(sessionTimer)}</div>
                <div className="text-sm text-slate-400">Session Time</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold">Overall Progress</h3>
                <p className="text-sm text-slate-400">{totalWords} / {targetWords} words</p>
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(overallProgress, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{overallProgress.toFixed(1)}% complete</span>
              <span className="text-blue-400 font-medium">
                {targetWords - totalWords} words remaining
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-bold">Today's Goal</h3>
                <p className="text-sm text-slate-400">{todayWords} / {dailyGoal} words</p>
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(dailyProgress, 100)}%` }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{dailyProgress.toFixed(1)}% of daily goal</span>
              <span className={`font-medium ${dailyProgress >= 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                {dailyProgress >= 100 ? 'Goal reached!' : `${dailyGoal - todayWords} words to go`}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold">Writing Streak</h3>
                <p className="text-sm text-slate-400">Keep up the momentum!</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">7</div>
              <div className="text-sm text-slate-400">Days in a row</div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Writing Goals */}
          <div className="bg-slate-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Writing Goals
            </h2>
            
            <div className="space-y-4">
              {writingGoals.map((goal) => {
                const progress = (goal.currentWords / goal.targetWords) * 100;
                
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-800 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{goal.title}</h3>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(goal.status)}`}>
                          {goal.status.replace('_', ' ').toUpperCase()}
                        </div>
                        <div className={`text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                          {goal.priority.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full ${
                          goal.status === 'completed' ? 'bg-green-500' :
                          goal.status === 'behind' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>{goal.currentWords} / {goal.targetWords} words</span>
                      <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Document Sections */}
          <div className="bg-slate-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-400" />
              Document Sections
            </h2>
            
            <div className="space-y-3">
              {documentSections.map((section) => {
                const progress = section.targetWords > 0 ? (section.wordCount / section.targetWords) * 100 : 0;
                
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{section.title}</h3>
                      <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(section.status)}`}>
                        {section.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full ${
                          section.status === 'completed' ? 'bg-green-500' :
                          section.status === 'in_progress' ? 'bg-blue-500' :
                          section.status === 'review' ? 'bg-orange-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{section.wordCount} / {section.targetWords} words</span>
                      {section.assignedTo && <span>Assigned to: {section.assignedTo}</span>}
                    </div>
                    
                    {section.lastModified && (
                      <div className="text-xs text-slate-500 mt-1">
                        Last modified: {new Date(section.lastModified).toLocaleString()}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-slate-900 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm"
            >
              <Edit3 className="w-4 h-4" />
              Continue Writing
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm"
            >
              <Eye className="w-4 h-4" />
              Review Draft
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share Progress
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-orange-600 hover:bg-orange-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Export Report
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentWritingProgressPage;