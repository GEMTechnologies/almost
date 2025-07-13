@echo off
echo Loading environment variables manually...
echo.

REM Load DATABASE_URL from .env file
for /f "tokens=1,2 delims==" %%a in ('findstr "^DATABASE_URL=" .env') do set %%a=%%b

echo DATABASE_URL loaded: %DATABASE_URL%
echo.
echo Starting Granada OS...
npx tsx server/index.ts