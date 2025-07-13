#!/usr/bin/env python3
"""
Granada OS - Content Service
Comprehensive content management and publishing
Port: 8008
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
import re
from PIL import Image
import io
from bs4 import BeautifulSoup
import markdown
import bleach

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

class ContentType(str, Enum):
    ARTICLE = "article"
    BLOG_POST = "blog_post"
    NEWS = "news"
    GUIDE = "guide"
    TUTORIAL = "tutorial"
    CASE_STUDY = "case_study"
    RESEARCH = "research"
    REPORT = "report"
    WHITEPAPER = "whitepaper"
    FAQ = "faq"

class ContentStatus(str, Enum):
    DRAFT = "draft"
    REVIEW = "review"
    APPROVED = "approved"
    PUBLISHED = "published"
    SCHEDULED = "scheduled"
    ARCHIVED = "archived"
    REJECTED = "rejected"

class ContentVisibility(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    MEMBERS_ONLY = "members_only"
    PREMIUM = "premium"
    ORGANIZATION = "organization"

class ResourceType(str, Enum):
    DOCUMENT = "document"
    TEMPLATE = "template"
    TOOL = "tool"
    DATASET = "dataset"
    MEDIA = "media"
    COURSE = "course"
    WEBINAR = "webinar"
    EBOOK = "ebook"

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class ArticleCreate(BaseModel):
    title: str = Field(..., max_length=500)
    slug: Optional[str] = Field(None, max_length=200)
    summary: Optional[str] = Field(None, max_length=1000)
    content: str
    category: Optional[str] = Field(None, max_length=100)
    subcategory: Optional[str] = Field(None, max_length=100)
    content_type: ContentType = ContentType.ARTICLE
    format: str = Field(default="markdown", max_length=50)
    visibility: ContentVisibility = ContentVisibility.PUBLIC
    language: str = Field(default="en", max_length=10)
    featured_image: Optional[str] = None
    tags: List[str] = Field(default=[])
    keywords: List[str] = Field(default=[])
    topics: List[str] = Field(default=[])
    target_audience: List[str] = Field(default=[])
    difficulty: Optional[str] = Field(None, max_length=20)
    prerequisites: List[str] = Field(default=[])
    objectives: List[str] = Field(default=[])
    references: List[Dict[str, str]] = Field(default=[])
    is_original: bool = Field(default=True)
    original_source: Optional[str] = None
    license: Optional[str] = Field(None, max_length=100)
    seo_title: Optional[str] = Field(None, max_length=255)
    seo_description: Optional[str] = Field(None, max_length=500)
    seo_keywords: List[str] = Field(default=[])
    scheduled_for: Optional[datetime] = None

class ArticleUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=500)
    summary: Optional[str] = Field(None, max_length=1000)
    content: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    status: Optional[ContentStatus] = None
    visibility: Optional[ContentVisibility] = None
    featured_image: Optional[str] = None
    tags: Optional[List[str]] = None
    seo_title: Optional[str] = Field(None, max_length=255)
    seo_description: Optional[str] = Field(None, max_length=500)

class ResourceCreate(BaseModel):
    title: str = Field(..., max_length=500)
    description: Optional[str] = Field(None, max_length=2000)
    resource_type: ResourceType
    category: Optional[str] = Field(None, max_length=100)
    format: Optional[str] = Field(None, max_length=50)
    url: Optional[str] = None
    file_name: Optional[str] = Field(None, max_length=255)
    version: Optional[str] = Field(None, max_length=50)
    language: str = Field(default="en", max_length=10)
    license: Optional[str] = Field(None, max_length=100)
    access_level: ContentVisibility = ContentVisibility.PUBLIC
    price: float = Field(default=0, ge=0)
    currency: str = Field(default="USD", max_length=10)
    tags: List[str] = Field(default=[])
    keywords: List[str] = Field(default=[])
    target_audience: List[str] = Field(default=[])
    prerequisites: List[str] = Field(default=[])

class CommentCreate(BaseModel):
    content: str = Field(..., max_length=2000)
    parent_comment_id: Optional[str] = None

class RatingCreate(BaseModel):
    rating: float = Field(..., ge=1, le=5)
    review: Optional[str] = Field(None, max_length=1000)

class ContentResponse(BaseModel):
    id: str
    title: str
    slug: str
    summary: Optional[str]
    author_name: str
    category: Optional[str]
    content_type: str
    status: str
    visibility: str
    view_count: int
    like_count: int
    comment_count: int
    rating: Optional[float]
    featured_image: Optional[str]
    published_at: Optional[datetime]
    created_at: datetime

class ResourceResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    resource_type: str
    category: Optional[str]
    format: Optional[str]
    file_size: Optional[int]
    download_count: int
    rating: Optional[float]
    price: float
    currency: str
    is_free: bool
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
# CONTENT PROCESSING
# ============================================================================

class ContentProcessor:
    def __init__(self):
        self.allowed_tags = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'br', 'hr', 'div', 'span',
            'strong', 'b', 'em', 'i', 'u', 'strike', 'del',
            'ul', 'ol', 'li',
            'blockquote', 'code', 'pre',
            'a', 'img',
            'table', 'thead', 'tbody', 'tr', 'th', 'td'
        ]
        
        self.allowed_attributes = {
            'a': ['href', 'title', 'target', 'rel'],
            'img': ['src', 'alt', 'title', 'width', 'height'],
            'code': ['class'],
            'pre': ['class'],
            'div': ['class'],
            'span': ['class']
        }
    
    def generate_slug(self, title: str) -> str:
        """Generate URL-friendly slug from title"""
        slug = title.lower()
        slug = re.sub(r'[^a-z0-9\s-]', '', slug)
        slug = re.sub(r'\s+', '-', slug)
        slug = slug.strip('-')
        return slug[:200]  # Limit length
    
    def process_content(self, content: str, format_type: str = "markdown") -> Dict[str, Any]:
        """Process and sanitize content"""
        try:
            if format_type == "markdown":
                # Convert markdown to HTML
                html_content = markdown.markdown(
                    content,
                    extensions=['tables', 'fenced_code', 'toc', 'nl2br']
                )
            else:
                html_content = content
            
            # Sanitize HTML
            clean_html = bleach.clean(
                html_content,
                tags=self.allowed_tags,
                attributes=self.allowed_attributes,
                strip=True
            )
            
            # Extract plain text for search
            soup = BeautifulSoup(clean_html, 'html.parser')
            plain_text = soup.get_text()
            
            # Calculate reading time (average 200 words per minute)
            word_count = len(plain_text.split())
            reading_time = max(1, round(word_count / 200))
            
            # Extract images
            images = []
            for img in soup.find_all('img'):
                if img.get('src'):
                    images.append({
                        'src': img['src'],
                        'alt': img.get('alt', ''),
                        'title': img.get('title', '')
                    })
            
            return {
                'html_content': clean_html,
                'plain_text': plain_text,
                'word_count': word_count,
                'reading_time': reading_time,
                'images': images
            }
            
        except Exception as e:
            logger.error(f"Content processing failed: {e}")
            return {
                'html_content': content,
                'plain_text': content,
                'word_count': len(content.split()),
                'reading_time': 1,
                'images': []
            }
    
    def extract_keywords(self, text: str, max_keywords: int = 20) -> List[str]:
        """Extract keywords from text content"""
        try:
            # Simple keyword extraction - in production use NLP libraries
            words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
            
            # Remove common stop words
            stop_words = {
                'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all',
                'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day',
                'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now',
                'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its',
                'let', 'put', 'say', 'she', 'too', 'use'
            }
            
            filtered_words = [word for word in words if word not in stop_words and len(word) > 3]
            
            # Count frequency
            word_freq = {}
            for word in filtered_words:
                word_freq[word] = word_freq.get(word, 0) + 1
            
            # Sort by frequency and return top keywords
            sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
            return [word for word, freq in sorted_words[:max_keywords]]
            
        except Exception as e:
            logger.error(f"Keyword extraction failed: {e}")
            return []

content_processor = ContentProcessor()

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
    logger.info("Content Service started on port 8008")
    yield
    await db_manager.close_pool()

app = FastAPI(
    title="Granada OS - Content Service",
    description="Comprehensive content management and publishing",
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

async def generate_unique_slug(title: str, exclude_id: Optional[str] = None) -> str:
    """Generate unique slug for article"""
    base_slug = content_processor.generate_slug(title)
    
    async with db_manager.get_connection() as conn:
        counter = 0
        while True:
            slug = f"{base_slug}-{counter}" if counter > 0 else base_slug
            
            query = "SELECT id FROM articles WHERE slug = $1"
            params = [slug]
            
            if exclude_id:
                query += " AND id != $2"
                params.append(exclude_id)
            
            exists = await conn.fetchval(query, *params)
            
            if not exists:
                return slug
            counter += 1

async def update_content_metrics(content_id: str, metric_type: str, increment: int = 1):
    """Update content engagement metrics"""
    try:
        async with db_manager.get_connection() as conn:
            if metric_type == "view":
                await conn.execute("""
                    UPDATE articles SET view_count = view_count + $1 WHERE id = $2
                """, increment, content_id)
            elif metric_type == "like":
                await conn.execute("""
                    UPDATE articles SET like_count = like_count + $1 WHERE id = $2
                """, increment, content_id)
            elif metric_type == "share":
                await conn.execute("""
                    UPDATE articles SET share_count = share_count + $1 WHERE id = $2
                """, increment, content_id)
                
    except Exception as e:
        logger.error(f"Update metrics failed: {e}")

# ============================================================================
# ARTICLE MANAGEMENT ENDPOINTS
# ============================================================================

@app.get("/api/articles", response_model=List[ContentResponse])
async def list_articles(
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0),
    category: Optional[str] = None,
    content_type: Optional[ContentType] = None,
    status: Optional[ContentStatus] = None,
    author_id: Optional[str] = None,
    featured_only: bool = Query(default=False),
    published_only: bool = Query(default=True),
    search: Optional[str] = None,
    sort_by: str = Query(default="published_at", regex="^(published_at|created_at|view_count|rating)$"),
    sort_order: str = Query(default="desc", regex="^(asc|desc)$")
):
    """List articles with comprehensive filtering"""
    try:
        async with db_manager.get_connection() as conn:
            base_query = """
                SELECT a.id, a.title, a.slug, a.summary, a.category, a.type,
                       a.status, a.visibility, a.view_count, a.like_count,
                       a.comment_count, a.rating, a.featured_image,
                       a.published_at, a.created_at,
                       u.first_name || ' ' || u.last_name as author_name
                FROM articles a
                JOIN users u ON a.author_id = u.id
                WHERE a.visibility = 'public'
            """
            
            conditions = []
            params = []
            param_count = 0
            
            if published_only:
                conditions.append("a.status = 'published'")
                conditions.append("a.published_at <= NOW()")
            
            if category:
                param_count += 1
                conditions.append(f"a.category = ${param_count}")
                params.append(category)
            
            if content_type:
                param_count += 1
                conditions.append(f"a.type = ${param_count}")
                params.append(content_type.value)
            
            if status:
                param_count += 1
                conditions.append(f"a.status = ${param_count}")
                params.append(status.value)
            
            if author_id:
                param_count += 1
                conditions.append(f"a.author_id = ${param_count}")
                params.append(author_id)
            
            if featured_only:
                conditions.append("a.is_featured = true")
            
            if search:
                param_count += 1
                conditions.append(f"(a.title ILIKE ${param_count} OR a.content ILIKE ${param_count} OR a.summary ILIKE ${param_count})")
                params.append(f"%{search}%")
            
            if conditions:
                base_query += " AND " + " AND ".join(conditions)
            
            # Add sorting
            base_query += f" ORDER BY a.{sort_by} {sort_order.upper()}"
            
            # Add pagination
            base_query += f" LIMIT ${param_count + 1} OFFSET ${param_count + 2}"
            params.extend([limit, offset])
            
            articles = await conn.fetch(base_query, *params)
            
            return [
                ContentResponse(
                    id=article['id'],
                    title=article['title'],
                    slug=article['slug'],
                    summary=article['summary'],
                    author_name=article['author_name'],
                    category=article['category'],
                    content_type=article['type'],
                    status=article['status'],
                    visibility=article['visibility'],
                    view_count=article['view_count'],
                    like_count=article['like_count'],
                    comment_count=article['comment_count'],
                    rating=article['rating'],
                    featured_image=article['featured_image'],
                    published_at=article['published_at'],
                    created_at=article['created_at']
                )
                for article in articles
            ]
            
    except Exception as e:
        logger.error(f"List articles failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to list articles")

@app.post("/api/articles", response_model=ContentResponse)
async def create_article(
    article_data: ArticleCreate,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Create new article"""
    try:
        async with db_manager.get_connection() as conn:
            # Generate unique slug
            slug = article_data.slug or await generate_unique_slug(article_data.title)
            
            # Process content
            processed = content_processor.process_content(article_data.content, article_data.format)
            
            # Extract keywords if not provided
            if not article_data.keywords:
                article_data.keywords = content_processor.extract_keywords(processed['plain_text'])
            
            article_id = str(uuid.uuid4())
            
            await conn.execute("""
                INSERT INTO articles (
                    id, title, slug, summary, content, html_content, plain_text,
                    author_id, category, subcategory, type, format, status,
                    visibility, language, reading_time, word_count,
                    featured_image, images, tags, keywords, topics,
                    target_audience, difficulty, prerequisites, objectives,
                    references, is_original, original_source, license,
                    seo_title, seo_description, seo_keywords, scheduled_for,
                    created_at, last_modified
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
                    $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24,
                    $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36
                )
            """,
                article_id, article_data.title, slug, article_data.summary,
                article_data.content, processed['html_content'], processed['plain_text'],
                current_user['user_id'], article_data.category, article_data.subcategory,
                article_data.content_type.value, article_data.format,
                ContentStatus.DRAFT.value, article_data.visibility.value,
                article_data.language, processed['reading_time'], processed['word_count'],
                article_data.featured_image, json.dumps(processed['images']),
                json.dumps(article_data.tags), json.dumps(article_data.keywords),
                json.dumps(article_data.topics), json.dumps(article_data.target_audience),
                article_data.difficulty, json.dumps(article_data.prerequisites),
                json.dumps(article_data.objectives), json.dumps(article_data.references),
                article_data.is_original, article_data.original_source,
                article_data.license, article_data.seo_title,
                article_data.seo_description, json.dumps(article_data.seo_keywords),
                article_data.scheduled_for, datetime.utcnow(), datetime.utcnow()
            )
            
            return ContentResponse(
                id=article_id,
                title=article_data.title,
                slug=slug,
                summary=article_data.summary,
                author_name=current_user.get('name', 'Unknown'),
                category=article_data.category,
                content_type=article_data.content_type.value,
                status=ContentStatus.DRAFT.value,
                visibility=article_data.visibility.value,
                view_count=0,
                like_count=0,
                comment_count=0,
                rating=None,
                featured_image=article_data.featured_image,
                published_at=None,
                created_at=datetime.utcnow()
            )
            
    except Exception as e:
        logger.error(f"Article creation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create article")

