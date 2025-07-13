@echo off
echo Starting Granada OS with Python AI Services...
echo Main App will be at: http://localhost:5000
echo AI Services will be at: http://localhost:8030
echo.

rem Start Python AI Service in background
start /B python python_services/ai_proposal_writer.py

rem Wait a moment for Python service to start
timeout /t 3 /nobreak >nul

rem Start main Node.js application
set NODE_ENV=development
npx tsx server/index.ts