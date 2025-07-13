/**
 * Granada OS - Document Collaboration Hub
 * Advanced collaboration center with real-time features
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Bell, 
  Activity,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  Filter,
  Search,
  Plus,
  X,
  Edit,
  Share2,
  GitBranch,
  Download,
  Eye
} from 'lucide-react';

interface CollaborationActivity {
  id: string;
  type: 'comment' | 'edit' | 'share' | 'upload' | 'approve' | 'review';
  documentId: string;
  documentName: string;
  user: string;
  action: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
}

interface CollaborationNotification {
  id: string;
  type: 'mention' | 'approval_needed' | 'deadline' | 'share_received';
  title: string;
  message: string;
  documentId?: string;
  documentName?: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface DocumentCollaborationHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentCollaborationHub: React.FC<DocumentCollaborationHubProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'notifications' | 'team'>('activity');
  const [activities, setActivities] = useState<CollaborationActivity[]>([]);
  const [notifications, setNotifications] = useState<CollaborationNotification[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'comment' | 'edit' | 'share'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  useEffect(() => {
    if (isOpen) {
      setActivities([
        {
          id: '1',
          type: 'comment',
          documentId: 'doc1',
          documentName: 'Child Protection Policy',
          user: 'Dr. Sarah Johnson',
          action: 'Added a comment on section 3.2',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          priority: 'medium'
        },
        {
          id: '2',
          type: 'edit',
          documentId: 'doc2',
          documentName: 'Financial Procedures Manual',
          user: 'James Wilson',
          action: 'Updated budget allocation guidelines',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          priority: 'high'
        },
        {
          id: '3',
          type: 'share',
          documentId: 'doc3',
          documentName: 'Staff Code of Conduct',
          user: 'Maria Rodriguez',
          action: 'Shared with external partner',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          priority: 'low'
        },
        {
          id: '4',
          type: 'approve',
          documentId: 'doc4',
          documentName: 'Risk Assessment Framework',
          user: 'Ahmed Hassan',
          action: 'Approved for publication',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          priority: 'high'
        },
        {
          id: '5',
          type: 'upload',
          documentId: 'doc5',
          documentName: 'Board Meeting Minutes',
          user: 'Lisa Chen',
          action: 'Uploaded new version 2.1',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          priority: 'medium'
        }
      ]);

      setNotifications([
        {
          id: '1',
          type: 'approval_needed',
          title: 'Document Approval Required',
          message: 'Child Protection Policy v3.2 needs your approval before publication',
          documentId: 'doc1',
          documentName: 'Child Protection Policy',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          isRead: false,
          priority: 'high'
        },
        {
          id: '2',
          type: 'mention',
          title: 'You were mentioned',
          message: 'Dr. Sarah Johnson mentioned you in Financial Procedures Manual',
          documentId: 'doc2',
          documentName: 'Financial Procedures Manual',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          isRead: false,
          priority: 'medium'
        },
        {
          id: '3',
          type: 'deadline',
          title: 'Document Review Deadline',
          message: 'Staff Code of Conduct review deadline is tomorrow',
          documentId: 'doc3',
          documentName: 'Staff Code of Conduct',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          isRead: true,
          priority: 'high'
        }
      ]);
    }
  }, [isOpen]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageSquare className="w-4 h-4" />;
      case 'edit': return <Edit className="w-4 h-4" />;
      case 'share': return <Share2 className="w-4 h-4" />;
      case 'upload': return <FileText className="w-4 h-4" />;
      case 'approve': return <CheckCircle className="w-4 h-4" />;
      case 'review': return <Eye className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'comment': return 'blue';
      case 'edit': return 'green';
      case 'share': return 'purple';
      case 'upload': return 'orange';
      case 'approve': return 'emerald';
      case 'review': return 'yellow';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filterType === 'all' || activity.type === filterType;
    const matchesSearch = searchQuery === '' || 
      activity.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-slate-800 rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Collaboration Hub</h2>
                <p className="text-slate-400">Real-time document collaboration and team activity</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'activity', label: 'Activity Feed', icon: Activity },
              { id: 'notifications', label: `Notifications ${unreadNotificationsCount > 0 ? `(${unreadNotificationsCount})` : ''}`, icon: Bell },
              { id: 'team', label: 'Team Members', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Activity Feed Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search activities..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Activities</option>
                  <option value="comment">Comments</option>
                  <option value="edit">Edits</option>
                  <option value="share">Shares</option>
                  <option value="upload">Uploads</option>
                  <option value="approve">Approvals</option>
                </select>
              </div>

              {/* Activities List */}
              <div className="space-y-4">
                {filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-700 border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 bg-${getActivityColor(activity.type)}-600 rounded-lg`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">{activity.user}</span>
                            <span className={`px-2 py-1 bg-${getPriorityColor(activity.priority)}-600 text-white text-xs rounded-full`}>
                              {activity.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-slate-300 mb-2">{activity.action}</p>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <FileText className="w-3 h-3" />
                            <span>{activity.documentName}</span>
                            <Clock className="w-3 h-3 ml-2" />
                            <span>{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                          title="View Document"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredActivities.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No activities found</p>
                    <p className="text-sm">Try adjusting your filters or search terms</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 transition-colors ${
                    notification.isRead 
                      ? 'border-slate-600 bg-slate-700/50' 
                      : 'border-blue-500 bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-white">{notification.title}</h3>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                        <span className={`px-2 py-1 bg-${getPriorityColor(notification.priority)}-600 text-white text-xs rounded-full`}>
                          {notification.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-300 mb-3">{notification.message}</p>
                      {notification.documentName && (
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                          <FileText className="w-3 h-3" />
                          <span>{notification.documentName}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(notification.timestamp)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.isRead && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setNotifications(prev => 
                              prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
                            );
                          }}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                        >
                          Mark Read
                        </motion.button>
                      )}
                      {notification.documentId && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg"
                          title="View Document"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {notifications.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications</p>
                  <p className="text-sm">You're all caught up!</p>
                </div>
              )}
            </div>
          )}

          {/* Team Members Tab */}
          {activeTab === 'team' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Dr. Sarah Johnson', role: 'Director', status: 'online', lastActive: 'Active now' },
                { name: 'James Wilson', role: 'Manager', status: 'online', lastActive: '5 minutes ago' },
                { name: 'Maria Rodriguez', role: 'Coordinator', status: 'away', lastActive: '2 hours ago' },
                { name: 'Ahmed Hassan', role: 'Officer', status: 'offline', lastActive: '1 day ago' },
                { name: 'Lisa Chen', role: 'Assistant', status: 'online', lastActive: 'Active now' }
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-700 border border-slate-600 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-700 ${
                        member.status === 'online' ? 'bg-green-500' : 
                        member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{member.name}</h3>
                      <p className="text-sm text-slate-400">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">
                    <span>{member.lastActive}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};