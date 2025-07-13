@echo off
echo Fixing Granada OS for Windows...
echo.

echo 1. Installing cross-env for Windows compatibility...
npm install cross-env

echo.
echo 2. Creating proper .env file...
echo # Granada OS Environment Variables > .env
echo DATABASE_URL=postgresql://demo:demo@localhost:5432/demo >> .env
echo SESSION_SECRET=granada_os_session_secret_key_2024 >> .env
echo NODE_ENV=development >> .env

echo.
echo 3. Testing the application...
echo Starting Granada OS on Windows...
set NODE_ENV=development
npx tsx server/index.ts