@echo off
echo Testing .env file recognition...
echo.
echo Checking if .env file exists:
if exist .env (
    echo ✓ .env file found
    echo.
    echo First few lines of .env:
    head -5 .env 2>nul || (
        echo Using 'more' to show content:
        more +1 .env | findstr /n "DATABASE_URL"
    )
) else (
    echo ✗ .env file NOT found
)
echo.
echo Testing environment variable loading:
echo DATABASE_URL from environment: %DATABASE_URL%
echo.
echo Starting app with explicit environment loading...
npx tsx server/index.ts