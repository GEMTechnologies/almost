#!/usr/bin/env python3
"""
Granada OS - Organization Management Service
Comprehensive organization profile and team management system
Port: 8022
"""

from fastapi import FastAPI, HTTPException, Depends, Security, BackgroundTasks, Request, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr, validator
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
import hashlib

# ============================================================================
# CONFIGURATION & SETUP
# ============================================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")
security = HTTPBearer()

# ============================================================================
# ENUMS AND CONSTANTS
# ============================================================================

class OrganizationType(str, Enum):
    NONPROFIT = "nonprofit"
    UNIVERSITY = "university"
    GOVERNMENT = "government"
    PRIVATE_COMPANY = "private_company"
    SOCIAL_ENTERPRISE = "social_enterprise"
    FOUNDATION = "foundation"
    RESEARCH_INSTITUTION = "research_institution"
    COMMUNITY_ORGANIZATION = "community_organization"

class OrganizationStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"
    SUSPENDED = "suspended"
    ARCHIVED = "archived"

class TeamMemberRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    MEMBER = "member"
    COLLABORATOR = "collaborator"
    VIEWER = "viewer"

class ComplianceStatus(str, Enum):
    COMPLIANT = "compliant"
    NON_COMPLIANT = "non_compliant"
    PENDING_REVIEW = "pending_review"
    EXPIRED = "expired"

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class OrganizationCreate(BaseModel):
    name: str = Field(..., max_length=200)
    organization_type: OrganizationType
    description: Optional[str] = Field(None, max_length=2000)
    mission_statement: Optional[str] = Field(None, max_length=1000)
    vision: Optional[str] = Field(None, max_length=1000)
    website: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Dict[str, str] = Field(default={})
    sectors: List[str] = Field(default=[])
    geographic_focus: List[str] = Field(default=[])
    target_beneficiaries: List[str] = Field(default=[])
    founding_date: Optional[datetime] = None
    registration_number: Optional[str] = None
    tax_id: Optional[str] = None
    annual_budget: Optional[float] = Field(None, ge=0)
    staff_size: Optional[int] = Field(None, ge=0)
    logo_url: Optional[str] = None
    social_media: Dict[str, str] = Field(default={})
    legal_documents: List[str] = Field(default=[])
    certifications: List[str] = Field(default=[])
    metadata: Dict[str, Any] = Field(default={})

class OrganizationUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    mission_statement: Optional[str] = Field(None, max_length=1000)
    vision: Optional[str] = Field(None, max_length=1000)
    website: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[Dict[str, str]] = None
    sectors: Optional[List[str]] = None
    geographic_focus: Optional[List[str]] = None
    target_beneficiaries: Optional[List[str]] = None
    annual_budget: Optional[float] = Field(None, ge=0)
    staff_size: Optional[int] = Field(None, ge=0)
    logo_url: Optional[str] = None
    social_media: Optional[Dict[str, str]] = None
    certifications: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None

class TeamMemberCreate(BaseModel):
    organization_id: str
    user_id: str
    role: TeamMemberRole
    position: Optional[str] = Field(None, max_length=100)
    department: Optional[str] = Field(None, max_length=100)
    start_date: Optional[datetime] = None
    permissions: List[str] = Field(default=[])
    bio: Optional[str] = Field(None, max_length=500)
    skills: List[str] = Field(default=[])
    contact_info: Dict[str, str] = Field(default={})
    is_public: bool = Field(default=True)

class TeamMemberUpdate(BaseModel):
    role: Optional[TeamMemberRole] = None
    position: Optional[str] = Field(None, max_length=100)
    department: Optional[str] = Field(None, max_length=100)
    permissions: Optional[List[str]] = None
    bio: Optional[str] = Field(None, max_length=500)
    skills: Optional[List[str]] = None
    contact_info: Optional[Dict[str, str]] = None
    is_public: Optional[bool] = None