@app.get("/api/articles/{article_id}")
async def get_article(
    article_id: str,
    background_tasks: BackgroundTasks,
    increment_views: bool = Query(default=True)
):
    """Get article by ID with full content"""
    try:
        async with db_manager.get_connection() as conn:
            article = await conn.fetchrow("""
                SELECT a.*, u.first_name || ' ' || u.last_name as author_name,
                       u.profile_picture as author_avatar, u.bio as author_bio
                FROM articles a
                JOIN users u ON a.author_id = u.id
                WHERE a.id = $1 AND a.visibility = 'public'
                AND (a.status = 'published' OR a.published_at <= NOW())
            """, article_id)
            
            if not article:
                raise HTTPException(status_code=404, detail="Article not found")
            
            # Increment view count
            if increment_views:
                background_tasks.add_task(update_content_metrics, article_id, "view")
            
            # Get related articles
            related_articles = await conn.fetch("""
                SELECT id, title, slug, summary, featured_image, published_at
                FROM articles
                WHERE category = $1 AND id != $2 AND status = 'published'
                AND visibility = 'public'
                ORDER BY published_at DESC
                LIMIT 5
            """, article['category'], article_id)
            
            # Get comments
            comments = await conn.fetch("""
                SELECT c.id, c.content, c.created_at, c.parent_comment_id,
                       u.first_name || ' ' || u.last_name as author_name,
                       u.profile_picture as author_avatar
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.entity_type = 'article' AND c.entity_id = $1
                AND c.is_approved = true
                ORDER BY c.created_at ASC
            """, article_id)
            
            result = dict(article)
            result['related_articles'] = [dict(rel) for rel in related_articles]
            result['comments'] = [dict(comment) for comment in comments]
            
            return result
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get article failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get article")

