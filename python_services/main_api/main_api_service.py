#!/usr/bin/env python3
"""
Granada OS - Main API Service
Central orchestrator for all modular services
Port: 8000 (Main entry point)
"""

from fastapi import FastAPI, HTTPException, Depends, Security, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
import asyncio
import asyncpg
import json
import os
import logging
from datetime import datetime, timedelta
import uuid
import httpx
from contextlib import asynccontextmanager
import uvicorn
from enum import Enum
import importlib.util
import sys
import traceback

# ============================================================================
# CONFIGURATION & SETUP
# ============================================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")
security = HTTPBearer()

# ============================================================================
# ENUMS AND MODELS
# ============================================================================

class ServiceStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ERROR = "error"
    MAINTENANCE = "maintenance"
    DISABLED = "disabled"

class ServiceType(str, Enum):
    CORE = "core"
    FEATURE = "feature"
    INTEGRATION = "integration"
    UTILITY = "utility"

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    ORGANIZATION = "organization"
    PREMIUM = "premium"

class ServiceConfig(BaseModel):
    name: str
    module_path: str
    port: int
    status: ServiceStatus
    service_type: ServiceType
    description: str
    version: str
    dependencies: List[str] = Field(default=[])
    required_roles: List[UserRole] = Field(default=[])
    is_premium: bool = Field(default=False)
    health_check_url: str
    admin_enabled: bool = Field(default=True)
    user_unlockable: bool = Field(default=True)
    metadata: Dict[str, Any] = Field(default={})

class UserServiceAccess(BaseModel):
    user_id: str
    service_name: str
    access_level: str
    expires_at: Optional[datetime] = None
    usage_count: int = Field(default=0)
    usage_limit: Optional[int] = None
    unlocked_at: datetime

# ============================================================================
# SERVICE REGISTRY
# ============================================================================