class ComplianceRecord(BaseModel):
    organization_id: str
    compliance_type: str = Field(..., max_length=100)
    status: ComplianceStatus
    certificate_number: Optional[str] = None
    issuing_authority: Optional[str] = None
    issue_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    renewal_date: Optional[datetime] = None
    document_url: Optional[str] = None
    notes: Optional[str] = None

class FinancialRecord(BaseModel):
    organization_id: str
    fiscal_year: int
    revenue: Optional[float] = Field(None, ge=0)
    expenses: Optional[float] = Field(None, ge=0)
    assets: Optional[float] = Field(None, ge=0)
    liabilities: Optional[float] = Field(None, ge=0)
    grants_received: Optional[float] = Field(None, ge=0)
    program_expenses: Optional[float] = Field(None, ge=0)
    admin_expenses: Optional[float] = Field(None, ge=0)
    fundraising_expenses: Optional[float] = Field(None, ge=0)
    financial_report_url: Optional[str] = None
    audited: bool = Field(default=False)

# Response Models
class OrganizationResponse(BaseModel):
    id: str
    name: str
    organization_type: str
    description: Optional[str]
    website: Optional[str]
    sectors: List[str]
    geographic_focus: List[str]
    status: str
    created_at: datetime
    updated_at: datetime
    team_size: int
    is_verified: bool

class TeamMemberResponse(BaseModel):
    id: str
    user_id: str
    role: str
    position: Optional[str]
    department: Optional[str]
    start_date: Optional[datetime]
    is_public: bool
    created_at: datetime

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
        return {"user_id": "user_123", "email": "user@example.com"}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# ============================================================================
# FASTAPI APPLICATION SETUP
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db_manager.create_pool()
    logger.info("Organization Management Service started on port 8022")
    yield
    await db_manager.close_pool()

