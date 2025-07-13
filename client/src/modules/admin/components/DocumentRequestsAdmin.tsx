/**
 * Granada OS - Admin Document Requests Management
 * Allows admins to view, approve, and manage document writing requests
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Eye,
  Filter,
  Search,
  Calendar,
  CreditCard,
  Building,
  Mail,
  Phone,
  MessageSquare,
  Send,
  RefreshCw
} from 'lucide-react';

interface DocumentRequest {
  id: string;
  userId: string;
  documentName: string;
  documentType: string;
  category: string;
  subcategory?: string;
  organizationContext?: any;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  creditsRequired: number;
  estimatedDuration: number;
  estimatedCompletion: Date;
  message: string;
  createdAt: Date;
  completedAt?: Date;
}

interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  userId?: string;
  jobId?: string;
  isRead: boolean;
  isActioned: boolean;
  actionTaken?: string;
  metadata?: any;
  createdAt: Date;
}

export const DocumentRequestsAdmin: React.FC = () => {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSendDocumentModal, setShowSendDocumentModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [selectedUploadedDoc, setSelectedUploadedDoc] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'requests' | 'uploads'>('requests');

  // Fetch document requests and notifications
  const fetchData = async () => {
    try {
      const [requestsRes, notificationsRes, uploadsRes] = await Promise.all([
        fetch('/api/document-writing/admin/requests'),
        fetch('/api/document-writing/admin/notifications'),
        fetch('/api/document-upload/admin/pending')
      ]);

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setRequests(requestsData.requests || []);
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData.notifications || []);
      }

      if (uploadsRes.ok) {
        const uploadsData = await uploadsRes.json();
        setUploadedDocuments(uploadsData.documents || []);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Send document to user
  const sendDocumentToUser = async () => {
    if (!selectedRequest || !recipientEmail) return;

    setLoading(true);
    try {
      const response = await fetch('/api/document-writing/admin/send-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: selectedRequest.id,
          recipientEmail,
          messageBody,
          adminId: 'admin-user-id' // In real app, get from session
        }),
      });

      if (response.ok) {
        alert('Document sent successfully!');
        setShowSendDocumentModal(false);
        setRecipientEmail('');
        setMessageBody('');
        fetchData(); // Refresh data
      } else {
        alert('Failed to send document');
      }
    } catch (error) {
      console.error('Error sending document:', error);
      alert('Error sending document');
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/document-writing/admin/notifications/${notificationId}/read`, {
        method: 'PATCH'
      });
      fetchData();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Approve or reject uploaded document
  const handleDocumentApproval = async (documentId: string, action: 'approve' | 'reject', reason?: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/document-upload/admin/${documentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          adminId: 'admin-user-id',
          reason: reason || '',
          adminNotes: `Document ${action}d by admin`
        }),
      });

      if (response.ok) {
        alert(`Document ${action}d successfully!`);
        fetchData(); // Refresh data
        setSelectedUploadedDoc(null);
      } else {
        alert(`Failed to ${action} document`);
      }
    } catch (error) {
      console.error(`Error ${action}ing document:`, error);
      alert(`Error ${action}ing document`);
    } finally {
      setLoading(false);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      request.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'failed': return 'red';
      case 'cancelled': return 'gray';
      default: return 'slate';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'normal': return 'blue';
      case 'low': return 'gray';
      default: return 'slate';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Document Requests Admin</h1>
            <p className="text-slate-400">Manage and oversee document writing requests</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'requests' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Writing Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('uploads')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'uploads' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Uploaded Documents ({uploadedDocuments.length})
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold">{requests.length + uploadedDocuments.length}</div>
                <div className="text-sm text-slate-400">Total Items</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold">{requests.filter(r => r.status === 'pending').length + uploadedDocuments.length}</div>
                <div className="text-sm text-slate-400">Pending Review</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold">{requests.filter(r => r.status === 'completed').length}</div>
                <div className="text-sm text-slate-400">Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold">{notifications.filter(n => !n.isRead).length}</div>
                <div className="text-sm text-slate-400">Unread Notifications</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Lists */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {activeTab === 'requests' ? 'Document Writing Requests' : 'Uploaded Documents'}
              </h2>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activeTab === 'requests' ? (
                filteredRequests.map(request => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border border-slate-700 rounded-lg p-4 cursor-pointer transition-all hover:border-blue-500 ${
                    selectedRequest?.id === request.id ? 'border-blue-500 bg-slate-700/50' : ''
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <h3 className="font-semibold">{request.documentName}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium bg-${getStatusColor(request.status)}-600 text-white`}>
                      {request.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 mb-2">
                    <div>Category: {request.category}</div>
                    <div>Credits: {request.creditsRequired}</div>
                    <div>Created: {new Date(request.createdAt).toLocaleDateString()}</div>
                  </div>
                  {request.status === 'in_progress' && (
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${request.progress}%` }}
                      />
                    </div>
                  )}
                </motion.div>
              ))
              ) : (
                uploadedDocuments.map(doc => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border border-slate-700 rounded-lg p-4 cursor-pointer transition-all hover:border-blue-500 ${
                      selectedUploadedDoc?.id === doc.id ? 'border-blue-500 bg-slate-700/50' : ''
                    }`}
                    onClick={() => setSelectedUploadedDoc(doc)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <h3 className="font-semibold">{doc.fileName}</h3>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-600 text-white">
                        PENDING APPROVAL
                      </span>
                    </div>
                    <div className="text-sm text-slate-400 mb-2">
                      <div>Type: {doc.documentType}</div>
                      <div>Category: {doc.category}</div>
                      <div>Size: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB</div>
                      <div>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                      <div>User: {doc.userFullName || doc.userEmail}</div>
                    </div>
                    {doc.isConfidential && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-900/30 text-red-300 rounded text-xs">
                        <Shield className="w-3 h-3" />
                        Confidential
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Details & Notifications */}
        <div className="space-y-6">
          {/* Selected Request Details */}
          {activeTab === 'requests' && selectedRequest && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Request Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-400">Document Name</label>
                  <div className="font-medium">{selectedRequest.documentName}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Type</label>
                  <div className="font-medium">{selectedRequest.documentType}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Category</label>
                  <div className="font-medium">{selectedRequest.category}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Organization</label>
                  <div className="font-medium">
                    {selectedRequest.organizationContext?.name || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Progress</label>
                  <div className="font-medium">{selectedRequest.progress}%</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Message</label>
                  <div className="font-medium text-sm">{selectedRequest.message}</div>
                </div>
              </div>

              {selectedRequest.status === 'completed' && (
                <div className="mt-6 space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSendDocumentModal(true)}
                    className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send to User
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Document
                  </motion.button>
                </div>
              )}
            </div>
          )}

          {/* Selected Upload Details */}
          {activeTab === 'uploads' && selectedUploadedDoc && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Document Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-400">File Name</label>
                  <div className="font-medium">{selectedUploadedDoc.fileName}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Document Type</label>
                  <div className="font-medium">{selectedUploadedDoc.documentType}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Category</label>
                  <div className="font-medium">{selectedUploadedDoc.category}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">File Size</label>
                  <div className="font-medium">{(selectedUploadedDoc.fileSize / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Uploaded By</label>
                  <div className="font-medium">{selectedUploadedDoc.userFullName || selectedUploadedDoc.userEmail}</div>
                </div>
                {selectedUploadedDoc.description && (
                  <div>
                    <label className="text-sm text-slate-400">Description</label>
                    <div className="font-medium text-sm">{selectedUploadedDoc.description}</div>
                  </div>
                )}
                {selectedUploadedDoc.isConfidential && (
                  <div className="flex items-center gap-2 p-2 bg-red-900/20 rounded">
                    <Shield className="w-4 h-4 text-red-400" />
                    <span className="text-red-300 text-sm">This document is marked as confidential</span>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDocumentApproval(selectedUploadedDoc.id, 'approve')}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Approve Document
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const reason = prompt('Rejection reason (optional):');
                    handleDocumentApproval(selectedUploadedDoc.id, 'reject', reason || undefined);
                  }}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Document
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(`/api/document-upload/download/${selectedUploadedDoc.id}?userId=admin`, '_blank')}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download & Review
                </motion.button>
              </div>
            </div>
          )}

          {/* Recent Notifications */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Recent Notifications</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notifications.slice(0, 10).map(notification => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`border border-slate-700 rounded-lg p-3 cursor-pointer ${
                    !notification.isRead ? 'border-blue-500 bg-blue-500/10' : ''
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <AlertCircle className={`w-4 h-4 text-${getPriorityColor(notification.priority)}-400`} />
                        <span className="font-medium text-sm">{notification.title}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{notification.message}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Send Document Modal */}
      {showSendDocumentModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Send Document to User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Recipient Email</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="Your document is ready for download..."
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendDocumentToUser}
                disabled={loading || !recipientEmail}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send Document
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSendDocumentModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};