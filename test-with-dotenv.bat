@echo off
echo Testing Granada OS with explicit dotenv loading...
echo.
echo Your .env file contains:
findstr "DATABASE_URL" .env
echo.
echo Starting app with dotenv support...
npx tsx server/index.ts