@app.get("/api/articles/slug/{slug}")
async def get_article_by_slug(
    slug: str,
    background_tasks: BackgroundTasks,
    increment_views: bool = Query(default=True)
):
    """Get article by slug"""
    try:
        async with db_manager.get_connection() as conn:
            article = await conn.fetchrow("""
                SELECT a.*, u.first_name || ' ' || u.last_name as author_name,
                       u.profile_picture as author_avatar, u.bio as author_bio
                FROM articles a
                JOIN users u ON a.author_id = u.id
                WHERE a.slug = $1 AND a.visibility = 'public'
                AND (a.status = 'published' OR a.published_at <= NOW())
            """, slug)
            
            if not article:
                raise HTTPException(status_code=404, detail="Article not found")
            
            # Increment view count
            if increment_views:
                background_tasks.add_task(update_content_metrics, article['id'], "view")
            
            return dict(article)
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get article by slug failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get article")

@app.put("/api/articles/{article_id}")
async def update_article(
    article_id: str,
    article_update: ArticleUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update article"""
    try:
        async with db_manager.get_connection() as conn:
            # Verify ownership
            article = await conn.fetchrow("""
                SELECT author_id, slug FROM articles WHERE id = $1
            """, article_id)
            
            if not article:
                raise HTTPException(status_code=404, detail="Article not found")
            
            if article['author_id'] != current_user['user_id']:
                raise HTTPException(status_code=403, detail="Not authorized to edit this article")
            
            # Build update query
            update_fields = []
            params = []
            param_count = 0
            
            for field, value in article_update.dict(exclude_unset=True).items():
                if value is not None:
                    param_count += 1
                    
                    if field == 'content' and value:
                        # Process updated content
                        processed = content_processor.process_content(value)
                        
                        update_fields.extend([
                            f"content = ${param_count}",
                            f"html_content = ${param_count + 1}",
                            f"plain_text = ${param_count + 2}",
                            f"word_count = ${param_count + 3}",
                            f"reading_time = ${param_count + 4}"
                        ])
                        params.extend([
                            value,
                            processed['html_content'],
                            processed['plain_text'],
                            processed['word_count'],
                            processed['reading_time']
                        ])
                        param_count += 4
                        
                    elif field == 'title' and value:
                        # Generate new slug if title changed
                        new_slug = await generate_unique_slug(value, article_id)
                        update_fields.extend([
                            f"title = ${param_count}",
                            f"slug = ${param_count + 1}"
                        ])
                        params.extend([value, new_slug])
                        param_count += 1
                        
                    elif field in ['tags', 'seo_keywords']:
                        update_fields.append(f"{field} = ${param_count}")
                        params.append(json.dumps(value))
                        
                    elif field in ['status', 'visibility']:
                        update_fields.append(f"{field} = ${param_count}")
                        params.append(value.value if hasattr(value, 'value') else value)
                        
                    else:
                        update_fields.append(f"{field} = ${param_count}")
                        params.append(value)
            
            if not update_fields:
                raise HTTPException(status_code=400, detail="No fields to update")
            
            param_count += 1
            update_fields.append(f"last_modified = ${param_count}")
            params.append(datetime.utcnow())
            
            params.append(article_id)
            
            query = f"""
                UPDATE articles SET {', '.join(update_fields)}
                WHERE id = ${param_count + 1}
            """
            
            await conn.execute(query, *params)
            
            return {"message": "Article updated successfully"}
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Article update failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to update article")

@app.post("/api/articles/{article_id}/publish")
async def publish_article(
    article_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Publish article"""
    try:
        async with db_manager.get_connection() as conn:
            # Verify ownership
            article = await conn.fetchrow("""
                SELECT author_id, status FROM articles WHERE id = $1
            """, article_id)
            
            if not article:
                raise HTTPException(status_code=404, detail="Article not found")
            
            if article['author_id'] != current_user['user_id']:
                raise HTTPException(status_code=403, detail="Not authorized")
            
            if article['status'] not in ['draft', 'review', 'approved']:
                raise HTTPException(status_code=400, detail="Article cannot be published in current status")
            
            await conn.execute("""
                UPDATE articles SET 
                    status = $1,
                    published_at = $2,
                    last_modified = $3
                WHERE id = $4
            """, ContentStatus.PUBLISHED.value, datetime.utcnow(), datetime.utcnow(), article_id)
            
            return {"message": "Article published successfully"}
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Article publishing failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to publish article")

# ============================================================================
# RESOURCE MANAGEMENT ENDPOINTS
# ============================================================================

@app.get("/api/resources", response_model=List[ResourceResponse])
async def list_resources(
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0),
    resource_type: Optional[ResourceType] = None,
    category: Optional[str] = None,
    free_only: bool = Query(default=False),
    search: Optional[str] = None,
    sort_by: str = Query(default="created_at", regex="^(created_at|download_count|rating|title)$"),
    sort_order: str = Query(default="desc", regex="^(asc|desc)$")
):
    """List resources with filtering"""
    try:
        async with db_manager.get_connection() as conn:
            base_query = """
                SELECT r.id, r.title, r.description, r.type, r.category,
                       r.format, r.file_size, r.download_count, r.rating,
                       r.price, r.currency, r.created_at,
                       CASE WHEN r.price = 0 THEN true ELSE false END as is_free
                FROM resources r
                WHERE r.is_active = true AND r.access_level = 'public'
            """
            
            conditions = []
            params = []
            param_count = 0
            
            if resource_type:
                param_count += 1
                conditions.append(f"r.type = ${param_count}")
                params.append(resource_type.value)
            
            if category:
                param_count += 1
                conditions.append(f"r.category = ${param_count}")
                params.append(category)
            
            if free_only:
                conditions.append("r.price = 0")
            
            if search:
                param_count += 1
                conditions.append(f"(r.title ILIKE ${param_count} OR r.description ILIKE ${param_count})")
                params.append(f"%{search}%")
            
            if conditions:
                base_query += " AND " + " AND ".join(conditions)
            
            base_query += f" ORDER BY r.{sort_by} {sort_order.upper()}"
            base_query += f" LIMIT ${param_count + 1} OFFSET ${param_count + 2}"
            params.extend([limit, offset])
            
            resources = await conn.fetch(base_query, *params)
            
            return [
                ResourceResponse(
                    id=resource['id'],
                    title=resource['title'],
                    description=resource['description'],
                    resource_type=resource['type'],
                    category=resource['category'],
                    format=resource['format'],
                    file_size=resource['file_size'],
                    download_count=resource['download_count'],
                    rating=resource['rating'],
                    price=resource['price'],
                    currency=resource['currency'],
                    is_free=resource['is_free'],
                    created_at=resource['created_at']
                )
                for resource in resources
            ]
            
    except Exception as e:
        logger.error(f"List resources failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to list resources")

