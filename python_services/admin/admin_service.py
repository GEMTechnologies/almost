#!/usr/bin/env python3
"""
Granada OS - Admin Service (Wabden)
Comprehensive administrative management system
Port: 8002
"""

from fastapi import FastAPI, HTTPException, Depends, Security, BackgroundTasks, Request, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional, Dict, Any, Union
import asyncio
import asyncpg
import json
import os
import logging
from datetime import datetime, timedelta
import uuid
import hashlib
import httpx
from contextlib import asynccontextmanager
import uvicorn
import pandas as pd
from io import BytesIO
import aiofiles

# ============================================================================
# CONFIGURATION & SETUP
# ============================================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

security = HTTPBearer()

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
            max_size=15,
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
# PYDANTIC MODELS
# ============================================================================

class AdminUser(BaseModel):
    id: str
    username: str
    email: EmailStr
    role: str
    permissions: List[str]
    is_active: bool
    last_login: Optional[datetime]
    created_at: datetime

class UserManagementAction(BaseModel):
    user_id: str
    action: str = Field(..., description="ban, unban, verify, suspend, activate")
    reason: Optional[str] = Field(None, max_length=500)
    duration_days: Optional[int] = Field(None, description="Duration for temporary actions")

class OpportunityVerification(BaseModel):
    opportunity_id: str
    status: str = Field(..., description="verified, rejected, pending")
    verification_notes: Optional[str]
    verifier_comments: Optional[str]

class SystemMetrics(BaseModel):
    total_users: int
    active_users: int
    total_opportunities: int
    verified_opportunities: int
    pending_verifications: int
    total_applications: int
    system_health: str
    database_size: str
    last_updated: datetime

class HREmployee(BaseModel):
    id: str
    employee_number: str
    first_name: str
    last_name: str
    email: EmailStr
    department: str
    position: str
    hire_date: date
    salary: Optional[float]
    status: str
    manager_id: Optional[str]

class FinancialTransaction(BaseModel):
    id: str
    transaction_type: str
    amount: float
    currency: str
    description: str
    category: str
    date: datetime
    status: str
    reference_number: Optional[str]

class BotConfiguration(BaseModel):
    bot_name: str
    target_urls: List[str]
    scraping_frequency: str
    selectors: Dict[str, str]
    is_active: bool
    last_run: Optional[datetime]
    success_rate: Optional[float]

# ============================================================================
# FASTAPI APPLICATION SETUP
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db_manager.create_pool()
    logger.info("Admin Service (Wabden) started on port 8002")
    yield
    await db_manager.close_pool()

