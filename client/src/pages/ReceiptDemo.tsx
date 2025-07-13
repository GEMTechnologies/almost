import React from 'react';
import { ArrowLeft } from 'lucide-react';
import ProfessionalReceipt from '@/components/ProfessionalReceipt';

export default function ReceiptDemo() {

  const demoReceiptData = {
    transactionId: 'DEMO_' + Date.now(),
    packageName: 'Professional Package',
    amount: 24.99,
    currency: 'USD',
    credits: 150,
    paymentMethod: 'Mobile Money (PesaPal)',
    customerName: 'Demo User',
    customerEmail: 'demo@granadaglobal.com',
    customerPhone: '+256760195194',
    date: new Date().toISOString(),
    organizationName: 'Granada Global Tech Ltd',
    userType: 'NGO'
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <button 
          onClick={() => window.location.href = '/credits'}
          className="mb-6 flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Credits
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Granada Global Tech Ltd - Professional Receipt System
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Experience our stunning professional receipt design with enhanced graphics, 
            company branding, and comprehensive sharing features. Download as PDF, share to WhatsApp, 
            email, social media, or print for your records.
          </p>
        </div>
        
        <ProfessionalReceipt data={demoReceiptData} />
      </div>
    </div>
  );
}