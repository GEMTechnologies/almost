@echo off
echo Creating .env file with DATABASE_URL...
echo DATABASE_URL=postgresql://demo:demo@localhost:5432/demo > .env
echo SESSION_SECRET=granada_os_session_secret_key_2024 >> .env
echo NODE_ENV=development >> .env
echo.
echo .env file created! Contents:
type .env
echo.
echo Now starting Granada OS...
npx tsx server/index.ts