class ServiceRegistry:
    def __init__(self):
        self.services: Dict[str, ServiceConfig] = {}
        self.service_instances: Dict[str, Any] = {}
        self.service_health: Dict[str, Dict] = {}
        self.load_service_configs()
    
    def load_service_configs(self):
        """Load all service configurations"""
        service_configs = [
            ServiceConfig(
                name="proposal_writing",
                module_path="python_services.proposal_writing.backend.proposal_service",
                port=8020,
                status=ServiceStatus.ACTIVE,
                service_type=ServiceType.FEATURE,
                description="AI-powered proposal generation and management system",
                version="1.0.0",
                dependencies=["ai_assistant", "document_processing"],
                required_roles=[UserRole.USER, UserRole.ORGANIZATION],
                is_premium=True,
                health_check_url="/api/health",
                admin_enabled=True,
                user_unlockable=True,
                metadata={"ai_models": ["deepseek", "gemini"], "export_formats": ["pdf", "docx", "markdown"]}
            ),
            ServiceConfig(
                name="opportunity_discovery",
                module_path="python_services.opportunity_discovery.backend.discovery_service",
                port=8021,
                status=ServiceStatus.ACTIVE,
                service_type=ServiceType.FEATURE,
                description="AI-powered funding opportunity discovery and matching",
                version="1.0.0",
                dependencies=["ai_assistant", "web_scraping"],
                required_roles=[UserRole.USER, UserRole.ORGANIZATION],
                is_premium=False,
                health_check_url="/api/health",
                admin_enabled=True,
                user_unlockable=True,
                metadata={"matching_algorithms": ["ai", "rule_based"], "sources": ["government", "foundation", "corporate"]}
            ),
            ServiceConfig(
                name="organization_management",
                module_path="python_services.organization_management.backend.org_service",
                port=8022,
                status=ServiceStatus.ACTIVE,
                service_type=ServiceType.CORE,
                description="Comprehensive organization profile and team management",
                version="1.0.0",
                dependencies=["user_management", "document_processing"],
                required_roles=[UserRole.ORGANIZATION],
                is_premium=False,
                health_check_url="/api/health",
                admin_enabled=True,
                user_unlockable=False,
                metadata={"features": ["team_management", "compliance", "reporting"]}
            ),
            ServiceConfig(
                name="ai_assistant",
                module_path="python_services.ai_assistant.backend.ai_service",
                port=8023,
                status=ServiceStatus.ACTIVE,
                service_type=ServiceType.CORE,
                description="Intelligent AI assistant for guidance and support",
                version="1.0.0",
                dependencies=[],
                required_roles=[UserRole.USER, UserRole.ORGANIZATION],
                is_premium=False,
                health_check_url="/api/health",
                admin_enabled=True,
                user_unlockable=True,
                metadata={"models": ["deepseek", "gemini"], "capabilities": ["chat", "analysis", "recommendations"]}
            ),
            ServiceConfig(
                name="document_processing",
                module_path="python_services.document_processing.backend.doc_service",
                port=8024,
                status=ServiceStatus.ACTIVE,
                service_type=ServiceType.UTILITY,
                description="Advanced document processing and analysis",
                version="1.0.0",
                dependencies=["ai_assistant"],
                required_roles=[UserRole.USER, UserRole.ORGANIZATION],
                is_premium=True,
                health_check_url="/api/health",
                admin_enabled=True,
                user_unlockable=True,
                metadata={"formats": ["pdf", "docx", "txt", "html"], "features": ["ocr", "analysis", "extraction"]}
            ),
            ServiceConfig(
                name="user_dashboard",
                module_path="python_services.user_dashboard.backend.dashboard_service",
                port=8025,
                status=ServiceStatus.ACTIVE,
                service_type=ServiceType.CORE,
                description="Personalized user dashboard and analytics",
                version="1.0.0",
                dependencies=["analytics", "notification"],
                required_roles=[UserRole.USER, UserRole.ORGANIZATION],
                is_premium=False,
                health_check_url="/api/health",
                admin_enabled=True,
                user_unlockable=False,
                metadata={"widgets": ["progress", "opportunities", "deadlines", "analytics"]}
            ),
            ServiceConfig(
                name="notification",
                module_path="python_services.notification.notification_service",
                port=8010,
                status=ServiceStatus.ACTIVE,
                service_type=ServiceType.CORE,
                description="Comprehensive notification and communication system",
                version="1.0.0",
                dependencies=[],
                required_roles=[UserRole.USER, UserRole.ORGANIZATION],
                is_premium=False,
                health_check_url="/api/health",
                admin_enabled=True,
                user_unlockable=False,
                metadata={"channels": ["email", "sms", "push", "in_app"]}
            ),
            ServiceConfig(
                name="analytics",
                module_path="python_services.analytics.analytics_service",
                port=8026,
                status=ServiceStatus.ACTIVE,
                service_type=ServiceType.FEATURE,
                description="Advanced analytics and reporting platform",
                version="1.0.0",
                dependencies=["user_dashboard"],
                required_roles=[UserRole.USER, UserRole.ORGANIZATION],
                is_premium=True,
                health_check_url="/api/health",
                admin_enabled=True,
                user_unlockable=True,
                metadata={"features": ["custom_dashboards", "predictive_analytics", "export"]}
            ),
            ServiceConfig(
                name="payment",
                module_path="python_services.payment.payment_service",
                port=8027,
                status=ServiceStatus.ACTIVE,
                service_type=ServiceType.CORE,
                description="Secure payment processing and credit management",
                version="1.0.0",
                dependencies=["user_management"],
                required_roles=[UserRole.USER, UserRole.ORGANIZATION],
                is_premium=False,
                health_check_url="/api/health",
                admin_enabled=True,
                user_unlockable=False,
                metadata={"providers": ["stripe", "paypal"], "features": ["credits", "subscriptions"]}
            ),
            ServiceConfig(
                name="compliance",
                module_path="python_services.compliance.compliance_service",
                port=8028,
                status=ServiceStatus.ACTIVE,
                service_type=ServiceType.FEATURE,
                description="Regulatory compliance and audit management",
                version="1.0.0",
                dependencies=["organization_management", "document_processing"],
                required_roles=[UserRole.ORGANIZATION],
                is_premium=True,
                health_check_url="/api/health",
                admin_enabled=True,
                user_unlockable=True,
                metadata={"frameworks": ["sox", "gdpr", "hipaa"], "features": ["audit_trails", "reporting"]}
            )
        ]
        
        for config in service_configs:
            self.services[config.name] = config
    
    async def start_service(self, service_name: str) -> bool:
        """Start a specific service"""
        if service_name not in self.services:
            logger.error(f"Service {service_name} not found in registry")
            return False
        
        config = self.services[service_name]
        
        try:
            # Dynamic import of service module
            spec = importlib.util.spec_from_file_location(
                config.name, 
                config.module_path.replace(".", "/") + ".py"
            )
            
            if spec and spec.loader:
                module = importlib.util.module_from_spec(spec)
                sys.modules[config.name] = module
                spec.loader.exec_module(module)
                
                # Store service instance
                self.service_instances[service_name] = module
                
                # Update status
                config.status = ServiceStatus.ACTIVE
                logger.info(f"Service {service_name} started successfully")
                return True
            else:
                logger.error(f"Failed to load module for service {service_name}")
                config.status = ServiceStatus.ERROR
                return False
                
        except Exception as e:
            logger.error(f"Error starting service {service_name}: {e}")
            config.status = ServiceStatus.ERROR
            return False
    
    async def stop_service(self, service_name: str) -> bool:
        """Stop a specific service"""
        if service_name in self.service_instances:
            try:
                # Clean up service instance
                del self.service_instances[service_name]
                
                # Update status
                if service_name in self.services:
                    self.services[service_name].status = ServiceStatus.INACTIVE
                
                logger.info(f"Service {service_name} stopped successfully")
                return True
                
            except Exception as e:
                logger.error(f"Error stopping service {service_name}: {e}")
                return False
        
        return True
    
    async def check_service_health(self, service_name: str) -> Dict:
        """Check health of a specific service"""
        if service_name not in self.services:
            return {"status": "not_found", "error": "Service not in registry"}
        
        config = self.services[service_name]
        
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"http://localhost:{config.port}{config.health_check_url}")
                
                if response.status_code == 200:
                    health_data = response.json()
                    self.service_health[service_name] = {
                        "status": "healthy",
                        "response_time": response.elapsed.total_seconds(),
                        "data": health_data,
                        "last_check": datetime.utcnow().isoformat()
                    }
                    return self.service_health[service_name]
                else:
                    self.service_health[service_name] = {
                        "status": "unhealthy",
                        "error": f"HTTP {response.status_code}",
                        "last_check": datetime.utcnow().isoformat()
                    }
                    return self.service_health[service_name]
                    
        except Exception as e:
            self.service_health[service_name] = {
                "status": "unreachable",
                "error": str(e),
                "last_check": datetime.utcnow().isoformat()
            }
            return self.service_health[service_name]
    
    async def get_user_accessible_services(self, user_id: str, user_role: UserRole) -> List[str]:
        """Get list of services accessible to a user"""
        async with db_manager.get_connection() as conn:
            # Get user's unlocked services
            unlocked_services = await conn.fetch("""
                SELECT service_name FROM user_service_access 
                WHERE user_id = $1 AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
            """, user_id)
            
            unlocked_service_names = [row['service_name'] for row in unlocked_services]
            
            accessible_services = []
            
            for service_name, config in self.services.items():
                # Check if service is active and user has required role
                if (config.status == ServiceStatus.ACTIVE and 
                    user_role in config.required_roles and
                    (not config.user_unlockable or service_name in unlocked_service_names or 
                     not config.is_premium)):
                    accessible_services.append(service_name)
            
            return accessible_services

