# Granada OS - Funding Opportunities Platform

## Overview

Granada OS is a comprehensive AI-powered funding opportunities platform designed to connect organizations, students, and businesses with relevant funding sources. Its core capabilities include intelligent proposal generation, donor matching, and a multi-module architecture tailored for various user types like NGOs, students, businesses, and general users. The platform aims to streamline the funding acquisition process, offering advanced AI tools for content creation and analysis, making it a vital resource for securing financial support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### NGO Microservices Architecture (NEW - January 2025)
- **Structure**: Complete independent microservice in `/NGOs/` folder following modern micro-frontend architecture
- **Packages**: Shared components (`/packages/db-models/python`, `/packages/ui-components`)
- **Services**: Four independent services with separate frontend/backend:
  - AI Supervisor Service (Port 8001) - Intelligent monitoring and guidance
  - Finance Service (Port 8002) - Financial management and reporting  
  - Grants Service (Port 8003) - Grant applications and funding management
  - Projects Service (Port 8004) - Project management and tracking
- **Shell App**: Main orchestration application (Port 3000) with authentication and service routing
- **Backend**: Python FastAPI services with Docker containerization
- **Frontend**: React 18 micro-frontends with Webpack federation
- **Database**: Shared PostgreSQL with service-specific schemas using Granada Models package

### Original Frontend (Legacy)
- **Framework**: React 18 with TypeScript and Vite.
- **Styling**: Tailwind CSS with shadcn/ui and Radix UI primitives.
- **State Management**: React Context API and TanStack Query.
- **Routing**: React Router DOM (converted from wouter for consistency).
- **Animation**: Framer Motion.
- **UI/UX Decisions**: Professional dark-themed dashboards (e.g., NGO, Student, Business portals) with consistent color schemes (slate-900, emerald accents), card-based layouts, interactive elements (hover effects, animations), and mobile-first responsive design. Gamification elements like achievement points and badges are integrated into user interfaces for engagement.
- **NGO Pages**: Successfully converted all modals to standalone pages with proper `/ngos/...` URL routing

### Backend
- **Architecture**: Hybrid system with original Express.js API Gateway and new NGO microservices architecture
- **Database**: PostgreSQL, with individual service connections for resilience.
- **Service Structure**: Each feature is a standalone system with its own backend (FastAPI), frontend (React components), and shared TypeScript types. Services can run independently or together, offering administrative control for enabling/disabling premium features via credits.

### Key Architectural Decisions
- **NGO Microservices Independence**: Complete separation of NGO functionality into independent microservice architecture with shared packages and shell app orchestration
- **Modal-to-Page Conversion**: Successfully converted all NGO modals to standalone pages with proper URL routing (`/ngos/documents/*`, `/ngos/*`)
- **Multi-Module Frontend**: Specialized modules cater to different user types (Student, NGO, Business, Job Seeker, Admin) with dedicated navigation and functionalities.
- **AI-Powered Services**: Integration of AI for core features like proposal generation, donor matching, and document processing. This includes a streaming AI writer and media-rich proposal generation for automated creation of visual content (charts, tables, infographics). NEW: Dedicated AI Supervisor Service with Gemini integration for intelligent monitoring.
- **Comprehensive Admin System (Wabden)**: Centralized management for users, opportunity verification, HR, accounting, and bot control for web scraping.
- **Payment Integration**: A credit-based system supporting various payment methods (credit card, mobile money) with real-time validation and a coupon system.
- **Fault Isolation**: Services operate independently to prevent cascading failures.
- **Scalability**: Services can be scaled independently based on demand.
- **Micro-Frontend Architecture**: Each NGO service has its own React frontend that can run standalone or be orchestrated through the shell application.

## External Dependencies

### AI Services
- **DeepSeek API**: Primary AI service for content generation, analysis, and proposal writing.
- **Custom AI Engine**: Local AI processing for user guidance.

### Database & Infrastructure
- **Neon Database**: PostgreSQL hosting.
- **Vercel/Replit**: Deployment platform.

### Payment Processing
- **DodoPay**: Primary payment processor.
- **Stripe**: Alternative international payment processing.
- **Mobile Money**: Regional payment methods (e.g., PesaPal 3.0 for MTN/Airtel Mobile Money).
- **PayPal SDK**: For PayPal transactions.

### Web Scraping & Automation
- **Selenium WebDriver**: Automated browser for funding opportunity discovery.
- **Custom Bot Services**: Specialized scrapers for funding websites.