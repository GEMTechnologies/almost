/**
 * Granada OS - Document Versioning System
 * Advanced version control and document history tracking
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  User, 
  Download,
  Eye,
  GitBranch,
  History,
  Upload,
  X,
  CheckCircle,
  AlertTriangle,
  Calendar,
  ArrowRight,
  GitCompare
} from 'lucide-react';

interface DocumentVersion {
  id: string;
  version: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  changeNotes: string;
  status: 'active' | 'archived' | 'superseded';
  isCurrentVersion: boolean;
  changes: {
    type: 'major' | 'minor' | 'patch';
    description: string;
    sections: string[];
  };
}

interface DocumentVersioningProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentVersioning: React.FC<DocumentVersioningProps> = ({
  documentId,
  isOpen,
  onClose
}) => {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newVersionNotes, setNewVersionNotes] = useState('');
  const [newVersionFile, setNewVersionFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock version data
  useEffect(() => {
    if (isOpen) {
      setVersions([
        {
          id: '1',
          version: '3.2',
          fileName: 'child-protection-policy-v3.2.pdf',
          fileSize: 1024576,
          uploadedBy: 'Dr. Sarah Johnson',
          uploadedAt: new Date('2024-01-10'),
          changeNotes: 'Updated reporting procedures and added digital safety guidelines',
          status: 'active',
          isCurrentVersion: true,
          changes: {
            type: 'minor',
            description: 'Enhanced digital safety protocols',
            sections: ['Reporting Procedures', 'Digital Safety', 'Staff Training']
          }
        },
        {
          id: '2',
          version: '3.1',
          fileName: 'child-protection-policy-v3.1.pdf',
          fileSize: 982144,
          uploadedBy: 'James Wilson',
          uploadedAt: new Date('2023-11-15'),
          changeNotes: 'Updated compliance requirements and legal references',
          status: 'superseded',
          isCurrentVersion: false,
          changes: {
            type: 'minor',
            description: 'Compliance updates',
            sections: ['Legal Framework', 'Compliance Checklist']
          }
        },
        {
          id: '3',
          version: '3.0',
          fileName: 'child-protection-policy-v3.0.pdf',
          fileSize: 945231,
          uploadedBy: 'Maria Rodriguez',
          uploadedAt: new Date('2023-08-01'),
          changeNotes: 'Major revision with new safeguarding framework',
          status: 'superseded',
          isCurrentVersion: false,
          changes: {
            type: 'major',
            description: 'Complete framework overhaul',
            sections: ['Safeguarding Framework', 'Risk Assessment', 'Incident Response']
          }
        }
      ]);
    }
  }, [isOpen, documentId]);

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getVersionTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'red';
      case 'minor': return 'blue';
      case 'patch': return 'green';
      default: return 'gray';
    }
  };

  const handleVersionSelection = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    }
  };

  const compareVersions = () => {
    if (selectedVersions.length === 2) {
      const version1 = versions.find(v => v.id === selectedVersions[0]);
      const version2 = versions.find(v => v.id === selectedVersions[1]);
      alert(`Comparing ${version1?.version} with ${version2?.version}\n\nThis would open a detailed comparison view showing changes between versions.`);
    }
  };

  const uploadNewVersion = async () => {
    if (!newVersionFile || !newVersionNotes) return;

    setLoading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newVersion: DocumentVersion = {
        id: (versions.length + 1).toString(),
        version: '3.3',
        fileName: newVersionFile.name,
        fileSize: newVersionFile.size,
        uploadedBy: 'Current User',
        uploadedAt: new Date(),
        changeNotes: newVersionNotes,
        status: 'active',
        isCurrentVersion: true,
        changes: {
          type: 'minor',
          description: newVersionNotes,
          sections: ['Updated Content']
        }
      };

      // Mark previous version as superseded
      const updatedVersions = versions.map(v => ({
        ...v,
        isCurrentVersion: false,
        status: 'superseded' as const
      }));

      setVersions([newVersion, ...updatedVersions]);
      setShowUploadModal(false);
      setNewVersionFile(null);
      setNewVersionNotes('');
    } catch (error) {
      console.error('Error uploading new version:', error);
    } finally {
      setLoading(false);
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
          className="bg-slate-800 rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <GitBranch className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Document Versions</h2>
                <p className="text-slate-400">Track changes and manage document versions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                New Version
              </motion.button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Comparison Tools */}
          {selectedVersions.length > 0 && (
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GitCompare className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300">
                    {selectedVersions.length === 1 
                      ? 'Select another version to compare' 
                      : 'Two versions selected'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {selectedVersions.length === 2 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={compareVersions}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
                    >
                      Compare Versions
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedVersions([])}
                    className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm"
                  >
                    Clear Selection
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* Version Timeline */}
          <div className="space-y-4">
            {versions.map((version, index) => (
              <motion.div
                key={version.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-lg p-6 cursor-pointer transition-all ${
                  selectedVersions.includes(version.id) 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : version.isCurrentVersion 
                      ? 'border-green-500 bg-green-900/20' 
                      : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                }`}
                onClick={() => handleVersionSelection(version.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-white">v{version.version}</span>
                        {version.isCurrentVersion && (
                          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                            Current
                          </span>
                        )}
                        <span className={`px-2 py-1 bg-${getVersionTypeColor(version.changes.type)}-600 text-white text-xs rounded-full`}>
                          {version.changes.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <User className="w-4 h-4" />
                        <span className="text-sm">{version.uploadedBy}</span>
                        <Calendar className="w-4 h-4 ml-2" />
                        <span className="text-sm">{version.uploadedAt.toLocaleDateString()}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2">{version.fileName}</h3>
                    <p className="text-slate-300 mb-3">{version.changeNotes}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm text-slate-400">File Size</label>
                        <div className="text-white">{formatFileSize(version.fileSize)}</div>
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Status</label>
                        <div className={`text-${version.isCurrentVersion ? 'green' : 'orange'}-400 capitalize`}>
                          {version.status}
                        </div>
                      </div>
                    </div>

                    {version.changes.sections.length > 0 && (
                      <div className="mb-4">
                        <label className="text-sm text-slate-400 mb-2 block">Changed Sections</label>
                        <div className="flex flex-wrap gap-2">
                          {version.changes.sections.map((section, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-slate-600 text-slate-200 text-xs rounded"
                            >
                              {section}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                      title="Download Version"
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg"
                      title="Preview Version"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {selectedVersions.includes(version.id) && (
                  <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-600/30">
                    <div className="flex items-center gap-2 text-blue-300">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Selected for comparison</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Upload New Version Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800 rounded-lg p-6 w-full max-w-md"
              >
                <h3 className="text-xl font-bold mb-4">Upload New Version</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Choose File</label>
                    <input
                      type="file"
                      onChange={(e) => setNewVersionFile(e.target.files?.[0] || null)}
                      className="w-full p-2 bg-slate-900 border border-slate-600 rounded"
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Change Notes</label>
                    <textarea
                      value={newVersionNotes}
                      onChange={(e) => setNewVersionNotes(e.target.value)}
                      placeholder="Describe what changed in this version..."
                      rows={4}
                      className="w-full p-2 bg-slate-900 border border-slate-600 rounded resize-none"
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
};