@echo off
echo Starting Granada OS without database...
echo This will skip database features but run the app
echo.
set SKIP_DB=true
npx tsx server/index.ts
pause