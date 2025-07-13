# Granada OS - Funding Opportunities Platform

## Overview

Granada OS is a comprehensive funding opportunities platform that connects organizations, students, and businesses with relevant funding sources through AI-powered matching and proposal generation. The system features intelligent bot automation for web scraping, expert-guided proposal writing, and real-time analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API with TanStack Query for server state
- **Routing**: React Router DOM
- **UI Components**: Radix UI primitives with custom styling
- **Build Tool**: Vite with development server

### Backend Architecture
- **Main Server**: Express.js serving both API and frontend
- **API Services**: Multiple specialized FastAPI services
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based with bcrypt password hashing
- **File Processing**: Express middleware for document uploads

### Database Design
- **ORM**: Drizzle with TypeScript schema definitions
- **Database**: PostgreSQL (via Neon)
- **Schema**: Shared schema definitions in `/shared/schema.ts`
- **Migration**: Drizzle Kit for schema management

## Key Components

### 1. Modular Frontend Structure
The frontend is organized into independent modules:
- **Student Module**: Scholarships, courses, applications, mentoring
- **NGO Module**: Grant management, proposals, projects, reporting
- **Business Module**: Funding opportunities, partnerships, compliance
- **Job Seeker Module**: Applications, skills development, networking
- **General User Module**: Opportunity exploration, community features

### 2. AI-Powered Services
- **Intelligent Assistant**: Real-time guidance and suggestions
- **Proposal Generator**: AI-powered grant proposal creation
- **Donor Matching**: Smart matching algorithm for funding opportunities
- **Content Analysis**: Document processing and extraction

### 3. Admin System (Wabden)
- **User Management**: Full CRUD operations for users
- **Opportunity Verification**: Manual review and approval workflow
- **System Analytics**: Real-time monitoring and reporting
- **Bot Control**: Management of web scraping automation

### 4. Bot System
- **Web Scraping**: Selenium-based automated opportunity discovery
- **Content Processing**: AI-powered content extraction and formatting
- **Data Enrichment**: Automated verification and categorization

## Data Flow

1. **User Registration/Login**: Authentication through Express.js API
2. **Opportunity Discovery**: Bot services scrape and process funding opportunities
3. **AI Matching**: Intelligent matching algorithm connects users with relevant opportunities
4. **Proposal Generation**: AI-assisted proposal creation with expert templates
5. **Application Tracking**: End-to-end application lifecycle management
6. **Analytics**: Real-time tracking of user behavior and system performance

## External Dependencies

### Payment Processing
- **Stripe**: Credit card processing and subscription management
- **DodoPay**: Alternative payment gateway with webhook support

### AI Services
- **DeepSeek API**: Large language model for content generation
- **Custom AI Engine**: Intelligent matching and recommendation system

### Communication
- **SendGrid**: Email delivery service
- **WhatsApp Integration**: Direct messaging for human help

### Infrastructure
- **Neon Database**: Managed PostgreSQL hosting
- **ChromeDriver**: Selenium web automation
- **Cloudflare**: CDN and security (implied from domain configuration)

## Deployment Strategy

### Development Environment
- **Port 5000**: Main Express.js server (frontend + API)
- **Multiple FastAPI Services**: Specialized microservices architecture
- **Local Database**: Development database via environment variables

### Production Considerations
- **Single Entry Point**: All traffic routes through Express.js server
- **Service Orchestration**: Background FastAPI services for specialized tasks
- **Database**: Managed PostgreSQL with connection pooling
- **Static Assets**: Served via Express with Vite build output

### Environment Configuration
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **API Keys**: Various service API keys via environment variables
- **CORS**: Configured for cross-origin requests between services

### Build Process
- **Frontend**: Vite build process generating static assets
- **Backend**: ESBuild for server-side code compilation
- **Shared Code**: TypeScript compilation for shared schemas

The architecture prioritizes modularity and scalability while maintaining a simple deployment model through the unified Express.js entry point. The system can handle both individual users and organizational customers with role-based access control and feature segmentation.