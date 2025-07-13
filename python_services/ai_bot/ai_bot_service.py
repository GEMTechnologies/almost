#!/usr/bin/env python3
"""
Granada OS - AI Bot Service
Intelligent web scraping and data collection service
Port: 8001
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
import asyncio
import asyncpg
import aiohttp
import json
import os
import logging
from datetime import datetime, timedelta
import uuid
from bs4 import BeautifulSoup
import httpx
from urllib.parse import urljoin, urlparse
import re
from contextlib import asynccontextmanager
import uvicorn

# ============================================================================
# CONFIGURATION & SETUP
# ============================================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

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
# PYDANTIC MODELS
# ============================================================================

class ScrapingTarget(BaseModel):
    url: HttpUrl
    target_type: str = Field(..., description="Type of content to scrape")
    selectors: Dict[str, str] = Field(default={}, description="CSS selectors for data extraction")
    frequency: str = Field(default="daily", description="Scraping frequency")
    priority: int = Field(default=5, description="Priority level 1-10")
    metadata: Dict[str, Any] = Field(default={})

class ScrapingJob(BaseModel):
    id: str
    target_id: str
    status: str
    started_at: datetime
    completed_at: Optional[datetime]
    results_count: int
    errors: List[str]
    metadata: Dict[str, Any]

class ScrapedData(BaseModel):
    id: str
    source_url: str
    content_type: str
    title: str
    description: Optional[str]
    content: Dict[str, Any]
    extracted_at: datetime
    ai_analysis: Optional[Dict[str, Any]]

class AIAnalysisRequest(BaseModel):
    content: Dict[str, Any]
    analysis_type: str = Field(..., description="Type of AI analysis to perform")
    context: Optional[Dict[str, Any]] = Field(default={})

# ============================================================================
# FASTAPI APPLICATION SETUP
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db_manager.create_pool()
    logger.info("AI Bot Service started on port 8001")
    yield
    await db_manager.close_pool()

app = FastAPI(
    title="Granada OS - AI Bot Service",
    description="Intelligent web scraping and data collection service",
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
# WEB SCRAPING ENGINE
# ============================================================================

class IntelligentScraper:
    def __init__(self):
        self.session = None
        self.user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        ]
    
    async def get_session(self):
        if not self.session:
            timeout = aiohttp.ClientTimeout(total=30)
            self.session = aiohttp.ClientSession(
                timeout=timeout,
                headers={"User-Agent": self.user_agents[0]}
            )
        return self.session
    
    async def close_session(self):
        if self.session:
            await self.session.close()
    
    async def scrape_url(self, url: str, selectors: Dict[str, str] = None) -> Dict[str, Any]:
        """Scrape a single URL with intelligent content extraction"""
        try:
            session = await self.get_session()
            
            async with session.get(url) as response:
                if response.status != 200:
                    raise HTTPException(status_code=response.status, detail=f"Failed to fetch {url}")
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                # Extract basic metadata
                result = {
                    "url": url,
                    "title": self.extract_title(soup),
                    "description": self.extract_description(soup),
                    "content": {},
                    "metadata": {
                        "scraped_at": datetime.utcnow().isoformat(),
                        "status_code": response.status,
                        "content_length": len(html)
                    }
                }
                
                # Use provided selectors or intelligent extraction
                if selectors:
                    for key, selector in selectors.items():
                        elements = soup.select(selector)
                        result["content"][key] = [elem.get_text(strip=True) for elem in elements]
                else:
                    # Intelligent content extraction
                    result["content"] = await self.intelligent_extraction(soup)
                
                return result
                
        except Exception as e:
            logger.error(f"Scraping failed for {url}: {e}")
            raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")
    
    def extract_title(self, soup: BeautifulSoup) -> str:
        """Extract page title"""
        title_tag = soup.find('title')
        if title_tag:
            return title_tag.get_text(strip=True)
        
        h1_tag = soup.find('h1')
        if h1_tag:
            return h1_tag.get_text(strip=True)
        
        return "Untitled"
    
    def extract_description(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract page description"""
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc and meta_desc.get('content'):
            return meta_desc['content']
        
        og_desc = soup.find('meta', attrs={'property': 'og:description'})
        if og_desc and og_desc.get('content'):
            return og_desc['content']
        
        # Extract first paragraph
        first_p = soup.find('p')
        if first_p:
            text = first_p.get_text(strip=True)
            if len(text) > 50:
                return text[:200] + "..." if len(text) > 200 else text
        
        return None
    
    async def intelligent_extraction(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """AI-powered content extraction"""
        content = {}
        
        # Extract funding-related content
        funding_keywords = [
            'grant', 'funding', 'award', 'scholarship', 'fellowship',
            'opportunity', 'application', 'deadline', 'eligibility',
            'amount', 'budget', 'proposal', 'program'
        ]
        
        # Find funding opportunities
        opportunities = []
        for elem in soup.find_all(['div', 'section', 'article']):
            text = elem.get_text().lower()
            if any(keyword in text for keyword in funding_keywords):
                # Extract structured data
                opportunity = self.extract_opportunity_data(elem)
                if opportunity:
                    opportunities.append(opportunity)
        
        content['funding_opportunities'] = opportunities
        
        # Extract contact information
        content['contact_info'] = self.extract_contact_info(soup)
        
        # Extract important dates
        content['dates'] = self.extract_dates(soup)
        
        # Extract amounts and financial info
        content['financial_info'] = self.extract_financial_info(soup)
        
        return content
    
    def extract_opportunity_data(self, element) -> Optional[Dict[str, Any]]:
        """Extract structured funding opportunity data"""
        try:
            text = element.get_text()
            
            # Extract title
            title_elem = element.find(['h1', 'h2', 'h3', 'h4'])
            title = title_elem.get_text(strip=True) if title_elem else None
            
            # Extract amount using regex
            amount_match = re.search(r'\$[\d,]+(?:\.\d{2})?|\d+(?:,\d{3})*\s*(?:USD|EUR|GBP|dollars?)', text, re.IGNORECASE)
            amount = amount_match.group() if amount_match else None
            
            # Extract deadline
            deadline_match = re.search(r'deadline:?\s*([^.]+)', text, re.IGNORECASE)
            deadline = deadline_match.group(1).strip() if deadline_match else None
            
            if title or amount or deadline:
                return {
                    "title": title,
                    "amount": amount,
                    "deadline": deadline,
                    "description": text[:300] + "..." if len(text) > 300 else text
                }
                
        except Exception as e:
            logger.warning(f"Failed to extract opportunity data: {e}")
        
        return None
    
    def extract_contact_info(self, soup: BeautifulSoup) -> Dict[str, List[str]]:
        """Extract contact information"""
        contact_info = {
            "emails": [],
            "phones": [],
            "addresses": []
        }
        
        text = soup.get_text()
        
        # Extract emails
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        contact_info["emails"] = list(set(emails))
        
        # Extract phone numbers
        phone_pattern = r'\+?[\d\s\-\(\)]{10,}'
        phones = re.findall(phone_pattern, text)
        contact_info["phones"] = [phone.strip() for phone in phones if len(phone.strip()) >= 10]
        
        return contact_info
    
    def extract_dates(self, soup: BeautifulSoup) -> List[str]:
        """Extract important dates"""
        text = soup.get_text()
        
        # Date patterns
        date_patterns = [
            r'\d{1,2}[/-]\d{1,2}[/-]\d{4}',
            r'\d{4}[/-]\d{1,2}[/-]\d{1,2}',
            r'[A-Za-z]+ \d{1,2},?\s*\d{4}',
            r'\d{1,2}\s+[A-Za-z]+\s+\d{4}'
        ]
        
        dates = []
        for pattern in date_patterns:
            matches = re.findall(pattern, text)
            dates.extend(matches)
        
        return list(set(dates))
    
    def extract_financial_info(self, soup: BeautifulSoup) -> List[str]:
        """Extract financial amounts and budget information"""
        text = soup.get_text()
        
        # Financial patterns
        financial_patterns = [
            r'\$[\d,]+(?:\.\d{2})?',
            r'\d+(?:,\d{3})*\s*(?:USD|EUR|GBP|dollars?)',
            r'budget:?\s*\$?[\d,]+',
            r'award:?\s*\$?[\d,]+'
        ]
        
        financial_info = []
        for pattern in financial_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            financial_info.extend(matches)
        
        return list(set(financial_info))

scraper = IntelligentScraper()

# ============================================================================
# AI ANALYSIS ENGINE
# ============================================================================

async def analyze_content_with_ai(content: Dict[str, Any], analysis_type: str) -> Dict[str, Any]:
    """Analyze scraped content with AI"""
    try:
        if not DEEPSEEK_API_KEY:
            return {"analysis": "AI analysis unavailable - no API key", "confidence": 0.0}
        
        prompt = f"""
        Analyze the following scraped content for {analysis_type}:
        
        Content: {json.dumps(content, indent=2)}
        
        Please provide:
        1. Content categorization and classification
        2. Key information extraction
        3. Quality assessment
        4. Relevance scoring for funding opportunities
        5. Data completeness analysis
        6. Recommendations for data enhancement
        
        Return structured JSON analysis.
        """
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "deepseek-chat",
                    "messages": [
                        {"role": "system", "content": "You are an AI data analyst specializing in funding opportunities and web content analysis."},
                        {"role": "user", "content": prompt}
                    ],
                    "response_format": {"type": "json_object"}
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("choices") and len(result["choices"]) > 0:
                    content_str = result["choices"][0]["message"]["content"]
                    return json.loads(content_str)
        
        return {"analysis": "AI analysis failed", "confidence": 0.0}
        
    except Exception as e:
        logger.error(f"AI analysis failed: {e}")
        return {"analysis": f"Analysis error: {str(e)}", "confidence": 0.0}

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Health check"""
    return {
        "service": "Granada OS AI Bot Service",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/scrape/url")
async def scrape_single_url(
    url: HttpUrl,
    selectors: Optional[Dict[str, str]] = None,
    analyze: bool = True
):
    """Scrape a single URL with optional AI analysis"""
    try:
        # Scrape the URL
        scraped_data = await scraper.scrape_url(str(url), selectors)
        
        # Store raw data
        data_id = str(uuid.uuid4())
        
        async with db_manager.get_connection() as conn:
            await conn.execute("""
                INSERT INTO scraped_data (
                    id, source_url, content_type, title, description,
                    content, extracted_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            """,
                data_id, str(url), "webpage", scraped_data["title"],
                scraped_data["description"], json.dumps(scraped_data["content"]),
                datetime.utcnow()
            )
        
        # Perform AI analysis if requested
        ai_analysis = None
        if analyze:
            ai_analysis = await analyze_content_with_ai(scraped_data["content"], "funding_opportunity")
            
            # Update with AI analysis
            async with db_manager.get_connection() as conn:
                await conn.execute("""
                    UPDATE scraped_data SET ai_analysis = $1 WHERE id = $2
                """, json.dumps(ai_analysis), data_id)
        
        return {
            "id": data_id,
            "scraped_data": scraped_data,
            "ai_analysis": ai_analysis,
            "status": "success"
        }
        
    except Exception as e:
        logger.error(f"URL scraping failed: {e}")
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")

@app.post("/api/scrape/batch")
async def scrape_batch_urls(
    urls: List[HttpUrl],
    background_tasks: BackgroundTasks,
    selectors: Optional[Dict[str, str]] = None,
    analyze: bool = True
):
    """Scrape multiple URLs in batch"""
    try:
        job_id = str(uuid.uuid4())
        
        # Create scraping job record
        async with db_manager.get_connection() as conn:
            await conn.execute("""
                INSERT INTO scraping_jobs (
                    id, status, started_at, metadata
                ) VALUES ($1, $2, $3, $4)
            """,
                job_id, "running", datetime.utcnow(),
                json.dumps({"url_count": len(urls), "analyze": analyze})
            )
        
        # Process URLs in background
        background_tasks.add_task(
            process_batch_scraping, job_id, [str(url) for url in urls], selectors, analyze
        )
        
        return {
            "job_id": job_id,
            "status": "started",
            "url_count": len(urls),
            "message": "Batch scraping started in background"
        }
        
    except Exception as e:
        logger.error(f"Batch scraping failed: {e}")
        raise HTTPException(status_code=500, detail=f"Batch scraping failed: {str(e)}")

@app.get("/api/scrape/job/{job_id}")
async def get_scraping_job(job_id: str):
    """Get scraping job status and results"""
    try:
        async with db_manager.get_connection() as conn:
            job = await conn.fetchrow("""
                SELECT id, status, started_at, completed_at, results_count,
                       errors, metadata
                FROM scraping_jobs WHERE id = $1
            """, job_id)
            
            if not job:
                raise HTTPException(status_code=404, detail="Job not found")
            
            return ScrapingJob(
                id=job['id'],
                target_id="batch",
                status=job['status'],
                started_at=job['started_at'],
                completed_at=job['completed_at'],
                results_count=job['results_count'] or 0,
                errors=job['errors'] or [],
                metadata=job['metadata'] or {}
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get job failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get job status")

@app.get("/api/data/scraped")
async def get_scraped_data(
    limit: int = 50,
    offset: int = 0,
    content_type: Optional[str] = None,
    source_url: Optional[str] = None
):
    """Get scraped data with filtering"""
    try:
        async with db_manager.get_connection() as conn:
            query = """
                SELECT id, source_url, content_type, title, description,
                       content, ai_analysis, extracted_at
                FROM scraped_data
                WHERE 1=1
            """
            params = []
            param_count = 0
            
            if content_type:
                param_count += 1
                query += f" AND content_type = ${param_count}"
                params.append(content_type)
            
            if source_url:
                param_count += 1
                query += f" AND source_url LIKE ${param_count}"
                params.append(f"%{source_url}%")
            
            query += f" ORDER BY extracted_at DESC LIMIT ${param_count + 1} OFFSET ${param_count + 2}"
            params.extend([limit, offset])
            
            rows = await conn.fetch(query, *params)
            
            results = []
            for row in rows:
                results.append(ScrapedData(
                    id=row['id'],
                    source_url=row['source_url'],
                    content_type=row['content_type'],
                    title=row['title'],
                    description=row['description'],
                    content=row['content'] or {},
                    extracted_at=row['extracted_at'],
                    ai_analysis=row['ai_analysis']
                ))
            
            return results
            
    except Exception as e:
        logger.error(f"Get scraped data failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get scraped data")

@app.post("/api/ai/analyze")
async def analyze_content(request: AIAnalysisRequest):
    """Perform AI analysis on content"""
    try:
        analysis = await analyze_content_with_ai(request.content, request.analysis_type)
        
        return {
            "analysis": analysis,
            "analysis_type": request.analysis_type,
            "timestamp": datetime.utcnow().isoformat(),
            "status": "completed"
        }
        
    except Exception as e:
        logger.error(f"AI analysis failed: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed")

@app.post("/api/scrape/funding-sites")
async def scrape_funding_sites(background_tasks: BackgroundTasks):
    """Scrape known funding opportunity websites"""
    try:
        # List of known funding websites
        funding_sites = [
            "https://www.grants.gov/",
            "https://www.foundation-center.org/",
            "https://www.grantspace.org/",
            "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home",
            "https://www.usaid.gov/work-usaid/partnership-opportunities",
            # Add more funding sites as needed
        ]
        
        job_id = str(uuid.uuid4())
        
        # Create job record
        async with db_manager.get_connection() as conn:
            await conn.execute("""
                INSERT INTO scraping_jobs (
                    id, status, started_at, metadata
                ) VALUES ($1, $2, $3, $4)
            """,
                job_id, "running", datetime.utcnow(),
                json.dumps({"site_count": len(funding_sites), "type": "funding_sites"})
            )
        
        # Start scraping in background
        background_tasks.add_task(
            scrape_funding_opportunities, job_id, funding_sites
        )
        
        return {
            "job_id": job_id,
            "status": "started",
            "site_count": len(funding_sites),
            "message": "Funding sites scraping started"
        }
        
    except Exception as e:
        logger.error(f"Funding sites scraping failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to start funding sites scraping")

# ============================================================================
# BACKGROUND TASKS
# ============================================================================

async def process_batch_scraping(
    job_id: str, 
    urls: List[str], 
    selectors: Optional[Dict[str, str]], 
    analyze: bool
):
    """Process batch URL scraping"""
    results_count = 0
    errors = []
    
    try:
        for url in urls:
            try:
                # Scrape URL
                scraped_data = await scraper.scrape_url(url, selectors)
                
                # Store data
                data_id = str(uuid.uuid4())
                
                async with db_manager.get_connection() as conn:
                    await conn.execute("""
                        INSERT INTO scraped_data (
                            id, source_url, content_type, title, description,
                            content, extracted_at
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                    """,
                        data_id, url, "webpage", scraped_data["title"],
                        scraped_data["description"], json.dumps(scraped_data["content"]),
                        datetime.utcnow()
                    )
                
                # AI analysis if requested
                if analyze:
                    ai_analysis = await analyze_content_with_ai(
                        scraped_data["content"], "funding_opportunity"
                    )
                    
                    async with db_manager.get_connection() as conn:
                        await conn.execute("""
                            UPDATE scraped_data SET ai_analysis = $1 WHERE id = $2
                        """, json.dumps(ai_analysis), data_id)
                
                results_count += 1
                
                # Add delay to be respectful
                await asyncio.sleep(1)
                
            except Exception as e:
                error_msg = f"Failed to scrape {url}: {str(e)}"
                errors.append(error_msg)
                logger.error(error_msg)
        
        # Update job status
        async with db_manager.get_connection() as conn:
            await conn.execute("""
                UPDATE scraping_jobs 
                SET status = $1, completed_at = $2, results_count = $3, errors = $4
                WHERE id = $5
            """, "completed", datetime.utcnow(), results_count, json.dumps(errors), job_id)
        
    except Exception as e:
        logger.error(f"Batch scraping job {job_id} failed: {e}")
        
        # Mark job as failed
        async with db_manager.get_connection() as conn:
            await conn.execute("""
                UPDATE scraping_jobs 
                SET status = $1, completed_at = $2, errors = $3
                WHERE id = $4
            """, "failed", datetime.utcnow(), json.dumps([str(e)]), job_id)

async def scrape_funding_opportunities(job_id: str, sites: List[str]):
    """Scrape funding opportunities from known sites"""
    results_count = 0
    errors = []
    
    try:
        for site in sites:
            try:
                # Custom selectors for known funding sites
                funding_selectors = {
                    "opportunities": ".opportunity, .grant, .funding-item, .award",
                    "titles": "h1, h2, h3, .title, .opportunity-title",
                    "amounts": ".amount, .funding-amount, .award-amount",
                    "deadlines": ".deadline, .due-date, .application-deadline"
                }
                
                scraped_data = await scraper.scrape_url(site, funding_selectors)
                
                # Extract funding opportunities from content
                opportunities = scraped_data["content"].get("funding_opportunities", [])
                
                for opportunity in opportunities:
                    if opportunity and opportunity.get("title"):
                        # Store individual opportunity
                        opp_id = str(uuid.uuid4())
                        
                        async with db_manager.get_connection() as conn:
                            await conn.execute("""
                                INSERT INTO funding_opportunities (
                                    id, title, description, source, source_url,
                                    status, created_at, last_scraped
                                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                                ON CONFLICT (title, source_url) DO UPDATE SET
                                    description = EXCLUDED.description,
                                    last_scraped = EXCLUDED.last_scraped
                            """,
                                opp_id, opportunity["title"], opportunity.get("description", ""),
                                "web_scraping", site, "open", datetime.utcnow(), datetime.utcnow()
                            )
                        
                        results_count += 1
                
                # Respectful delay
                await asyncio.sleep(2)
                
            except Exception as e:
                error_msg = f"Failed to scrape funding site {site}: {str(e)}"
                errors.append(error_msg)
                logger.error(error_msg)
        
        # Update job
        async with db_manager.get_connection() as conn:
            await conn.execute("""
                UPDATE scraping_jobs 
                SET status = $1, completed_at = $2, results_count = $3, errors = $4
                WHERE id = $5
            """, "completed", datetime.utcnow(), results_count, json.dumps(errors), job_id)
        
    except Exception as e:
        logger.error(f"Funding scraping job {job_id} failed: {e}")
        
        async with db_manager.get_connection() as conn:
            await conn.execute("""
                UPDATE scraping_jobs 
                SET status = $1, completed_at = $2, errors = $3
                WHERE id = $4
            """, "failed", datetime.utcnow(), json.dumps([str(e)]), job_id)

# ============================================================================
# CLEANUP HANDLERS
# ============================================================================

@app.on_event("shutdown")
async def shutdown_event():
    await scraper.close_session()
    await db_manager.close_pool()

# ============================================================================
# MAIN APPLICATION RUNNER
# ============================================================================

if __name__ == "__main__":
    uvicorn.run(
        "ai_bot_service:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )