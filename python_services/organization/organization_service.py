#!/usr/bin/env python3
"""
Granada OS - Organization Service
Comprehensive organization management
Port: 8006
"""

from fastapi import FastAPI, HTTPException, Depends, Security, BackgroundTasks, Request, UploadFile, File, Query
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
import aiofiles
from enum import Enum

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
    NGO = "ngo"
    NONPROFIT = "nonprofit"
    FOUNDATION = "foundation"
    UNIVERSITY = "university"
    GOVERNMENT = "government"
    CORPORATE = "corporate"
    STARTUP = "startup"
    SME = "sme"
    COOPERATIVE = "cooperative"
    SOCIAL_ENTERPRISE = "social_enterprise"

class MemberRole(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MANAGER = "manager"
    COORDINATOR = "coordinator"
    MEMBER = "member"
    VOLUNTEER = "volunteer"
    CONSULTANT = "consultant"
    PARTNER = "partner"

class VerificationLevel(int, Enum):
    UNVERIFIED = 0
    BASIC = 1
    STANDARD = 2
    PREMIUM = 3
    ENTERPRISE = 4

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class OrganizationCreate(BaseModel):
    name: str = Field(..., max_length=255)
    legal_name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    mission: Optional[str] = Field(None, max_length=1000)
    vision: Optional[str] = Field(None, max_length=1000)
    values: List[str] = Field(default=[])
    organization_type: OrganizationType
    sub_type: Optional[str] = Field(None, max_length=50)
    category: Optional[str] = Field(None, max_length=100)
    industry: Optional[str] = Field(None, max_length=100)
    sector: Optional[str] = Field(None, max_length=100)
    size: Optional[str] = Field(None, max_length=50)
    founded_date: Optional[datetime] = None
    registration_number: Optional[str] = Field(None, max_length=100)
    tax_id: Optional[str] = Field(None, max_length=50)
    vat_number: Optional[str] = Field(None, max_length=50)
    registration_country: str = Field(..., max_length=100)
    operating_countries: List[str] = Field(default=[])
    headquarters: Dict[str, Any] = Field(default={})
    website: Optional[str] = Field(None, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    social_media: Dict[str, str] = Field(default={})
    employee_count: Optional[int] = Field(None, ge=0)
    annual_revenue: Optional[float] = Field(None, ge=0)
    currency: str = Field(default="USD", max_length=10)

class OrganizationUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    legal_name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    mission: Optional[str] = Field(None, max_length=1000)
    vision: Optional[str] = Field(None, max_length=1000)
    values: Optional[List[str]] = None
    sub_type: Optional[str] = Field(None, max_length=50)
    category: Optional[str] = Field(None, max_length=100)
    industry: Optional[str] = Field(None, max_length=100)
    sector: Optional[str] = Field(None, max_length=100)
    size: Optional[str] = Field(None, max_length=50)
    website: Optional[str] = Field(None, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    social_media: Optional[Dict[str, str]] = None
    employee_count: Optional[int] = Field(None, ge=0)
    annual_revenue: Optional[float] = Field(None, ge=0)

class MemberInvite(BaseModel):
    email: EmailStr
    role: MemberRole
    title: Optional[str] = Field(None, max_length=100)
    department: Optional[str] = Field(None, max_length=100)
    permissions: List[str] = Field(default=[])
    message: Optional[str] = Field(None, max_length=500)

class MemberUpdate(BaseModel):
    role: Optional[MemberRole] = None
    title: Optional[str] = Field(None, max_length=100)
    department: Optional[str] = Field(None, max_length=100)
    permissions: Optional[List[str]] = None
    is_active: Optional[bool] = None

class DepartmentCreate(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    parent_department_id: Optional[str] = None
    head_of_department_id: Optional[str] = None
    budget: Optional[float] = Field(None, ge=0)
    cost_center: Optional[str] = Field(None, max_length=50)
    objectives: List[str] = Field(default=[])

class LocationCreate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    location_type: str = Field(..., max_length=50)
    address_line_1: str = Field(..., max_length=255)
    address_line_2: Optional[str] = Field(None, max_length=255)
    city: str = Field(..., max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    postal_code: Optional[str] = Field(None, max_length=20)
    country: str = Field(..., max_length=100)
    coordinates: Optional[Dict[str, float]] = Field(default={})
    phone: Optional[str] = Field(None, max_length=50)
    email: Optional[EmailStr] = None
    is_headquarters: bool = Field(default=False)
    capacity: Optional[int] = Field(None, ge=0)
    facilities: List[str] = Field(default=[])

class VerificationRequest(BaseModel):
    verification_type: str = Field(..., max_length=50)
    documents: List[Dict[str, Any]] = Field(default=[])
    supporting_info: Dict[str, Any] = Field(default={})
    contact_person: Dict[str, Any] = Field(default={})

class OrganizationResponse(BaseModel):
    id: str
    name: str
    legal_name: Optional[str]
    description: Optional[str]
    organization_type: str
    sector: Optional[str]
    country: str
    website: Optional[str]
    is_verified: bool
    verification_level: int
    member_count: int
    created_at: datetime
    logo_url: Optional[str]

class MemberResponse(BaseModel):
    id: str
    user_id: str
    user_name: str
    user_email: str
    role: str
    title: Optional[str]
    department: Optional[str]
    is_active: bool
    joined_at: datetime

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
        # Simplified authentication - in production, verify JWT token
        return {"user_id": "user_123", "email": "user@example.com"}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# ============================================================================
# FASTAPI APPLICATION SETUP
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db_manager.create_pool()
    logger.info("Organization Service started on port 8006")
    yield
    await db_manager.close_pool()

app = FastAPI(
    title="Granada OS - Organization Service",
    description="Comprehensive organization management",
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

async def send_member_invitation(email: str, organization_name: str, role: str, invite_token: str):
    """Send member invitation email"""
    logger.info(f"Sending invitation to {email} for {organization_name} as {role}")

async def check_organization_permissions(user_id: str, organization_id: str, required_role: str = "member") -> bool:
    """Check if user has required permissions for organization"""
    async with db_manager.get_connection() as conn:
        member = await conn.fetchrow("""
            SELECT role, is_active FROM organization_members
            WHERE user_id = $1 AND organization_id = $2 AND is_active = true
        """, user_id, organization_id)
        
        if not member:
            return False
        
        # Role hierarchy: owner > admin > manager > coordinator > member
        role_hierarchy = {
            "owner": 5,
            "admin": 4,
            "manager": 3,
            "coordinator": 2,
            "member": 1
        }
        
        user_level = role_hierarchy.get(member['role'], 0)
        required_level = role_hierarchy.get(required_role, 0)
        
        return user_level >= required_level

async def generate_organization_slug(name: str) -> str:
    """Generate unique slug for organization"""
    import re
    base_slug = re.sub(r'[^a-zA-Z0-9\s]', '', name.lower())
    base_slug = re.sub(r'\s+', '-', base_slug)
    
    async with db_manager.get_connection() as conn:
        counter = 0
        while True:
            slug = f"{base_slug}-{counter}" if counter > 0 else base_slug
            exists = await conn.fetchval(
                "SELECT id FROM organizations WHERE slug = $1", slug
            )
            if not exists:
                return slug
            counter += 1

# ============================================================================
# ORGANIZATION MANAGEMENT ENDPOINTS
# ============================================================================

@app.post("/api/organizations", response_model=OrganizationResponse)
async def create_organization(
    org_data: OrganizationCreate,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Create a new organization"""
    try:
        async with db_manager.get_connection() as conn:
            # Check if user already owns too many organizations
            org_count = await conn.fetchval("""
                SELECT COUNT(*) FROM organization_members
                WHERE user_id = $1 AND role = 'owner'
            """, current_user['user_id'])
            
            if org_count >= 5:  # Limit to 5 organizations per user
                raise HTTPException(status_code=400, detail="Maximum organization limit reached")
            
            # Generate unique slug
            slug = await generate_organization_slug(org_data.name)
            
            # Create organization
            org_id = str(uuid.uuid4())
            
            await conn.execute("""
                INSERT INTO organizations (
                    id, name, legal_name, display_name, slug, description,
                    mission, vision, values, type, sub_type, category,
                    industry, sector, size, founded_date, registration_number,
                    tax_id, vat_number, registration_country, operating_countries,
                    headquarters, website, email, phone, social_media,
                    employee_count, annual_revenue, currency, is_active,
                    created_at, created_by
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
                    $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,
                    $27, $28, $29, $30, $31, $32
                )
            """,
                org_id, org_data.name, org_data.legal_name, org_data.name,
                slug, org_data.description, org_data.mission, org_data.vision,
                json.dumps(org_data.values), org_data.organization_type.value,
                org_data.sub_type, org_data.category, org_data.industry,
                org_data.sector, org_data.size, org_data.founded_date,
                org_data.registration_number, org_data.tax_id, org_data.vat_number,
                org_data.registration_country, json.dumps(org_data.operating_countries),
                json.dumps(org_data.headquarters), org_data.website, org_data.email,
                org_data.phone, json.dumps(org_data.social_media),
                org_data.employee_count, org_data.annual_revenue, org_data.currency,
                True, datetime.utcnow(), current_user['user_id']
            )
            
            # Add creator as owner
            member_id = str(uuid.uuid4())
            await conn.execute("""
                INSERT INTO organization_members (
                    id, organization_id, user_id, role, title, is_active,
                    is_primary, joined_at, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            """,
                member_id, org_id, current_user['user_id'], "owner",
                "Founder", True, True, datetime.utcnow(), datetime.utcnow()
            )
            
            # Create default department
            dept_id = str(uuid.uuid4())
            await conn.execute("""
                INSERT INTO organization_departments (
                    id, organization_id, name, description, is_active, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6)
            """,
                dept_id, org_id, "General", "Default department", True, datetime.utcnow()
            )
            
            # Create headquarters location if provided
            if org_data.headquarters:
                location_id = str(uuid.uuid4())
                await conn.execute("""
                    INSERT INTO organization_locations (
                        id, organization_id, name, type, address_line_1,
                        city, country, is_headquarters, is_active, created_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                """,
                    location_id, org_id, "Headquarters", "headquarters",
                    org_data.headquarters.get('address', ''),
                    org_data.headquarters.get('city', ''),
                    org_data.registration_country, True, True, datetime.utcnow()
                )
            
            return OrganizationResponse(
                id=org_id,
                name=org_data.name,
                legal_name=org_data.legal_name,
                description=org_data.description,
                organization_type=org_data.organization_type.value,
                sector=org_data.sector,
                country=org_data.registration_country,
                website=org_data.website,
                is_verified=False,
                verification_level=0,
                member_count=1,
                created_at=datetime.utcnow(),
                logo_url=None
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Organization creation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create organization")

@app.get("/api/organizations", response_model=List[OrganizationResponse])
async def list_organizations(
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0),
    organization_type: Optional[OrganizationType] = None,
    sector: Optional[str] = None,
    country: Optional[str] = None,
    verified_only: bool = Query(default=False),
    search: Optional[str] = None
):
    """List organizations with filtering and pagination"""
    try:
        async with db_manager.get_connection() as conn:
            base_query = """
                SELECT o.id, o.name, o.legal_name, o.description, o.type,
                       o.sector, o.registration_country, o.website, o.is_verified,
                       o.verification_level, o.logo, o.created_at,
                       COUNT(om.id) as member_count
                FROM organizations o
                LEFT JOIN organization_members om ON o.id = om.organization_id AND om.is_active = true
                WHERE o.is_active = true
            """
            
            conditions = []
            params = []
            param_count = 0
            
            if organization_type:
                param_count += 1
                conditions.append(f"o.type = ${param_count}")
                params.append(organization_type.value)
            
            if sector:
                param_count += 1
                conditions.append(f"o.sector = ${param_count}")
                params.append(sector)
            
            if country:
                param_count += 1
                conditions.append(f"o.registration_country = ${param_count}")
                params.append(country)
            
            if verified_only:
                conditions.append("o.is_verified = true")
            
            if search:
                param_count += 1
                conditions.append(f"(o.name ILIKE ${param_count} OR o.description ILIKE ${param_count})")
                params.append(f"%{search}%")
            
            if conditions:
                base_query += " AND " + " AND ".join(conditions)
            
            base_query += f"""
                GROUP BY o.id, o.name, o.legal_name, o.description, o.type,
                         o.sector, o.registration_country, o.website, o.is_verified,
                         o.verification_level, o.logo, o.created_at
                ORDER BY o.created_at DESC
                LIMIT ${param_count + 1} OFFSET ${param_count + 2}
            """
            
            params.extend([limit, offset])
            organizations = await conn.fetch(base_query, *params)
            
            return [
                OrganizationResponse(
                    id=org['id'],
                    name=org['name'],
                    legal_name=org['legal_name'],
                    description=org['description'],
                    organization_type=org['type'],
                    sector=org['sector'],
                    country=org['registration_country'],
                    website=org['website'],
                    is_verified=org['is_verified'],
                    verification_level=org['verification_level'],
                    member_count=org['member_count'],
                    created_at=org['created_at'],
                    logo_url=org['logo']
                )
                for org in organizations
            ]
            
    except Exception as e:
        logger.error(f"List organizations failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to list organizations")

@app.get("/api/organizations/{organization_id}", response_model=OrganizationResponse)
async def get_organization(organization_id: str):
    """Get organization by ID"""
    try:
        async with db_manager.get_connection() as conn:
            org = await conn.fetchrow("""
                SELECT o.*, COUNT(om.id) as member_count
                FROM organizations o
                LEFT JOIN organization_members om ON o.id = om.organization_id AND om.is_active = true
                WHERE o.id = $1 AND o.is_active = true
                GROUP BY o.id
            """, organization_id)
            
            if not org:
                raise HTTPException(status_code=404, detail="Organization not found")
            
            return OrganizationResponse(
                id=org['id'],
                name=org['name'],
                legal_name=org['legal_name'],
                description=org['description'],
                organization_type=org['type'],
                sector=org['sector'],
                country=org['registration_country'],
                website=org['website'],
                is_verified=org['is_verified'],
                verification_level=org['verification_level'],
                member_count=org['member_count'],
                created_at=org['created_at'],
                logo_url=org['logo']
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get organization failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get organization")

@app.put("/api/organizations/{organization_id}")
async def update_organization(
    organization_id: str,
    org_update: OrganizationUpdate,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Update organization"""
    try:
        # Check permissions
        if not await check_organization_permissions(current_user['user_id'], organization_id, "admin"):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        async with db_manager.get_connection() as conn:
            # Build update query dynamically
            update_fields = []
            params = []
            param_count = 0
            
            for field, value in org_update.dict(exclude_unset=True).items():
                if value is not None:
                    param_count += 1
                    if field in ['values', 'social_media']:
                        update_fields.append(f"{field} = ${param_count}")
                        params.append(json.dumps(value))
                    else:
                        update_fields.append(f"{field} = ${param_count}")
                        params.append(value)
            
            if not update_fields:
                raise HTTPException(status_code=400, detail="No fields to update")
            
            param_count += 1
            update_fields.append(f"updated_at = ${param_count}")
            params.append(datetime.utcnow())
            
            param_count += 1
            update_fields.append(f"updated_by = ${param_count}")
            params.append(current_user['user_id'])
            
            params.append(organization_id)
            
            query = f"""
                UPDATE organizations SET {', '.join(update_fields)}
                WHERE id = ${param_count + 1} AND is_active = true
            """
            
            result = await conn.execute(query, *params)
            
            if result == "UPDATE 0":
                raise HTTPException(status_code=404, detail="Organization not found")
            
            return {"message": "Organization updated successfully"}
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Organization update failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to update organization")

@app.delete("/api/organizations/{organization_id}")
async def delete_organization(
    organization_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete (deactivate) organization"""
    try:
        # Only owner can delete organization
        if not await check_organization_permissions(current_user['user_id'], organization_id, "owner"):
            raise HTTPException(status_code=403, detail="Only organization owner can delete")
        
        async with db_manager.get_connection() as conn:
            # Soft delete
            result = await conn.execute("""
                UPDATE organizations SET 
                    is_active = false,
                    deleted_at = $1,
                    updated_by = $2
                WHERE id = $3 AND is_active = true
            """, datetime.utcnow(), current_user['user_id'], organization_id)
            
            if result == "UPDATE 0":
                raise HTTPException(status_code=404, detail="Organization not found")
            
            # Deactivate all members
            await conn.execute("""
                UPDATE organization_members SET 
                    is_active = false,
                    left_at = $1,
                    left_reason = 'organization_deleted'
                WHERE organization_id = $2
            """, datetime.utcnow(), organization_id)
            
            return {"message": "Organization deleted successfully"}
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Organization deletion failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete organization")

# ============================================================================
# MEMBER MANAGEMENT ENDPOINTS
# ============================================================================

@app.get("/api/organizations/{organization_id}/members", response_model=List[MemberResponse])
async def list_organization_members(
    organization_id: str,
    current_user: dict = Depends(get_current_user),
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0),
    role: Optional[MemberRole] = None,
    department: Optional[str] = None,
    active_only: bool = Query(default=True)
):
    """List organization members"""
    try:
        # Check permissions
        if not await check_organization_permissions(current_user['user_id'], organization_id, "member"):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        async with db_manager.get_connection() as conn:
            base_query = """
                SELECT om.id, om.user_id, om.role, om.title, om.department,
                       om.is_active, om.joined_at,
                       u.first_name, u.last_name, u.email,
                       CONCAT(u.first_name, ' ', u.last_name) as user_name
                FROM organization_members om
                JOIN users u ON om.user_id = u.id
                WHERE om.organization_id = $1
            """
            
            conditions = []
            params = [organization_id]
            param_count = 1
            
            if active_only:
                conditions.append("om.is_active = true")
            
            if role:
                param_count += 1
                conditions.append(f"om.role = ${param_count}")
                params.append(role.value)
            
            if department:
                param_count += 1
                conditions.append(f"om.department = ${param_count}")
                params.append(department)
            
            if conditions:
                base_query += " AND " + " AND ".join(conditions)
            
            base_query += f"""
                ORDER BY om.joined_at DESC
                LIMIT ${param_count + 1} OFFSET ${param_count + 2}
            """
            
            params.extend([limit, offset])
            members = await conn.fetch(base_query, *params)
            
            return [
                MemberResponse(
                    id=member['id'],
                    user_id=member['user_id'],
                    user_name=member['user_name'],
                    user_email=member['email'],
                    role=member['role'],
                    title=member['title'],
                    department=member['department'],
                    is_active=member['is_active'],
                    joined_at=member['joined_at']
                )
                for member in members
            ]
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"List members failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to list members")

@app.post("/api/organizations/{organization_id}/members/invite")
async def invite_member(
    organization_id: str,
    invite: MemberInvite,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Invite new member to organization"""
    try:
        # Check permissions
        if not await check_organization_permissions(current_user['user_id'], organization_id, "admin"):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        async with db_manager.get_connection() as conn:
            # Check if user is already a member
            existing_member = await conn.fetchval("""
                SELECT id FROM organization_members om
                JOIN users u ON om.user_id = u.id
                WHERE om.organization_id = $1 AND u.email = $2 AND om.is_active = true
            """, organization_id, invite.email.lower())
            
            if existing_member:
                raise HTTPException(status_code=400, detail="User is already a member")
            
            # Get organization info
            org_info = await conn.fetchrow("""
                SELECT name, type FROM organizations WHERE id = $1
            """, organization_id)
            
            if not org_info:
                raise HTTPException(status_code=404, detail="Organization not found")
            
            # Check if user exists
            user = await conn.fetchrow("""
                SELECT id, first_name, last_name FROM users WHERE email = $1
            """, invite.email.lower())
            
            # Generate invitation token
            invite_token = str(uuid.uuid4())
            
            if user:
                # User exists, create membership directly (pending acceptance)
                member_id = str(uuid.uuid4())
                await conn.execute("""
                    INSERT INTO organization_members (
                        id, organization_id, user_id, role, title, department,
                        permissions, is_active, invited_by, invited_at, created_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                """,
                    member_id, organization_id, user['id'], invite.role.value,
                    invite.title, invite.department, json.dumps(invite.permissions),
                    False, current_user['user_id'], datetime.utcnow(), datetime.utcnow()
                )
            else:
                # User doesn't exist, store invitation for later
                await conn.execute("""
                    INSERT INTO member_invitations (
                        id, organization_id, email, role, title, department,
                        permissions, invited_by, invite_token, expires_at, created_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                """,
                    str(uuid.uuid4()), organization_id, invite.email.lower(),
                    invite.role.value, invite.title, invite.department,
                    json.dumps(invite.permissions), current_user['user_id'],
                    invite_token, datetime.utcnow() + timedelta(days=7), datetime.utcnow()
                )
            
            # Send invitation email
            background_tasks.add_task(
                send_member_invitation,
                invite.email,
                org_info['name'],
                invite.role.value,
                invite_token
            )
            
            return {
                "message": "Invitation sent successfully",
                "invite_token": invite_token,
                "expires_at": datetime.utcnow() + timedelta(days=7)
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Member invitation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to invite member")

@app.put("/api/organizations/{organization_id}/members/{member_id}")
async def update_member(
    organization_id: str,
    member_id: str,
    member_update: MemberUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update organization member"""
    try:
        # Check permissions
        if not await check_organization_permissions(current_user['user_id'], organization_id, "admin"):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        async with db_manager.get_connection() as conn:
            # Build update query
            update_fields = []
            params = []
            param_count = 0
            
            for field, value in member_update.dict(exclude_unset=True).items():
                if value is not None:
                    param_count += 1
                    if field == 'permissions':
                        update_fields.append(f"{field} = ${param_count}")
                        params.append(json.dumps(value))
                    elif field == 'role':
                        update_fields.append(f"{field} = ${param_count}")
                        params.append(value.value if hasattr(value, 'value') else value)
                    else:
                        update_fields.append(f"{field} = ${param_count}")
                        params.append(value)
            
            if not update_fields:
                raise HTTPException(status_code=400, detail="No fields to update")
            
            param_count += 1
            update_fields.append(f"updated_at = ${param_count}")
            params.append(datetime.utcnow())
            
            params.extend([member_id, organization_id])
            
            query = f"""
                UPDATE organization_members SET {', '.join(update_fields)}
                WHERE id = ${param_count + 1} AND organization_id = ${param_count + 2}
            """
            
            result = await conn.execute(query, *params)
            
            if result == "UPDATE 0":
                raise HTTPException(status_code=404, detail="Member not found")
            
            return {"message": "Member updated successfully"}
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Member update failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to update member")

@app.delete("/api/organizations/{organization_id}/members/{member_id}")
async def remove_member(
    organization_id: str,
    member_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Remove member from organization"""
    try:
        # Check permissions
        if not await check_organization_permissions(current_user['user_id'], organization_id, "admin"):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        async with db_manager.get_connection() as conn:
            # Check if trying to remove the last owner
            member_info = await conn.fetchrow("""
                SELECT user_id, role FROM organization_members
                WHERE id = $1 AND organization_id = $2
            """, member_id, organization_id)
            
            if not member_info:
                raise HTTPException(status_code=404, detail="Member not found")
            
            if member_info['role'] == 'owner':
                owner_count = await conn.fetchval("""
                    SELECT COUNT(*) FROM organization_members
                    WHERE organization_id = $1 AND role = 'owner' AND is_active = true
                """, organization_id)
                
                if owner_count <= 1:
                    raise HTTPException(status_code=400, detail="Cannot remove the last owner")
            
            # Remove member
            await conn.execute("""
                UPDATE organization_members SET 
                    is_active = false,
                    left_at = $1,
                    left_reason = 'removed_by_admin'
                WHERE id = $2 AND organization_id = $3
            """, datetime.utcnow(), member_id, organization_id)
            
            return {"message": "Member removed successfully"}
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Member removal failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to remove member")

# Continue with additional endpoints for:
# - Department management
# - Location management
# - Organization verification
# - Settings management
# - Analytics and reporting
# - File uploads (logos, documents)
# - Integration management
# etc.

# ============================================================================
# DEPARTMENT MANAGEMENT ENDPOINTS
# ============================================================================

@app.get("/api/organizations/{organization_id}/departments")
async def list_departments(
    organization_id: str,
    current_user: dict = Depends(get_current_user)
):
    """List organization departments"""
    try:
        if not await check_organization_permissions(current_user['user_id'], organization_id, "member"):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        async with db_manager.get_connection() as conn:
            departments = await conn.fetch("""
                SELECT d.*, 
                       u.first_name || ' ' || u.last_name as head_name,
                       COUNT(om.id) as member_count
                FROM organization_departments d
                LEFT JOIN users u ON d.head_of_department = u.id
                LEFT JOIN organization_members om ON d.id = om.department AND om.is_active = true
                WHERE d.organization_id = $1 AND d.is_active = true
                GROUP BY d.id, u.first_name, u.last_name
                ORDER BY d.name
            """, organization_id)
            
            return [dict(dept) for dept in departments]
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"List departments failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to list departments")

@app.post("/api/organizations/{organization_id}/departments")
async def create_department(
    organization_id: str,
    dept_data: DepartmentCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new department"""
    try:
        if not await check_organization_permissions(current_user['user_id'], organization_id, "admin"):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        async with db_manager.get_connection() as conn:
            dept_id = str(uuid.uuid4())
            
            await conn.execute("""
                INSERT INTO organization_departments (
                    id, organization_id, name, description, parent_department,
                    head_of_department, budget, cost_center, objectives, is_active, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            """,
                dept_id, organization_id, dept_data.name, dept_data.description,
                dept_data.parent_department_id, dept_data.head_of_department_id,
                dept_data.budget, dept_data.cost_center, json.dumps(dept_data.objectives),
                True, datetime.utcnow()
            )
            
            return {"id": dept_id, "message": "Department created successfully"}
            
    except Exception as e:
        logger.error(f"Department creation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create department")

# ============================================================================
# LOCATION MANAGEMENT ENDPOINTS
# ============================================================================

@app.get("/api/organizations/{organization_id}/locations")
async def list_locations(
    organization_id: str,
    current_user: dict = Depends(get_current_user)
):
    """List organization locations"""
    try:
        if not await check_organization_permissions(current_user['user_id'], organization_id, "member"):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        async with db_manager.get_connection() as conn:
            locations = await conn.fetch("""
                SELECT * FROM organization_locations
                WHERE organization_id = $1 AND is_active = true
                ORDER BY is_headquarters DESC, name
            """, organization_id)
            
            return [dict(location) for location in locations]
            
    except Exception as e:
        logger.error(f"List locations failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to list locations")

@app.post("/api/organizations/{organization_id}/locations")
async def create_location(
    organization_id: str,
    location_data: LocationCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new location"""
    try:
        if not await check_organization_permissions(current_user['user_id'], organization_id, "admin"):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        async with db_manager.get_connection() as conn:
            location_id = str(uuid.uuid4())
            
            await conn.execute("""
                INSERT INTO organization_locations (
                    id, organization_id, name, type, address_line_1, address_line_2,
                    city, state, postal_code, country, coordinates, phone, email,
                    is_headquarters, capacity, facilities, is_active, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            """,
                location_id, organization_id, location_data.name, location_data.location_type,
                location_data.address_line_1, location_data.address_line_2,
                location_data.city, location_data.state, location_data.postal_code,
                location_data.country, json.dumps(location_data.coordinates),
                location_data.phone, location_data.email, location_data.is_headquarters,
                location_data.capacity, json.dumps(location_data.facilities),
                True, datetime.utcnow()
            )
            
            return {"id": location_id, "message": "Location created successfully"}
            
    except Exception as e:
        logger.error(f"Location creation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create location")

# ============================================================================
# VERIFICATION ENDPOINTS
# ============================================================================

@app.post("/api/organizations/{organization_id}/verification")
async def request_verification(
    organization_id: str,
    verification_request: VerificationRequest,
    current_user: dict = Depends(get_current_user)
):
    """Request organization verification"""
    try:
        if not await check_organization_permissions(current_user['user_id'], organization_id, "admin"):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        async with db_manager.get_connection() as conn:
            # Check if verification already pending
            pending = await conn.fetchval("""
                SELECT id FROM organization_verifications
                WHERE organization_id = $1 AND status = 'pending'
            """, organization_id)
            
            if pending:
                raise HTTPException(status_code=400, detail="Verification already pending")
            
            verification_id = str(uuid.uuid4())
            
            await conn.execute("""
                INSERT INTO organization_verifications (
                    id, organization_id, verification_type, documents,
                    supporting_info, contact_person, status, requested_by, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            """,
                verification_id, organization_id, verification_request.verification_type,
                json.dumps(verification_request.documents),
                json.dumps(verification_request.supporting_info),
                json.dumps(verification_request.contact_person),
                "pending", current_user['user_id'], datetime.utcnow()
            )
            
            return {
                "verification_id": verification_id,
                "message": "Verification request submitted successfully"
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Verification request failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to request verification")

if __name__ == "__main__":
    uvicorn.run(
        "organization_service:app",
        host="0.0.0.0",
        port=8006,
        reload=True,
        log_level="info"
    )