# Initialize service registry
service_registry = ServiceRegistry()

# ============================================================================
# DATABASE CONNECTION
# ============================================================================

class DatabaseManager:
    def __init__(self):
        self.pool = None
    
    async def create_pool(self):
        self.pool = await asyncpg.create_pool(
            DATABASE_URL,
            min_size=10,
            max_size=20,
            command_timeout=60
        )
    
    async def close_pool(self):
        if self.pool:
            await self.pool.close()
    
    async def get_connection(self):
        if not self.pool:
            await self.create_pool()
        return self.pool.acquire()

db_manager = DatabaseManager()

# ============================================================================
# AUTHENTICATION
# ============================================================================

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Get current authenticated user"""
    try:
        # This would typically validate JWT token
        return {
            "user_id": "user_123", 
            "email": "user@example.com",
            "role": UserRole.USER,
            "is_premium": False
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# ============================================================================
# FASTAPI APPLICATION SETUP
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db_manager.create_pool()
    
    # Start all active services
    for service_name in service_registry.services:
        if service_registry.services[service_name].status == ServiceStatus.ACTIVE:
            await service_registry.start_service(service_name)
    
    logger.info("Main API Service started on port 8000")
    yield
    
    # Stop all services
    for service_name in list(service_registry.service_instances.keys()):
        await service_registry.stop_service(service_name)
    
    await db_manager.close_pool()

app = FastAPI(
    title="Granada OS - Main API Service",
    description="Central orchestrator for all modular services",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# MAIN API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Main API service health check"""
    return {
        "service": "Granada OS Main API Service",
        "version": "1.0.0",
        "status": "operational",
        "active_services": len([
            s for s in service_registry.services.values() 
            if s.status == ServiceStatus.ACTIVE
        ]),
        "total_services": len(service_registry.services),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/services")
async def list_services(current_user: dict = Depends(get_current_user)):
    """List all available services"""
    user_accessible = await service_registry.get_user_accessible_services(
        current_user["user_id"], 
        current_user["role"]
    )
    
    services_info = []
    for service_name, config in service_registry.services.items():
        health = await service_registry.check_service_health(service_name)
        
        services_info.append({
            "name": config.name,
            "description": config.description,
            "version": config.version,
            "status": config.status.value,
            "service_type": config.service_type.value,
            "is_premium": config.is_premium,
            "user_accessible": service_name in user_accessible,
            "health": health,
            "port": config.port,
            "metadata": config.metadata
        })
    
    return {
        "services": services_info,
        "user_accessible_count": len(user_accessible),
        "total_services": len(services_info)
    }

@app.get("/api/services/{service_name}")
async def get_service_info(service_name: str, current_user: dict = Depends(get_current_user)):
    """Get detailed information about a specific service"""
    if service_name not in service_registry.services:
        raise HTTPException(status_code=404, detail="Service not found")
    
    config = service_registry.services[service_name]
    health = await service_registry.check_service_health(service_name)
    
    user_accessible = await service_registry.get_user_accessible_services(
        current_user["user_id"], 
        current_user["role"]
    )
    
    return {
        "name": config.name,
        "description": config.description,
        "version": config.version,
        "status": config.status.value,
        "service_type": config.service_type.value,
        "port": config.port,
        "is_premium": config.is_premium,
        "user_accessible": service_name in user_accessible,
        "dependencies": config.dependencies,
        "required_roles": [role.value for role in config.required_roles],
        "health": health,
        "metadata": config.metadata
    }

@app.post("/api/services/{service_name}/unlock")
async def unlock_service(service_name: str, current_user: dict = Depends(get_current_user)):
    """Unlock a premium service for user"""
    if service_name not in service_registry.services:
        raise HTTPException(status_code=404, detail="Service not found")
    
    config = service_registry.services[service_name]
    
    if not config.user_unlockable:
        raise HTTPException(status_code=400, detail="Service cannot be unlocked by users")
    
    if not config.is_premium:
        raise HTTPException(status_code=400, detail="Service is not premium")
    
    # Check if user has sufficient credits or payment method
    async with db_manager.get_connection() as conn:
        user_credits = await conn.fetchval("""
            SELECT credits FROM user_credits WHERE user_id = $1
        """, current_user["user_id"])
        
        if not user_credits or user_credits < 100:  # Assume 100 credits needed
            raise HTTPException(status_code=400, detail="Insufficient credits")
        
        # Unlock service
        await conn.execute("""
            INSERT INTO user_service_access (
                id, user_id, service_name, access_level, unlocked_at
            ) VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id, service_name) 
            DO UPDATE SET access_level = 'full', unlocked_at = CURRENT_TIMESTAMP
        """, 
            str(uuid.uuid4()), current_user["user_id"], service_name, 
            "full", datetime.utcnow()
        )
        
        # Deduct credits
        await conn.execute("""
            UPDATE user_credits SET credits = credits - 100 WHERE user_id = $1
        """, current_user["user_id"])
    
    return {
        "message": f"Service {service_name} unlocked successfully",
        "service_name": service_name,
        "access_level": "full",
        "credits_deducted": 100
    }

@app.post("/api/admin/services/{service_name}/enable")
async def admin_enable_service(service_name: str, current_user: dict = Depends(get_current_user)):
    """Admin endpoint to enable a service"""
    if current_user["role"] != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if service_name not in service_registry.services:
        raise HTTPException(status_code=404, detail="Service not found")
    
    success = await service_registry.start_service(service_name)
    
    if success:
        return {"message": f"Service {service_name} enabled successfully"}
    else:
        raise HTTPException(status_code=500, detail=f"Failed to enable service {service_name}")

@app.post("/api/admin/services/{service_name}/disable")
async def admin_disable_service(service_name: str, current_user: dict = Depends(get_current_user)):
    """Admin endpoint to disable a service"""
    if current_user["role"] != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if service_name not in service_registry.services:
        raise HTTPException(status_code=404, detail="Service not found")
    
    success = await service_registry.stop_service(service_name)
    
    if success:
        return {"message": f"Service {service_name} disabled successfully"}
    else:
        raise HTTPException(status_code=500, detail=f"Failed to disable service {service_name}")

@app.get("/api/health")
async def health_check():
    """System-wide health check"""
    services_health = {}
    
    for service_name in service_registry.services:
        services_health[service_name] = await service_registry.check_service_health(service_name)
    
    healthy_services = sum(1 for health in services_health.values() if health["status"] == "healthy")
    total_services = len(services_health)
    
    return {
        "status": "healthy" if healthy_services == total_services else "degraded",
        "services": services_health,
        "healthy_services": healthy_services,
        "total_services": total_services,
        "uptime_percentage": (healthy_services / total_services) * 100 if total_services > 0 else 0,
        "timestamp": datetime.utcnow().isoformat()
    }

# ============================================================================
# SERVICE PROXY ENDPOINTS
# ============================================================================

@app.api_route("/api/{service_name}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_to_service(service_name: str, path: str, request: Request, current_user: dict = Depends(get_current_user)):
    """Proxy requests to appropriate service"""
    if service_name not in service_registry.services:
        raise HTTPException(status_code=404, detail="Service not found")
    
    config = service_registry.services[service_name]
    
    # Check if user has access to this service
    user_accessible = await service_registry.get_user_accessible_services(
        current_user["user_id"], 
        current_user["role"]
    )
    
    if service_name not in user_accessible:
        raise HTTPException(status_code=403, detail="Access denied to this service")
    
    # Check if service is healthy
    health = await service_registry.check_service_health(service_name)
    if health["status"] != "healthy":
        raise HTTPException(status_code=503, detail=f"Service {service_name} is currently unavailable")
    
    try:
        # Forward request to the service
        async with httpx.AsyncClient() as client:
            # Get request body
            body = await request.body()
            
            # Forward request
            response = await client.request(
                method=request.method,
                url=f"http://localhost:{config.port}/api/{path}",
                headers=dict(request.headers),
                content=body,
                timeout=30.0
            )
            
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.headers.get("content-type")
            )
            
    except Exception as e:
        logger.error(f"Error proxying request to {service_name}: {e}")
        raise HTTPException(status_code=502, detail=f"Service {service_name} error")

if __name__ == "__main__":
    uvicorn.run(
        "main_api_service:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )