import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Edit3,
  Clock,
  FileText,
  User,
  Plus,
  Send,
  Eye,
  CheckCircle,
  AlertCircle,
  Calendar,
  Bell,
  Search,
  Filter
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  resolved: boolean;
  replies: Comment[];
  position?: { page: number; x: number; y: number };
}

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'reviewer' | 'viewer';
  status: 'online' | 'offline' | 'away';
  lastActive: string;
  avatar?: string;
}

interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  description: string;
}

const DocumentCollaborationPage: React.FC = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newTask, setNewTask] = useState({ title: '', assignee: '', dueDate: '', priority: 'medium' as const });
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [activeTab, setActiveTab] = useState('comments');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data
    setCollaborators([
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@ngo.org',
        role: 'owner',
        status: 'online',
        lastActive: '2024-01-20T10:30:00Z'
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael@partner.org',
        role: 'editor',
        status: 'online',
        lastActive: '2024-01-20T10:25:00Z'
      },
      {
        id: '3',
        name: 'Emma Wilson',
        email: 'emma@consultant.com',
        role: 'reviewer',
        status: 'away',
        lastActive: '2024-01-20T09:45:00Z'
      },
      {
        id: '4',
        name: 'David Kim',
        email: 'david@legal.org',
        role: 'viewer',
        status: 'offline',
        lastActive: '2024-01-19T16:20:00Z'
      }
    ]);

    setComments([
      {
        id: '1',
        author: 'Sarah Johnson',
        content: 'This section needs to be updated with the new regulatory requirements from 2024.',
        timestamp: '2024-01-20T10:30:00Z',
        resolved: false,
        replies: [
          {
            id: '1a',
            author: 'Michael Chen',
            content: 'I can work on this update. Do you have the specific requirements document?',
            timestamp: '2024-01-20T10:35:00Z',
            resolved: false,
            replies: []
          }
        ]
      },
      {
        id: '2',
        author: 'Emma Wilson',
        content: 'The contact information in section 4.2 appears to be outdated.',
        timestamp: '2024-01-20T09:45:00Z',
        resolved: true,
        replies: []
      },
      {
        id: '3',
        author: 'David Kim',
        content: 'From a legal perspective, we should add a disclaimer about jurisdiction-specific variations.',
        timestamp: '2024-01-19T16:20:00Z',
        resolved: false,
        replies: []
      }
    ]);

    setTasks([
      {
        id: '1',
        title: 'Update regulatory compliance section',
        assignee: 'Michael Chen',
        dueDate: '2024-01-25',
        status: 'in_progress',
        priority: 'high',
        description: 'Update section 3 with new 2024 regulatory requirements'
      },
      {
        id: '2',
        title: 'Review contact information',
        assignee: 'Sarah Johnson',
        dueDate: '2024-01-22',
        status: 'completed',
        priority: 'medium',
        description: 'Verify and update all contact details throughout the document'
      },
      {
        id: '3',
        title: 'Add legal disclaimer',
        assignee: 'David Kim',
        dueDate: '2024-01-30',
        status: 'pending',
        priority: 'low',
        description: 'Add jurisdiction-specific disclaimer section'
      }
    ]);
  }, []);

  const addComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Current User',
      content: newComment,
      timestamp: new Date().toISOString(),
      resolved: false,
      replies: []
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const addTask = () => {
    if (!newTask.title.trim() || !newTask.assignee) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
      status: 'pending',
      priority: newTask.priority,
      description: ''
    };
    
    setTasks(prev => [task, ...prev]);
    setNewTask({ title: '', assignee: '', dueDate: '', priority: 'medium' });
    setShowNewTaskModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-900/30 text-green-400 border-green-500/30';
      case 'in_progress': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
      case 'overdue': return 'bg-red-900/30 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30';
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
                <Users className="w-8 h-8 text-purple-400" />
                Collaboration Hub
              </h1>
              <p className="text-slate-400">Child Protection Policy v3.2</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {collaborators.slice(0, 4).map((collaborator) => (
                <div key={collaborator.id} className="relative">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold border-2 border-slate-900">
                    {collaborator.name.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(collaborator.status)} rounded-full border-2 border-slate-900`} />
                </div>
              ))}
              {collaborators.length > 4 && (
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-medium border-2 border-slate-900">
                  +{collaborators.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-slate-900 rounded-xl p-2">
              <div className="flex gap-2">
                {[
                  { id: 'comments', label: 'Comments', icon: MessageSquare, count: comments.filter(c => !c.resolved).length },
                  { id: 'tasks', label: 'Tasks', icon: CheckCircle, count: tasks.filter(t => t.status !== 'completed').length },
                  { id: 'activity', label: 'Activity', icon: Clock, count: 0 }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count > 0 && (
                      <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {tab.count}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="space-y-4">
                {/* Add Comment */}
                <div className="bg-slate-900 rounded-xl p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                      U
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <div className="flex justify-end mt-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addComment}
                          disabled={!newComment.trim()}
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Comment
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-slate-900 rounded-xl p-6 ${comment.resolved ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                          {comment.author.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-xs text-slate-400">
                              {new Date(comment.timestamp).toLocaleString()}
                            </span>
                            {comment.resolved && (
                              <div className="flex items-center gap-1 text-green-400 text-xs">
                                <CheckCircle className="w-3 h-3" />
                                Resolved
                              </div>
                            )}
                          </div>
                          <p className="text-slate-300 mb-3">{comment.content}</p>
                          
                          {/* Replies */}
                          {comment.replies.length > 0 && (
                            <div className="ml-6 border-l-2 border-slate-800 pl-4 space-y-3">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                    {reply.author.charAt(0)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-sm">{reply.author}</span>
                                      <span className="text-xs text-slate-400">
                                        {new Date(reply.timestamp).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-300">{reply.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-3 mt-3 text-sm">
                            <button className="text-slate-400 hover:text-white">Reply</button>
                            {!comment.resolved && (
                              <button className="text-green-400 hover:text-green-300">Mark Resolved</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div className="space-y-4">
                {/* Add Task Button */}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewTaskModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Task
                  </motion.button>
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-900 rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{task.title}</h3>
                            <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                              {task.status.replace('_', ' ').toUpperCase()}
                            </div>
                            <div className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority.toUpperCase()}
                            </div>
                          </div>
                          {task.description && (
                            <p className="text-sm text-slate-400 mb-3">{task.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {task.assignee}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="bg-slate-900 rounded-xl p-6">
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-400 mb-2">Activity Feed</h3>
                  <p className="text-slate-500">Recent collaboration activity will appear here</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Collaborators */}
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Collaborators ({collaborators.length})</h3>
              <div className="space-y-3">
                {collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {collaborator.name.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(collaborator.status)} rounded-full border border-slate-900`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{collaborator.name}</p>
                      <p className="text-xs text-slate-400">{collaborator.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Open Comments</span>
                  <span className="font-bold">{comments.filter(c => !c.resolved).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pending Tasks</span>
                  <span className="font-bold">{tasks.filter(t => t.status === 'pending').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Users</span>
                  <span className="font-bold">{collaborators.filter(c => c.status === 'online').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      <AnimatePresence>
        {showNewTaskModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-4">Create New Task</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Task Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Assignee</label>
                  <select
                    value={newTask.assignee}
                    onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select assignee</option>
                    {collaborators.map((collaborator) => (
                      <option key={collaborator.id} value={collaborator.name}>
                        {collaborator.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addTask}
                  disabled={!newTask.title || !newTask.assignee}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg"
                >
                  Create Task
                </motion.button>
                <button
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentCollaborationPage;