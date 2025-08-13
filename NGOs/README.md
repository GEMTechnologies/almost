# Granada NGO Management System - Microservices Architecture

A comprehensive microservices-based NGO management platform built with modern web technologies and AI-powered supervision.

## Architecture Overview

The Granada NGO system follows a microservices architecture with the following components:

### 📦 Packages
- **DB Models (Python)**: Shared data models and schemas
- **UI Components**: Reusable React components library

### 🔧 Services
- **AI Supervisor Service**: Intelligent monitoring and guidance
- **Finance Service**: Financial management and reporting
- **Grants Service**: Grant applications and funding management
- **Projects Service**: Project management and tracking

### 🖥️ Shell Application
- **Frontend Shell**: Main application shell with routing and service orchestration

## Technology Stack

### Backend Services
- **Python 3.11** with FastAPI
- **PostgreSQL** for data persistence
- **Docker** for containerization
- **Uvicorn** ASGI server

### Frontend Applications
- **React 18** with modern hooks
- **Webpack 5** for module bundling
- **Micro-frontend** architecture
- **React Router** for navigation

### AI & Intelligence
- **Google Gemini AI** for intelligent analysis
- **Real-time monitoring** and alerts
- **Automated insights** and recommendations

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NGOs
   ```

2. **Install Python dependencies**
   ```bash
   cd packages/db-models/python
   pip install -e .
   ```

3. **Install Node.js dependencies for each frontend**
   ```bash
   # Shell application
   cd shell-app/frontend
   npm install

   # Service frontends
   cd ../../services/finance-service/frontend
   npm install

   cd ../grants-service/frontend
   npm install

   cd ../projects-service/frontend
   npm install
   ```

### Running the System

#### Development Mode

1. **Start Backend Services**
   ```bash
   # AI Supervisor Service
   cd services/ai-supervisor-service/backend
   uvicorn main:app --host 0.0.0.0 --port 8001 --reload

   # Finance Service
   cd ../finance-service/backend
   uvicorn main:app --host 0.0.0.0 --port 8002 --reload

   # Grants Service
   cd ../grants-service/backend
   uvicorn main:app --host 0.0.0.0 --port 8003 --reload

   # Projects Service
   cd ../projects-service/backend
   uvicorn main:app --host 0.0.0.0 --port 8004 --reload
   ```

2. **Start Frontend Applications**
   ```bash
   # Shell Application (Main UI)
   cd shell-app/frontend
   npm start  # Runs on port 3000

   # Service Frontends (if running standalone)
   cd services/finance-service/frontend
   npm start  # Runs on port 3002

   cd ../grants-service/frontend
   npm start  # Runs on port 3003

   cd ../projects-service/frontend
   npm start  # Runs on port 3004
   ```

#### Docker Mode

```bash
# Build and start all services
docker-compose up --build

# Start specific service
docker-compose up ai-supervisor-service
```

## Service Details

### AI Supervisor Service (Port 8001)
- **Monitors**: Grant deadlines, project progress, budget utilization
- **AI Analysis**: Proposal quality assessment, project risk analysis
- **Alerts**: Real-time notifications and recommendations
- **Endpoints**: `/api/insights`, `/api/recommendations`, `/api/alerts`

### Finance Service (Port 8002)
- **Features**: Transaction management, budget tracking, financial reporting
- **Endpoints**: `/api/finance/transactions`, `/api/finance/budgets`, `/api/finance/reports`

### Grants Service (Port 8003)
- **Features**: Grant search, application management, status tracking
- **Endpoints**: `/api/grants/search`, `/api/grants/applications`

### Projects Service (Port 8004)
- **Features**: Project creation, milestone tracking, team management
- **Endpoints**: `/api/projects`, `/api/projects/{id}/milestones`

### Shell Application (Port 3000)
- **Features**: Main dashboard, service orchestration, authentication
- **Routes**: `/dashboard`, `/finance/*`, `/grants/*`, `/projects/*`

## Database Schema

The system uses the Granada Models package for consistent data structures:

- **Finance Models**: Transaction, Budget, FinancialReport
- **Project Models**: Project, ProjectMilestone, ProjectActivity
- **Proposal Models**: Proposal, ProposalDocument, ProposalReview
- **User Models**: NGOUser, UserProfile, UserPermission

## API Documentation

Each service provides OpenAPI documentation at:
- AI Supervisor: `http://localhost:8001/docs`
- Finance: `http://localhost:8002/docs`
- Grants: `http://localhost:8003/docs`
- Projects: `http://localhost:8004/docs`

## Environment Configuration

Create `.env` files for each service:

```env
# Backend services
DATABASE_URL=postgresql://user:password@localhost:5432/ngo_db
GEMINI_API_KEY=your_gemini_api_key
LOG_LEVEL=INFO

# Frontend applications
REACT_APP_API_BASE_URL=http://localhost:8001
REACT_APP_ENVIRONMENT=development
```

## Deployment

### Production Deployment

1. **Build Docker images**
   ```bash
   docker build -t ngo-ai-supervisor ./services/ai-supervisor-service
   docker build -t ngo-finance ./services/finance-service
   docker build -t ngo-grants ./services/grants-service
   docker build -t ngo-projects ./services/projects-service
   ```

2. **Deploy to orchestration platform**
   - Kubernetes manifests available in `/k8s`
   - Docker Compose for local production in `/docker-compose.prod.yml`

### Scaling Considerations

- **Horizontal Scaling**: Each service can be scaled independently
- **Load Balancing**: Use nginx or cloud load balancer
- **Database**: Consider read replicas for high-traffic services
- **Caching**: Redis for session management and caching

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

Copyright © 2025 Granada OS Team. All rights reserved.

## Support

For support and questions:
- Create an issue in the repository
- Email: support@granada-os.com
- Documentation: [docs.granada-os.com](https://docs.granada-os.com)