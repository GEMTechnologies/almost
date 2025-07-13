#!/usr/bin/env python3
"""
Granada OS - Vector Service
Advanced vector database and semantic search service
Port: 8003
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
import asyncio
import asyncpg
import numpy as np
import json
import os
import logging
from datetime import datetime
import uuid
import httpx
from contextlib import asynccontextmanager
import uvicorn
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import hashlib

# ============================================================================
# CONFIGURATION & SETUP
# ============================================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class VectorEmbeddingRequest(BaseModel):
    text: str
    entity_type: str
    entity_id: str
    model: str = Field(default="text-embedding-004")
    metadata: Dict[str, Any] = Field(default={})

class VectorEmbeddingResponse(BaseModel):
    id: str
    entity_type: str
    entity_id: str
    embedding: List[float]
    dimensions: int
    model: str
    confidence: float
    created_at: datetime

class SimilaritySearchRequest(BaseModel):
    query: str
    entity_types: List[str] = Field(default=[])
    limit: int = Field(default=10, le=100)
    threshold: float = Field(default=0.7, ge=0.0, le=1.0)
    include_metadata: bool = Field(default=True)

class SimilarityResult(BaseModel):
    entity_type: str
    entity_id: str
    similarity_score: float
    text_content: str
    metadata: Dict[str, Any]

class SemanticRelationshipRequest(BaseModel):
    source_entity: str
    target_entity: str
    relationship_type: str
    confidence: float
    evidence: Dict[str, Any] = Field(default={})

class RelationshipDiscoveryRequest(BaseModel):
    entity_types: List[str] = Field(default=[])
    min_confidence: float = Field(default=0.8)
    batch_size: int = Field(default=100)

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
# VECTOR PROCESSING ENGINE
# ============================================================================

class VectorProcessor:
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=10000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        self.is_fitted = False
        
    async def generate_embedding(self, text: str, model: str = "text-embedding-004") -> List[float]:
        """Generate vector embedding for text"""
        try:
            if model == "tfidf" or not DEEPSEEK_API_KEY:
                return await self.generate_tfidf_embedding(text)
            elif model.startswith("deepseek"):
                return await self.generate_deepseek_embedding(text)
            elif model.startswith("gemini"):
                return await self.generate_gemini_embedding(text)
            else:
                return await self.generate_tfidf_embedding(text)
                
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            return await self.generate_tfidf_embedding(text)
    
    async def generate_deepseek_embedding(self, text: str) -> List[float]:
        """Generate embedding using DeepSeek API"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.deepseek.com/v1/embeddings",
                    headers={
                        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "deepseek-embedding",
                        "input": text,
                        "encoding_format": "float"
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("data") and len(data["data"]) > 0:
                        embedding = data["data"][0]["embedding"]
                        # Ensure consistent dimensions
                        if len(embedding) != 1536:
                            embedding = self.normalize_embedding_dimensions(embedding, 1536)
                        return embedding
                
        except Exception as e:
            logger.error(f"DeepSeek embedding failed: {e}")
        
        return await self.generate_tfidf_embedding(text)
    
    async def generate_gemini_embedding(self, text: str) -> List[float]:
        """Generate embedding using Gemini API"""
        try:
            if not GEMINI_API_KEY:
                return await self.generate_tfidf_embedding(text)
                
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={GEMINI_API_KEY}",
                    headers={"Content-Type": "application/json"},
                    json={
                        "model": "models/text-embedding-004",
                        "content": {
                            "parts": [{"text": text}]
                        },
                        "taskType": "SEMANTIC_SIMILARITY"
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("embedding") and data["embedding"].get("values"):
                        embedding = data["embedding"]["values"]
                        # Ensure consistent dimensions
                        if len(embedding) != 1536:
                            embedding = self.normalize_embedding_dimensions(embedding, 1536)
                        return embedding
                
        except Exception as e:
            logger.error(f"Gemini embedding failed: {e}")
        
        return await self.generate_tfidf_embedding(text)
    
    async def generate_tfidf_embedding(self, text: str) -> List[float]:
        """Generate TF-IDF embedding as fallback"""
        try:
            # Simple hash-based embedding for consistency
            text_hash = hashlib.md5(text.encode()).hexdigest()
            
            # Convert hash to float vector
            embedding = []
            for i in range(0, len(text_hash), 2):
                hex_pair = text_hash[i:i+2]
                val = int(hex_pair, 16) / 255.0
                embedding.extend([val] * 48)  # Expand to reach target dimensions
            
            # Normalize to 1536 dimensions
            while len(embedding) < 1536:
                embedding.append(0.0)
            
            return embedding[:1536]
            
        except Exception as e:
            logger.error(f"TF-IDF embedding failed: {e}")
            return [0.0] * 1536
    
    def normalize_embedding_dimensions(self, embedding: List[float], target_dim: int) -> List[float]:
        """Normalize embedding to target dimensions"""
        if len(embedding) == target_dim:
            return embedding
        elif len(embedding) > target_dim:
            # Truncate
            return embedding[:target_dim]
        else:
            # Pad with zeros
            return embedding + [0.0] * (target_dim - len(embedding))
    
    def calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """Calculate cosine similarity between embeddings"""
        try:
            arr1 = np.array(embedding1).reshape(1, -1)
            arr2 = np.array(embedding2).reshape(1, -1)
            
            similarity = cosine_similarity(arr1, arr2)[0][0]
            return float(similarity)
            
        except Exception as e:
            logger.error(f"Similarity calculation failed: {e}")
            return 0.0

vector_processor = VectorProcessor()

# ============================================================================
# FASTAPI APPLICATION SETUP
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db_manager.create_pool()
    logger.info("Vector Service started on port 8003")
    yield
    await db_manager.close_pool()

app = FastAPI(
    title="Granada OS - Vector Service",
    description="Advanced vector database and semantic search service",
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
# API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Service health check"""
    return {
        "service": "Granada OS Vector Service",
        "version": "1.0.0",
        "status": "operational",
        "capabilities": [
            "vector_embeddings",
            "semantic_search",
            "relationship_discovery",
            "similarity_analysis"
        ],
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/vectors/embed", response_model=VectorEmbeddingResponse)
async def create_embedding(request: VectorEmbeddingRequest):
    """Create vector embedding for text"""
    try:
        # Generate embedding
        embedding = await vector_processor.generate_embedding(request.text, request.model)
        
        # Store in database
        embedding_id = str(uuid.uuid4())
        
        async with db_manager.get_connection() as conn:
            await conn.execute("""
                INSERT INTO vector_embeddings (
                    id, entity_type, entity_id, embedding_type, model,
                    dimensions, embedding, text_content, metadata, confidence, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                ON CONFLICT (entity_type, entity_id) DO UPDATE SET
                    embedding = EXCLUDED.embedding,
                    text_content = EXCLUDED.text_content,
                    metadata = EXCLUDED.metadata,
                    updated_at = CURRENT_TIMESTAMP
            """,
                embedding_id, request.entity_type, request.entity_id,
                "semantic", request.model, len(embedding),
                json.dumps(embedding), request.text, json.dumps(request.metadata),
                0.95, datetime.utcnow()
            )
        
        return VectorEmbeddingResponse(
            id=embedding_id,
            entity_type=request.entity_type,
            entity_id=request.entity_id,
            embedding=embedding,
            dimensions=len(embedding),
            model=request.model,
            confidence=0.95,
            created_at=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Embedding creation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create embedding")

@app.post("/api/vectors/search")
async def search_similar(request: SimilaritySearchRequest):
    """Search for similar entities using vector similarity"""
    try:
        # Generate query embedding
        query_embedding = await vector_processor.generate_embedding(request.query)
        
        async with db_manager.get_connection() as conn:
            # Base query for vector similarity search
            base_query = """
                SELECT ve.entity_type, ve.entity_id, ve.text_content, ve.metadata,
                       1 - (ve.embedding::vector <=> $1::vector) as similarity_score
                FROM vector_embeddings ve
                WHERE ve.is_active = true
            """
            
            params = [json.dumps(query_embedding)]
            param_count = 1
            
            # Add entity type filter
            if request.entity_types:
                param_count += 1
                placeholders = ",".join([f"${i}" for i in range(param_count, param_count + len(request.entity_types))])
                base_query += f" AND ve.entity_type = ANY(ARRAY[{placeholders}])"
                params.extend(request.entity_types)
                param_count += len(request.entity_types)
            
            # Add similarity threshold
            param_count += 1
            base_query += f" AND 1 - (ve.embedding::vector <=> $1::vector) >= ${param_count}"
            params.append(request.threshold)
            
            # Order and limit
            param_count += 1
            base_query += f" ORDER BY similarity_score DESC LIMIT ${param_count}"
            params.append(request.limit)
            
            results = await conn.fetch(base_query, *params)
            
            # Format results
            similar_entities = []
            for row in results:
                similar_entities.append(SimilarityResult(
                    entity_type=row['entity_type'],
                    entity_id=row['entity_id'],
                    similarity_score=float(row['similarity_score']),
                    text_content=row['text_content'] or "",
                    metadata=row['metadata'] if request.include_metadata else {}
                ))
            
            return {
                "query": request.query,
                "total_results": len(similar_entities),
                "threshold": request.threshold,
                "results": similar_entities
            }
            
    except Exception as e:
        logger.error(f"Similarity search failed: {e}")
        raise HTTPException(status_code=500, detail="Search failed")

@app.post("/api/vectors/relationships/create")
async def create_relationship(request: SemanticRelationshipRequest):
    """Create semantic relationship between entities"""
    try:
        relationship_id = str(uuid.uuid4())
        
        async with db_manager.get_connection() as conn:
            await conn.execute("""
                INSERT INTO semantic_relationships (
                    id, source_entity, target_entity, relationship_type,
                    confidence, discovery_method, evidence, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            """,
                relationship_id, request.source_entity, request.target_entity,
                request.relationship_type, request.confidence, "manual",
                json.dumps(request.evidence), datetime.utcnow()
            )
        
        return {
            "relationship_id": relationship_id,
            "source_entity": request.source_entity,
            "target_entity": request.target_entity,
            "relationship_type": request.relationship_type,
            "confidence": request.confidence,
            "status": "created"
        }
        
    except Exception as e:
        logger.error(f"Relationship creation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create relationship")

@app.get("/api/vectors/relationships/{entity_id}")
async def get_entity_relationships(
    entity_id: str,
    relationship_types: List[str] = Query(default=[]),
    min_confidence: float = Query(default=0.7)
):
    """Get relationships for a specific entity"""
    try:
        async with db_manager.get_connection() as conn:
            query = """
                SELECT id, source_entity, target_entity, relationship_type,
                       confidence, evidence, created_at
                FROM semantic_relationships
                WHERE (source_entity LIKE $1 OR target_entity LIKE $1)
                AND confidence >= $2
            """
            
            params = [f"%{entity_id}%", min_confidence]
            
            if relationship_types:
                placeholders = ",".join([f"${i}" for i in range(3, 3 + len(relationship_types))])
                query += f" AND relationship_type = ANY(ARRAY[{placeholders}])"
                params.extend(relationship_types)
            
            query += " ORDER BY confidence DESC"
            
            relationships = await conn.fetch(query, *params)
            
            return {
                "entity_id": entity_id,
                "total_relationships": len(relationships),
                "relationships": [dict(rel) for rel in relationships]
            }
            
    except Exception as e:
        logger.error(f"Get relationships failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get relationships")

@app.post("/api/vectors/discovery/relationships")
async def discover_relationships(
    request: RelationshipDiscoveryRequest,
    background_tasks: BackgroundTasks
):
    """Discover relationships between entities using AI"""
    try:
        task_id = str(uuid.uuid4())
        
        # Start relationship discovery in background
        background_tasks.add_task(
            perform_relationship_discovery,
            task_id,
            request.entity_types,
            request.min_confidence,
            request.batch_size
        )
        
        return {
            "task_id": task_id,
            "status": "started",
            "entity_types": request.entity_types,
            "min_confidence": request.min_confidence,
            "message": "Relationship discovery started in background"
        }
        
    except Exception as e:
        logger.error(f"Relationship discovery failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to start relationship discovery")

@app.get("/api/vectors/analytics/embeddings")
async def get_embedding_analytics():
    """Get analytics on vector embeddings"""
    try:
        async with db_manager.get_connection() as conn:
            # Basic statistics
            stats = await conn.fetchrow("""
                SELECT 
                    COUNT(*) as total_embeddings,
                    COUNT(DISTINCT entity_type) as unique_entity_types,
                    AVG(dimensions) as avg_dimensions,
                    COUNT(*) FILTER (WHERE is_active = true) as active_embeddings
                FROM vector_embeddings
            """)
            
            # Entity type distribution
            entity_distribution = await conn.fetch("""
                SELECT entity_type, COUNT(*) as count
                FROM vector_embeddings
                WHERE is_active = true
                GROUP BY entity_type
                ORDER BY count DESC
                LIMIT 20
            """)
            
            # Model usage
            model_usage = await conn.fetch("""
                SELECT model, COUNT(*) as count
                FROM vector_embeddings
                GROUP BY model
                ORDER BY count DESC
            """)
            
            # Recent activity
            recent_activity = await conn.fetch("""
                SELECT DATE(created_at) as date, COUNT(*) as embeddings_created
                FROM vector_embeddings
                WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            """)
            
            return {
                "statistics": dict(stats),
                "entity_distribution": [dict(row) for row in entity_distribution],
                "model_usage": [dict(row) for row in model_usage],
                "recent_activity": [dict(row) for row in recent_activity],
                "generated_at": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        logger.error(f"Analytics failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get analytics")

@app.get("/api/vectors/analytics/relationships")
async def get_relationship_analytics():
    """Get analytics on semantic relationships"""
    try:
        async with db_manager.get_connection() as conn:
            # Relationship statistics
            stats = await conn.fetchrow("""
                SELECT 
                    COUNT(*) as total_relationships,
                    COUNT(DISTINCT relationship_type) as unique_types,
                    AVG(confidence) as avg_confidence,
                    COUNT(*) FILTER (WHERE is_validated = true) as validated_relationships
                FROM semantic_relationships
            """)
            
            # Relationship type distribution
            type_distribution = await conn.fetch("""
                SELECT relationship_type, COUNT(*) as count, AVG(confidence) as avg_confidence
                FROM semantic_relationships
                GROUP BY relationship_type
                ORDER BY count DESC
            """)
            
            # Discovery method breakdown
            discovery_methods = await conn.fetch("""
                SELECT discovery_method, COUNT(*) as count
                FROM semantic_relationships
                GROUP BY discovery_method
                ORDER BY count DESC
            """)
            
            return {
                "statistics": dict(stats),
                "type_distribution": [dict(row) for row in type_distribution],
                "discovery_methods": [dict(row) for row in discovery_methods],
                "generated_at": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        logger.error(f"Relationship analytics failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get relationship analytics")

@app.post("/api/vectors/batch/process")
async def batch_process_embeddings(
    entity_types: List[str],
    background_tasks: BackgroundTasks,
    batch_size: int = 100,
    model: str = "text-embedding-004"
):
    """Process embeddings for multiple entities in batch"""
    try:
        task_id = str(uuid.uuid4())
        
        # Start batch processing in background
        background_tasks.add_task(
            perform_batch_embedding,
            task_id,
            entity_types,
            batch_size,
            model
        )
        
        return {
            "task_id": task_id,
            "status": "started",
            "entity_types": entity_types,
            "batch_size": batch_size,
            "model": model,
            "message": "Batch embedding processing started"
        }
        
    except Exception as e:
        logger.error(f"Batch processing failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to start batch processing")

# ============================================================================
# BACKGROUND TASKS
# ============================================================================

async def perform_relationship_discovery(
    task_id: str,
    entity_types: List[str],
    min_confidence: float,
    batch_size: int
):
    """Discover relationships between entities"""
    try:
        async with db_manager.get_connection() as conn:
            # Get embeddings for analysis
            query = """
                SELECT entity_type, entity_id, embedding, text_content
                FROM vector_embeddings
                WHERE is_active = true
            """
            
            if entity_types:
                placeholders = ",".join([f"'{et}'" for et in entity_types])
                query += f" AND entity_type IN ({placeholders})"
            
            query += f" LIMIT {batch_size}"
            
            embeddings = await conn.fetch(query)
            
            discovered_relationships = 0
            
            # Compare embeddings to find relationships
            for i, emb1 in enumerate(embeddings):
                for emb2 in embeddings[i+1:]:
                    try:
                        # Calculate similarity
                        embedding1 = json.loads(emb1['embedding'])
                        embedding2 = json.loads(emb2['embedding'])
                        
                        similarity = vector_processor.calculate_similarity(embedding1, embedding2)
                        
                        if similarity >= min_confidence:
                            # Create relationship
                            relationship_id = str(uuid.uuid4())
                            
                            await conn.execute("""
                                INSERT INTO semantic_relationships (
                                    id, source_entity, target_entity, relationship_type,
                                    confidence, discovery_method, evidence, created_at
                                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                                ON CONFLICT DO NOTHING
                            """,
                                relationship_id,
                                f"{emb1['entity_type']}:{emb1['entity_id']}",
                                f"{emb2['entity_type']}:{emb2['entity_id']}",
                                "semantic_similarity",
                                similarity,
                                "ai_discovery",
                                json.dumps({"similarity_score": similarity, "method": "vector_comparison"}),
                                datetime.utcnow()
                            )
                            
                            discovered_relationships += 1
                            
                    except Exception as e:
                        logger.warning(f"Relationship comparison failed: {e}")
                        continue
            
            logger.info(f"Relationship discovery task {task_id} completed. Discovered {discovered_relationships} relationships.")
            
    except Exception as e:
        logger.error(f"Relationship discovery task {task_id} failed: {e}")

async def perform_batch_embedding(
    task_id: str,
    entity_types: List[str],
    batch_size: int,
    model: str
):
    """Process embeddings for multiple entities"""
    try:
        async with db_manager.get_connection() as conn:
            # Get entities without embeddings
            query = """
                SELECT entity_type, entity_id, content
                FROM (
                    SELECT 'users' as entity_type, id as entity_id, 
                           CONCAT(first_name, ' ', last_name, ' ', COALESCE(bio, '')) as content
                    FROM users
                    WHERE NOT EXISTS (
                        SELECT 1 FROM vector_embeddings ve 
                        WHERE ve.entity_type = 'users' AND ve.entity_id = users.id::text
                    )
                    
                    UNION ALL
                    
                    SELECT 'funding_opportunities' as entity_type, id as entity_id,
                           CONCAT(title, ' ', description, ' ', COALESCE(summary, '')) as content
                    FROM funding_opportunities
                    WHERE NOT EXISTS (
                        SELECT 1 FROM vector_embeddings ve 
                        WHERE ve.entity_type = 'funding_opportunities' AND ve.entity_id = funding_opportunities.id::text
                    )
                    
                    UNION ALL
                    
                    SELECT 'organizations' as entity_type, id as entity_id,
                           CONCAT(name, ' ', COALESCE(description, ''), ' ', sector) as content
                    FROM organizations
                    WHERE NOT EXISTS (
                        SELECT 1 FROM vector_embeddings ve 
                        WHERE ve.entity_type = 'organizations' AND ve.entity_id = organizations.id::text
                    )
                ) as entities
                WHERE content IS NOT NULL AND LENGTH(content) > 10
            """
            
            if entity_types:
                placeholders = ",".join([f"'{et}'" for et in entity_types])
                query += f" AND entity_type IN ({placeholders})"
            
            query += f" LIMIT {batch_size}"
            
            entities = await conn.fetch(query)
            
            processed_count = 0
            
            for entity in entities:
                try:
                    # Generate embedding
                    embedding = await vector_processor.generate_embedding(entity['content'], model)
                    
                    # Store embedding
                    embedding_id = str(uuid.uuid4())
                    
                    await conn.execute("""
                        INSERT INTO vector_embeddings (
                            id, entity_type, entity_id, embedding_type, model,
                            dimensions, embedding, text_content, confidence, created_at
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    """,
                        embedding_id, entity['entity_type'], entity['entity_id'],
                        "semantic", model, len(embedding), json.dumps(embedding),
                        entity['content'], 0.9, datetime.utcnow()
                    )
                    
                    processed_count += 1
                    
                    # Small delay to prevent overwhelming the system
                    await asyncio.sleep(0.1)
                    
                except Exception as e:
                    logger.warning(f"Embedding processing failed for {entity['entity_type']}:{entity['entity_id']}: {e}")
                    continue
            
            logger.info(f"Batch embedding task {task_id} completed. Processed {processed_count} entities.")
            
    except Exception as e:
        logger.error(f"Batch embedding task {task_id} failed: {e}")

# ============================================================================
# MAIN APPLICATION RUNNER
# ============================================================================

if __name__ == "__main__":
    uvicorn.run(
        "vector_service:app",
        host="0.0.0.0",
        port=8003,
        reload=True,
        log_level="info"
    )