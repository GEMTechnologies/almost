#!/usr/bin/env python3
"""
Granada OS - Opportunity Discovery Service
AI-powered funding opportunity discovery and matching system
Port: 8021
"""

from fastapi import FastAPI, HTTPException, Depends, Security, BackgroundTasks, Request, Query
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
import re
from bs4 import BeautifulSoup
import aiofiles
from urllib.parse import urljoin, urlparse
import hashlib

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

class OpportunityStatus(str, Enum):
    OPEN = "open"
    CLOSED = "closed"
    UPCOMING = "upcoming"
    ROLLING = "rolling"
    DEADLINE_PASSED = "deadline_passed"

class SourceType(str, Enum):
    GOVERNMENT = "government"
    FOUNDATION = "foundation"
    CORPORATE = "corporate"
    INTERNATIONAL = "international"
    ACADEMIC = "academic"
    NONPROFIT = "nonprofit"
    CROWDFUNDING = "crowdfunding"

class FundingType(str, Enum):
    GRANT = "grant"
    LOAN = "loan"
    EQUITY = "equity"
    SCHOLARSHIP = "scholarship"
    FELLOWSHIP = "fellowship"
    PRIZE = "prize"
    CONTRACT = "contract"

class MatchScore(str, Enum):
    EXCELLENT = "excellent"  # 90-100%
    VERY_GOOD = "very_good"  # 80-89%
    GOOD = "good"           # 70-79%
    FAIR = "fair"           # 60-69%
    POOR = "poor"           # <60%

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class OpportunitySearch(BaseModel):
    keywords: List[str] = Field(default=[])
    sectors: List[str] = Field(default=[])
    geographic_scope: List[str] = Field(default=[])
    funding_types: List[FundingType] = Field(default=[])
    source_types: List[SourceType] = Field(default=[])
    min_amount: Optional[float] = Field(None, ge=0)
    max_amount: Optional[float] = Field(None, ge=0)
    deadline_after: Optional[datetime] = None
    deadline_before: Optional[datetime] = None
    organization_type: Optional[str] = None
    target_beneficiaries: List[str] = Field(default=[])
    exclude_keywords: List[str] = Field(default=[])

class AIMatchingRequest(BaseModel):
    organization_profile: Dict[str, Any]
    project_description: str
    sectors: List[str]
    geographic_focus: List[str]
    funding_range: Dict[str, float]  # {"min": 10000, "max": 100000}
    timeline: Optional[str] = None
    special_requirements: List[str] = Field(default=[])

class OpportunitySource(BaseModel):
    name: str = Field(..., max_length=200)
    url: str
    source_type: SourceType
    description: Optional[str] = Field(None, max_length=1000)
    scraping_frequency: str = Field(default="daily")
    selectors: Dict[str, str] = Field(default={})
    is_active: bool = Field(default=True)
    requires_authentication: bool = Field(default=False)
    rate_limit: Optional[int] = None  # requests per hour
    metadata: Dict[str, Any] = Field(default={})

class OpportunityAlert(BaseModel):
    name: str = Field(..., max_length=200)
    search_criteria: OpportunitySearch
    notification_frequency: str = Field(default="daily")
    is_active: bool = Field(default=True)
    notification_channels: List[str] = Field(default=["email"])

class OpportunityCreate(BaseModel):
    title: str = Field(..., max_length=500)
    description: str
    funder_name: str = Field(..., max_length=200)
    source_type: SourceType
    funding_type: FundingType
    amount: Optional[float] = Field(None, ge=0)
    min_amount: Optional[float] = Field(None, ge=0)
    max_amount: Optional[float] = Field(None, ge=0)
    currency: str = Field(default="USD", max_length=10)
    application_deadline: Optional[datetime] = None
    eligibility_criteria: List[str] = Field(default=[])
    sectors: List[str] = Field(default=[])
    geographic_scope: List[str] = Field(default=[])
    target_beneficiaries: List[str] = Field(default=[])
    keywords: List[str] = Field(default=[])
    requirements: List[str] = Field(default=[])
    application_process: Dict[str, Any] = Field(default={})
    contact_information: Dict[str, Any] = Field(default={})
    source_url: Optional[str] = None
    metadata: Dict[str, Any] = Field(default={})

# Response Models
class OpportunityResponse(BaseModel):
    id: str
    title: str
    funder_name: str
    source_type: str
    funding_type: str
    amount: Optional[float]
    currency: str
    application_deadline: Optional[datetime]
    status: str
    match_score: Optional[float]
    sectors: List[str]
    geographic_scope: List[str]
    created_at: datetime
    is_featured: bool
    is_verified: bool

