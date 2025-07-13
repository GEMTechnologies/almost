# Windows Commands - Granada OS

## Complete Setup Commands

### 1. Full Setup (Demo Database)
```bash
windows-setup.bat
```
**What it does:**
- Installs all npm dependencies
- Creates .env file with demo database
- Runs database migrations
- Starts the application

### 2. Quick Start (If already setup)
```bash
quick-start.bat
```
**What it does:**
- Creates .env if missing
- Starts the app immediately
- Your confirmed working command: `npx tsx server/index.ts`

### 3. Setup with Real Database
```bash
setup-with-real-db.bat
```
**What it does:**
- Prompts for your Neon database URL
- Creates proper .env with real database
- Migrates schema to your database
- Starts the application

## Manual Commands (If you prefer typing)

### Create Environment File
```bash
echo DATABASE_URL=postgresql://demo:demo@localhost:5432/demo > .env
```

### Install Dependencies
```bash
npm install
```

### Migrate Database
```bash
npm run db:push
```

### Start Application
```bash
npx tsx server/index.ts
```

## One-Line Setup
```bash
echo DATABASE_URL=postgresql://demo:demo@localhost:5432/demo > .env && npx tsx server/index.ts
```

## For Real Database (Recommended)
1. Go to https://neon.tech
2. Create free account
3. Create project
4. Copy connection string
5. Run: `setup-with-real-db.bat`
6. Paste your connection string when prompted

## Your Workflow
Based on our conversation, your preferred method is:
1. Ensure .env exists with DATABASE_URL
2. Run: `npx tsx server/index.ts`
3. Access: http://localhost:5000

The batch files automate the .env creation for you!