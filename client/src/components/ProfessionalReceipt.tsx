/**
 * Professional Receipt Display Component
 * Beautiful, branded receipt with download options
 */

import React, { useState, useEffect } from 'react';
// Using custom button styling instead of shadcn
import { Download, Printer, Mail, Share2, FileText, MessageCircle, Facebook, Twitter, Linkedin } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReceiptData {
  transactionId: string;
  packageName: string;
  amount: number;
  currency: string;
  credits: number;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  organizationName?: string;
  userType?: string;
}

interface ProfessionalReceiptProps {
  data: ReceiptData;
  showActions?: boolean;
}

const ProfessionalReceipt: React.FC<ProfessionalReceiptProps> = ({ 
  data, 
  showActions = true 
}) => {
  const [receiptHtml, setReceiptHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateReceipt();
  }, [data]);

  const generateReceipt = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/receipt/download?transactionId=${data.transactionId}&format=html`);
      const html = await response.text();
      setReceiptHtml(html);
    } catch (error) {
      console.error('Failed to generate receipt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReceipt = async (format: 'html' | 'svg') => {
    try {
      const response = await fetch(`/api/receipt/download?transactionId=${data.transactionId}&format=${format}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `granada-receipt-${data.transactionId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHtml);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const shareReceipt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Granada Global Tech Ltd - Payment Receipt',
          text: `Payment confirmation for ${data.packageName} package - ${data.credits} credits from Granada Global Tech Ltd, Soroti Uganda`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Receipt link copied to clipboard!');
    }
  };

  const shareToWhatsApp = () => {
    const message = encodeURIComponent(
      `*Granada Global Tech Ltd - Payment Receipt*\n\n` +
      `✅ Payment Successful!\n` +
      `📦 Package: ${data.packageName}\n` +
      `💰 Amount: ${data.currency} ${data.amount}\n` +
      `🎯 Credits: ${data.credits}\n` +
      `🔗 Transaction ID: ${data.transactionId}\n\n` +
      `Thank you for choosing Granada Global Tech Ltd!\n` +
      `📍 Soroti, Uganda\n` +
      `View receipt: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareToEmail = () => {
    const subject = encodeURIComponent('Granada Global Tech Ltd - Payment Receipt');
    const body = encodeURIComponent(
      `Dear ${data.customerName},\n\n` +
      `Thank you for your purchase from Granada Global Tech Ltd!\n\n` +
      `PAYMENT DETAILS:\n` +
      `Transaction ID: ${data.transactionId}\n` +
      `Package: ${data.packageName}\n` +
      `Credits: ${data.credits}\n` +
      `Amount: ${data.currency} ${data.amount}\n` +
      `Date: ${data.date}\n\n` +
      `Your credits are now available in your account.\n\n` +
      `Granada Global Tech Ltd\n` +
      `Amen A, Soroti, Eastern Region, Uganda\n` +
      `Postal Address: 290884 Soroti\n\n` +
      `Best regards,\n` +
      `Granada Global Tech Team`
    );
    window.open(`mailto:${data.customerEmail}?subject=${subject}&body=${body}`);
  };

  const shareToSocial = (platform: string) => {
    const text = encodeURIComponent(
      `Just completed a purchase with Granada Global Tech Ltd! 🎉 ${data.credits} credits added to my account. Professional funding platform from Soroti, Uganda! 🇺🇬`
    );
    const url = encodeURIComponent(window.location.href);
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
    }
  };

  const emailReceipt = () => {
    const subject = encodeURIComponent('Granada OS Payment Receipt');
    const body = encodeURIComponent(
      `Dear ${data.customerName},\n\n` +
      `Thank you for your purchase! Your payment has been processed successfully.\n\n` +
      `Transaction ID: ${data.transactionId}\n` +
      `Package: ${data.packageName}\n` +
      `Credits: ${data.credits}\n` +
      `Amount: ${data.currency} ${data.amount}\n\n` +
      `Your credits are now available in your Granada OS account.\n\n` +
      `Best regards,\nGranada OS Team`
    );
    window.open(`mailto:${data.customerEmail}?subject=${subject}&body=${body}`);
  };

  const downloadAsPDF = async () => {
    try {
      const receiptElement = document.getElementById('professional-receipt');
      if (!receiptElement) {
        alert('Receipt not found. Please wait for it to load.');
        return;
      }

      // Create canvas from HTML element with high quality
      const canvas = await html2canvas(receiptElement, {
        scale: 3, // Higher resolution for crisp PDF
        useCORS: true,
        backgroundColor: '#ffffff',
        height: receiptElement.offsetHeight,
        width: receiptElement.offsetWidth,
        logging: false,
        allowTaint: true
      });

      // Create PDF with beautiful formatting
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Calculate dimensions to fit A4 beautifully
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let yPosition = 10; // Start with 10mm top margin

      // If receipt fits on one page
      if (imgHeight <= pdfHeight - 20) {
        pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
      } else {
        // Multi-page handling
        let remainingHeight = imgHeight;
        let sourceY = 0;
        
        while (remainingHeight > 0) {
          const pageHeight = Math.min(remainingHeight, pdfHeight - 20);
          const sourceHeight = (pageHeight * canvas.height) / imgHeight;
          
          // Create a canvas for this page section
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceHeight;
          const pageCtx = pageCanvas.getContext('2d');
          
          if (pageCtx) {
            pageCtx.drawImage(
              canvas,
              0, sourceY, canvas.width, sourceHeight,
              0, 0, canvas.width, sourceHeight
            );
            
            const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
            pdf.addImage(pageImgData, 'PNG', 10, 10, imgWidth, pageHeight);
            
            remainingHeight -= pageHeight;
            sourceY += sourceHeight;
            
            if (remainingHeight > 0) {
              pdf.addPage();
            }
          }
        }
      }

      // Download the beautiful PDF
      pdf.save(`Granada-Receipt-${data.transactionId}.pdf`);
      
      // Show success message
      alert('Receipt PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <span className="ml-4 text-slate-600">Generating your beautiful receipt...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Receipt Preview */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            ✓
          </div>
          Payment Receipt Generated
        </h2>
        <p className="text-slate-300 mt-2">
          Your professional receipt is ready for download, printing, or sharing
        </p>
      </div>

      {/* Receipt Display */}
      <div className="p-6">
        <div 
          id="professional-receipt"
          className="w-full border rounded-lg overflow-hidden shadow-sm"
          dangerouslySetInnerHTML={{ __html: receiptHtml }}
        />
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="bg-slate-50 p-6 border-t">
          {/* Download & Print Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Download & Print</h3>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={downloadAsPDF}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all transform hover:scale-105 font-semibold shadow-lg"
              >
                <FileText className="w-5 h-5" />
                Download PDF
              </button>
              
              <button 
                onClick={printReceipt}
                className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-semibold"
              >
                <Printer className="w-5 h-5" />
                Print Receipt
              </button>
              
              <button 
                onClick={() => downloadReceipt('html')}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-white transition-colors"
              >
                <Download className="w-4 h-4" />
                HTML
              </button>
              
              <button 
                onClick={() => downloadReceipt('svg')}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-white transition-colors"
              >
                <Download className="w-4 h-4" />
                SVG
              </button>
            </div>
          </div>

          {/* Share Section */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Share Receipt</h3>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={shareToWhatsApp}
                className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
              
              <button 
                onClick={shareToEmail}
                className="flex items-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              
              <button 
                onClick={() => shareToSocial('twitter')}
                className="flex items-center gap-2 px-4 py-3 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition-colors font-semibold"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </button>
              
              <button 
                onClick={() => shareToSocial('facebook')}
                className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </button>
              
              <button 
                onClick={() => shareToSocial('linkedin')}
                className="flex items-center gap-2 px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-slate-600 bg-white p-4 rounded-lg border">
            <p className="mb-1">
              <strong>Granada Global Tech Ltd</strong> - Soroti, Uganda
            </p>
            <p className="mb-1">
              <strong>Transaction ID:</strong> {data.transactionId}
            </p>
            <p>
              <strong>Generated:</strong> {new Date(data.date).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalReceipt;