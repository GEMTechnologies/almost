# Granada OS - Quick Start for Windows

## You were running this app before - here's how to get it working again:

### What command were you using before?

Based on your project, you probably used one of these:

1. **Double-clicked a .bat file** - Look for:
   - `start.bat` (I just created this for you)
   - `start-python.bat` (includes AI services)

2. **Used Python command** - Try:
   ```bash
   python scripts/start_all_services.py
   ```

3. **Used direct server command** - Try:
   ```bash
   npx tsx server/index.ts
   ```

### Fix Your Database Error First

Your error `ENOTFOUND base` means your `.env` file has wrong database settings.

**QUICK FIX:**
1. Open `.env` file in your project folder
2. Find the line that starts with `DATABASE_URL=`
3. Replace it with:
   ```
   DATABASE_URL=postgresql://demo:demo@localhost:5432/demo
   ```
4. Save the file

### Now Try Running:

**Option 1: Use the .bat file I created**
```bash
start.bat
```

**Option 2: Use the working Node.js command**
```bash
set NODE_ENV=development && npx tsx server/index.ts
```

**Option 3: Use Python services**
```bash
python python_services/start_ai_writer.py
```

### Which Method Were You Using?

Tell me which command worked for you before, and I'll help you get it working again!

Common commands that might have worked:
- `python start_python_ai.py`
- `python scripts/start_all_services.py`
- `bash scripts/start.sh` (if you had Git Bash)
- Double-clicking a `.bat` or `.py` file
- `npx tsx server/index.ts`

### If All Else Fails - Simple Start

Try this basic command:
```bash
npx tsx server/index.ts
```

This should start the app without environment variables, then we can fix the database later.