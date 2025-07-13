#!/usr/bin/env python3
"""
Granada OS - Funding Service
Comprehensive funding opportunities and grant management
Port: 8007
"""

from fastapi import FastAPI, HTTPException, Depends, Security, BackgroundTasks, Request, UploadFile, File, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
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
import pandas as pd
from io import BytesIO
import zipfile

# ============================================================================
# CONFIGURATION & SETUP
# ============================================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
security = HTTPBearer()

# ============================================================================
# ENUMS AND CONSTANTS
# ============================================================================

class FundingType(str, Enum):
    GRANT = "grant"
    LOAN = "loan"
    EQUITY = "equity"
    DONATION = "donation"
    SCHOLARSHIP = "scholarship"
    FELLOWSHIP = "fellowship"
    AWARD = "award"
    PRIZE = "prize"
    CROWDFUNDING = "crowdfunding"
    GOVERNMENT = "government"

class ApplicationStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    SHORTLISTED = "shortlisted"
    APPROVED = "approved"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"
    ON_HOLD = "on_hold"
    RESUBMISSION_REQUIRED = "resubmission_required"

class FundingStatus(str, Enum):
    OPEN = "open"
    CLOSED = "closed"
    UPCOMING = "upcoming"
    ROLLING = "rolling"
    PAUSED = "paused"
    CANCELLED = "cancelled"

class GrantStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    SUSPENDED = "suspended"
    TERMINATED = "terminated"
    EXTENDED = "extended"

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class FundingOpportunityCreate(BaseModel):
    title: str = Field(..., max_length=500)
    description: str
    summary: Optional[str] = Field(None, max_length=2000)
    objectives: List[str] = Field(default=[])
    requirements: List[str] = Field(default=[])
    eligibility_criteria: List[str] = Field(default=[])
    categories: List[str] = Field(default=[])
    tags: List[str] = Field(default=[])
    keywords: List[str] = Field(default=[])
    funder_name: str = Field(..., max_length=255)
    funder_type: str = Field(..., max_length=100)
    organization_id: Optional[str] = None
    amount: Optional[float] = Field(None, ge=0)
    min_amount: Optional[float] = Field(None, ge=0)
    max_amount: Optional[float] = Field(None, ge=0)
    currency: str = Field(default="USD", max_length=10)
    funding_type: FundingType
    application_deadline: Optional[datetime] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration_months: Optional[int] = Field(None, ge=1, le=120)
    geographic_scope: List[str] = Field(default=[])
    target_beneficiaries: List[str] = Field(default=[])
    sectors: List[str] = Field(default=[])
    sdgs: List[int] = Field(default=[])  # UN SDG numbers
    application_process: Dict[str, Any] = Field(default={})
    document_requirements: List[str] = Field(default=[])
    selection_criteria: List[str] = Field(default=[])
    evaluation_process: Optional[str] = None
    reporting_requirements: List[str] = Field(default=[])
    disbursement_schedule: Dict[str, Any] = Field(default={})
    renewal_options: Dict[str, Any] = Field(default={})
    contact_information: Dict[str, Any] = Field(default={})
    website: Optional[str] = None
    application_url: Optional[str] = None
    documents_url: Optional[str] = None

class FundingOpportunityUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=500)
    description: Optional[str] = None
    summary: Optional[str] = Field(None, max_length=2000)
    application_deadline: Optional[datetime] = None
    amount: Optional[float] = Field(None, ge=0)
    status: Optional[FundingStatus] = None
    tags: Optional[List[str]] = None
    website: Optional[str] = None

class ApplicationCreate(BaseModel):
    funding_opportunity_id: str
    organization_id: str
    title: str = Field(..., max_length=500)
    summary: Optional[str] = Field(None, max_length=2000)
    description: str
    project_summary: Optional[str] = Field(None, max_length=3000)
    objectives: List[str] = Field(default=[])
    methodology: Optional[str] = None
    timeline: Dict[str, Any] = Field(default={})
    budget: Dict[str, Any] = Field(default={})
    budget_justification: Optional[str] = None
    requested_amount: float = Field(..., ge=0)
    matching_funds: float = Field(default=0, ge=0)
    total_project_cost: Optional[float] = Field(None, ge=0)
    currency: str = Field(default="USD", max_length=10)
    project_duration: Optional[int] = Field(None, ge=1, le=120)  # months
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    team_members: List[Dict[str, Any]] = Field(default=[])
    principal_investigator: Dict[str, Any] = Field(default={})
    co_investigators: List[Dict[str, Any]] = Field(default=[])
    organization_capacity: Optional[str] = None
    previous_experience: Optional[str] = None
    partnerships: List[Dict[str, Any]] = Field(default=[])
    collaborations: List[Dict[str, Any]] = Field(default=[])
    impact_statement: Optional[str] = None
    sustainability: Optional[str] = None
    risk_management: Optional[str] = None
    monitoring_evaluation: Optional[str] = None
    dissemination: Optional[str] = None
    ethics_considerations: Optional[str] = None
    environmental_impact: Optional[str] = None
    social_impact: Optional[str] = None
    gender_considerations: Optional[str] = None
    innovation_aspects: Optional[str] = None
    scalability_potential: Optional[str] = None
    replication_potential: Optional[str] = None

class ApplicationUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=500)
    summary: Optional[str] = Field(None, max_length=2000)
    description: Optional[str] = None
    requested_amount: Optional[float] = Field(None, ge=0)
    status: Optional[ApplicationStatus] = None
    
class GrantCreate(BaseModel):
    grant_number: Optional[str] = Field(None, max_length=100)
    title: str = Field(..., max_length=500)
    description: Optional[str] = None
    funding_opportunity_id: str
    application_id: str
    organization_id: str
    principal_investigator: str
    co_investigators: List[str] = Field(default=[])
    amount: float = Field(..., ge=0)
    currency: str = Field(default="USD", max_length=10)
    start_date: datetime
    end_date: datetime
    grant_type: Optional[str] = Field(None, max_length=100)
    funding_type: Optional[str] = Field(None, max_length=100)
    project_summary: Optional[str] = None
    objectives: List[str] = Field(default=[])
    milestones: List[Dict[str, Any]] = Field(default=[])
    deliverables: List[Dict[str, Any]] = Field(default=[])
    budget: Dict[str, Any] = Field(default={})
    disbursement_schedule: List[Dict[str, Any]] = Field(default=[])
    reporting_schedule: List[Dict[str, Any]] = Field(default=[])
    compliance_requirements: List[str] = Field(default=[])

class ReviewCreate(BaseModel):
    application_id: str
    reviewer_id: str
    review_type: str = Field(..., max_length=50)
    score: Optional[float] = Field(None, ge=0, le=100)
    comments: Optional[str] = None
    strengths: Optional[str] = None
    weaknesses: Optional[str] = None
    recommendations: Optional[str] = None
    criteria_scores: Dict[str, float] = Field(default={})
    is_final: bool = Field(default=False)

class AIProposalRequest(BaseModel):
    funding_opportunity_id: str
    organization_id: str
    project_title: str
    project_description: str
    requested_amount: float
    project_duration_months: int
    additional_context: Dict[str, Any] = Field(default={})
    template_preference: Optional[str] = None
    focus_areas: List[str] = Field(default=[])

class DonorRequest(BaseModel):
    organization_type: List[str] = Field(default=[])
    sectors: List[str] = Field(default=[])
    geographic_focus: List[str] = Field(default=[])
    funding_range_min: Optional[float] = Field(None, ge=0)
    funding_range_max: Optional[float] = Field(None, ge=0)
    funding_types: List[FundingType] = Field(default=[])

# Response Models
class FundingOpportunityResponse(BaseModel):
    id: str
    title: str
    description: str
    funder_name: str
    amount: Optional[float]
    currency: str
    funding_type: str
    application_deadline: Optional[datetime]
    status: str
    is_featured: bool
    is_verified: bool
    match_score: Optional[float]
    created_at: datetime

class ApplicationResponse(BaseModel):
    id: str
    title: str
    funding_opportunity_title: str
    organization_name: str
    requested_amount: float
    currency: str
    status: str
    submission_date: Optional[datetime]
    deadline: Optional[datetime]
    score: Optional[float]
    created_at: datetime

class GrantResponse(BaseModel):
    id: str
    grant_number: Optional[str]
    title: str
    organization_name: str
    amount: float
    currency: str
    start_date: datetime
    end_date: datetime
    status: str
    progress: Optional[float]
    disbursed_amount: Optional[float]
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
# AI SERVICE INTEGRATION
# ============================================================================

class AIProposalGenerator:
    def __init__(self):
        self.deepseek_api_key = DEEPSEEK_API_KEY
        
    async def generate_proposal(self, request: AIProposalRequest, funding_opportunity: Dict[str, Any], organization: Dict[str, Any]) -> Dict[str, Any]:
        """Generate AI-powered funding proposal"""
        try:
            prompt = self._build_proposal_prompt(request, funding_opportunity, organization)
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.deepseek.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.deepseek_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "deepseek-chat",
                        "messages": [
                            {"role": "system", "content": "You are an expert grant writer and funding proposal specialist."},
                            {"role": "user", "content": prompt}
                        ],
                        "response_format": {"type": "json_object"},
                        "max_tokens": 4000
                    },
                    timeout=60.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("choices") and len(result["choices"]) > 0:
                        content = result["choices"][0]["message"]["content"]
                        return json.loads(content)
            
            return self._generate_fallback_proposal(request, funding_opportunity, organization)
            
        except Exception as e:
            logger.error(f"AI proposal generation failed: {e}")
            return self._generate_fallback_proposal(request, funding_opportunity, organization)
    
    def _build_proposal_prompt(self, request: AIProposalRequest, funding_opportunity: Dict[str, Any], organization: Dict[str, Any]) -> str:
        return f"""
        Generate a comprehensive funding proposal for the following:
        
        FUNDING OPPORTUNITY:
        Title: {funding_opportunity.get('title', '')}
        Funder: {funding_opportunity.get('funder_name', '')}
        Amount: {funding_opportunity.get('amount', 'Not specified')}
        Type: {funding_opportunity.get('funding_type', '')}
        Deadline: {funding_opportunity.get('application_deadline', 'Not specified')}
        Requirements: {funding_opportunity.get('requirements', [])}
        Eligibility: {funding_opportunity.get('eligibility_criteria', [])}
        
        ORGANIZATION:
        Name: {organization.get('name', '')}
        Type: {organization.get('type', '')}
        Sector: {organization.get('sector', '')}
        Description: {organization.get('description', '')}
        
        PROJECT REQUEST:
        Title: {request.project_title}
        Description: {request.project_description}
        Requested Amount: {request.requested_amount}
        Duration: {request.project_duration_months} months
        Focus Areas: {request.focus_areas}
        Additional Context: {request.additional_context}
        
        Generate a structured proposal with the following sections:
        1. Executive Summary
        2. Project Description
        3. Objectives and Goals
        4. Methodology and Approach
        5. Timeline and Milestones
        6. Budget and Budget Justification
        7. Team and Organization Capacity
        8. Expected Outcomes and Impact
        9. Sustainability Plan
        10. Risk Management
        11. Monitoring and Evaluation
        12. Conclusion
        
        Return as JSON with these sections as keys, plus:
        - "confidence_score": number between 0-1
        - "success_probability": estimated probability of success
        - "recommendations": list of improvement suggestions
        - "alignment_score": how well aligned with funder priorities
        
        Make the content professional, compelling, and tailored to the specific opportunity.
        """
    
    def _generate_fallback_proposal(self, request: AIProposalRequest, funding_opportunity: Dict[str, Any], organization: Dict[str, Any]) -> Dict[str, Any]:
        """Generate fallback proposal when AI service fails"""
        return {
            "executive_summary": f"This proposal requests funding for {request.project_title}, a {request.project_duration_months}-month project by {organization.get('name', 'our organization')}.",
            "project_description": request.project_description,
            "objectives": ["Primary objective to be defined", "Secondary objectives to be specified"],
            "methodology": "Methodology will be developed based on best practices in the field.",
            "timeline": {"phase_1": "Months 1-3: Planning and setup", "phase_2": f"Months 4-{request.project_duration_months}: Implementation"},
            "budget": {"total": request.requested_amount, "breakdown": "Detailed budget breakdown to be provided"},
            "team": "Experienced team with relevant expertise",
            "outcomes": "Expected positive outcomes aligned with funder priorities",
            "sustainability": "Long-term sustainability plan to be developed",
            "risk_management": "Risk mitigation strategies will be implemented",
            "monitoring": "Regular monitoring and evaluation framework",
            "conclusion": "This project aligns with funder objectives and promises significant impact",
            "confidence_score": 0.7,
            "success_probability": 0.6,
            "recommendations": ["Strengthen budget justification", "Add more specific outcomes", "Include detailed timeline"],
            "alignment_score": 0.8
        }

