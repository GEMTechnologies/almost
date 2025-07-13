@echo off
echo Quick Start - Granada OS
echo ======================
echo.

REM Check if .env exists, create if not
if not exist .env (
    echo Creating .env file...
    echo DATABASE_URL=postgresql://demo:demo@localhost:5432/demo > .env
    echo SESSION_SECRET=granada_os_session_secret_key_2024 >> .env
    echo NODE_ENV=development >> .env
)

echo Starting Granada OS...
echo Open: http://localhost:5000
echo.
npx tsx server/index.ts