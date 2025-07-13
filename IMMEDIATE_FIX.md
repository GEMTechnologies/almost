# IMMEDIATE FIX - DATABASE_URL Error

## The Problem
Your `.env` file is missing or doesn't have DATABASE_URL set.

## Quick Solutions

### Solution 1: Create .env file (EASIEST)
Run this in your Command Prompt:
```bash
echo DATABASE_URL=postgresql://demo:demo@localhost:5432/demo > .env
```

Then try again:
```bash
npx tsx server/index.ts
```

### Solution 2: Use the batch file I created
Double-click `create-env.bat` in your project folder, then run:
```bash
npx tsx server/index.ts
```

### Solution 3: Run without database (TEMPORARY)
```bash
set SKIP_DB=true && npx tsx server/index.ts
```

### Solution 4: Manual .env creation
Create a file called `.env` in your project folder with this content:
```
DATABASE_URL=postgresql://demo:demo@localhost:5432/demo
SESSION_SECRET=granada_os_session_secret_key_2024
NODE_ENV=development
```

## For Real Database (Later)
If you want full functionality:
1. Go to https://neon.tech (free)
2. Create account and project
3. Copy the connection string
4. Replace DATABASE_URL in .env with real connection string

## Your Next Command
After creating .env file:
```bash
npx tsx server/index.ts
```