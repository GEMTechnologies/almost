@echo off
echo ===============================================
echo Granada OS - Complete Windows Setup
echo ===============================================
echo.

echo [1/4] Installing dependencies...
npm install

echo.
echo [2/4] Creating environment file...
echo DATABASE_URL=postgresql://demo:demo@localhost:5432/demo > .env
echo SESSION_SECRET=granada_os_session_secret_key_2024 >> .env
echo NODE_ENV=development >> .env
echo DEEPSEEK_API_KEY=your_api_key_here >> .env
echo STRIPE_SECRET_KEY=your_stripe_key_here >> .env

echo.
echo [3/4] Setting up database schema...
npm run db:push

echo.
echo [4/4] Starting Granada OS...
echo App will be available at: http://localhost:5000
echo.
npx tsx server/index.ts