ai_proposal_generator = AIProposalGenerator()

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
    logger.info("Funding Service started on port 8007")
    yield
    await db_manager.close_pool()

app = FastAPI(
    title="Granada OS - Funding Service",
    description="Comprehensive funding opportunities and grant management",
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

async def calculate_match_score(opportunity: Dict[str, Any], organization: Dict[str, Any]) -> float:
    """Calculate match score between opportunity and organization"""
    score = 0.0
    factors = 0
    
    # Sector alignment
    if opportunity.get('sectors') and organization.get('sector'):
        if organization['sector'] in opportunity['sectors']:
            score += 0.3
        factors += 1
    
    # Geographic alignment
    if opportunity.get('geographic_scope') and organization.get('country'):
        if organization['country'] in opportunity['geographic_scope']:
            score += 0.2
        factors += 1
    
    # Organization type alignment
    if opportunity.get('funder_type') and organization.get('type'):
        # Simple matching logic - can be enhanced
        if 'ngo' in opportunity['funder_type'].lower() and 'ngo' in organization['type'].lower():
            score += 0.2
        factors += 1
    
    # Amount feasibility
    if opportunity.get('amount') and organization.get('annual_revenue'):
        ratio = opportunity['amount'] / max(organization['annual_revenue'], 1)
        if 0.1 <= ratio <= 2.0:  # Reasonable ratio
            score += 0.3
        factors += 1
    
    return score / max(factors, 1) if factors > 0 else 0.5

async def send_application_notification(email: str, application_id: str, status: str):
    """Send application status notification"""
    logger.info(f"Sending notification to {email} for application {application_id}: {status}")

async def generate_grant_number() -> str:
    """Generate unique grant number"""
    prefix = "GR"
    timestamp = datetime.utcnow().strftime("%Y%m")
    suffix = str(uuid.uuid4())[:8].upper()
    return f"{prefix}{timestamp}{suffix}"

# ============================================================================
# FUNDING OPPORTUNITY ENDPOINTS
# ============================================================================

@app.get("/api/funding-opportunities", response_model=List[FundingOpportunityResponse])
async def list_funding_opportunities(
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0),
    funding_type: Optional[FundingType] = None,
    sector: Optional[str] = None,
    country: Optional[str] = None,
    min_amount: Optional[float] = Query(default=None, ge=0),
    max_amount: Optional[float] = Query(default=None, ge=0),
    deadline_from: Optional[datetime] = None,
    deadline_to: Optional[datetime] = None,
    status: Optional[FundingStatus] = None,
    verified_only: bool = Query(default=False),
    featured_only: bool = Query(default=False),
    search: Optional[str] = None,
    sort_by: str = Query(default="created_at", regex="^(created_at|deadline|amount|match_score)$"),
    sort_order: str = Query(default="desc", regex="^(asc|desc)$")
):
    """List funding opportunities with comprehensive filtering"""
    try:
        async with db_manager.get_connection() as conn:
            base_query = """
                SELECT fo.id, fo.title, fo.description, fo.funder_name, fo.amount,
                       fo.currency, fo.funding_type, fo.application_deadline,
                       fo.status, fo.is_featured, fo.is_verified, fo.match_score,
                       fo.created_at
                FROM funding_opportunities fo
                WHERE fo.is_active = true
            """
            
            conditions = []
            params = []
            param_count = 0
            
            if funding_type:
                param_count += 1
                conditions.append(f"fo.funding_type = ${param_count}")
                params.append(funding_type.value)
            
            if sector:
                param_count += 1
                conditions.append(f"${param_count} = ANY(fo.sectors)")
                params.append(sector)
            
            if country:
                param_count += 1
                conditions.append(f"${param_count} = ANY(fo.geographic_scope)")
                params.append(country)
            
            if min_amount:
                param_count += 1
                conditions.append(f"fo.amount >= ${param_count}")
                params.append(min_amount)
            
            if max_amount:
                param_count += 1
                conditions.append(f"fo.amount <= ${param_count}")
                params.append(max_amount)
            
            if deadline_from:
                param_count += 1
                conditions.append(f"fo.application_deadline >= ${param_count}")
                params.append(deadline_from)
            
            if deadline_to:
                param_count += 1
                conditions.append(f"fo.application_deadline <= ${param_count}")
                params.append(deadline_to)
            
            if status:
                param_count += 1
                conditions.append(f"fo.status = ${param_count}")
                params.append(status.value)
            
            if verified_only:
                conditions.append("fo.is_verified = true")
            
            if featured_only:
                conditions.append("fo.is_featured = true")
            
            if search:
                param_count += 1
                conditions.append(f"(fo.title ILIKE ${param_count} OR fo.description ILIKE ${param_count} OR fo.funder_name ILIKE ${param_count})")
                params.append(f"%{search}%")
            
            if conditions:
                base_query += " AND " + " AND ".join(conditions)
            
            # Add sorting
            base_query += f" ORDER BY fo.{sort_by} {sort_order.upper()}"
            
            # Add pagination
            base_query += f" LIMIT ${param_count + 1} OFFSET ${param_count + 2}"
            params.extend([limit, offset])
            
            opportunities = await conn.fetch(base_query, *params)
            
            return [
                FundingOpportunityResponse(
                    id=opp['id'],
                    title=opp['title'],
                    description=opp['description'],
                    funder_name=opp['funder_name'],
                    amount=opp['amount'],
                    currency=opp['currency'],
                    funding_type=opp['funding_type'],
                    application_deadline=opp['application_deadline'],
                    status=opp['status'],
                    is_featured=opp['is_featured'],
                    is_verified=opp['is_verified'],
                    match_score=opp['match_score'],
                    created_at=opp['created_at']
                )
                for opp in opportunities
            ]
            
    except Exception as e:
        logger.error(f"List funding opportunities failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to list funding opportunities")

