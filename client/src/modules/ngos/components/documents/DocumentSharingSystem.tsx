/**
 * Granada OS - Document Sharing System
 * Advanced document sharing with permissions and access control
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  Users, 
  Shield, 
  Clock, 
  Eye,
  Download,
  Edit,
  Trash2,
  X,
  Mail,
  Link,
  QrCode,
  Calendar,
  UserPlus,
  Settings,
  AlertTriangle,
  CheckCircle,
  Copy
} from 'lucide-react';

interface ShareLink {
  id: string;
  documentId: string;
  documentName: string;
  shareType: 'internal' | 'external' | 'public';
  permissions: 'view' | 'download' | 'edit';
  sharedWith: {
    type: 'user' | 'team' | 'role' | 'email';
    identifier: string;
    name: string;
  }[];
  expiresAt?: Date;
  accessCount: number;
  maxAccess?: number;
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
  requiresAuth: boolean;
  allowDownload: boolean;
  trackAccess: boolean;
}

interface DocumentSharingProps {
  documentId: string;
  documentName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentSharingSystem: React.FC<DocumentSharingProps> = ({
  documentId,
  documentName,
  isOpen,
  onClose
}) => {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [newShare, setNewShare] = useState({
    shareType: 'internal' as 'internal' | 'external' | 'public',
    permissions: 'view' as 'view' | 'download' | 'edit',
    recipients: '',
    expiresIn: '7', // days
    requiresAuth: true,
    allowDownload: true,
    maxAccess: 0, // 0 = unlimited
    message: ''
  });
  const [activeTab, setActiveTab] = useState<'shares' | 'create' | 'analytics'>('shares');
  const [loading, setLoading] = useState(false);

  // Mock share data
  useEffect(() => {
    if (isOpen) {
      setShareLinks([
        {
          id: '1',
          documentId,
          documentName,
          shareType: 'internal',
          permissions: 'view',
          sharedWith: [
            { type: 'user', identifier: 'sarah.johnson', name: 'Dr. Sarah Johnson' },
            { type: 'team', identifier: 'policy-team', name: 'Policy Review Team' }
          ],
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          accessCount: 12,
          maxAccess: 50,
          createdBy: 'Current User',
          createdAt: new Date('2024-01-08'),
          isActive: true,
          requiresAuth: true,
          allowDownload: false,
          trackAccess: true
        },
        {
          id: '2',
          documentId,
          documentName,
          shareType: 'external',
          permissions: 'download',
          sharedWith: [
            { type: 'email', identifier: 'partner@example.org', name: 'External Partner' }
          ],
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          accessCount: 3,
          createdBy: 'Current User',
          createdAt: new Date('2024-01-10'),
          isActive: true,
          requiresAuth: false,
          allowDownload: true,
          trackAccess: true
        }
      ]);
    }
  }, [isOpen, documentId, documentName]);

  const createShareLink = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const recipients = newShare.recipients.split(',').map(r => r.trim()).filter(r => r);
      const newShareLink: ShareLink = {
        id: (shareLinks.length + 1).toString(),
        documentId,
        documentName,
        shareType: newShare.shareType,
        permissions: newShare.permissions,
        sharedWith: recipients.map(r => ({
          type: r.includes('@') ? 'email' : 'user',
          identifier: r,
          name: r.includes('@') ? 'External User' : r
        })),
        expiresAt: newShare.expiresIn !== '0' ? new Date(Date.now() + parseInt(newShare.expiresIn) * 24 * 60 * 60 * 1000) : undefined,
        accessCount: 0,
        maxAccess: newShare.maxAccess || undefined,
        createdBy: 'Current User',
        createdAt: new Date(),
        isActive: true,
        requiresAuth: newShare.requiresAuth,
        allowDownload: newShare.allowDownload,
        trackAccess: true
      };

      setShareLinks([newShareLink, ...shareLinks]);
      setActiveTab('shares');
      
      // Reset form
      setNewShare({
        shareType: 'internal',
        permissions: 'view',
        recipients: '',
        expiresIn: '7',
        requiresAuth: true,
        allowDownload: true,
        maxAccess: 0,
        message: ''
      });
    } catch (error) {
      console.error('Error creating share link:', error);
    } finally {
      setLoading(false);
    }
  };

  const revokeShare = async (shareId: string) => {
    try {
      setShareLinks(shareLinks.map(link => 
        link.id === shareId ? { ...link, isActive: false } : link
      ));
    } catch (error) {
      console.error('Error revoking share:', error);
    }
  };

  const copyShareLink = (shareId: string) => {
    const link = `https://granada-ngo.com/shared/${shareId}`;
    navigator.clipboard.writeText(link);
    alert('Share link copied to clipboard!');
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'view': return <Eye className="w-4 h-4" />;
      case 'download': return <Download className="w-4 h-4" />;
      case 'edit': return <Edit className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getShareTypeColor = (type: string) => {
    switch (type) {
      case 'internal': return 'green';
      case 'external': return 'blue';
      case 'public': return 'orange';
      default: return 'gray';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Share2 className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Share Document</h2>
                <p className="text-slate-400">{documentName}</p>
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
              { id: 'shares', label: 'Active Shares', icon: Share2 },
              { id: 'create', label: 'Create Share', icon: UserPlus },
              { id: 'analytics', label: 'Analytics', icon: Settings }
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

          {/* Active Shares Tab */}
          {activeTab === 'shares' && (
            <div className="space-y-4">
              {shareLinks.map(link => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border border-slate-600 rounded-lg p-4 ${
                    !link.isActive ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 bg-${getShareTypeColor(link.shareType)}-600 text-white text-xs rounded-full`}>
                        {link.shareType.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1">
                        {getPermissionIcon(link.permissions)}
                        <span className="text-sm text-slate-400 capitalize">{link.permissions}</span>
                      </div>
                      {!link.isActive && (
                        <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                          REVOKED
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {link.isActive && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyShareLink(link.id)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                            title="Copy Link"
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => revokeShare(link.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg"
                            title="Revoke Access"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="text-sm text-slate-400">Shared With</label>
                      <div className="space-y-1">
                        {link.sharedWith.map((recipient, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-white">
                            {recipient.type === 'email' ? <Mail className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                            {recipient.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-slate-400">Access Stats</label>
                      <div className="text-sm text-white">
                        {link.accessCount} views {link.maxAccess && `/ ${link.maxAccess} max`}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <label className="text-slate-400">Created</label>
                      <div className="text-white">{link.createdAt.toLocaleDateString()}</div>
                    </div>
                    
                    <div>
                      <label className="text-slate-400">Expires</label>
                      <div className="text-white">
                        {link.expiresAt ? link.expiresAt.toLocaleDateString() : 'Never'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-slate-400">Security</label>
                      <div className="flex items-center gap-2">
                        {link.requiresAuth && <Shield className="w-3 h-3 text-green-400" />}
                        {link.trackAccess && <Eye className="w-3 h-3 text-blue-400" />}
                        <span className="text-white text-xs">
                          {link.requiresAuth ? 'Auth Required' : 'Public Access'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {shareLinks.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Share2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active shares for this document</p>
                  <p className="text-sm">Create a share link to collaborate with others</p>
                </div>
              )}
            </div>
          )}

          {/* Create Share Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Share Type
                  </label>
                  <select
                    value={newShare.shareType}
                    onChange={(e) => setNewShare({ ...newShare, shareType: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="internal">Internal Team</option>
                    <option value="external">External Partners</option>
                    <option value="public">Public Link</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Permissions
                  </label>
                  <select
                    value={newShare.permissions}
                    onChange={(e) => setNewShare({ ...newShare, permissions: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="view">View Only</option>
                    <option value="download">View & Download</option>
                    <option value="edit">Full Access</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Recipients (comma separated)
                </label>
                <textarea
                  value={newShare.recipients}
                  onChange={(e) => setNewShare({ ...newShare, recipients: e.target.value })}
                  placeholder="sarah.johnson, policy-team, partner@example.org"
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Use usernames for internal users, email addresses for external users
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Expires In
                  </label>
                  <select
                    value={newShare.expiresIn}
                    onChange={(e) => setNewShare({ ...newShare, expiresIn: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="1">1 Day</option>
                    <option value="3">3 Days</option>
                    <option value="7">1 Week</option>
                    <option value="30">1 Month</option>
                    <option value="0">Never</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Max Access Count (0 = unlimited)
                  </label>
                  <input
                    type="number"
                    value={newShare.maxAccess}
                    onChange={(e) => setNewShare({ ...newShare, maxAccess: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newShare.requiresAuth}
                    onChange={(e) => setNewShare({ ...newShare, requiresAuth: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Require authentication</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newShare.allowDownload}
                    onChange={(e) => setNewShare({ ...newShare, allowDownload: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300">Allow downloads</span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Message (optional)
                </label>
                <textarea
                  value={newShare.message}
                  onChange={(e) => setNewShare({ ...newShare, message: e.target.value })}
                  placeholder="Add a message for recipients..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={createShareLink}
                disabled={!newShare.recipients || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Share...
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    Create Share Link
                  </>
                )}
              </motion.button>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Eye className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="text-2xl font-bold">
                        {shareLinks.reduce((sum, link) => sum + link.accessCount, 0)}
                      </div>
                      <div className="text-sm text-slate-400">Total Views</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-green-400" />
                    <div>
                      <div className="text-2xl font-bold">{shareLinks.filter(l => l.isActive).length}</div>
                      <div className="text-sm text-slate-400">Active Shares</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-yellow-400" />
                    <div>
                      <div className="text-2xl font-bold">
                        {shareLinks.filter(l => l.requiresAuth).length}
                      </div>
                      <div className="text-sm text-slate-400">Secure Shares</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded">
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-sm font-medium">Document viewed</div>
                        <div className="text-xs text-slate-400">by Dr. Sarah Johnson</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">2 hours ago</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded">
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4 text-green-400" />
                      <div>
                        <div className="text-sm font-medium">Document downloaded</div>
                        <div className="text-xs text-slate-400">by External Partner</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">1 day ago</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};