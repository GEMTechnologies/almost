# Quick Start Guide - Granada NGO Management System

Get your NGO management system running in minutes!

## 🚀 Quick Setup (Recommended)

### Option 1: Docker Setup (Easiest)
```bash
# 1. Clone and enter directory
git clone <repository-url>
cd NGOs

# 2. Copy environment file
cp .env.example .env

# 3. Start everything with Docker
docker-compose up --build
```

**That's it!** Visit http://localhost:3000 to access your NGO management system.

### Option 2: Local Development Setup
```bash
# 1. Install dependencies
npm run setup

# 2. Start services in development mode
npm run dev
```

## 🎯 What You Get

- **Shell Application**: Main dashboard at http://localhost:3000
- **AI Supervisor**: Intelligent monitoring at http://localhost:8001
- **Finance Service**: Financial management at http://localhost:8002
- **Grants Service**: Grant applications at http://localhost:8003
- **Projects Service**: Project tracking at http://localhost:8004

## 🔑 Default Login

- **Username**: admin
- **Password**: admin
- **Organization**: Sample NGO Organization

## 📊 Key Features

### Dashboard Overview
- Project statistics and progress
- Financial summaries
- Grant application status
- AI-powered insights

### Finance Management
- Transaction tracking
- Budget monitoring
- Financial reporting
- Expense categorization

### Grant Management
- Grant opportunity search
- Application submission
- Status tracking
- Document management

### Project Management
- Project creation and tracking
- Milestone management
- Team coordination
- Progress monitoring

### AI Supervision
- Intelligent insights
- Risk assessment
- Performance optimization
- Automated recommendations

## 🛠️ Available Commands

```bash
# Development
npm start              # Start shell application only
npm run dev           # Start all services in development mode
npm run start:services # Start only backend services

# Building
npm run build         # Build all applications
npm run build:shell   # Build shell application only

# Setup
npm run setup         # Install all dependencies
npm run install:all   # Install frontend dependencies
npm run install:python # Install Python packages

# Docker
npm run docker:build  # Build Docker images
npm run docker:up     # Start with Docker Compose
npm run docker:down   # Stop Docker services

# Testing
npm test              # Run all tests
npm run test:frontend # Frontend tests only
npm run test:backend  # Backend tests only
```

## 🔧 Configuration

### Environment Variables
Edit `.env` file to configure:
- Database connection
- API keys (Gemini AI, OpenAI)
- Service URLs
- Security secrets

### Database Setup
The system automatically creates tables and sample data. For custom setup:
```bash
psql -U granada_user -d granada_ngo -f database/init.sql
```

## 📁 Project Structure

```
NGOs/
├── packages/
│   ├── db-models/python/     # Shared data models
│   └── ui-components/        # Reusable UI components
├── services/
│   ├── ai-supervisor-service/  # AI monitoring
│   ├── finance-service/        # Financial management
│   ├── grants-service/         # Grant applications
│   └── projects-service/       # Project tracking
├── shell-app/
│   └── frontend/              # Main application
├── database/
│   └── init.sql              # Database schema
├── docker-compose.yml        # Docker configuration
└── package.json             # Main npm scripts
```

## 🌐 Service Architecture

Each service is independent and can be scaled separately:

- **Shell App (Port 3000)**: Main UI with routing and authentication
- **AI Supervisor (Port 8001)**: Intelligent monitoring with Gemini AI
- **Finance (Port 8002)**: Transaction and budget management
- **Grants (Port 8003)**: Grant search and application management
- **Projects (Port 8004)**: Project and milestone tracking

## 📚 Documentation

- **API Documentation**: Visit `/docs` endpoint for each service
- **Architecture Guide**: See `README.md` for detailed architecture
- **Development Guide**: Check individual service README files

## 🆘 Troubleshooting

### Common Issues

**Port conflicts**:
```bash
# Check running services
lsof -i :3000
# Kill process if needed
kill -9 <PID>
```

**Database connection issues**:
```bash
# Check PostgreSQL status
docker-compose ps postgres
# View logs
docker-compose logs postgres
```

**Python dependencies**:
```bash
# Install Python packages manually
cd packages/db-models/python
pip install -e .
```

### Getting Help

1. Check the logs: `docker-compose logs [service-name]`
2. Verify environment variables in `.env`
3. Ensure all ports are available
4. Review service health: http://localhost:800[1-4]/health

## 🚀 Production Deployment

For production deployment:
1. Update `.env` with production values
2. Use `docker-compose.prod.yml`
3. Configure SSL/TLS certificates
4. Set up database backups
5. Configure monitoring and logging

## 💡 Next Steps

1. **Customize**: Modify organization details in database
2. **Configure AI**: Add your Gemini API key for AI features
3. **Add Users**: Create additional user accounts
4. **Import Data**: Import existing financial and project data
5. **Customize UI**: Modify themes and branding

Ready to transform your NGO operations! 🎉