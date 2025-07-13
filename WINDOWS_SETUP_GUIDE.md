# Granada OS - Windows Setup Guide

## Prerequisites

### 1. Install Node.js
- Go to https://nodejs.org
- Download Node.js 20.x LTS version
- Run the installer and follow the setup wizard
- Verify installation: Open Command Prompt and run:
  ```
  node --version
  npm --version
  ```

### 2. Install Git
- Go to https://git-scm.com/download/win
- Download and install Git for Windows
- During installation, choose "Git from the command line and also from 3rd-party software"
- Verify installation:
  ```
  git --version
  ```

### 3. Install Python (for AI Services)
- Go to https://www.python.org/downloads/
- Download Python 3.11 or later
- **IMPORTANT**: Check "Add Python to PATH" during installation
- Verify installation:
  ```
  python --version
  pip --version
  ```

## Database Setup

### Option 1: Use Neon Database (Recommended - Cloud)
1. Go to https://neon.tech
2. Create a free account
3. Create a new project
4. Copy the connection string (starts with `postgresql://`)
5. Save this connection string - you'll need it for the `.env` file

### Option 2: Install PostgreSQL Locally
1. Go to https://www.postgresql.org/download/windows/
2. Download and install PostgreSQL
3. During installation, remember the password you set for the `postgres` user
4. After installation, create a database:
   ```
   createdb granada_os
   ```

## Project Setup

### 1. Clone the Project
```bash
git clone [your-repository-url]
cd granada-os
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```
Or if you have a `pyproject.toml`:
```bash
pip install -e .
```

### 4. Environment Variables Setup
Create a `.env` file in the root directory:

**IMPORTANT**: The DATABASE_URL is crucial. Here are the correct formats:

For Neon Database (Recommended):
```env
# Database - Replace with your actual Neon connection string
DATABASE_URL=postgresql://username:password@ep-example-12345.us-east-2.aws.neon.tech/neondb?sslmode=require

For Local PostgreSQL:
```env
# Database - For local PostgreSQL installation
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/granada_os
```

```env
# AI Services
DEEPSEEK_API_KEY=your_deepseek_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Payment Services
STRIPE_SECRET_KEY=your_stripe_secret_key_here
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here

# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Session Secret
SESSION_SECRET=your_random_session_secret_here
```

### FIXING YOUR CURRENT ERROR (URGENT)

Your error shows `ENOTFOUND base` which means your DATABASE_URL has `base` as the hostname. To fix this:

**IMMEDIATE FIX STEPS:**

1. **Find your `.env` file** in `C:\Users\GMM\Documents\good (1)\good\.env`
2. **Open it in Notepad** and look for `DATABASE_URL=`
3. **Replace the entire DATABASE_URL line** with one of these:

   **EASIEST OPTION: Use Neon Database (Free)**
   - Visit: https://neon.tech
   - Click "Sign Up" → Create account
   - Click "Create Project" → Choose a name
   - Copy the connection string (starts with `postgresql://`)
   - Replace your DATABASE_URL with:
   ```
   DATABASE_URL=postgresql://your_copied_connection_string_here
   ```

   **LOCAL OPTION: Install PostgreSQL**
   - Download: https://www.postgresql.org/download/windows/
   - Install PostgreSQL (remember the password!)
   - Open Command Prompt as Administrator, run:
   ```
   createdb granada_os
   ```
   - Set DATABASE_URL to:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/granada_os
   ```

4. **Save the `.env` file**
5. **Try again:** `npm run db:push`

**ALTERNATIVE: Skip Database Setup Initially**
If you just want to test the app without database features:
- Comment out the DATABASE_URL line in `.env` by adding `#` at the start:
  ```
  # DATABASE_URL=postgresql://...
  ```
- The app will run but database features won't work

**Important**: Replace all placeholder values with your actual API keys and database connection string.

### 5. Database Migration
```bash
npm run db:push
```

## Running the Application

### Windows Users - You Have 4 Options:

**Option 1: Simple Start (Recommended for Windows)**
```bash
start.bat
```
Or double-click the `start.bat` file in your project folder.

**Option 2: With Python AI Services**
```bash
start-python.bat
```
This starts both Node.js and Python AI services.

**Option 3: Using Cross-Env (After installing cross-env)**
```bash
npm run dev
```
This now works on Windows because we installed cross-env.

**Option 4: Manual Windows Command**
```bash
set NODE_ENV=development && npx tsx server/index.ts
```

**Option 5: Start Python AI Service Separately**
In a separate command prompt:
```bash
python python_services/start_ai_writer.py
```

### 3. Access the Application
- Main application: http://localhost:5000
- AI Services: http://localhost:8030

## API Keys You'll Need

### 1. DeepSeek API Key
- Go to https://platform.deepseek.com
- Create an account and get your API key
- Add to `.env` file as `DEEPSEEK_API_KEY`

### 2. OpenAI API Key (Optional)
- Go to https://platform.openai.com
- Create an account and get your API key
- Add to `.env` file as `OPENAI_API_KEY`

### 3. Stripe Keys (For Payments)
- Go to https://stripe.com
- Create an account and get your test/live keys
- Add to `.env` file as `STRIPE_SECRET_KEY`

### 4. SendGrid API Key (For Emails)
- Go to https://sendgrid.com
- Create an account and get your API key
- Add to `.env` file as `SENDGRID_API_KEY`

## Development Tools (Recommended)

### 1. Visual Studio Code
- Download from https://code.visualstudio.com
- Install extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets

### 2. Database Management
- Install pgAdmin 4 for PostgreSQL management
- Or use VS Code extension: PostgreSQL

## Troubleshooting

### Common Issues

1. **Node modules issues**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Python dependency issues**:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt --force-reinstall
   ```

3. **Database connection issues**:
   - Check your DATABASE_URL is correct
   - Ensure PostgreSQL service is running
   - Verify database exists

4. **Port already in use**:
   ```bash
   netstat -ano | findstr :5000
   taskkill /PID [process_id] /F
   ```

### Getting Help

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all required services (database, etc.) are running
4. Check the application logs for detailed error information

## Project Structure

```
granada-os/
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared TypeScript types
├── python_services/ # Python AI services
├── docs/           # Documentation
└── scripts/        # Utility scripts
```

## Next Steps

After successful setup:
1. Access the application at http://localhost:5000
2. Create your first user account
3. Explore the NGO dashboard and funding opportunities
4. Test the AI proposal generation features
5. Configure payment methods and credit system

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Use production database credentials
3. Use live API keys (not test keys)
4. Configure proper domain and SSL certificates
5. Set up monitoring and logging

---

For additional support, refer to the main documentation in `/docs/` or check the `replit.md` file for project-specific details.