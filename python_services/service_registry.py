#!/usr/bin/env python3
"""
Granada OS - Service Registry & Orchestration
Central registry for all microservices with health monitoring
Port: 8999
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import asyncio
import asyncpg
import httpx
import json
import os
import logging
from datetime import datetime, timedelta
import uuid
from contextlib import asynccontextmanager
import uvicorn
from enum import Enum

# ============================================================================
# CONFIGURATION & SETUP
# ============================================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")

# Service definitions with their endpoints - Complete modular architecture
SERVICES = {
    "main_api": {
        "name": "Main API Service",
        "url": "http://localhost:8000",
        "health_endpoint": "/api/health",
        "endpoints": 150,
        "service_type": "core",
        "module_path": "python_services/main_api/main_api_service.py",
        "is_critical": True,
        "admin_enabled": True,
        "user_unlockable": False
    },
    "proposal_writing": {
        "name": "Proposal Writing Service",
        "url": "http://localhost:8020",
        "health_endpoint": "/api/health",
        "endpoints": 75,
        "service_type": "feature",
        "module_path": "python_services/proposal_writing/backend/proposal_service.py",
        "is_critical": False,
        "admin_enabled": True,
        "user_unlockable": True,
        "is_premium": True
    },
    "opportunity_discovery": {
        "name": "Opportunity Discovery Service",
        "url": "http://localhost:8021",
        "health_endpoint": "/api/health",
        "endpoints": 65,
        "service_type": "feature",
        "module_path": "python_services/opportunity_discovery/backend/discovery_service.py",
        "is_critical": False,
        "admin_enabled": True,
        "user_unlockable": True,
        "is_premium": False
    },
    "organization_management": {
        "name": "Organization Management Service",
        "url": "http://localhost:8022",
        "health_endpoint": "/api/health",
        "endpoints": 85,
        "service_type": "core",
        "module_path": "python_services/organization_management/backend/org_service.py",
        "is_critical": True,
        "admin_enabled": True,
        "user_unlockable": False
    },
    "ai_assistant": {
        "name": "AI Assistant Service",
        "url": "http://localhost:8023",
        "health_endpoint": "/api/health",
        "endpoints": 45,
        "service_type": "core",
        "module_path": "python_services/ai_assistant/backend/ai_service.py",
        "is_critical": True,
        "admin_enabled": True,
        "user_unlockable": False
    },
    "document_processing": {
        "name": "Document Processing Service",
        "url": "http://localhost:8024",
        "health_endpoint": "/api/health",
        "endpoints": 55,
        "service_type": "utility",
        "module_path": "python_services/document_processing/backend/doc_service.py",
        "is_critical": False,
        "admin_enabled": True,
        "user_unlockable": True,
        "is_premium": True
    },
    "user_dashboard": {
        "name": "User Dashboard Service",
        "url": "http://localhost:8025",
        "health_endpoint": "/api/health",
        "endpoints": 35,
        "service_type": "core",
        "module_path": "python_services/user_dashboard/backend/dashboard_service.py",
        "is_critical": True,
        "admin_enabled": True,
        "user_unlockable": False
    },
    "notification": {
        "name": "Notification Service",
        "url": "http://localhost:8010",
        "health_endpoint": "/api/health",
        "endpoints": 95,
        "service_type": "core",
        "module_path": "python_services/notification/notification_service.py",
        "is_critical": True,
        "admin_enabled": True,
        "user_unlockable": False
    },
    "analytics": {
        "name": "Analytics Service",
        "url": "http://localhost:8026",
        "health_endpoint": "/api/health",
        "endpoints": 70,
        "service_type": "feature",
        "module_path": "python_services/analytics/analytics_service.py",
        "is_critical": False,
        "admin_enabled": True,
        "user_unlockable": True,
        "is_premium": True
    },
    "payment": {
        "name": "Payment Service",
        "url": "http://localhost:8027",
        "health_endpoint": "/api/health",
        "endpoints": 60,
        "service_type": "core",
        "module_path": "python_services/payment/payment_service.py",
        "is_critical": True,
        "admin_enabled": True,
        "user_unlockable": False
    },
    "compliance": {
        "name": "Compliance Service",
        "url": "http://localhost:8028",
        "health_endpoint": "/api/health",
        "endpoints": 80,
        "service_type": "feature",
        "module_path": "python_services/compliance/compliance_service.py",
        "is_critical": False,
        "admin_enabled": True,
        "user_unlockable": True,
        "is_premium": True
    },
    "web_scraping": {
        "name": "Web Scraping Service",
        "url": "http://localhost:8029",
        "health_endpoint": "/api/health",
        "endpoints": 40,
        "service_type": "utility",
        "module_path": "python_services/web_scraping/scraping_service.py",
        "is_critical": False,
        "admin_enabled": True,
        "user_unlockable": True,
        "is_premium": False
    }
}

# ============================================================================
# ENUMS AND MODELS
# ============================================================================

class ServiceStatus(str, Enum):
    HEALTHY = "healthy"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"
    STARTING = "starting"
    STOPPING = "stopping"

class ServiceInfo(BaseModel):
    service_id: str
    name: str
    url: str
    status: ServiceStatus
    last_health_check: Optional[datetime]
    response_time: Optional[float]
    endpoints_count: int
    version: Optional[str]
    uptime: Optional[float]

class EndpointInfo(BaseModel):
    service_id: str
    path: str
    method: str
    description: Optional[str]
    response_time: Optional[float]
    error_rate: Optional[float]
    last_called: Optional[datetime]

class SystemMetrics(BaseModel):
    total_services: int
    healthy_services: int
    unhealthy_services: int
    total_endpoints: int
    avg_response_time: float
    uptime_percentage: float
    last_updated: datetime

# ============================================================================
# DATABASE CONNECTION
# ============================================================================

class DatabaseManager:
    def __init__(self):
        self.pool = None
    
    async def create_pool(self):
        self.pool = await asyncpg.create_pool(
            DATABASE_URL,
            min_size=5,
            max_size=10,
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
# SERVICE HEALTH MONITORING
# ============================================================================

class ServiceMonitor:
    def __init__(self):
        self.service_states = {}
        self.monitoring = False
        
    async def start_monitoring(self):
        """Start continuous health monitoring"""
        self.monitoring = True
        
        while self.monitoring:
            try:
                await self.check_all_services()
                await asyncio.sleep(30)  # Check every 30 seconds
            except Exception as e:
                logger.error(f"Health monitoring error: {e}")
                await asyncio.sleep(60)
    
    async def stop_monitoring(self):
        """Stop health monitoring"""
        self.monitoring = False
    
    async def check_all_services(self):
        """Check health of all registered services"""
        tasks = []
        for service_id, service_config in SERVICES.items():
            tasks.append(self.check_service_health(service_id, service_config))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Update database with results
        await self.update_service_states(results)
    
    async def check_service_health(self, service_id: str, service_config: Dict[str, Any]) -> Dict[str, Any]:
        """Check individual service health"""
        start_time = datetime.utcnow()
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{service_config['url']}{service_config['health_endpoint']}"
                )
                
                response_time = (datetime.utcnow() - start_time).total_seconds() * 1000
                
                if response.status_code == 200:
                    status = ServiceStatus.HEALTHY
                    response_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {}
                else:
                    status = ServiceStatus.UNHEALTHY
                    response_data = {}
                
                return {
                    "service_id": service_id,
                    "status": status,
                    "response_time": response_time,
                    "last_check": datetime.utcnow(),
                    "error": None,
                    "data": response_data
                }
                
        except Exception as e:
            response_time = (datetime.utcnow() - start_time).total_seconds() * 1000
            
            return {
                "service_id": service_id,
                "status": ServiceStatus.UNHEALTHY,
                "response_time": response_time,
                "last_check": datetime.utcnow(),
                "error": str(e),
                "data": {}
            }
    
    async def update_service_states(self, health_results: List[Dict[str, Any]]):
        """Update service states in database"""
        try:
            async with db_manager.get_connection() as conn:
                for result in health_results:
                    if isinstance(result, dict):
                        await conn.execute("""
                            INSERT INTO service_health (
                                id, service_id, status, response_time, last_check,
                                error_message, metadata, created_at
                            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                        """,
                            str(uuid.uuid4()),
                            result["service_id"],
                            result["status"].value,
                            result["response_time"],
                            result["last_check"],
                            result.get("error"),
                            json.dumps(result.get("data", {})),
                            datetime.utcnow()
                        )
                        
                        # Update current state
                        self.service_states[result["service_id"]] = result
                        
        except Exception as e:
            logger.error(f"Failed to update service states: {e}")

service_monitor = ServiceMonitor()

# ============================================================================
# FASTAPI APPLICATION SETUP
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db_manager.create_pool()
    
    # Initialize service monitoring tables
    await initialize_database()
    
    # Start health monitoring
    monitoring_task = asyncio.create_task(service_monitor.start_monitoring())
    
    logger.info("Service Registry started on port 8999")
    logger.info(f"Monitoring {len(SERVICES)} services")
    
    yield
    
    # Cleanup
    await service_monitor.stop_monitoring()
    monitoring_task.cancel()
    await db_manager.close_pool()

app = FastAPI(
    title="Granada OS - Service Registry",
    description="Central registry and health monitoring for all microservices",
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
# DATABASE INITIALIZATION
# ============================================================================

async def initialize_database():
    """Initialize database tables for service registry"""
    try:
        async with db_manager.get_connection() as conn:
            # Create service health table
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS service_health (
                    id UUID PRIMARY KEY,
                    service_id VARCHAR(100) NOT NULL,
                    status VARCHAR(20) NOT NULL,
                    response_time FLOAT,
                    last_check TIMESTAMP,
                    error_message TEXT,
                    metadata JSONB DEFAULT '{}',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            await conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_service_health_service_id 
                ON service_health(service_id)
            """)
            
            await conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_service_health_created_at 
                ON service_health(created_at DESC)
            """)
            
            # Create service endpoints table
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS service_endpoints (
                    id UUID PRIMARY KEY,
                    service_id VARCHAR(100) NOT NULL,
                    path VARCHAR(500) NOT NULL,
                    method VARCHAR(10) NOT NULL,
                    description TEXT,
                    response_time FLOAT,
                    error_rate FLOAT DEFAULT 0,
                    call_count BIGINT DEFAULT 0,
                    last_called TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            logger.info("Service registry database initialized")
            
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Service registry health check"""
    total_endpoints = sum(service["endpoints"] for service in SERVICES.values())
    
    return {
        "service": "Granada OS Service Registry",
        "version": "1.0.0",
        "status": "operational",
        "total_services": len(SERVICES),
        "total_endpoints": total_endpoints,
        "monitoring_active": service_monitor.monitoring,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/services", response_model=List[ServiceInfo])
async def list_services():
    """Get list of all registered services with their status"""
    try:
        async with db_manager.get_connection() as conn:
            services = []
            
            for service_id, service_config in SERVICES.items():
                # Get latest health check
                health_check = await conn.fetchrow("""
                    SELECT status, response_time, last_check, created_at
                    FROM service_health
                    WHERE service_id = $1
                    ORDER BY created_at DESC
                    LIMIT 1
                """, service_id)
                
                if health_check:
                    status = ServiceStatus(health_check['status'])
                    last_health_check = health_check['last_check']
                    response_time = health_check['response_time']
                    
                    # Calculate uptime
                    uptime_query = await conn.fetchval("""
                        SELECT COUNT(*) * 100.0 / NULLIF(
                            (SELECT COUNT(*) FROM service_health 
                             WHERE service_id = $1 AND created_at >= NOW() - INTERVAL '24 hours'), 0
                        ) as uptime_percentage
                        FROM service_health
                        WHERE service_id = $1 AND status = 'healthy' 
                        AND created_at >= NOW() - INTERVAL '24 hours'
                    """, service_id)
                    
                    uptime = float(uptime_query) if uptime_query else 0.0
                else:
                    status = ServiceStatus.UNKNOWN
                    last_health_check = None
                    response_time = None
                    uptime = 0.0
                
                services.append(ServiceInfo(
                    service_id=service_id,
                    name=service_config["name"],
                    url=service_config["url"],
                    status=status,
                    last_health_check=last_health_check,
                    response_time=response_time,
                    endpoints_count=service_config["endpoints"],
                    version=None,  # Could be fetched from service
                    uptime=uptime
                ))
            
            return services
            
    except Exception as e:
        logger.error(f"List services failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to list services")

@app.get("/services/{service_id}", response_model=ServiceInfo)
async def get_service(service_id: str):
    """Get detailed information about a specific service"""
    try:
        if service_id not in SERVICES:
            raise HTTPException(status_code=404, detail="Service not found")
        
        service_config = SERVICES[service_id]
        
        async with db_manager.get_connection() as conn:
            # Get latest health check
            health_check = await conn.fetchrow("""
                SELECT status, response_time, last_check, metadata
                FROM service_health
                WHERE service_id = $1
                ORDER BY created_at DESC
                LIMIT 1
            """, service_id)
            
            if health_check:
                status = ServiceStatus(health_check['status'])
                last_health_check = health_check['last_check']
                response_time = health_check['response_time']
                metadata = health_check['metadata'] or {}
            else:
                status = ServiceStatus.UNKNOWN
                last_health_check = None
                response_time = None
                metadata = {}
            
            # Calculate uptime for last 24 hours
            uptime = await conn.fetchval("""
                SELECT COUNT(*) * 100.0 / NULLIF(
                    (SELECT COUNT(*) FROM service_health 
                     WHERE service_id = $1 AND created_at >= NOW() - INTERVAL '24 hours'), 0
                ) as uptime_percentage
                FROM service_health
                WHERE service_id = $1 AND status = 'healthy' 
                AND created_at >= NOW() - INTERVAL '24 hours'
            """, service_id)
            
            return ServiceInfo(
                service_id=service_id,
                name=service_config["name"],
                url=service_config["url"],
                status=status,
                last_health_check=last_health_check,
                response_time=response_time,
                endpoints_count=service_config["endpoints"],
                version=metadata.get("version"),
                uptime=float(uptime) if uptime else 0.0
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get service failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get service")

@app.get("/services/{service_id}/health")
async def check_service_health(service_id: str):
    """Manually trigger health check for a specific service"""
    try:
        if service_id not in SERVICES:
            raise HTTPException(status_code=404, detail="Service not found")
        
        service_config = SERVICES[service_id]
        health_result = await service_monitor.check_service_health(service_id, service_config)
        
        # Update database
        await service_monitor.update_service_states([health_result])
        
        return health_result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Health check failed")

@app.get("/metrics", response_model=SystemMetrics)
async def get_system_metrics():
    """Get overall system health metrics"""
    try:
        async with db_manager.get_connection() as conn:
            # Get latest status for each service
            service_statuses = []
            total_response_time = 0
            healthy_count = 0
            
            for service_id in SERVICES.keys():
                latest_health = await conn.fetchrow("""
                    SELECT status, response_time
                    FROM service_health
                    WHERE service_id = $1
                    ORDER BY created_at DESC
                    LIMIT 1
                """, service_id)
                
                if latest_health:
                    service_statuses.append(latest_health['status'])
                    if latest_health['response_time']:
                        total_response_time += latest_health['response_time']
                    if latest_health['status'] == 'healthy':
                        healthy_count += 1
                else:
                    service_statuses.append('unknown')
            
            total_services = len(SERVICES)
            unhealthy_services = len([s for s in service_statuses if s == 'unhealthy'])
            avg_response_time = total_response_time / total_services if total_services > 0 else 0
            
            # Calculate overall uptime (last 24 hours)
            uptime_percentage = await conn.fetchval("""
                SELECT AVG(uptime_calc.uptime) as overall_uptime
                FROM (
                    SELECT service_id,
                           COUNT(*) FILTER (WHERE status = 'healthy') * 100.0 / 
                           NULLIF(COUNT(*), 0) as uptime
                    FROM service_health
                    WHERE created_at >= NOW() - INTERVAL '24 hours'
                    GROUP BY service_id
                ) uptime_calc
            """) or 0.0
            
            total_endpoints = sum(service["endpoints"] for service in SERVICES.values())
            
            return SystemMetrics(
                total_services=total_services,
                healthy_services=healthy_count,
                unhealthy_services=unhealthy_services,
                total_endpoints=total_endpoints,
                avg_response_time=avg_response_time,
                uptime_percentage=float(uptime_percentage),
                last_updated=datetime.utcnow()
            )
            
    except Exception as e:
        logger.error(f"Get metrics failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get metrics")

@app.get("/services/{service_id}/history")
async def get_service_history(
    service_id: str,
    hours: int = 24
):
    """Get health check history for a service"""
    try:
        if service_id not in SERVICES:
            raise HTTPException(status_code=404, detail="Service not found")
        
        async with db_manager.get_connection() as conn:
            history = await conn.fetch("""
                SELECT status, response_time, last_check, error_message, created_at
                FROM service_health
                WHERE service_id = $1 AND created_at >= NOW() - INTERVAL '%s hours'
                ORDER BY created_at DESC
            """, service_id, hours)
            
            return {
                "service_id": service_id,
                "hours": hours,
                "total_checks": len(history),
                "history": [dict(record) for record in history]
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get service history failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get service history")

@app.get("/endpoints")
async def list_all_endpoints():
    """Get comprehensive list of all API endpoints across services"""
    
    # This would be populated by scanning service documentation or registration
    endpoints_summary = {
        "total_endpoints": sum(service["endpoints"] for service in SERVICES.values()),
        "services": SERVICES,
        "endpoint_distribution": {
            service_id: config["endpoints"] 
            for service_id, config in SERVICES.items()
        },
        "estimated_total": 750  # Our target
    }
    
    return endpoints_summary

@app.post("/services/{service_id}/restart")
async def restart_service(service_id: str):
    """Trigger service restart (placeholder - would integrate with container orchestration)"""
    try:
        if service_id not in SERVICES:
            raise HTTPException(status_code=404, detail="Service not found")
        
        # In production, this would trigger actual service restart
        # For now, just log the action
        logger.info(f"Restart requested for service: {service_id}")
        
        return {
            "service_id": service_id,
            "action": "restart_requested",
            "timestamp": datetime.utcnow().isoformat(),
            "message": "Service restart has been requested"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Service restart failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to restart service")

@app.get("/discovery")
async def service_discovery():
    """Provide service discovery information for clients"""
    discovery_info = {}
    
    for service_id, config in SERVICES.items():
        # Get current status
        current_state = service_monitor.service_states.get(service_id, {})
        
        discovery_info[service_id] = {
            "name": config["name"],
            "url": config["url"],
            "status": current_state.get("status", ServiceStatus.UNKNOWN),
            "last_check": current_state.get("last_check"),
            "response_time": current_state.get("response_time"),
            "endpoints": config["endpoints"]
        }
    
    return {
        "services": discovery_info,
        "registry_url": "http://localhost:8999",
        "updated_at": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(
        "service_registry:app",
        host="0.0.0.0", 
        port=8999,
        reload=True,
        log_level="info"
    )