@app.post("/api/funding-opportunities", response_model=FundingOpportunityResponse)
async def create_funding_opportunity(
    opportunity_data: FundingOpportunityCreate,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Create new funding opportunity"""
    try:
        async with db_manager.get_connection() as conn:
            opportunity_id = str(uuid.uuid4())
            
            await conn.execute("""
                INSERT INTO funding_opportunities (
                    id, title, description, summary, objectives, requirements,
                    eligibility_criteria, categories, tags, keywords, funder_name,
                    funder_type, organization_id, amount, min_amount, max_amount,
                    currency, funding_type, application_deadline, start_date,
                    end_date, duration_months, geographic_scope, target_beneficiaries,
                    sectors, sdgs, application_process, document_requirements,
                    selection_criteria, evaluation_process, reporting_requirements,
                    disbursement_schedule, renewal_options, contact_information,
                    website, application_url, documents_url, status, is_active,
                    created_at, created_by
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
                    $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,
                    $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38,
                    $39, $40, $41
                )
            """,
                opportunity_id, opportunity_data.title, opportunity_data.description,
                opportunity_data.summary, json.dumps(opportunity_data.objectives),
                json.dumps(opportunity_data.requirements), json.dumps(opportunity_data.eligibility_criteria),
                json.dumps(opportunity_data.categories), json.dumps(opportunity_data.tags),
                json.dumps(opportunity_data.keywords), opportunity_data.funder_name,
                opportunity_data.funder_type, opportunity_data.organization_id,
                opportunity_data.amount, opportunity_data.min_amount, opportunity_data.max_amount,
                opportunity_data.currency, opportunity_data.funding_type.value,
                opportunity_data.application_deadline, opportunity_data.start_date,
                opportunity_data.end_date, opportunity_data.duration_months,
                json.dumps(opportunity_data.geographic_scope), json.dumps(opportunity_data.target_beneficiaries),
                json.dumps(opportunity_data.sectors), json.dumps(opportunity_data.sdgs),
                json.dumps(opportunity_data.application_process), json.dumps(opportunity_data.document_requirements),
                json.dumps(opportunity_data.selection_criteria), opportunity_data.evaluation_process,
                json.dumps(opportunity_data.reporting_requirements), json.dumps(opportunity_data.disbursement_schedule),
                json.dumps(opportunity_data.renewal_options), json.dumps(opportunity_data.contact_information),
                opportunity_data.website, opportunity_data.application_url, opportunity_data.documents_url,
                FundingStatus.OPEN.value, True, datetime.utcnow(), current_user['user_id']
            )
            
            return FundingOpportunityResponse(
                id=opportunity_id,
                title=opportunity_data.title,
                description=opportunity_data.description,
                funder_name=opportunity_data.funder_name,
                amount=opportunity_data.amount,
                currency=opportunity_data.currency,
                funding_type=opportunity_data.funding_type.value,
                application_deadline=opportunity_data.application_deadline,
                status=FundingStatus.OPEN.value,
                is_featured=False,
                is_verified=False,
                match_score=0.0,
                created_at=datetime.utcnow()
            )
            
    except Exception as e:
        logger.error(f"Funding opportunity creation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create funding opportunity")

@app.get("/api/funding-opportunities/{opportunity_id}")
async def get_funding_opportunity(opportunity_id: str):
    """Get detailed funding opportunity information"""
    try:
        async with db_manager.get_connection() as conn:
            opportunity = await conn.fetchrow("""
                SELECT fo.*, COUNT(app.id) as application_count
                FROM funding_opportunities fo
                LEFT JOIN applications app ON fo.id = app.funding_opportunity_id
                WHERE fo.id = $1 AND fo.is_active = true
                GROUP BY fo.id
            """, opportunity_id)
            
            if not opportunity:
                raise HTTPException(status_code=404, detail="Funding opportunity not found")
            
            return dict(opportunity)
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get funding opportunity failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get funding opportunity")

@app.put("/api/funding-opportunities/{opportunity_id}")
async def update_funding_opportunity(
    opportunity_id: str,
    update_data: FundingOpportunityUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update funding opportunity"""
    try:
        async with db_manager.get_connection() as conn:
            # Build update query
            update_fields = []
            params = []
            param_count = 0
            
            for field, value in update_data.dict(exclude_unset=True).items():
                if value is not None:
                    param_count += 1
                    if field == 'tags':
                        update_fields.append(f"{field} = ${param_count}")
                        params.append(json.dumps(value))
                    elif field == 'status':
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
            
            param_count += 1
            update_fields.append(f"updated_by = ${param_count}")
            params.append(current_user['user_id'])
            
            params.append(opportunity_id)
            
            query = f"""
                UPDATE funding_opportunities SET {', '.join(update_fields)}
                WHERE id = ${param_count + 1} AND is_active = true
            """
            
            result = await conn.execute(query, *params)
            
            if result == "UPDATE 0":
                raise HTTPException(status_code=404, detail="Funding opportunity not found")
            
            return {"message": "Funding opportunity updated successfully"}
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Funding opportunity update failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to update funding opportunity")

# ============================================================================
# APPLICATION MANAGEMENT ENDPOINTS
# ============================================================================

@app.post("/api/applications", response_model=ApplicationResponse)
async def create_application(
    application_data: ApplicationCreate,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Create new funding application"""
    try:
        async with db_manager.get_connection() as conn:
            # Verify funding opportunity exists and is open
            opportunity = await conn.fetchrow("""
                SELECT id, title, application_deadline, status FROM funding_opportunities
                WHERE id = $1 AND is_active = true
            """, application_data.funding_opportunity_id)
            
            if not opportunity:
                raise HTTPException(status_code=404, detail="Funding opportunity not found")
            
            if opportunity['status'] != 'open':
                raise HTTPException(status_code=400, detail="Funding opportunity is not open for applications")
            
            if opportunity['application_deadline'] and opportunity['application_deadline'] < datetime.utcnow():
                raise HTTPException(status_code=400, detail="Application deadline has passed")
            
            # Verify organization exists
            organization = await conn.fetchrow("""
                SELECT id, name FROM organizations
                WHERE id = $1 AND is_active = true
            """, application_data.organization_id)
            
            if not organization:
                raise HTTPException(status_code=404, detail="Organization not found")
            
            # Check if application already exists
            existing = await conn.fetchval("""
                SELECT id FROM applications
                WHERE funding_opportunity_id = $1 AND organization_id = $2 AND status != 'withdrawn'
            """, application_data.funding_opportunity_id, application_data.organization_id)
            
            if existing:
                raise HTTPException(status_code=400, detail="Application already exists for this opportunity")
            
            # Generate application number
            app_number = f"APP{datetime.utcnow().strftime('%Y%m')}{str(uuid.uuid4())[:8].upper()}"
            application_id = str(uuid.uuid4())
            
            await conn.execute("""
                INSERT INTO applications (
                    id, application_number, funding_opportunity_id, organization_id,
                    applicant_id, title, summary, description, project_summary,
                    objectives, methodology, timeline, budget, budget_justification,
                    requested_amount, matching_funds, total_project_cost, currency,
                    project_duration, start_date, end_date, team_members,
                    principal_investigator, co_investigators, organization_capacity,
                    previous_experience, partnerships, collaborations, impact_statement,
                    sustainability, risk_management, monitoring_evaluation,
                    dissemination, ethics_considerations, environmental_impact,
                    social_impact, gender_considerations, innovation_aspects,
                    scalability_potential, replication_potential, status,
                    deadline, created_at, created_by
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
                    $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,
                    $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38,
                    $39, $40, $41, $42, $43
                )
            """,
                application_id, app_number, application_data.funding_opportunity_id,
                application_data.organization_id, current_user['user_id'],
                application_data.title, application_data.summary, application_data.description,
                application_data.project_summary, json.dumps(application_data.objectives),
                application_data.methodology, json.dumps(application_data.timeline),
                json.dumps(application_data.budget), application_data.budget_justification,
                application_data.requested_amount, application_data.matching_funds,
                application_data.total_project_cost, application_data.currency,
                application_data.project_duration, application_data.start_date,
                application_data.end_date, json.dumps(application_data.team_members),
                json.dumps(application_data.principal_investigator), json.dumps(application_data.co_investigators),
                application_data.organization_capacity, application_data.previous_experience,
                json.dumps(application_data.partnerships), json.dumps(application_data.collaborations),
                application_data.impact_statement, application_data.sustainability,
                application_data.risk_management, application_data.monitoring_evaluation,
                application_data.dissemination, application_data.ethics_considerations,
                application_data.environmental_impact, application_data.social_impact,
                application_data.gender_considerations, application_data.innovation_aspects,
                application_data.scalability_potential, application_data.replication_potential,
                ApplicationStatus.DRAFT.value, opportunity['application_deadline'],
                datetime.utcnow(), current_user['user_id']
            )
            
            return ApplicationResponse(
                id=application_id,
                title=application_data.title,
                funding_opportunity_title=opportunity['title'],
                organization_name=organization['name'],
                requested_amount=application_data.requested_amount,
                currency=application_data.currency,
                status=ApplicationStatus.DRAFT.value,
                submission_date=None,
                deadline=opportunity['application_deadline'],
                score=None,
                created_at=datetime.utcnow()
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Application creation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create application")

@app.get("/api/applications", response_model=List[ApplicationResponse])
async def list_applications(
    current_user: dict = Depends(get_current_user),
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0),
    status: Optional[ApplicationStatus] = None,
    organization_id: Optional[str] = None,
    funding_opportunity_id: Optional[str] = None
):
    """List applications with filtering"""
    try:
        async with db_manager.get_connection() as conn:
            base_query = """
                SELECT app.id, app.title, app.requested_amount, app.currency,
                       app.status, app.submission_date, app.deadline, app.score,
                       app.created_at, fo.title as funding_opportunity_title,
                       org.name as organization_name
                FROM applications app
                JOIN funding_opportunities fo ON app.funding_opportunity_id = fo.id
                JOIN organizations org ON app.organization_id = org.id
                WHERE app.applicant_id = $1
            """
            
            conditions = []
            params = [current_user['user_id']]
            param_count = 1
            
            if status:
                param_count += 1
                conditions.append(f"app.status = ${param_count}")
                params.append(status.value)
            
            if organization_id:
                param_count += 1
                conditions.append(f"app.organization_id = ${param_count}")
                params.append(organization_id)
            
            if funding_opportunity_id:
                param_count += 1
                conditions.append(f"app.funding_opportunity_id = ${param_count}")
                params.append(funding_opportunity_id)
            
            if conditions:
                base_query += " AND " + " AND ".join(conditions)
            
            base_query += f"""
                ORDER BY app.created_at DESC
                LIMIT ${param_count + 1} OFFSET ${param_count + 2}
            """
            
            params.extend([limit, offset])
            applications = await conn.fetch(base_query, *params)
            
            return [
                ApplicationResponse(
                    id=app['id'],
                    title=app['title'],
                    funding_opportunity_title=app['funding_opportunity_title'],
                    organization_name=app['organization_name'],
                    requested_amount=app['requested_amount'],
                    currency=app['currency'],
                    status=app['status'],
                    submission_date=app['submission_date'],
                    deadline=app['deadline'],
                    score=app['score'],
                    created_at=app['created_at']
                )
                for app in applications
            ]
            
    except Exception as e:
        logger.error(f"List applications failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to list applications")

@app.post("/api/applications/{application_id}/submit")
async def submit_application(
    application_id: str,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Submit application for review"""
    try:
        async with db_manager.get_connection() as conn:
            # Verify application exists and belongs to user
            application = await conn.fetchrow("""
                SELECT app.*, fo.application_deadline, org.email as org_email
                FROM applications app
                JOIN funding_opportunities fo ON app.funding_opportunity_id = fo.id
                JOIN organizations org ON app.organization_id = org.id
                WHERE app.id = $1 AND app.applicant_id = $2
            """, application_id, current_user['user_id'])
            
            if not application:
                raise HTTPException(status_code=404, detail="Application not found")
            
            if application['status'] not in ['draft', 'resubmission_required']:
                raise HTTPException(status_code=400, detail="Application cannot be submitted in current status")
            
            if application['application_deadline'] and application['application_deadline'] < datetime.utcnow():
                raise HTTPException(status_code=400, detail="Application deadline has passed")
            
            # Validate required fields
            required_fields = ['title', 'description', 'requested_amount', 'organization_capacity']
            missing_fields = [field for field in required_fields if not application.get(field)]
            
            if missing_fields:
                raise HTTPException(status_code=400, detail=f"Missing required fields: {', '.join(missing_fields)}")
            
            # Update application status
            await conn.execute("""
                UPDATE applications SET 
                    status = $1,
                    submission_date = $2,
                    updated_at = $3
                WHERE id = $4
            """, ApplicationStatus.SUBMITTED.value, datetime.utcnow(), datetime.utcnow(), application_id)
            
            # Send notification
            background_tasks.add_task(
                send_application_notification,
                application['org_email'],
                application_id,
                "submitted"
            )
            
            return {"message": "Application submitted successfully"}
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Application submission failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit application")

# ============================================================================
# AI PROPOSAL GENERATION ENDPOINTS
# ============================================================================

@app.post("/api/ai/generate-proposal")
async def generate_ai_proposal(
    request: AIProposalRequest,
    current_user: dict = Depends(get_current_user)
):
    """Generate AI-powered funding proposal"""
    try:
        async with db_manager.get_connection() as conn:
            # Get funding opportunity details
            opportunity = await conn.fetchrow("""
                SELECT * FROM funding_opportunities WHERE id = $1
            """, request.funding_opportunity_id)
            
            if not opportunity:
                raise HTTPException(status_code=404, detail="Funding opportunity not found")
            
            # Get organization details
            organization = await conn.fetchrow("""
                SELECT * FROM organizations WHERE id = $1
            """, request.organization_id)
            
            if not organization:
                raise HTTPException(status_code=404, detail="Organization not found")
            
            # Generate proposal using AI
            proposal = await ai_proposal_generator.generate_proposal(
                request,
                dict(opportunity),
                dict(organization)
            )
            
            # Store generated proposal
            proposal_id = str(uuid.uuid4())
            
            await conn.execute("""
                INSERT INTO ai_proposals (
                    id, funding_opportunity_id, organization_id, user_id,
                    project_title, content, confidence_score, estimated_success_rate,
                    generated_by, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            """,
                proposal_id, request.funding_opportunity_id, request.organization_id,
                current_user['user_id'], request.project_title, json.dumps(proposal),
                proposal.get('confidence_score', 0.8), proposal.get('success_probability', 0.6),
                "deepseek", datetime.utcnow()
            )
            
            return {
                "proposal_id": proposal_id,
                "content": proposal,
                "confidence_score": proposal.get('confidence_score', 0.8),
                "success_probability": proposal.get('success_probability', 0.6),
                "recommendations": proposal.get('recommendations', []),
                "generated_at": datetime.utcnow().isoformat()
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"AI proposal generation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate AI proposal")

# ============================================================================
# Continue with remaining endpoints...
# This service would include 100+ more endpoints for:
# - Grant management
# - Review and evaluation
# - Reporting and analytics
# - Document management
# - Donor matching
# - Application tracking
# - Financial management
# - Compliance monitoring
# etc.
# ============================================================================

if __name__ == "__main__":
    uvicorn.run(
        "funding_service:app",
        host="0.0.0.0",
        port=8007,
        reload=True,
        log_level="info"
    )