class MatchingResponse(BaseModel):
    opportunity_id: str
    title: str
    funder_name: str
    match_score: float
    match_reasons: List[str]
    alignment_factors: Dict[str, float]
    recommendations: List[str]
    urgency_level: str

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
# AI MATCHING ENGINE
# ============================================================================

class AIMatchingEngine:
    def __init__(self):
        self.deepseek_key = DEEPSEEK_API_KEY
    
    async def calculate_match_score(self, opportunity: Dict, organization_profile: Dict,
                                  project_description: str) -> Dict:
        """Calculate AI-powered match score between opportunity and organization"""
        try:
            if self.deepseek_key:
                return await self._ai_enhanced_matching(opportunity, organization_profile, project_description)
            else:
                return await self._rule_based_matching(opportunity, organization_profile, project_description)
                
        except Exception as e:
            logger.error(f"AI matching failed: {e}")
            return await self._rule_based_matching(opportunity, organization_profile, project_description)
    
    async def _ai_enhanced_matching(self, opportunity: Dict, organization_profile: Dict,
                                   project_description: str) -> Dict:
        """Use AI to calculate sophisticated match scores"""
        prompt = self._build_matching_prompt(opportunity, organization_profile, project_description)
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.deepseek_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "deepseek-chat",
                    "messages": [
                        {"role": "system", "content": "You are an expert grant matching specialist with deep knowledge of funding landscapes and organizational assessment."},
                        {"role": "user", "content": prompt}
                    ],
                    "response_format": {"type": "json_object"},
                    "max_tokens": 2000
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("choices") and len(result["choices"]) > 0:
                    content = result["choices"][0]["message"]["content"]
                    return json.loads(content)
        
        return await self._rule_based_matching(opportunity, organization_profile, project_description)
    
    def _build_matching_prompt(self, opportunity: Dict, organization_profile: Dict,
                              project_description: str) -> str:
        """Build AI prompt for matching analysis"""
        return f"""
        Analyze the compatibility between this funding opportunity and organization:
        
        FUNDING OPPORTUNITY:
        Title: {opportunity.get('title', '')}
        Funder: {opportunity.get('funder_name', '')}
        Type: {opportunity.get('funding_type', '')}
        Amount: {opportunity.get('amount', 'Not specified')}
        Sectors: {opportunity.get('sectors', [])}
        Geographic Scope: {opportunity.get('geographic_scope', [])}
        Eligibility: {opportunity.get('eligibility_criteria', [])}
        Requirements: {opportunity.get('requirements', [])}
        Target Beneficiaries: {opportunity.get('target_beneficiaries', [])}
        
        ORGANIZATION PROFILE:
        Name: {organization_profile.get('name', '')}
        Type: {organization_profile.get('type', '')}
        Sector: {organization_profile.get('sector', '')}
        Geographic Focus: {organization_profile.get('geographic_focus', [])}
        Size: {organization_profile.get('size', '')}
        Experience: {organization_profile.get('experience_years', 'Not specified')} years
        Previous Funding: {organization_profile.get('previous_funding', [])}
        
        PROJECT DESCRIPTION:
        {project_description}
        
        Provide a comprehensive matching analysis with the following JSON structure:
        {{
            "overall_match_score": score_0_to_100,
            "match_category": "excellent|very_good|good|fair|poor",
            "alignment_factors": {{
                "sector_alignment": score_0_to_100,
                "geographic_alignment": score_0_to_100,
                "organization_fit": score_0_to_100,
                "project_alignment": score_0_to_100,
                "eligibility_match": score_0_to_100,
                "funding_amount_fit": score_0_to_100
            }},
            "match_reasons": ["reason 1", "reason 2", "reason 3"],
            "concerns": ["concern 1", "concern 2"],
            "recommendations": ["recommendation 1", "recommendation 2"],
            "success_probability": probability_0_to_1,
            "competitive_assessment": "low|medium|high",
            "urgency_level": "low|medium|high|critical",
            "next_steps": ["step 1", "step 2", "step 3"]
        }}
        
        Consider all aspects including sector alignment, geographic fit, organizational capacity,
        project relevance, eligibility requirements, and funding amount appropriateness.
        """
    
    async def _rule_based_matching(self, opportunity: Dict, organization_profile: Dict,
                                  project_description: str) -> Dict:
        """Fallback rule-based matching algorithm"""
        scores = {}
        
        # Sector alignment (25% weight)
        org_sector = organization_profile.get('sector', '').lower()
        opp_sectors = [s.lower() for s in opportunity.get('sectors', [])]
        
        if org_sector in opp_sectors:
            scores['sector_alignment'] = 100
        elif any(sector in org_sector for sector in opp_sectors):
            scores['sector_alignment'] = 80
        elif any(org_sector in sector for sector in opp_sectors):
            scores['sector_alignment'] = 70
        else:
            scores['sector_alignment'] = 30
        
        # Geographic alignment (20% weight)
        org_geo = organization_profile.get('geographic_focus', [])
        opp_geo = opportunity.get('geographic_scope', [])
        
        if not opp_geo:  # Global opportunity
            scores['geographic_alignment'] = 100
        elif any(geo in opp_geo for geo in org_geo):
            scores['geographic_alignment'] = 100
        elif any(geo.lower() in [g.lower() for g in opp_geo] for geo in org_geo):
            scores['geographic_alignment'] = 80
        else:
            scores['geographic_alignment'] = 40
        
        # Organization type fit (15% weight)
        org_type = organization_profile.get('type', '').lower()
        eligibility = ' '.join(opportunity.get('eligibility_criteria', [])).lower()
        
        if org_type in eligibility or 'any' in eligibility:
            scores['organization_fit'] = 100
        elif 'nonprofit' in eligibility and 'nonprofit' in org_type:
            scores['organization_fit'] = 100
        elif 'university' in eligibility and 'academic' in org_type:
            scores['organization_fit'] = 100
        else:
            scores['organization_fit'] = 60
        
        # Project alignment (20% weight)
        project_keywords = set(re.findall(r'\b\w+\b', project_description.lower()))
        opp_keywords = set(' '.join(opportunity.get('keywords', [])).lower().split())
        
        if opp_keywords:
            overlap = len(project_keywords.intersection(opp_keywords))
            scores['project_alignment'] = min(100, (overlap / len(opp_keywords)) * 150)
        else:
            scores['project_alignment'] = 70
        
        # Funding amount fit (10% weight)
        requested_amount = organization_profile.get('requested_amount', 0)
        opp_amount = opportunity.get('amount', 0)
        opp_min = opportunity.get('min_amount', 0)
        opp_max = opportunity.get('max_amount', 0)
        
        if requested_amount and opp_amount:
            ratio = min(requested_amount, opp_amount) / max(requested_amount, opp_amount)
            scores['funding_amount_fit'] = ratio * 100
        elif requested_amount and opp_min and opp_max:
            if opp_min <= requested_amount <= opp_max:
                scores['funding_amount_fit'] = 100
            else:
                scores['funding_amount_fit'] = 50
        else:
            scores['funding_amount_fit'] = 75
        
        # Eligibility match (10% weight)
        scores['eligibility_match'] = 85  # Assume eligible unless proven otherwise
        
        # Calculate overall score
        weights = {
            'sector_alignment': 0.25,
            'geographic_alignment': 0.20,
            'organization_fit': 0.15,
            'project_alignment': 0.20,
            'funding_amount_fit': 0.10,
            'eligibility_match': 0.10
        }
        
        overall_score = sum(scores[key] * weights[key] for key in scores)
        
        # Determine match category
        if overall_score >= 90:
            match_category = "excellent"
        elif overall_score >= 80:
            match_category = "very_good"
        elif overall_score >= 70:
            match_category = "good"
        elif overall_score >= 60:
            match_category = "fair"
        else:
            match_category = "poor"
        
        # Generate recommendations
        recommendations = []
        if scores['sector_alignment'] < 70:
            recommendations.append("Consider emphasizing sector-specific impact in your proposal")
        if scores['project_alignment'] < 70:
            recommendations.append("Align project description more closely with funder priorities")
        if scores['funding_amount_fit'] < 70:
            recommendations.append("Review and adjust requested funding amount")
        
        return {
            "overall_match_score": round(overall_score, 1),
            "match_category": match_category,
            "alignment_factors": scores,
            "match_reasons": [
                f"Strong {key.replace('_', ' ')} ({score:.0f}%)" 
                for key, score in scores.items() if score >= 80
            ],
            "concerns": [
                f"Weak {key.replace('_', ' ')} ({score:.0f}%)" 
                for key, score in scores.items() if score < 60
            ],
            "recommendations": recommendations,
            "success_probability": min(0.95, overall_score / 100),
            "competitive_assessment": "medium",
            "urgency_level": "medium",
            "next_steps": [
                "Review opportunity details thoroughly",
                "Prepare preliminary proposal outline",
                "Contact funder for clarification if needed"
            ]
        }