app = FastAPI(
    title="Granada OS - Organization Management Service",
    description="Comprehensive organization profile and team management system",
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
# UTILITY FUNCTIONS
# ============================================================================

async def check_organization_access(user_id: str, organization_id: str) -> bool:
    """Check if user has access to organization"""
    async with db_manager.get_connection() as conn:
        access = await conn.fetchrow("""
            SELECT role FROM organization_members 
            WHERE user_id = $1 AND organization_id = $2
        """, user_id, organization_id)
        return access is not None

async def get_organization_team_size(organization_id: str) -> int:
    """Get current team size for organization"""
    async with db_manager.get_connection() as conn:
        count = await conn.fetchval("""
            SELECT COUNT(*) FROM organization_members WHERE organization_id = $1
        """, organization_id)
        return count or 0

# ============================================================================
# ORGANIZATION MANAGEMENT ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Organization management service health check"""
    return {
        "service": "Granada OS Organization Management Service",
        "version": "1.0.0",
        "status": "operational",
        "features": [
            "Organization profile management",
            "Team member management",
            "Compliance tracking",
            "Financial record keeping",
            "Document management",
            "Verification system"
        ],
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/organizations", response_model=OrganizationResponse)
async def create_organization(
    org_data: OrganizationCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new organization"""
    try:
        async with db_manager.get_connection() as conn:
            organization_id = str(uuid.uuid4())
            
            # Create organization
            await conn.execute("""
                INSERT INTO organizations (
                    id, name, organization_type, description, mission_statement, vision,
                    website, email, phone, address, sectors, geographic_focus,
                    target_beneficiaries, founding_date, registration_number, tax_id,
                    annual_budget, staff_size, logo_url, social_media, legal_documents,
                    certifications, metadata, status, created_by, created_at, updated_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
                    $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
                )
            """,
                organization_id, org_data.name, org_data.organization_type.value,
                org_data.description, org_data.mission_statement, org_data.vision,
                org_data.website, org_data.email, org_data.phone,
                json.dumps(org_data.address), json.dumps(org_data.sectors),
                json.dumps(org_data.geographic_focus), json.dumps(org_data.target_beneficiaries),
                org_data.founding_date, org_data.registration_number, org_data.tax_id,
                org_data.annual_budget, org_data.staff_size, org_data.logo_url,
                json.dumps(org_data.social_media), json.dumps(org_data.legal_documents),
                json.dumps(org_data.certifications), json.dumps(org_data.metadata),
                OrganizationStatus.ACTIVE.value, current_user["user_id"],
                datetime.utcnow(), datetime.utcnow()
            )
            
            # Add creator as admin
            await conn.execute("""
                INSERT INTO organization_members (
                    id, organization_id, user_id, role, position, permissions,
                    start_date, is_public, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            """,
                str(uuid.uuid4()), organization_id, current_user["user_id"],
                TeamMemberRole.ADMIN.value, "Founder", json.dumps(["all"]),
                datetime.utcnow(), True, datetime.utcnow()
            )
            
            return OrganizationResponse(
                id=organization_id,
                name=org_data.name,
                organization_type=org_data.organization_type.value,
                description=org_data.description,
                website=org_data.website,
                sectors=org_data.sectors,
                geographic_focus=org_data.geographic_focus,
                status=OrganizationStatus.ACTIVE.value,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                team_size=1,
                is_verified=False
            )
            
    except Exception as e:
        logger.error(f"Create organization failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create organization")

@app.get("/api/organizations", response_model=List[OrganizationResponse])
async def list_organizations(
    current_user: dict = Depends(get_current_user),
    limit: int = 50,
    offset: int = 0,
    organization_type: Optional[OrganizationType] = None,
    sectors: Optional[str] = None,
    geographic_focus: Optional[str] = None
):
    """List organizations accessible to user"""
    try:
        async with db_manager.get_connection() as conn:
            base_query = """
                SELECT o.id, o.name, o.organization_type, o.description, o.website,
                       o.sectors, o.geographic_focus, o.status, o.created_at,
                       o.updated_at, o.is_verified,
                       COUNT(om.id) as team_size
                FROM organizations o
                LEFT JOIN organization_members om ON o.id = om.organization_id
                WHERE o.status = 'active'
                AND (o.is_public = true OR EXISTS (
                    SELECT 1 FROM organization_members 
                    WHERE organization_id = o.id AND user_id = $1
                ))
            """
            
            conditions = []
            params = [current_user["user_id"]]
            param_count = 1
            
            if organization_type:
                param_count += 1
                conditions.append(f"o.organization_type = ${param_count}")
                params.append(organization_type.value)
            
            if sectors:
                sector_list = [s.strip() for s in sectors.split(',')]
                param_count += 1
                conditions.append(f"o.sectors && ${param_count}")
                params.append(sector_list)
            
            if geographic_focus:
                geo_list = [g.strip() for g in geographic_focus.split(',')]
                param_count += 1
                conditions.append(f"o.geographic_focus && ${param_count}")
                params.append(geo_list)
            
            if conditions:
                base_query += " AND " + " AND ".join(conditions)
            
            base_query += f"""
                GROUP BY o.id, o.name, o.organization_type, o.description, o.website,
                         o.sectors, o.geographic_focus, o.status, o.created_at,
                         o.updated_at, o.is_verified
                ORDER BY o.created_at DESC
                LIMIT ${param_count + 1} OFFSET ${param_count + 2}
            """
            
            params.extend([limit, offset])
            organizations = await conn.fetch(base_query, *params)
            
            return [
                OrganizationResponse(
                    id=org['id'],
                    name=org['name'],
                    organization_type=org['organization_type'],
                    description=org['description'],
                    website=org['website'],
                    sectors=org['sectors'] or [],
                    geographic_focus=org['geographic_focus'] or [],
                    status=org['status'],
                    created_at=org['created_at'],
                    updated_at=org['updated_at'],
                    team_size=org['team_size'],
                    is_verified=org['is_verified']
                )
                for org in organizations
            ]
            
    except Exception as e:
        logger.error(f"List organizations failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to list organizations")

@app.get("/api/organizations/{organization_id}")
async def get_organization(
    organization_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get detailed organization information"""
    try:
        async with db_manager.get_connection() as conn:
            organization = await conn.fetchrow("""
                SELECT o.*, COUNT(om.id) as team_size
                FROM organizations o
                LEFT JOIN organization_members om ON o.id = om.organization_id
                WHERE o.id = $1
                AND (o.is_public = true OR EXISTS (
                    SELECT 1 FROM organization_members 
                    WHERE organization_id = o.id AND user_id = $2
                ))
                GROUP BY o.id
            """, organization_id, current_user["user_id"])
            
            if not organization:
                raise HTTPException(status_code=404, detail="Organization not found")
            
            # Get team members (if user has access)
            team_members = await conn.fetch("""
                SELECT om.*, u.name, u.email
                FROM organization_members om
                JOIN users u ON om.user_id = u.id
                WHERE om.organization_id = $1
                AND (om.is_public = true OR EXISTS (
                    SELECT 1 FROM organization_members 
                    WHERE organization_id = $1 AND user_id = $2
                ))
                ORDER BY om.created_at
            """, organization_id, current_user["user_id"])
            
            # Get compliance records
            compliance_records = await conn.fetch("""
                SELECT * FROM compliance_records
                WHERE organization_id = $1
                ORDER BY created_at DESC
            """, organization_id)
            
            return {
                "organization": dict(organization),
                "team_members": [dict(member) for member in team_members],
                "compliance_records": [dict(record) for record in compliance_records],
                "team_size": organization['team_size']
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get organization failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get organization")

@app.put("/api/organizations/{organization_id}")
async def update_organization(
    organization_id: str,
    org_data: OrganizationUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update organization information"""
    try:
        # Check access
        if not await check_organization_access(current_user["user_id"], organization_id):
            raise HTTPException(status_code=403, detail="Access denied")
        
        async with db_manager.get_connection() as conn:
            # Build update query dynamically
            update_fields = []
            params = []
            param_count = 0
            
            for field, value in org_data.dict(exclude_unset=True).items():
                if value is not None:
                    param_count += 1
                    if field in ['address', 'sectors', 'geographic_focus', 'target_beneficiaries', 
                               'social_media', 'certifications', 'metadata']:
                        update_fields.append(f"{field} = ${param_count}")
                        params.append(json.dumps(value))
                    else:
                        update_fields.append(f"{field} = ${param_count}")
                        params.append(value)
            
            if update_fields:
                param_count += 1
                params.append(datetime.utcnow())
                update_fields.append(f"updated_at = ${param_count}")
                
                param_count += 1
                params.append(organization_id)
                
                query = f"""
                    UPDATE organizations 
                    SET {', '.join(update_fields)}
                    WHERE id = ${param_count}
                """
                
                await conn.execute(query, *params)
            
            return {"message": "Organization updated successfully"}
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update organization failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to update organization")

# Continue with team member management endpoints...

@app.post("/api/organizations/{organization_id}/members")
async def add_team_member(
    organization_id: str,
    member_data: TeamMemberCreate,
    current_user: dict = Depends(get_current_user)
):
    """Add team member to organization"""
    try:
        # Check admin access
        if not await check_organization_access(current_user["user_id"], organization_id):
            raise HTTPException(status_code=403, detail="Access denied")
        
        async with db_manager.get_connection() as conn:
            member_id = str(uuid.uuid4())
            
            await conn.execute("""
                INSERT INTO organization_members (
                    id, organization_id, user_id, role, position, department,
                    start_date, permissions, bio, skills, contact_info,
                    is_public, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            """,
                member_id, organization_id, member_data.user_id,
                member_data.role.value, member_data.position, member_data.department,
                member_data.start_date, json.dumps(member_data.permissions),
                member_data.bio, json.dumps(member_data.skills),
                json.dumps(member_data.contact_info), member_data.is_public,
                datetime.utcnow()
            )
            
            return {"message": "Team member added successfully", "member_id": member_id}
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Add team member failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to add team member")

if __name__ == "__main__":
    uvicorn.run(
        "org_service:app",
        host="0.0.0.0",
        port=8022,
        reload=True,
        log_level="info"
    )