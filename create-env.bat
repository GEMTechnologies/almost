@echo off
echo Creating .env file for Granada OS...
echo DATABASE_URL=postgresql://demo:demo@localhost:5432/demo > .env
echo SESSION_SECRET=granada_os_session_secret_key_2024 >> .env
echo NODE_ENV=development >> .env
echo DEEPSEEK_API_KEY=your_api_key_here >> .env
echo.
echo .env file created successfully!
echo Contents:
type .env
echo.
echo Now you can run: npx tsx server/index.ts
pause