@echo off
echo ===============================================
echo Granada OS - Setup with Real Database
echo ===============================================
echo.
echo This script will:
echo 1. Install dependencies
echo 2. Create .env with Neon database
echo 3. Migrate database schema
echo 4. Start the application
echo.
echo IMPORTANT: You need a Neon database URL
echo Get one free at: https://neon.tech
echo.
set /p DATABASE_URL="Enter your Neon DATABASE_URL: "

echo.
echo [1/4] Installing dependencies...
npm install

echo.
echo [2/4] Creating environment file...
echo DATABASE_URL=%DATABASE_URL% > .env
echo SESSION_SECRET=granada_os_session_secret_key_2024 >> .env
echo NODE_ENV=development >> .env
echo DEEPSEEK_API_KEY=your_api_key_here >> .env

echo.
echo [3/4] Migrating database...
npm run db:push

echo.
echo [4/4] Starting Granada OS...
echo App available at: http://localhost:5000
echo.
npx tsx server/index.ts