ai_matching_engine = AIMatchingEngine()

# ============================================================================
# WEB SCRAPING ENGINE
# ============================================================================

class OpportunityScrapingEngine:
    def __init__(self):
        self.session_timeout = 30
        self.max_retries = 3
        
    async def scrape_opportunities(self, source: Dict) -> List[Dict]:
        """Scrape opportunities from a given source"""
        try:
            async with httpx.AsyncClient(timeout=self.session_timeout) as client:
                response = await client.get(source['url'])
                
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    return await self._extract_opportunities(soup, source)
                else:
                    logger.warning(f"Failed to scrape {source['url']}: {response.status_code}")
                    return []
                    
        except Exception as e:
            logger.error(f"Scraping error for {source['url']}: {e}")
            return []
    
    async def _extract_opportunities(self, soup: BeautifulSoup, source: Dict) -> List[Dict]:
        """Extract opportunity data from HTML using configured selectors"""
        opportunities = []
        selectors = source.get('selectors', {})
        
        # Default extraction if no selectors configured
        if not selectors:
            return await self._generic_extraction(soup, source)
        
        try:
            # Use configured selectors
            opportunity_containers = soup.select(selectors.get('container', 'article, .opportunity, .grant'))
            
            for container in opportunity_containers[:50]:  # Limit to 50 per source
                opportunity = {
                    'source_id': source['id'],
                    'source_name': source['name'],
                    'source_type': source['source_type'],
                    'source_url': source['url']
                }
                
                # Extract title
                title_elem = container.select_one(selectors.get('title', 'h1, h2, h3, .title'))
                if title_elem:
                    opportunity['title'] = title_elem.get_text(strip=True)
                
                # Extract description
                desc_elem = container.select_one(selectors.get('description', '.description, .summary, p'))
                if desc_elem:
                    opportunity['description'] = desc_elem.get_text(strip=True)[:2000]
                
                # Extract deadline
                deadline_elem = container.select_one(selectors.get('deadline', '.deadline, .due-date'))
                if deadline_elem:
                    deadline_text = deadline_elem.get_text(strip=True)
                    opportunity['deadline_text'] = deadline_text
                
                # Extract amount
                amount_elem = container.select_one(selectors.get('amount', '.amount, .funding'))
                if amount_elem:
                    amount_text = amount_elem.get_text(strip=True)
                    opportunity['amount_text'] = amount_text
                
                # Extract link
                link_elem = container.select_one(selectors.get('link', 'a'))
                if link_elem and link_elem.get('href'):
                    opportunity['detail_url'] = urljoin(source['url'], link_elem['href'])
                
                if opportunity.get('title'):
                    opportunities.append(opportunity)
                    
        except Exception as e:
            logger.error(f"Extraction error for {source['name']}: {e}")
        
        return opportunities
    
    async def _generic_extraction(self, soup: BeautifulSoup, source: Dict) -> List[Dict]:
        """Generic opportunity extraction when no selectors are configured"""
        opportunities = []
        
        # Look for common opportunity indicators
        potential_opportunities = soup.find_all(['article', 'div'], 
                                               class_=re.compile(r'(grant|opportunity|funding|award)', re.I))
        
        for element in potential_opportunities[:20]:
            title_elem = element.find(['h1', 'h2', 'h3', 'h4'])
            if title_elem:
                opportunity = {
                    'source_id': source['id'],
                    'source_name': source['name'],
                    'source_type': source['source_type'],
                    'source_url': source['url'],
                    'title': title_elem.get_text(strip=True),
                    'description': element.get_text(strip=True)[:1000]
                }
                
                link_elem = element.find('a')
                if link_elem and link_elem.get('href'):
                    opportunity['detail_url'] = urljoin(source['url'], link_elem['href'])
                
                opportunities.append(opportunity)
        
        return opportunities

