# Windows Fix - Quick Solution

## The Problem
1. Your `.env` file has `DATABASE_URL` pointing to "base" which doesn't exist
2. Windows Command Prompt doesn't understand `NODE_ENV=development` syntax

## The Solution

### Step 1: Fix Your .env File
Open your `.env` file and replace the DATABASE_URL line with:
```
DATABASE_URL=postgresql://demo:demo@localhost:5432/demo
```

Or if the file doesn't exist, create it with:
```
DATABASE_URL=postgresql://demo:demo@localhost:5432/demo
SESSION_SECRET=granada_os_session_secret_key_2024
NODE_ENV=development
```

### Step 2: Use Windows-Compatible Commands

Instead of `npm run dev`, use one of these:

**Option 1: Use the .bat file I created**
```
run-app.bat
```
Or double-click `run-app.bat` in your project folder.

**Option 2: Manual command**
```
set NODE_ENV=development && npx tsx server/index.ts
```

**Option 3: Install cross-env first**
```
npm install cross-env
```
Then `npm run dev` will work.

### Step 3: Skip Database Setup (Temporary)
If you want to test the app quickly without setting up a database:

1. Comment out the DATABASE_URL in `.env`:
   ```
   # DATABASE_URL=postgresql://demo:demo@localhost:5432/demo
   ```

2. The app will start but database features won't work.

## Quick Commands for You

Run these in your Command Prompt:

```bash
# Create proper .env file
echo DATABASE_URL=postgresql://demo:demo@localhost:5432/demo > .env

# Start the app
set NODE_ENV=development && npx tsx server/index.ts
```

## What Were You Using Before?

You mentioned you had a way to run this without errors. It was probably one of these:

1. `python scripts/start_all_services.py`
2. `python start_python_ai.py`
3. `npx tsx server/index.ts`
4. Double-clicking a `.bat` or `.py` file

Tell me which one worked, and I'll help you use that method again!