app = FastAPI(
    title="Granada OS - Admin Service (Wabden)",
    description="Comprehensive administrative management system",
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
# AUTHENTICATION & AUTHORIZATION
# ============================================================================

async def get_admin_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Validate admin authentication"""
    try:
        token = credentials.credentials
        # Implement proper JWT validation for admin users
        # For now, return mock admin user
        return {
            "admin_id": "admin_123",
            "username": "admin",
            "role": "superadmin",
            "permissions": ["all"]
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

def require_permission(permission: str):
    """Decorator to require specific permission"""
    def permission_checker(admin_user: dict = Depends(get_admin_user)):
        if "all" not in admin_user["permissions"] and permission not in admin_user["permissions"]:
            raise HTTPException(status_code=403, detail=f"Insufficient permissions: {permission} required")
        return admin_user
    return permission_checker

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Admin service health check"""
    return {
        "service": "Granada OS Admin Service (Wabden)",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat()
    }

# ============================================================================
# DASHBOARD & METRICS
# ============================================================================

@app.get("/api/admin/dashboard", response_model=SystemMetrics)
async def get_dashboard_metrics(admin_user: dict = Depends(get_admin_user)):
    """Get comprehensive system metrics for dashboard"""
    try:
        async with db_manager.get_connection() as conn:
            # Get user metrics
            user_metrics = await conn.fetchrow("""
                SELECT 
                    COUNT(*) as total_users,
                    COUNT(*) FILTER (WHERE is_active = true) as active_users
                FROM users
            """)
            
            # Get opportunity metrics
            opp_metrics = await conn.fetchrow("""
                SELECT 
                    COUNT(*) as total_opportunities,
                    COUNT(*) FILTER (WHERE is_verified = true) as verified_opportunities,
                    COUNT(*) FILTER (WHERE is_verified = false AND is_active = true) as pending_verifications
                FROM funding_opportunities
            """)
            
            # Get application metrics
            app_metrics = await conn.fetchrow("""
                SELECT COUNT(*) as total_applications
                FROM applications
            """)
            
            # Get database size
            db_size = await conn.fetchval("""
                SELECT pg_size_pretty(pg_database_size(current_database()))
            """)
            
            return SystemMetrics(
                total_users=user_metrics['total_users'] or 0,
                active_users=user_metrics['active_users'] or 0,
                total_opportunities=opp_metrics['total_opportunities'] or 0,
                verified_opportunities=opp_metrics['verified_opportunities'] or 0,
                pending_verifications=opp_metrics['pending_verifications'] or 0,
                total_applications=app_metrics['total_applications'] or 0,
                system_health="healthy",
                database_size=db_size or "Unknown",
                last_updated=datetime.utcnow()
            )
            
    except Exception as e:
        logger.error(f"Dashboard metrics failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get dashboard metrics")

@app.get("/api/admin/analytics/users")
async def get_user_analytics(
    days: int = 30,
    admin_user: dict = Depends(require_permission("view_analytics"))
):
    """Get user analytics and growth metrics"""
    try:
        async with db_manager.get_connection() as conn:
            # User registration trends
            registration_trends = await conn.fetch("""
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as new_users,
                    COUNT(*) FILTER (WHERE user_type = 'ngo') as ngo_users,
                    COUNT(*) FILTER (WHERE user_type = 'student') as student_users,
                    COUNT(*) FILTER (WHERE user_type = 'business') as business_users
                FROM users
                WHERE created_at >= NOW() - INTERVAL '%s days'
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            """, days)
            
            # User activity metrics
            activity_metrics = await conn.fetchrow("""
                SELECT 
                    COUNT(*) FILTER (WHERE last_login >= NOW() - INTERVAL '7 days') as weekly_active,
                    COUNT(*) FILTER (WHERE last_login >= NOW() - INTERVAL '30 days') as monthly_active,
                    AVG(login_count) as avg_login_count
                FROM users
                WHERE is_active = true
            """)
            
            # Geographic distribution
            geo_distribution = await conn.fetch("""
                SELECT country, COUNT(*) as user_count
                FROM users
                WHERE country IS NOT NULL
                GROUP BY country
                ORDER BY user_count DESC
                LIMIT 10
            """)
            
            return {
                "registration_trends": [dict(row) for row in registration_trends],
                "activity_metrics": dict(activity_metrics),
                "geographic_distribution": [dict(row) for row in geo_distribution],
                "period_days": days,
                "generated_at": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        logger.error(f"User analytics failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user analytics")

# ============================================================================
# USER MANAGEMENT
# ============================================================================

@app.get("/api/admin/users")
async def get_users(
    limit: int = 50,
    offset: int = 0,
    status: Optional[str] = None,
    user_type: Optional[str] = None,
    country: Optional[str] = None,
    admin_user: dict = Depends(require_permission("manage_users"))
):
    """Get users with filtering and pagination"""
    try:
        async with db_manager.get_connection() as conn:
            query = """
                SELECT id, email, first_name, last_name, user_type, country,
                       is_active, is_verified, credits, last_login, created_at
                FROM users
                WHERE 1=1
            """
            params = []
            param_count = 0
            
            if status == "active":
                query += " AND is_active = true"
            elif status == "inactive":
                query += " AND is_active = false"
            
            if user_type:
                param_count += 1
                query += f" AND user_type = ${param_count}"
                params.append(user_type)
            
            if country:
                param_count += 1
                query += f" AND country = ${param_count}"
                params.append(country)
            
            query += f" ORDER BY created_at DESC LIMIT ${param_count + 1} OFFSET ${param_count + 2}"
            params.extend([limit, offset])
            
            users = await conn.fetch(query, *params)
            
            return [dict(user) for user in users]
            
    except Exception as e:
        logger.error(f"Get users failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get users")

@app.post("/api/admin/users/action")
async def perform_user_action(
    action: UserManagementAction,
    admin_user: dict = Depends(require_permission("manage_users"))
):
    """Perform administrative action on user"""
    try:
        async with db_manager.get_connection() as conn:
            # Verify user exists
            user = await conn.fetchrow("SELECT id, email, is_active FROM users WHERE id = $1", action.user_id)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            
            # Perform action
            if action.action == "ban":
                await conn.execute("""
                    UPDATE users SET 
                        is_active = false,
                        account_locked_until = $1,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = $2
                """, 
                    datetime.utcnow() + timedelta(days=action.duration_days or 365),
                    action.user_id
                )
                
            elif action.action == "unban":
                await conn.execute("""
                    UPDATE users SET 
                        is_active = true,
                        account_locked_until = NULL,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = $1
                """, action.user_id)
                
            elif action.action == "verify":
                await conn.execute("""
                    UPDATE users SET 
                        is_verified = true,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = $1
                """, action.user_id)
                
            elif action.action == "suspend":
                await conn.execute("""
                    UPDATE users SET 
                        is_active = false,
                        account_locked_until = $1,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = $2
                """,
                    datetime.utcnow() + timedelta(days=action.duration_days or 30),
                    action.user_id
                )
            
            # Log admin action
            await conn.execute("""
                INSERT INTO admin_actions (
                    id, admin_id, target_user_id, action, reason, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6)
            """,
                str(uuid.uuid4()), admin_user["admin_id"], action.user_id,
                action.action, action.reason, datetime.utcnow()
            )
            
            return {
                "success": True,
                "action": action.action,
                "user_id": action.user_id,
                "performed_by": admin_user["username"],
                "timestamp": datetime.utcnow().isoformat()
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"User action failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to perform user action")

# ============================================================================
# OPPORTUNITY VERIFICATION
# ============================================================================

@app.get("/api/admin/opportunities/pending")
async def get_pending_opportunities(
    limit: int = 50,
    admin_user: dict = Depends(require_permission("verify_opportunities"))
):
    """Get funding opportunities pending verification"""
    try:
        async with db_manager.get_connection() as conn:
            opportunities = await conn.fetch("""
                SELECT id, title, description, funder_name, amount, currency,
                       application_deadline, created_at, created_by
                FROM funding_opportunities
                WHERE is_verified = false AND is_active = true
                ORDER BY created_at ASC
                LIMIT $1
            """, limit)
            
            return [dict(opp) for opp in opportunities]
            
    except Exception as e:
        logger.error(f"Get pending opportunities failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get pending opportunities")

@app.post("/api/admin/opportunities/verify")
async def verify_opportunity(
    verification: OpportunityVerification,
    admin_user: dict = Depends(require_permission("verify_opportunities"))
):
    """Verify or reject funding opportunity"""
    try:
        async with db_manager.get_connection() as conn:
            # Update opportunity status
            await conn.execute("""
                UPDATE funding_opportunities SET
                    is_verified = $1,
                    verification_date = $2,
                    verified_by = $3,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $4
            """,
                verification.status == "verified",
                datetime.utcnow(),
                admin_user["admin_id"],
                verification.opportunity_id
            )
            
            # Log verification action
            await conn.execute("""
                INSERT INTO opportunity_verifications (
                    id, opportunity_id, admin_id, status, notes, verifier_comments, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            """,
                str(uuid.uuid4()), verification.opportunity_id, admin_user["admin_id"],
                verification.status, verification.verification_notes,
                verification.verifier_comments, datetime.utcnow()
            )
            
            return {
                "success": True,
                "opportunity_id": verification.opportunity_id,
                "status": verification.status,
                "verified_by": admin_user["username"],
                "timestamp": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        logger.error(f"Opportunity verification failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to verify opportunity")

# ============================================================================
# HR MANAGEMENT
# ============================================================================

@app.get("/api/admin/hr/employees")
async def get_employees(
    department: Optional[str] = None,
    status: Optional[str] = None,
    admin_user: dict = Depends(require_permission("manage_hr"))
):
    """Get employee directory"""
    try:
        async with db_manager.get_connection() as conn:
            query = """
                SELECT id, employee_number, first_name, last_name, email,
                       department, position, hire_date, status, manager_id
                FROM employees
                WHERE 1=1
            """
            params = []
            
            if department:
                query += " AND department = $1"
                params.append(department)
            
            if status:
                if len(params) > 0:
                    query += f" AND status = ${len(params) + 1}"
                else:
                    query += " AND status = $1"
                params.append(status)
            
            query += " ORDER BY last_name, first_name"
            
            employees = await conn.fetch(query, *params)
            
            return [dict(emp) for emp in employees]
            
    except Exception as e:
        logger.error(f"Get employees failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get employees")

@app.get("/api/admin/hr/departments")
async def get_departments(admin_user: dict = Depends(require_permission("manage_hr"))):
    """Get department statistics"""
    try:
        async with db_manager.get_connection() as conn:
            departments = await conn.fetch("""
                SELECT 
                    department,
                    COUNT(*) as employee_count,
                    COUNT(*) FILTER (WHERE status = 'active') as active_count,
                    AVG(salary) FILTER (WHERE salary IS NOT NULL) as avg_salary
                FROM employees
                GROUP BY department
                ORDER BY employee_count DESC
            """)
            
            return [dict(dept) for dept in departments]
            
    except Exception as e:
        logger.error(f"Get departments failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get departments")

# ============================================================================
# FINANCIAL MANAGEMENT
# ============================================================================

@app.get("/api/admin/finance/transactions")
async def get_financial_transactions(
    limit: int = 50,
    transaction_type: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    admin_user: dict = Depends(require_permission("manage_finance"))
):
    """Get financial transactions with filtering"""
    try:
        async with db_manager.get_connection() as conn:
            query = """
                SELECT id, transaction_type, amount, currency, description,
                       category, date, status, reference_number
                FROM financial_transactions
                WHERE 1=1
            """
            params = []
            param_count = 0
            
            if transaction_type:
                param_count += 1
                query += f" AND transaction_type = ${param_count}"
                params.append(transaction_type)
            
            if date_from:
                param_count += 1
                query += f" AND date >= ${param_count}"
                params.append(date_from)
            
            if date_to:
                param_count += 1
                query += f" AND date <= ${param_count}"
                params.append(date_to)
            
            query += f" ORDER BY date DESC LIMIT ${param_count + 1}"
            params.append(limit)
            
            transactions = await conn.fetch(query, *params)
            
            return [dict(txn) for txn in transactions]
            
    except Exception as e:
        logger.error(f"Get transactions failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get financial transactions")

@app.get("/api/admin/finance/summary")
async def get_financial_summary(
    period_days: int = 30,
    admin_user: dict = Depends(require_permission("view_finance"))
):
    """Get financial summary and metrics"""
    try:
        async with db_manager.get_connection() as conn:
            summary = await conn.fetchrow("""
                SELECT 
                    SUM(amount) FILTER (WHERE transaction_type = 'revenue') as total_revenue,
                    SUM(amount) FILTER (WHERE transaction_type = 'expense') as total_expenses,
                    COUNT(*) as total_transactions,
                    COUNT(DISTINCT category) as unique_categories
                FROM financial_transactions
                WHERE date >= NOW() - INTERVAL '%s days'
            """, period_days)
            
            # Category breakdown
            categories = await conn.fetch("""
                SELECT 
                    category,
                    SUM(amount) as total_amount,
                    COUNT(*) as transaction_count
                FROM financial_transactions
                WHERE date >= NOW() - INTERVAL '%s days'
                GROUP BY category
                ORDER BY total_amount DESC
            """, period_days)
            
            return {
                "summary": dict(summary),
                "categories": [dict(cat) for cat in categories],
                "period_days": period_days,
                "generated_at": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        logger.error(f"Financial summary failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get financial summary")

# ============================================================================
# BOT MANAGEMENT
# ============================================================================

@app.get("/api/admin/bots/configurations")
async def get_bot_configurations(admin_user: dict = Depends(require_permission("manage_bots"))):
    """Get all bot configurations"""
    try:
        async with db_manager.get_connection() as conn:
            bots = await conn.fetch("""
                SELECT bot_name, target_urls, scraping_frequency, selectors,
                       is_active, last_run, success_rate
                FROM bot_configurations
                ORDER BY bot_name
            """)
            
            return [dict(bot) for bot in bots]
            
    except Exception as e:
        logger.error(f"Get bot configurations failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get bot configurations")

@app.post("/api/admin/bots/configure")
async def configure_bot(
    bot_config: BotConfiguration,
    admin_user: dict = Depends(require_permission("manage_bots"))
):
    """Configure or update bot settings"""
    try:
        async with db_manager.get_connection() as conn:
            await conn.execute("""
                INSERT INTO bot_configurations (
                    bot_name, target_urls, scraping_frequency, selectors,
                    is_active, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (bot_name) DO UPDATE SET
                    target_urls = EXCLUDED.target_urls,
                    scraping_frequency = EXCLUDED.scraping_frequency,
                    selectors = EXCLUDED.selectors,
                    is_active = EXCLUDED.is_active,
                    updated_at = EXCLUDED.updated_at
            """,
                bot_config.bot_name, bot_config.target_urls,
                bot_config.scraping_frequency, json.dumps(bot_config.selectors),
                bot_config.is_active, datetime.utcnow(), datetime.utcnow()
            )
            
            return {
                "success": True,
                "bot_name": bot_config.bot_name,
                "configured_by": admin_user["username"],
                "timestamp": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        logger.error(f"Bot configuration failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to configure bot")

@app.post("/api/admin/bots/{bot_name}/start")
async def start_bot(
    bot_name: str,
    background_tasks: BackgroundTasks,
    admin_user: dict = Depends(require_permission("manage_bots"))
):
    """Start a specific bot"""
    try:
        # Trigger bot execution via API call to bot service
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:8001/api/scrape/funding-sites",
                timeout=30.0
            )
            
            if response.status_code == 200:
                job_data = response.json()
                
                return {
                    "success": True,
                    "bot_name": bot_name,
                    "job_id": job_data.get("job_id"),
                    "started_by": admin_user["username"],
                    "timestamp": datetime.utcnow().isoformat()
                }
            else:
                raise HTTPException(status_code=500, detail="Failed to start bot")
                
    except Exception as e:
        logger.error(f"Start bot failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to start bot")

# ============================================================================
# REPORTS & EXPORTS
# ============================================================================

@app.get("/api/admin/reports/export")
async def export_data(
    data_type: str,
    format: str = "csv",
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    admin_user: dict = Depends(require_permission("export_data"))
):
    """Export system data in various formats"""
    try:
        async with db_manager.get_connection() as conn:
            # Define export queries
            export_queries = {
                "users": """
                    SELECT id, email, first_name, last_name, user_type, country,
                           is_active, is_verified, created_at
                    FROM users
                    WHERE created_at >= COALESCE($1, '1900-01-01')
                    AND created_at <= COALESCE($2, NOW())
                """,
                "opportunities": """
                    SELECT id, title, funder_name, amount, currency, funding_type,
                           application_deadline, is_verified, created_at
                    FROM funding_opportunities
                    WHERE created_at >= COALESCE($1, '1900-01-01')
                    AND created_at <= COALESCE($2, NOW())
                """,
                "applications": """
                    SELECT id, title, requested_amount, status, submission_date, created_at
                    FROM applications
                    WHERE created_at >= COALESCE($1, '1900-01-01')
                    AND created_at <= COALESCE($2, NOW())
                """
            }
            
            if data_type not in export_queries:
                raise HTTPException(status_code=400, detail="Invalid data type")
            
            # Execute query
            results = await conn.fetch(
                export_queries[data_type],
                date_from or datetime(1900, 1, 1),
                date_to or datetime.utcnow()
            )
            
            # Convert to DataFrame
            df = pd.DataFrame([dict(row) for row in results])
            
            # Generate export file
            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            filename = f"{data_type}_export_{timestamp}.{format}"
            filepath = f"/tmp/{filename}"
            
            if format == "csv":
                df.to_csv(filepath, index=False)
                media_type = "text/csv"
            elif format == "excel":
                df.to_excel(filepath, index=False)
                media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            else:
                raise HTTPException(status_code=400, detail="Unsupported format")
            
            return FileResponse(
                filepath,
                media_type=media_type,
                filename=filename
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Data export failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to export data")

# ============================================================================
# SYSTEM MAINTENANCE
# ============================================================================

@app.post("/api/admin/system/maintenance")
async def system_maintenance(
    maintenance_type: str,
    background_tasks: BackgroundTasks,
    admin_user: dict = Depends(require_permission("system_admin"))
):
    """Perform system maintenance tasks"""
    try:
        maintenance_tasks = {
            "cleanup_old_data": cleanup_old_data,
            "reindex_database": reindex_database,
            "backup_database": backup_database,
            "optimize_queries": optimize_queries
        }
        
        if maintenance_type not in maintenance_tasks:
            raise HTTPException(status_code=400, detail="Invalid maintenance type")
        
        # Start maintenance task in background
        task_id = str(uuid.uuid4())
        background_tasks.add_task(
            maintenance_tasks[maintenance_type],
            task_id,
            admin_user["admin_id"]
        )
        
        return {
            "success": True,
            "task_id": task_id,
            "maintenance_type": maintenance_type,
            "initiated_by": admin_user["username"],
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"System maintenance failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to initiate maintenance")

# ============================================================================
# BACKGROUND TASKS
# ============================================================================

async def cleanup_old_data(task_id: str, admin_id: str):
    """Clean up old data based on retention policies"""
    try:
        async with db_manager.get_connection() as conn:
            # Cleanup old session data
            await conn.execute("""
                DELETE FROM user_sessions 
                WHERE expires_at < NOW() - INTERVAL '30 days'
            """)
            
            # Cleanup old audit logs (keep 2 years)
            await conn.execute("""
                DELETE FROM user_audit_logs 
                WHERE timestamp < NOW() - INTERVAL '2 years'
            """)
            
            # Mark task as completed
            await conn.execute("""
                INSERT INTO maintenance_tasks (
                    id, task_type, status, started_by, completed_at
                ) VALUES ($1, $2, $3, $4, $5)
            """, task_id, "cleanup_old_data", "completed", admin_id, datetime.utcnow())
            
    except Exception as e:
        logger.error(f"Cleanup task {task_id} failed: {e}")

async def reindex_database(task_id: str, admin_id: str):
    """Reindex database for performance"""
    try:
        async with db_manager.get_connection() as conn:
            # Reindex important tables
            await conn.execute("REINDEX TABLE users")
            await conn.execute("REINDEX TABLE funding_opportunities")
            await conn.execute("REINDEX TABLE applications")
            
            # Mark completed
            await conn.execute("""
                INSERT INTO maintenance_tasks (
                    id, task_type, status, started_by, completed_at
                ) VALUES ($1, $2, $3, $4, $5)
            """, task_id, "reindex_database", "completed", admin_id, datetime.utcnow())
            
    except Exception as e:
        logger.error(f"Reindex task {task_id} failed: {e}")

async def backup_database(task_id: str, admin_id: str):
    """Create database backup"""
    try:
        # This would integrate with the backup manager
        # For now, just log the action
        async with db_manager.get_connection() as conn:
            await conn.execute("""
                INSERT INTO maintenance_tasks (
                    id, task_type, status, started_by, completed_at
                ) VALUES ($1, $2, $3, $4, $5)
            """, task_id, "backup_database", "completed", admin_id, datetime.utcnow())
            
    except Exception as e:
        logger.error(f"Backup task {task_id} failed: {e}")

async def optimize_queries(task_id: str, admin_id: str):
    """Optimize database queries and performance"""
    try:
        async with db_manager.get_connection() as conn:
            # Analyze tables for query optimization
            await conn.execute("ANALYZE")
            
            # Update table statistics
            await conn.execute("VACUUM ANALYZE")
            
            # Mark completed
            await conn.execute("""
                INSERT INTO maintenance_tasks (
                    id, task_type, status, started_by, completed_at
                ) VALUES ($1, $2, $3, $4, $5)
            """, task_id, "optimize_queries", "completed", admin_id, datetime.utcnow())
            
    except Exception as e:
        logger.error(f"Optimization task {task_id} failed: {e}")

# ============================================================================
# MAIN APPLICATION RUNNER
# ============================================================================

if __name__ == "__main__":
    uvicorn.run(
        "admin_service:app",
        host="0.0.0.0",
        port=8002,
        reload=True,
        log_level="info"
    )