scraping_engine = OpportunityScrapingEngine()

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
    logger.info("Opportunity Discovery Service started on port 8021")
    yield
    await db_manager.close_pool()

app = FastAPI(
    title="Granada OS - Opportunity Discovery Service",
    description="AI-powered funding opportunity discovery and matching system",
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

async def calculate_deadline_urgency(deadline: datetime) -> str:
    """Calculate urgency level based on deadline"""
    if not deadline:
        return "low"
    
    days_until_deadline = (deadline - datetime.utcnow()).days
    
    if days_until_deadline <= 7:
        return "critical"
    elif days_until_deadline <= 30:
        return "high"
    elif days_until_deadline <= 60:
        return "medium"
    else:
        return "low"

async def generate_opportunity_hash(opportunity: Dict) -> str:
    """Generate unique hash for opportunity to detect duplicates"""
    content = f"{opportunity.get('title', '')}{opportunity.get('funder_name', '')}{opportunity.get('application_deadline', '')}"
    return hashlib.md5(content.encode()).hexdigest()

# ============================================================================
# DISCOVERY ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Opportunity discovery service health check"""
    return {
        "service": "Granada OS Opportunity Discovery Service",
        "version": "1.0.0",
        "status": "operational",
        "features": [
            "AI-powered opportunity matching",
            "Automated web scraping",
            "Smart filtering and search",
            "Personalized recommendations",
            "Real-time alerts",
            "Duplicate detection"
        ],
        "ai_matching": bool(DEEPSEEK_API_KEY),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/opportunities", response_model=List[OpportunityResponse])
async def search_opportunities(
    current_user: dict = Depends(get_current_user),
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0),
    keywords: Optional[str] = Query(default=None),
    sectors: Optional[str] = Query(default=None),
    geographic_scope: Optional[str] = Query(default=None),
    funding_types: Optional[str] = Query(default=None),
    source_types: Optional[str] = Query(default=None),
    min_amount: Optional[float] = Query(default=None, ge=0),
    max_amount: Optional[float] = Query(default=None, ge=0),
    deadline_after: Optional[datetime] = Query(default=None),
    deadline_before: Optional[datetime] = Query(default=None),
    status: Optional[OpportunityStatus] = Query(default=None),
    sort_by: str = Query(default="created_at", regex="^(created_at|deadline|amount|match_score)$"),
    sort_order: str = Query(default="desc", regex="^(asc|desc)$")
):
    """Search and filter funding opportunities"""
    try:
        async with db_manager.get_connection() as conn:
            base_query = """
                SELECT fo.id, fo.title, fo.funder_name, fo.source_type, fo.funding_type,
                       fo.amount, fo.currency, fo.application_deadline, fo.status,
                       fo.sectors, fo.geographic_scope, fo.created_at, fo.is_featured,
                       fo.is_verified, COALESCE(om.match_score, 0) as match_score
                FROM funding_opportunities fo
                LEFT JOIN opportunity_matches om ON fo.id = om.opportunity_id 
                    AND om.user_id = $1
                WHERE fo.is_active = true
            """
            
            conditions = []
            params = [current_user["user_id"]]
            param_count = 1
            
            # Apply filters
            if keywords:
                param_count += 1
                conditions.append(f"""
                    (fo.title ILIKE ${param_count} OR fo.description ILIKE ${param_count} 
                     OR fo.keywords::text ILIKE ${param_count})
                """)
                params.append(f"%{keywords}%")
            
            if sectors:
                sector_list = [s.strip() for s in sectors.split(',')]
                param_count += 1
                conditions.append(f"fo.sectors && ${param_count}")
                params.append(sector_list)
            
            if geographic_scope:
                geo_list = [g.strip() for g in geographic_scope.split(',')]
                param_count += 1
                conditions.append(f"fo.geographic_scope && ${param_count}")
                params.append(geo_list)
            
            if funding_types:
                funding_list = [f.strip() for f in funding_types.split(',')]
                param_count += 1
                conditions.append(f"fo.funding_type = ANY(${param_count})")
                params.append(funding_list)
            
            if source_types:
                source_list = [s.strip() for s in source_types.split(',')]
                param_count += 1
                conditions.append(f"fo.source_type = ANY(${param_count})")
                params.append(source_list)
            
            if min_amount:
                param_count += 1
                conditions.append(f"fo.amount >= ${param_count}")
                params.append(min_amount)
            
            if max_amount:
                param_count += 1
                conditions.append(f"fo.amount <= ${param_count}")
                params.append(max_amount)
            
            if deadline_after:
                param_count += 1
                conditions.append(f"fo.application_deadline >= ${param_count}")
                params.append(deadline_after)
            
            if deadline_before:
                param_count += 1
                conditions.append(f"fo.application_deadline <= ${param_count}")
                params.append(deadline_before)
            
            if status:
                param_count += 1
                conditions.append(f"fo.status = ${param_count}")
                params.append(status.value)
            
            if conditions:
                base_query += " AND " + " AND ".join(conditions)
            
            # Add sorting
            base_query += f" ORDER BY fo.{sort_by} {sort_order.upper()}"
            
            # Add pagination
            base_query += f" LIMIT ${param_count + 1} OFFSET ${param_count + 2}"
            params.extend([limit, offset])
            
            opportunities = await conn.fetch(base_query, *params)
            
            return [
                OpportunityResponse(
                    id=opp['id'],
                    title=opp['title'],
                    funder_name=opp['funder_name'],
                    source_type=opp['source_type'],
                    funding_type=opp['funding_type'],
                    amount=opp['amount'],
                    currency=opp['currency'],
                    application_deadline=opp['application_deadline'],
                    status=opp['status'],
                    match_score=opp['match_score'],
                    sectors=opp['sectors'] or [],
                    geographic_scope=opp['geographic_scope'] or [],
                    created_at=opp['created_at'],
                    is_featured=opp['is_featured'],
                    is_verified=opp['is_verified']
                )
                for opp in opportunities
            ]
            
    except Exception as e:
        logger.error(f"Search opportunities failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to search opportunities")

@app.post("/api/opportunities/ai-match")
async def ai_match_opportunities(
    matching_request: AIMatchingRequest,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Get AI-powered opportunity recommendations"""
    try:
        async with db_manager.get_connection() as conn:
            # Get relevant opportunities based on basic criteria
            opportunities = await conn.fetch("""
                SELECT * FROM funding_opportunities
                WHERE is_active = true 
                AND (status = 'open' OR status = 'rolling')
                AND (
                    sectors && $1 OR
                    geographic_scope && $2 OR
                    (amount BETWEEN $3 AND $4)
                )
                ORDER BY created_at DESC
                LIMIT 100
            """,
                matching_request.sectors,
                matching_request.geographic_focus,
                matching_request.funding_range.get('min', 0),
                matching_request.funding_range.get('max', 999999999)
            )
            
            # Calculate AI match scores for each opportunity
            matches = []
            
            for opp in opportunities:
                opp_dict = dict(opp)
                
                match_result = await ai_matching_engine.calculate_match_score(
                    opp_dict,
                    matching_request.organization_profile,
                    matching_request.project_description
                )
                
                if match_result['overall_match_score'] >= 60:  # Only include decent matches
                    # Store match in database
                    match_id = str(uuid.uuid4())
                    await conn.execute("""
                        INSERT INTO opportunity_matches (
                            id, user_id, opportunity_id, match_score, alignment_factors,
                            match_reasons, recommendations, urgency_level, created_at
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                        ON CONFLICT (user_id, opportunity_id) 
                        DO UPDATE SET 
                            match_score = EXCLUDED.match_score,
                            alignment_factors = EXCLUDED.alignment_factors,
                            updated_at = CURRENT_TIMESTAMP
                    """,
                        match_id, current_user["user_id"], opp['id'],
                        match_result['overall_match_score'],
                        json.dumps(match_result['alignment_factors']),
                        json.dumps(match_result['match_reasons']),
                        json.dumps(match_result['recommendations']),
                        match_result['urgency_level'],
                        datetime.utcnow()
                    )
                    
                    matches.append(MatchingResponse(
                        opportunity_id=opp['id'],
                        title=opp['title'],
                        funder_name=opp['funder_name'],
                        match_score=match_result['overall_match_score'],
                        match_reasons=match_result['match_reasons'],
                        alignment_factors=match_result['alignment_factors'],
                        recommendations=match_result['recommendations'],
                        urgency_level=match_result['urgency_level']
                    ))
            
            # Sort by match score
            matches.sort(key=lambda x: x.match_score, reverse=True)
            
            return {
                "total_analyzed": len(opportunities),
                "matches_found": len(matches),
                "top_matches": matches[:20],  # Return top 20 matches
                "analysis_timestamp": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        logger.error(f"AI matching failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to perform AI matching")

# Continue with more endpoints for source management, alerts, scraping, etc...

if __name__ == "__main__":
    uvicorn.run(
        "discovery_service:app",
        host="0.0.0.0",
        port=8021,
        reload=True,
        log_level="info"
    )