import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'wouter';
import {
  ArrowLeft,
  Share2,
  Mail,
  MessageSquare,
  Copy,
  Users,
  Eye,
  Download,
  Calendar,
  Lock,
  Unlock,
  UserPlus,
  Send,
  Globe,
  FileText,
  CheckCircle,
  X
} from 'lucide-react';

interface SharedUser {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'editor' | 'admin';
  lastAccessed: string;
  status: 'active' | 'pending' | 'expired';
}

interface ShareActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details: string;
}

const DocumentSharingPage: React.FC = () => {
  const { documentId } = useParams();
  const [documentName, setDocumentName] = useState('Child Protection Policy v3.2');
  const [shareLink, setShareLink] = useState('');
  const [sharePassword, setSharePassword] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [shareSettings, setShareSettings] = useState({
    allowDownload: true,
    allowComments: true,
    requireSignIn: false,
    notifyOnAccess: true
  });
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [shareActivity, setShareActivity] = useState<ShareActivity[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'viewer' | 'editor' | 'admin'>('viewer');
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    // Generate share link
    const baseUrl = window.location.origin;
    const linkId = `doc_${documentId}_${Date.now()}`;
    setShareLink(`${baseUrl}/shared/${linkId}`);

    // Mock shared users data
    setSharedUsers([
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@ngo.org',
        role: 'editor',
        lastAccessed: '2024-01-20T10:30:00Z',
        status: 'active'
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael@partner.org',
        role: 'viewer',
        lastAccessed: '2024-01-19T14:15:00Z',
        status: 'active'
      },
      {
        id: '3',
        name: 'Emma Wilson',
        email: 'emma@consultant.com',
        role: 'viewer',
        lastAccessed: '2024-01-18T09:45:00Z',
        status: 'pending'
      }
    ]);

    // Mock activity data
    setShareActivity([
      {
        id: '1',
        user: 'Sarah Johnson',
        action: 'Downloaded document',
        timestamp: '2024-01-20T10:30:00Z',
        details: 'Downloaded PDF version'
      },
      {
        id: '2',
        user: 'Michael Chen',
        action: 'Viewed document',
        timestamp: '2024-01-19T14:15:00Z',
        details: 'Accessed via shared link'
      },
      {
        id: '3',
        user: 'Emma Wilson',
        action: 'Invited to view',
        timestamp: '2024-01-18T09:45:00Z',
        details: 'Invitation sent via email'
      }
    ]);
  }, [documentId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const inviteUser = () => {
    if (!newUserEmail) return;
    
    const newUser: SharedUser = {
      id: Date.now().toString(),
      name: newUserEmail.split('@')[0],
      email: newUserEmail,
      role: newUserRole,
      lastAccessed: new Date().toISOString(),
      status: 'pending'
    };
    
    setSharedUsers(prev => [...prev, newUser]);
    setNewUserEmail('');
    setShowInviteModal(false);
  };

  const removeUser = (userId: string) => {
    setSharedUsers(prev => prev.filter(user => user.id !== userId));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-900/30 text-red-400 border-red-500/30';
      case 'editor': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
      case 'viewer': return 'bg-green-900/30 text-green-400 border-green-500/30';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'expired': return 'text-red-400';
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
                <Share2 className="w-8 h-8 text-blue-400" />
                Document Sharing
              </h1>
              <p className="text-slate-400">{documentName}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInviteModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Invite People
          </motion.button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Sharing Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Share Link */}
            <div className="bg-slate-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Share Link
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(shareLink)}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </motion.button>
                </div>

                {/* Share Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Password Protection</label>
                    <input
                      type="password"
                      value={sharePassword}
                      onChange={(e) => setSharePassword(e.target.value)}
                      placeholder="Optional password"
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg"
                    />
                  </div>
                </div>

                {/* Permission Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareSettings.allowDownload}
                      onChange={(e) => setShareSettings(prev => ({...prev, allowDownload: e.target.checked}))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Allow Download</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareSettings.allowComments}
                      onChange={(e) => setShareSettings(prev => ({...prev, allowComments: e.target.checked}))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Allow Comments</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareSettings.requireSignIn}
                      onChange={(e) => setShareSettings(prev => ({...prev, requireSignIn: e.target.checked}))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Require Sign-in</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareSettings.notifyOnAccess}
                      onChange={(e) => setShareSettings(prev => ({...prev, notifyOnAccess: e.target.checked}))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Notify on Access</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Shared Users */}
            <div className="bg-slate-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                Shared With ({sharedUsers.length})
              </h2>
              
              <div className="space-y-3">
                {sharedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role.toUpperCase()}
                      </div>
                      <div className={`text-xs ${getStatusColor(user.status)}`}>
                        {user.status}
                      </div>
                      <button
                        onClick={() => removeUser(user.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Activity */}
            <div className="bg-slate-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-400" />
                Recent Activity
              </h2>
              
              <div className="space-y-3">
                {shareActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{activity.details}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Email Link
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Share via Message
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Share Report
                </motion.button>
              </div>
            </div>

            {/* Share Statistics */}
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Share Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Views</span>
                  <span className="font-bold">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Downloads</span>
                  <span className="font-bold">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Comments</span>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shared Users</span>
                  <span className="font-bold">{sharedUsers.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite User Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-4">Invite People</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as 'viewer' | 'editor' | 'admin')}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="viewer">Viewer - Can view only</option>
                    <option value="editor">Editor - Can view and edit</option>
                    <option value="admin">Admin - Full access</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={inviteUser}
                  disabled={!newUserEmail}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Invitation
                </motion.button>
                <button
                  onClick={() => setShowInviteModal(false)}
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

export default DocumentSharingPage;