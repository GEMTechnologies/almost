import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'wouter';
import {
  ArrowLeft,
  Clock,
  User,
  Download,
  Eye,
  FileText,
  Upload,
  GitBranch,
  Calendar,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Trash2
} from 'lucide-react';

interface DocumentVersion {
  id: string;
  version: string;
  uploadedAt: string;
  uploadedBy: string;
  notes: string;
  fileSize: number;
  status: 'approved' | 'pending' | 'rejected';
  changes: string[];
  downloadUrl: string;
}

const DocumentVersioningPage: React.FC = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [documentName, setDocumentName] = useState('Child Protection Policy');
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newVersionFile, setNewVersionFile] = useState<File | null>(null);
  const [newVersionNotes, setNewVersionNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    setVersions([
      {
        id: '1',
        version: '3.2',
        uploadedAt: '2024-01-15T10:30:00Z',
        uploadedBy: 'Sarah Johnson',
        notes: 'Updated reporting procedures and contact information for 2024',
        fileSize: 245760,
        status: 'approved',
        changes: ['Updated contact information', 'Revised reporting timeline', 'Added new safeguarding measures'],
        downloadUrl: '/api/documents/download/1'
      },
      {
        id: '2',
        version: '3.1',
        uploadedAt: '2024-01-10T14:15:00Z',
        uploadedBy: 'Michael Chen',
        notes: 'Fixed formatting issues and updated legal references',
        fileSize: 242150,
        status: 'approved',
        changes: ['Fixed formatting', 'Updated references', 'Corrected typos'],
        downloadUrl: '/api/documents/download/2'
      },
      {
        id: '3',
        version: '3.0',
        uploadedAt: '2024-01-05T09:00:00Z',
        uploadedBy: 'Sarah Johnson',
        notes: 'Major revision incorporating new regulatory requirements',
        fileSize: 238940,
        status: 'approved',
        changes: ['Major restructure', 'New regulatory compliance', 'Updated procedures'],
        downloadUrl: '/api/documents/download/3'
      }
    ]);
  }, [documentId]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900/30 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-900/30 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-500/30';
    }
  };

  const uploadNewVersion = async () => {
    if (!newVersionFile || !newVersionNotes) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', newVersionFile);
      formData.append('notes', newVersionNotes);
      formData.append('documentId', documentId || '');

      const response = await fetch('/api/documents/upload-version', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Refresh versions list
        setShowUploadModal(false);
        setNewVersionFile(null);
        setNewVersionNotes('');
        // In real app, refresh the versions list
      }
    } catch (error) {
      console.error('Failed to upload version:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
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
              <h1 className="text-2xl font-bold text-white">Document Versions</h1>
              <p className="text-slate-400">{documentName}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload New Version
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Version Timeline */}
        <div className="space-y-4">
          {versions.map((version, index) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900 rounded-xl p-6 border border-slate-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-blue-400" />
                      <span className="text-lg font-semibold">Version {version.version}</span>
                      {index === 0 && (
                        <div className="bg-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                          Latest
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(version.status)}`}>
                      {getStatusIcon(version.status)}
                      {version.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{version.uploadedBy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(version.uploadedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{formatFileSize(version.fileSize)}</span>
                    </div>
                  </div>

                  {version.notes && (
                    <div className="bg-slate-800 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5" />
                        <p className="text-sm text-slate-300">{version.notes}</p>
                      </div>
                    </div>
                  )}

                  {version.changes.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-400 mb-2">Changes in this version:</h4>
                      <ul className="space-y-1">
                        {version.changes.map((change, changeIndex) => (
                          <li key={changeIndex} className="text-sm text-slate-300 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                  {index !== 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upload New Version Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-4">Upload New Version</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select File</label>
                  <input
                    type="file"
                    onChange={(e) => setNewVersionFile(e.target.files?.[0] || null)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept=".pdf,.doc,.docx"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Version Notes</label>
                  <textarea
                    value={newVersionNotes}
                    onChange={(e) => setNewVersionNotes(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the changes in this version..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={uploadNewVersion}
                  disabled={!newVersionFile || !newVersionNotes || loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg"
                >
                  {loading ? 'Uploading...' : 'Upload Version'}
                </motion.button>
                <button
                  onClick={() => setShowUploadModal(false)}
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

export default DocumentVersioningPage;