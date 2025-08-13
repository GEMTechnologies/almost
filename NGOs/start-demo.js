#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve the shell app HTML with embedded demo
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Granada NGO Management System - Demo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px; margin-bottom: 30px; }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .header p { font-size: 1.2rem; opacity: 0.9; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s; }
        .card:hover { transform: translateY(-2px); }
        .card h3 { color: #2d3748; margin-bottom: 15px; font-size: 1.3rem; }
        .card p { color: #718096; margin-bottom: 15px; line-height: 1.6; }
        .status { padding: 5px 10px; border-radius: 15px; font-size: 0.8rem; font-weight: 600; display: inline-block; }
        .status.active { background: #c6f6d5; color: #22543d; }
        .status.demo { background: #bee3f8; color: #2b6cb0; }
        .features { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .features h2 { color: #2d3748; margin-bottom: 20px; }
        .features ul { list-style: none; }
        .features li { padding: 8px 0; color: #4a5568; }
        .features li:before { content: "✓ "; color: #48bb78; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #718096; }
        .setup-info { background: #edf2f7; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .setup-info h3 { color: #2d3748; margin-bottom: 10px; }
        .setup-info code { background: #e2e8f0; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Granada NGO Management System</h1>
            <p>Comprehensive Standalone Application with Microservices Architecture</p>
        </div>

        <div class="setup-info">
            <h3>🚀 How to Run the Full Application:</h3>
            <p>1. <code>cd NGOs</code></p>
            <p>2. <code>npm run setup</code> (install dependencies)</p>
            <p>3. <code>npm run dev</code> (start all services)</p>
            <p>4. Visit <code>http://localhost:3000</code></p>
        </div>

        <div class="grid">
            <div class="card">
                <h3>🤖 AI Supervisor Service</h3>
                <span class="status demo">Demo Mode</span>
                <p>Intelligent monitoring and guidance with Gemini AI integration. Provides real-time insights, risk assessment, and automated recommendations.</p>
                <p><strong>Port:</strong> 8001 | <strong>Tech:</strong> Python FastAPI</p>
            </div>

            <div class="card">
                <h3>💰 Finance Service</h3>
                <span class="status demo">Demo Mode</span>
                <p>Complete financial management with transaction tracking, budget monitoring, and comprehensive reporting capabilities.</p>
                <p><strong>Port:</strong> 8002 | <strong>Tech:</strong> Python FastAPI</p>
            </div>

            <div class="card">
                <h3>📝 Grants Service</h3>
                <span class="status demo">Demo Mode</span>
                <p>Grant opportunity search, application management, and status tracking with document handling and submission workflows.</p>
                <p><strong>Port:</strong> 8003 | <strong>Tech:</strong> Python FastAPI</p>
            </div>

            <div class="card">
                <h3>📊 Projects Service</h3>
                <span class="status demo">Demo Mode</span>
                <p>Project creation, milestone tracking, team coordination, and progress monitoring with detailed analytics.</p>
                <p><strong>Port:</strong> 8004 | <strong>Tech:</strong> Python FastAPI</p>
            </div>
        </div>

        <div class="features">
            <h2>✨ Key Features</h2>
            <div class="grid">
                <div>
                    <ul>
                        <li>Microservices Architecture</li>
                        <li>Docker Containerization</li>
                        <li>PostgreSQL Database</li>
                        <li>React Micro-Frontends</li>
                    </ul>
                </div>
                <div>
                    <ul>
                        <li>AI-Powered Insights</li>
                        <li>Independent Service Scaling</li>
                        <li>Complete Documentation</li>
                        <li>Production Ready</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>This is a demonstration of the standalone NGO application structure.</p>
            <p>The complete system is located in the <strong>/NGOs/</strong> folder and can run independently.</p>
        </div>
    </div>
</body>
</html>
    `);
});

// API endpoints for demonstration
app.get('/api/*', (req, res) => {
    res.json({
        message: 'NGO Microservice API Endpoint',
        path: req.path,
        note: 'Start the full application to access all services',
        commands: [
            'cd NGOs',
            'npm run setup',
            'npm run dev'
        ]
    });
});

// Start demo server
app.listen(PORT, () => {
    console.log(`🌟 NGO Demo running at http://localhost:${PORT}`);
    console.log('📁 Full app located at: ./NGOs/');
    console.log('');
    console.log('To run the complete application:');
    console.log('  cd NGOs && npm run setup && npm run dev');
});