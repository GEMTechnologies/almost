/**
 * Granada OS - Website Preview Component
 * Live preview of generated websites with responsive testing
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Monitor,
  Smartphone,
  Tablet,
  Download,
  Code,
  Eye,
  RefreshCw,
  Settings
} from 'lucide-react';

interface WebsitePreviewProps {
  website: any;
  onClose: () => void;
  onBack: () => void;
}

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({ website, onClose, onBack }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);

  const getFrameSize = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const downloadWebsite = () => {
    const blob = new Blob([website.htmlPreview], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-preview.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (showCode) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCode(false)}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <h1 className="text-2xl font-bold">Generated Code</h1>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadWebsite}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-4">HTML</h3>
              <div className="bg-slate-900 p-4 rounded-lg overflow-auto max-h-96">
                <pre className="text-sm text-green-400">
                  <code>{website.htmlCode || website.htmlPreview}</code>
                </pre>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-4">CSS</h3>
              <div className="bg-slate-900 p-4 rounded-lg overflow-auto max-h-96">
                <pre className="text-sm text-blue-400">
                  <code>{website.cssCode || '/* CSS styles included in HTML */'}</code>
                </pre>
              </div>
            </div>

            {website.jsCode && (
              <div className="bg-slate-800 rounded-lg p-4 lg:col-span-2">
                <h3 className="text-lg font-bold mb-4">JavaScript</h3>
                <div className="bg-slate-900 p-4 rounded-lg overflow-auto max-h-96">
                  <pre className="text-sm text-yellow-400">
                    <code>{website.jsCode}</code>
                  </pre>
                </div>
              </div>
            )}

            {website.reactCode && (
              <div className="bg-slate-800 rounded-lg p-4 lg:col-span-2">
                <h3 className="text-lg font-bold mb-4">React Components</h3>
                <div className="bg-slate-900 p-4 rounded-lg overflow-auto max-h-96">
                  <pre className="text-sm text-cyan-400">
                    <code>{website.reactCode}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <h1 className="text-xl font-bold">Website Preview</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Responsive Controls */}
            <div className="flex bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCode(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                View Code
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadWebsite}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-lg shadow-2xl overflow-hidden ${
                viewMode !== 'desktop' ? 'mx-auto' : ''
              }`}
              style={getFrameSize()}
            >
              <iframe
                srcDoc={website.htmlPreview}
                className="w-full h-full border-0"
                title="Website Preview"
                sandbox="allow-same-origin allow-scripts"
              />
            </motion.div>
          </div>

          {/* Preview Info */}
          <div className="mt-6 bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">Preview Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Type:</span>
                    <span className="ml-2 capitalize">{website.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Pages:</span>
                    <span className="ml-2">{website.pages.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Features:</span>
                    <span className="ml-2">{website.features.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Size:</span>
                    <span className="ml-2">{website.size}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-slate-400">Generated on</div>
                <div className="font-medium">{website.generatedAt}</div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="font-bold mb-3">Included Pages</h4>
              <div className="space-y-2">
                {website.pages.map((page: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="capitalize">{page.replace('-', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="font-bold mb-3">Active Features</h4>
              <div className="space-y-2">
                {website.features.slice(0, 6).map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                ))}
                {website.features.length > 6 && (
                  <div className="text-slate-400 text-sm">
                    +{website.features.length - 6} more features
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};