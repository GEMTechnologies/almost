/**
 * Professional Receipt Generator Service
 * Creates beautiful, branded receipts with modern design
 */

import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';

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

export class ProfessionalReceiptGenerator {
  private logoSvg: string;
  
  constructor() {
    this.logoSvg = this.createGranadaLogo();
  }

  private createGranadaLogo(): string {
    return `
      <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
        <!-- Modern gradient background -->
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#047857;stop-opacity:1" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Background circle -->
        <circle cx="20" cy="20" r="18" fill="url(#logoGrad)" filter="url(#shadow)"/>
        
        <!-- Granada icon - stylized G -->
        <path d="M12 8 C12 8, 28 8, 28 8 C28 12, 28 16, 28 20 C28 28, 20 32, 20 32 C12 32, 12 24, 12 20 Z" 
              fill="white" opacity="0.9"/>
        <circle cx="20" cy="20" r="4" fill="url(#logoGrad)"/>
        
        <!-- Text -->
        <text x="45" y="16" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1f2937">
          GRANADA
        </text>
        <text x="45" y="28" font-family="Arial, sans-serif" font-size="8" fill="#6b7280" letter-spacing="2px">
          FUNDING PLATFORM
        </text>
      </svg>
    `;
  }

  private createWatermarkPattern(): string {
    return `
      <defs>
        <pattern id="watermark" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
          <g opacity="0.03">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" stroke-width="2"/>
            <text x="100" y="105" text-anchor="middle" font-family="Arial" font-size="14" fill="#10b981">
              GRANADA OS
            </text>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#watermark)"/>
    `;
  }