@app.post("/api/resources", response_model=ResourceResponse)
async def create_resource(
    resource_data: ResourceCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new resource"""
    try:
        async with db_manager.get_connection() as conn:
            resource_id = str(uuid.uuid4())
            
            await conn.execute("""
                INSERT INTO resources (
                    id, title, description, type, category, format, url,
                    file_name, version, language, license, access_level,
                    price, currency, tags, keywords, target_audience,
                    prerequisites, is_active, author_id, created_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
                    $13, $14, $15, $16, $17, $18, $19, $20, $21
                )
            """,
                resource_id, resource_data.title, resource_data.description,
                resource_data.resource_type.value, resource_data.category,
                resource_data.format, resource_data.url, resource_data.file_name,
                resource_data.version, resource_data.language, resource_data.license,
                resource_data.access_level.value, resource_data.price,
                resource_data.currency, json.dumps(resource_data.tags),
                json.dumps(resource_data.keywords), json.dumps(resource_data.target_audience),
                json.dumps(resource_data.prerequisites), True, current_user['user_id'],
                datetime.utcnow()
            )
            
            return ResourceResponse(
                id=resource_id,
                title=resource_data.title,
                description=resource_data.description,
                resource_type=resource_data.resource_type.value,
                category=resource_data.category,
                format=resource_data.format,
                file_size=None,
                download_count=0,
                rating=None,
                price=resource_data.price,
                currency=resource_data.currency,
                is_free=resource_data.price == 0,
                created_at=datetime.utcnow()
            )
            
    except Exception as e:
        logger.error(f"Resource creation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create resource")

# ============================================================================
# ENGAGEMENT ENDPOINTS
# ============================================================================

@app.post("/api/articles/{article_id}/like")
async def like_article(
    article_id: str,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Like/unlike article"""
    try:
        async with db_manager.get_connection() as conn:
            # Check if already liked
            existing_like = await conn.fetchval("""
                SELECT id FROM content_likes
                WHERE user_id = $1 AND entity_type = 'article' AND entity_id = $2
            """, current_user['user_id'], article_id)
            
            if existing_like:
                # Unlike
                await conn.execute("""
                    DELETE FROM content_likes WHERE id = $1
                """, existing_like)
                
                background_tasks.add_task(update_content_metrics, article_id, "like", -1)
                
                return {"liked": False, "message": "Article unliked"}
            else:
                # Like
                await conn.execute("""
                    INSERT INTO content_likes (id, user_id, entity_type, entity_id, created_at)
                    VALUES ($1, $2, $3, $4, $5)
                """, str(uuid.uuid4()), current_user['user_id'], 'article', article_id, datetime.utcnow())
                
                background_tasks.add_task(update_content_metrics, article_id, "like", 1)
                
                return {"liked": True, "message": "Article liked"}
                
    except Exception as e:
        logger.error(f"Like article failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to like article")

@app.post("/api/articles/{article_id}/comments")
async def create_comment(
    article_id: str,
    comment_data: CommentCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create comment on article"""
    try:
        async with db_manager.get_connection() as conn:
            # Verify article exists
            article_exists = await conn.fetchval("""
                SELECT id FROM articles WHERE id = $1 AND status = 'published'
            """, article_id)
            
            if not article_exists:
                raise HTTPException(status_code=404, detail="Article not found")
            
            comment_id = str(uuid.uuid4())
            
            await conn.execute("""
                INSERT INTO comments (
                    id, user_id, entity_type, entity_id, content,
                    parent_comment_id, is_approved, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            """,
                comment_id, current_user['user_id'], 'article', article_id,
                comment_data.content, comment_data.parent_comment_id,
                True, datetime.utcnow()  # Auto-approve for now
            )
            
            # Update comment count
            await conn.execute("""
                UPDATE articles SET comment_count = comment_count + 1 WHERE id = $1
            """, article_id)
            
            return {
                "comment_id": comment_id,
                "message": "Comment created successfully"
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create comment failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create comment")

@app.post("/api/articles/{article_id}/rating")
async def rate_article(
    article_id: str,
    rating_data: RatingCreate,
    current_user: dict = Depends(get_current_user)
):
    """Rate article"""
    try:
        async with db_manager.get_connection() as conn:
            # Check if already rated
            existing_rating = await conn.fetchval("""
                SELECT id FROM content_ratings
                WHERE user_id = $1 AND entity_type = 'article' AND entity_id = $2
            """, current_user['user_id'], article_id)
            
            if existing_rating:
                # Update existing rating
                await conn.execute("""
                    UPDATE content_ratings SET 
                        rating = $1, review = $2, updated_at = $3
                    WHERE id = $4
                """, rating_data.rating, rating_data.review, datetime.utcnow(), existing_rating)
            else:
                # Create new rating
                await conn.execute("""
                    INSERT INTO content_ratings (
                        id, user_id, entity_type, entity_id, rating, review, created_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                """,
                    str(uuid.uuid4()), current_user['user_id'], 'article',
                    article_id, rating_data.rating, rating_data.review, datetime.utcnow()
                )
            
            # Update article average rating
            avg_rating = await conn.fetchval("""
                SELECT AVG(rating) FROM content_ratings
                WHERE entity_type = 'article' AND entity_id = $1
            """, article_id)
            
            rating_count = await conn.fetchval("""
                SELECT COUNT(*) FROM content_ratings
                WHERE entity_type = 'article' AND entity_id = $1
            """, article_id)
            
            await conn.execute("""
                UPDATE articles SET rating = $1, rating_count = $2 WHERE id = $3
            """, float(avg_rating), rating_count, article_id)
            
            return {"message": "Article rated successfully"}
            
    except Exception as e:
        logger.error(f"Rate article failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to rate article")

# Continue with remaining endpoints for:
# - File upload management
# - Content analytics
# - SEO optimization
# - Content scheduling
# - Template management
# - Media library
# - Content moderation
# - Export functionality
# etc.

if __name__ == "__main__":
    uvicorn.run(
        "content_service:app",
        host="0.0.0.0",
        port=8008,
        reload=True,
        log_level="info"
    )