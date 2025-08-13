#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Granada NGO Management System...');
console.log('📁 Located at: ./NGOs/');
console.log('');

// Change to NGOs directory
process.chdir(path.join(__dirname, 'NGOs'));

// Check if dependencies are installed
const fs = require('fs');
if (!fs.existsSync('shell-app/frontend/node_modules')) {
    console.log('⚠️  Dependencies not installed. Installing now...');
    console.log('   Run: cd NGOs && npm run install:all');
    console.log('');
}

console.log('🌟 NGO Management System Structure:');
console.log('   📋 Shell Application: Main dashboard and routing');
console.log('   🤖 AI Supervisor: Intelligent monitoring');
console.log('   💰 Finance Service: Financial management');
console.log('   📝 Grants Service: Grant applications');
console.log('   📊 Projects Service: Project tracking');
console.log('');

console.log('📚 Quick Commands:');
console.log('   cd NGOs && npm run setup     # Install all dependencies');
console.log('   cd NGOs && npm run dev       # Start in development mode');
console.log('   cd NGOs && docker-compose up # Start with Docker');
console.log('');

console.log('🌐 Access Points (after starting):');
console.log('   Main App: http://localhost:3000');
console.log('   AI API:   http://localhost:8001');
console.log('   Finance:  http://localhost:8002');
console.log('   Grants:   http://localhost:8003');
console.log('   Projects: http://localhost:8004');
console.log('');

console.log('✨ The NGOs folder is completely standalone!');
console.log('   You can copy it anywhere and run independently.');
console.log('   See NGOs/QUICK_START.md for detailed instructions.');