  generateReceiptSVG(data: ReceiptData): string {
    const receiptDate = new Date(data.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
    <svg width="600" height="800" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
      <!-- Background and watermark -->
      <rect width="600" height="800" fill="#ffffff"/>
      ${this.createWatermarkPattern()}
      
      <!-- Header gradient -->
      <defs>
        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1e293b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#334155;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Header section -->
      <rect width="600" height="120" fill="url(#headerGrad)"/>
      
      <!-- Logo and company info -->
      <g transform="translate(40, 30)">
        ${this.logoSvg}
      </g>
      
      <!-- Receipt title -->
      <text x="300" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">
        PAYMENT RECEIPT
      </text>
      <text x="300" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#cbd5e1">
        Transaction Confirmation
      </text>

      <!-- Success badge -->
      <rect x="220" y="90" width="160" height="30" rx="15" fill="url(#successGrad)" filter="url(#glow)"/>
      <text x="300" y="109" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white">
        ✓ PAYMENT SUCCESSFUL
      </text>

      <!-- Transaction details section -->
      <rect x="40" y="160" width="520" height="480" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" rx="12"/>
      
      <!-- Transaction ID highlight -->
      <rect x="60" y="180" width="480" height="50" fill="#ecfdf5" stroke="#10b981" stroke-width="1" rx="8"/>
      <text x="80" y="200" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#065f46">
        TRANSACTION ID
      </text>
      <text x="80" y="220" font-family="Courier, monospace" font-size="16" font-weight="bold" fill="#047857">
        ${data.transactionId}
      </text>

      <!-- Customer information -->
      <text x="80" y="270" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1f2937">
        Customer Information
      </text>
      <line x1="80" y1="275" x2="520" y2="275" stroke="#d1d5db" stroke-width="1"/>
      
      <text x="80" y="300" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">Name:</text>
      <text x="200" y="300" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#1f2937">${data.customerName}</text>
      
      <text x="80" y="320" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">Email:</text>
      <text x="200" y="320" font-family="Arial, sans-serif" font-size="12" fill="#1f2937">${data.customerEmail}</text>
      
      ${data.customerPhone ? `
      <text x="80" y="340" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">Phone:</text>
      <text x="200" y="340" font-family="Arial, sans-serif" font-size="12" fill="#1f2937">${data.customerPhone}</text>
      ` : ''}

      ${data.organizationName ? `
      <text x="80" y="360" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">Organization:</text>
      <text x="200" y="360" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#1f2937">${data.organizationName}</text>
      ` : ''}

      <!-- Purchase details -->
      <text x="80" y="410" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1f2937">
        Purchase Details
      </text>
      <line x1="80" y1="415" x2="520" y2="415" stroke="#d1d5db" stroke-width="1"/>

      <!-- Package info box -->
      <rect x="80" y="430" width="440" height="80" fill="white" stroke="#e5e7eb" stroke-width="1" rx="8"/>
      <rect x="80" y="430" width="440" height="25" fill="#f3f4f6" rx="8 8 0 0"/>
      <text x="95" y="448" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#374151">
        ${data.packageName} Package
      </text>
      
      <text x="95" y="470" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">Credits Purchased:</text>
      <text x="420" y="470" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#059669">${data.credits.toLocaleString()}</text>
      
      <text x="95" y="490" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">Payment Method:</text>
      <text x="420" y="490" font-family="Arial, sans-serif" font-size="14" fill="#1f2937">${data.paymentMethod}</text>

      <!-- Amount section -->
      <rect x="80" y="530" width="440" height="60" fill="#fefce8" stroke="#facc15" stroke-width="2" rx="8"/>
      <text x="95" y="550" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#713f12">
        Total Amount Paid
      </text>
      <text x="95" y="575" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#a16207">
        ${data.currency} ${data.amount.toLocaleString()}
      </text>

      <!-- Transaction date -->
      <text x="80" y="620" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">Transaction Date:</text>
      <text x="300" y="620" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#1f2937">${receiptDate}</text>

      <!-- Footer section -->
      <rect x="0" y="680" width="600" height="120" fill="#f1f5f9"/>
      <text x="300" y="710" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1e293b">
        Thank you for choosing Granada OS!
      </text>
      <text x="300" y="730" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#64748b">
        Your credits have been added to your account and are ready to use.
      </text>
      
      <!-- Support info -->
      <text x="300" y="760" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#94a3b8">
        Questions? Contact support@granadaos.com | www.granadaos.com
      </text>
      <text x="300" y="775" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#94a3b8">
        Keep this receipt for your records
      </text>

      <!-- Security elements -->
      <rect x="480" y="750" width="80" height="20" fill="none" stroke="#cbd5e1" stroke-width="1" rx="4"/>
      <text x="520" y="762" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="#9ca3af">
        VERIFIED
      </text>
    </svg>
    `;
  }

  generateReceiptHTML(data: ReceiptData): string {
    const svg = this.generateReceiptSVG(data);
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Granada OS - Payment Receipt</title>
      <style>
        body { 
          margin: 0; 
          padding: 20px; 
          background: #f8fafc; 
          font-family: Arial, sans-serif;
        }
        .receipt-container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 12px; 
          overflow: hidden; 
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .print-btn {
          margin: 20px auto;
          display: block;
          background: linear-gradient(to right, #10b981, #059669);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          font-size: 14px;
        }
        .print-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        @media print {
          body { background: white; padding: 0; }
          .print-btn { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        ${svg}
      </div>
      <button class="print-btn" onclick="window.print()">🖨️ Print Receipt</button>
    </body>
    </html>
    `;
  }
}

// API endpoint for generating receipts
export async function generateReceipt(req: Request, res: Response) {
  try {
    const receiptData: ReceiptData = req.body;
    
    const generator = new ProfessionalReceiptGenerator();
    const format = req.query.format as string || 'html';
    
    if (format === 'svg') {
      const svgContent = generator.generateReceiptSVG(receiptData);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Content-Disposition', `attachment; filename="receipt-${receiptData.transactionId}.svg"`);
      return res.send(svgContent);
    }
    
    if (format === 'html') {
      const htmlContent = generator.generateReceiptHTML(receiptData);
      res.setHeader('Content-Type', 'text/html');
      return res.send(htmlContent);
    }
    
    // Default to JSON with SVG data
    const svgContent = generator.generateReceiptSVG(receiptData);
    res.json({
      success: true,
      format: 'svg',
      content: svgContent,
      downloadUrl: `/api/receipt/download?transactionId=${receiptData.transactionId}&format=svg`
    });
    
  } catch (error) {
    console.error('Receipt generation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate receipt'
    });
  }
}