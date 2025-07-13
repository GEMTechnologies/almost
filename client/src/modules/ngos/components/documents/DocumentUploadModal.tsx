/**
 * Granada OS - Document Upload Modal
 * Comprehensive file upload with categorization and metadata
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  File,
  Calendar,
  Tag,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (document: any) => void;
  userId: string;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
  userId
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    category: 'governance',
    subcategory: '',
    documentType: 'certificate',
    description: '',
    tags: '',
    isConfidential: false,
    expiryDate: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentCategories = [
    { id: 'governance', name: 'Governance & Legal', color: 'blue' },
    { id: 'financial', name: 'Financial Documents', color: 'green' },
    { id: 'policies', name: 'Organizational Policies', color: 'purple' },
    { id: 'compliance', name: 'Compliance & Risk', color: 'orange' },
    { id: 'monitoring', name: 'Monitoring & Evaluation', color: 'teal' },
    { id: 'hr', name: 'HR & Staff Management', color: 'indigo' }
  ];

  const documentTypes = [
    'Certificate',
    'Policy Document',
    'Financial Report',
    'Compliance Report',
    'Meeting Minutes',
    'Audit Report',
    'Registration Document',
    'Contract',
    'MOU/Agreement',
    'Training Material',
    'Evaluation Report',
    'Other'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadComplete(false);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadComplete(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-8 h-8 text-blue-400" />;
    if (fileType.includes('pdf')) return <FileText className="w-8 h-8 text-red-400" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileText className="w-8 h-8 text-blue-600" />;
    return <File className="w-8 h-8 text-slate-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('document', selectedFile);
      uploadFormData.append('userId', userId);
      uploadFormData.append('category', formData.category);
      uploadFormData.append('subcategory', formData.subcategory);
      uploadFormData.append('documentType', formData.documentType);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('tags', JSON.stringify(formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)));
      uploadFormData.append('isConfidential', formData.isConfidential.toString());
      if (formData.expiryDate) {
        uploadFormData.append('expiryDate', formData.expiryDate);
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      const response = await fetch('/api/document-upload/upload', {
        method: 'POST',
        body: uploadFormData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (result.success) {
        setUploadComplete(true);
        onUploadComplete(result.document);
        
        setTimeout(() => {
          onClose();
          resetForm();
        }, 2000);
      } else {
        throw new Error(result.error || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploading(false);
    setUploadComplete(false);
    setFormData({
      category: 'governance',
      subcategory: '',
      documentType: 'certificate',
      description: '',
      tags: '',
      isConfidential: false,
      expiryDate: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
          className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Upload Document</h2>
              <p className="text-slate-400">Add certificates, policies, and other important documents</p>
            </div>
            <button
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Upload Complete */}
          {uploadComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-900/30 border border-green-600 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <div className="text-green-300 font-semibold">Upload Complete!</div>
                  <div className="text-green-400 text-sm">Document uploaded and pending admin approval</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* File Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-600 hover:border-blue-500 rounded-lg p-8 mb-6 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xls,.xlsx"
              className="hidden"
            />
            
            {selectedFile ? (
              <div className="flex items-center gap-4">
                {getFileIcon(selectedFile.type)}
                <div className="flex-1">
                  <div className="font-semibold text-white">{selectedFile.name}</div>
                  <div className="text-slate-400 text-sm">{formatFileSize(selectedFile.size)}</div>
                  <div className="text-slate-500 text-xs mt-1">{selectedFile.type}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="p-1 hover:bg-slate-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <div className="text-white font-semibold mb-2">Drop files here or click to browse</div>
                <div className="text-slate-400 text-sm">
                  Supports: PDF, Word, Excel, Images (Max 50MB)
                </div>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Uploading...</span>
                <span className="text-sm text-white">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                {documentCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Document Type *
              </label>
              <select
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                {documentTypes.map(type => (
                  <option key={type} value={type.toLowerCase()}>{type}</option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Subcategory
              </label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                placeholder="e.g., Board Resolutions, Audit Reports"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the document..."
              rows={3}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white resize-none"
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="important, annual, compliance, board"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white"
            />
          </div>

          {/* Confidential */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isConfidential}
                onChange={(e) => setFormData({ ...formData, isConfidential: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-600 rounded"
              />
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-300">Mark as confidential</span>
              </div>
            </label>
            <p className="text-xs text-slate-500 ml-7 mt-1">
              Confidential documents require additional approval steps
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              disabled={!selectedFile || uploading || uploadComplete}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : uploadComplete ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              {uploading ? 'Uploading...' : uploadComplete ? 'Uploaded' : 'Upload Document'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </motion.button>
          </div>

          {/* Info */}
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5" />
              <div className="text-xs text-blue-300">
                All uploaded documents are reviewed by administrators before approval. 
                You'll receive notifications about the approval status.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DocumentUploadModal;