"""
Granada OS - Intelligent AI Proposal Writer Service
Advanced streaming AI writing assistant with DeepSeek integration
Port: 8030
"""

import asyncio
import json
import os
import time
import signal
from datetime import datetime
from typing import Dict, List, Optional, AsyncGenerator
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import psycopg2
from psycopg2.extras import RealDictCursor
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ProposalSection(BaseModel):
    id: str
    title: str
    content: str
    word_limit: Optional[int] = None
    requirements: List[str] = []
    ai_suggestions: List[str] = []
    completion_score: float = 0.0

class WritingRequest(BaseModel):
    section_id: str
    section_title: str
    context: Dict
    current_content: str
    writing_style: str = "professional"
    tone: str = "formal"
    target_audience: str = "funding_committee"
    word_limit: Optional[int] = None

class AIWritingResponse(BaseModel):
    section_id: str
    generated_content: str
    suggestions: List[str]
    improvement_score: float
    word_count: int
    readability_score: float

class StreamingWritingRequest(BaseModel):
    prompt: str
    context: Dict
    style_preferences: Dict
    max_tokens: int = 1000

class DatabaseManager:
    def __init__(self):
        self.connection_string = os.getenv('DATABASE_URL')
        if not self.connection_string:
            print("⚠️ DATABASE_URL not found, using fallback mode")
            self.connection_string = None
    
    async def get_connection(self):
        """Get database connection"""
        if not self.connection_string:
            return None
        try:
            return psycopg2.connect(
                self.connection_string,
                cursor_factory=RealDictCursor
            )
        except Exception as e:
            print(f"Database connection failed: {e}")
            return None
    
    async def save_writing_session(self, user_id: str, session_data: Dict):
        """Save writing session to database"""
        try:
            conn = await self.get_connection()
            if not conn:
                print("No database connection, skipping session save")
                return f"session_{int(time.time())}"
                
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO ai_writing_sessions 
                (user_id, session_data, created_at)
                VALUES (%s, %s, %s)
                RETURNING id
            """, (user_id, json.dumps(session_data), datetime.utcnow()))
            
            session_id = cursor.fetchone()['id']
            conn.commit()
            cursor.close()
            conn.close()
            
            return session_id
        except Exception as e:
            logger.error(f"Error saving writing session: {e}")
            return f"fallback_session_{int(time.time())}"

class IntelligentWritingEngine:
    def __init__(self):
        api_key = os.getenv('DEEPSEEK_API_KEY')
        if not api_key:
            raise ValueError("🚨 DEEPSEEK_API_KEY environment variable is required")
        
        self.client = openai.OpenAI(
            api_key=api_key,
            base_url="https://api.deepseek.com"
        )
        self.db = DatabaseManager()
        print(f"🔑 Python AI Service initialized with DeepSeek: {api_key[:10]}...{api_key[-4:]}")
    
    async def stream_intelligent_writing(
        self, 
        request: StreamingWritingRequest
    ) -> AsyncGenerator[str, None]:
        """Stream intelligent writing with real-time generation"""
        try:
            # Construct intelligent prompt
            system_prompt = self._build_system_prompt(request.context, request.style_preferences)
            
            # Stream response from DeepSeek
            stream = self.client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": request.prompt}
                ],
                max_tokens=request.max_tokens,
                temperature=0.7,
                stream=True
            )
            
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    yield content
                    
        except Exception as e:
            logger.error(f"Streaming error: {e}")
            yield f"Error: {str(e)}"
    
    def _build_system_prompt(self, context: Dict, style_preferences: Dict) -> str:
        """Build intelligent system prompt based on context"""
        
        funding_type = context.get('funding_type', 'general')
        sector = context.get('sector', 'general')
        funder_name = context.get('funder_name', 'funding organization')
        
        base_prompt = f"""
You are an expert proposal writer with extensive experience in securing funding from {funder_name}.
You specialize in {sector} sector proposals and understand the specific requirements and preferences of this funder.

Context:
- Funding Type: {funding_type}
- Sector: {sector}
- Target Amount: {context.get('amount', 'not specified')}
- Geographic Focus: {context.get('location', 'not specified')}
- Project Duration: {context.get('duration', 'not specified')}

Style Preferences:
- Writing Style: {style_preferences.get('style', 'professional')}
- Tone: {style_preferences.get('tone', 'formal')}
- Complexity Level: {style_preferences.get('complexity', 'advanced')}
- Use of Data: {style_preferences.get('data_heavy', 'moderate')}

Instructions:
1. Write compelling, evidence-based content that aligns with {funder_name}'s priorities
2. Use specific terminology and language preferred by this funder
3. Include relevant statistics, research citations, and impact metrics
4. Structure content with clear logical flow and persuasive arguments
5. Ensure compliance with typical {sector} sector proposal requirements
6. Maintain the specified tone while being engaging and convincing

Generate high-quality proposal content that maximizes funding success probability.
"""
        
        return base_prompt
    
    async def analyze_writing_quality(self, content: str, context: Dict) -> Dict:
        """Analyze writing quality and provide improvement suggestions"""
        try:
            analysis_prompt = f"""
Analyze this proposal section for writing quality, persuasiveness, and compliance:

Content: {content}

Context: {json.dumps(context)}

Provide analysis in JSON format:
{{
    "quality_score": 0-100,
    "readability_score": 0-100,
    "persuasiveness_score": 0-100,
    "compliance_score": 0-100,
    "word_count": number,
    "strengths": ["strength1", "strength2"],
    "improvements": ["improvement1", "improvement2"],
    "suggestions": ["suggestion1", "suggestion2"]
}}
"""
            
            response = self.client.chat.completions.create(
                model="deepseek-chat",
                messages=[{"role": "user", "content": analysis_prompt}],
                max_tokens=500,
                temperature=0.3
            )
            
            analysis = json.loads(response.choices[0].message.content)
            return analysis
            
        except Exception as e:
            logger.error(f"Quality analysis error: {e}")
            return {
                "quality_score": 0,
                "readability_score": 0,
                "persuasiveness_score": 0,
                "compliance_score": 0,
                "word_count": len(content.split()),
                "strengths": [],
                "improvements": ["Unable to analyze due to error"],
                "suggestions": []
            }
    
    async def generate_section_suggestions(self, section_title: str, context: Dict) -> List[str]:
        """Generate intelligent suggestions for a specific section"""
        try:
            suggestion_prompt = f"""
Generate 5 specific, actionable writing suggestions for the "{section_title}" section of a funding proposal.

Context: {json.dumps(context)}

Focus on:
1. Content elements that should be included
2. Persuasive techniques specific to this funder
3. Data and evidence requirements
4. Structural recommendations
5. Language and tone guidelines

Return as JSON array of suggestions.
"""
            
            response = self.client.chat.completions.create(
                model="deepseek-chat",
                messages=[{"role": "user", "content": suggestion_prompt}],
                max_tokens=300,
                temperature=0.5
            )
            
            suggestions = json.loads(response.choices[0].message.content)
            return suggestions if isinstance(suggestions, list) else []
            
        except Exception as e:
            logger.error(f"Suggestions error: {e}")
            return ["Focus on clear problem definition", "Include relevant statistics", "Demonstrate organizational capacity"]

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        logger.info(f"Client {client_id} connected")
    
    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            logger.info(f"Client {client_id} disconnected")
    
    async def send_message(self, client_id: str, message: dict):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_text(json.dumps(message))

# Initialize services
writing_engine = IntelligentWritingEngine()
connection_manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🤖 AI Proposal Writer Service starting...")
    yield
    logger.info("🤖 AI Proposal Writer Service shutting down...")

app = FastAPI(
    title="Granada OS - AI Proposal Writer",
    description="Intelligent streaming proposal writing service",
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

@app.get("/")
async def root():
    return {
        "service": "AI Proposal Writer",
        "status": "operational",
        "capabilities": [
            "Streaming AI writing",
            "Real-time suggestions",
            "Quality analysis",
            "Style adaptation",
            "Funder-specific optimization"
        ]
    }

@app.websocket("/ws/stream-writing/{client_id}")
async def websocket_streaming_endpoint(websocket: WebSocket, client_id: str):
    await connection_manager.connect(websocket, client_id)
    try:
        while True:
            # Receive writing request
            data = await websocket.receive_text()
            request_data = json.loads(data)
            
            if request_data.get("type") == "write":
                # Stream writing response
                writing_request = StreamingWritingRequest(**request_data["payload"])
                
                await connection_manager.send_message(client_id, {
                    "type": "writing_start",
                    "section_id": request_data.get("section_id")
                })
                
                content_buffer = ""
                async for chunk in writing_engine.stream_intelligent_writing(writing_request):
                    content_buffer += chunk
                    await connection_manager.send_message(client_id, {
                        "type": "writing_chunk",
                        "content": chunk,
                        "section_id": request_data.get("section_id")
                    })
                
                # Send completion with analysis
                analysis = await writing_engine.analyze_writing_quality(
                    content_buffer, 
                    writing_request.context
                )
                
                await connection_manager.send_message(client_id, {
                    "type": "writing_complete",
                    "section_id": request_data.get("section_id"),
                    "analysis": analysis
                })
            
            elif request_data.get("type") == "analyze":
                # Analyze existing content
                content = request_data["payload"]["content"]
                context = request_data["payload"]["context"]
                
                analysis = await writing_engine.analyze_writing_quality(content, context)
                
                await connection_manager.send_message(client_id, {
                    "type": "analysis_result",
                    "analysis": analysis
                })
    
    except WebSocketDisconnect:
        connection_manager.disconnect(client_id)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        connection_manager.disconnect(client_id)

@app.post("/api/generate-section")
async def generate_section(request: WritingRequest):
    """Generate content for a specific proposal section"""
    try:
        # Create streaming request
        streaming_request = StreamingWritingRequest(
            prompt=f"Write a compelling {request.section_title} section for this proposal: {request.current_content}",
            context=request.context,
            style_preferences={
                "style": request.writing_style,
                "tone": request.tone
            },
            max_tokens=request.word_limit or 1000
        )
        
        # Collect streamed content
        generated_content = ""
        async for chunk in writing_engine.stream_intelligent_writing(streaming_request):
            generated_content += chunk
        
        # Analyze quality
        analysis = await writing_engine.analyze_writing_quality(
            generated_content, 
            request.context
        )
        
        return AIWritingResponse(
            section_id=request.section_id,
            generated_content=generated_content,
            suggestions=analysis.get("suggestions", []),
            improvement_score=analysis.get("quality_score", 0),
            word_count=analysis.get("word_count", 0),
            readability_score=analysis.get("readability_score", 0)
        )
        
    except Exception as e:
        logger.error(f"Section generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-quality")
async def analyze_quality(content: str, context: Dict):
    """Analyze writing quality of existing content"""
    try:
        analysis = await writing_engine.analyze_writing_quality(content, context)
        return analysis
    except Exception as e:
        logger.error(f"Quality analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/suggestions/{section_title}")
async def get_section_suggestions(section_title: str, context: Dict):
    """Get intelligent suggestions for a specific section"""
    try:
        suggestions = await writing_engine.generate_section_suggestions(section_title, context)
        return {"suggestions": suggestions}
    except Exception as e:
        logger.error(f"Suggestions error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "AI Proposal Writer"
    }

if __name__ == "__main__":
    print("🐍 Starting Python AI Proposal Writer Service on port 8030...")
    uvicorn.run(
        "ai_proposal_writer:app",
        host="0.0.0.0",
        port=8030,
        reload=True,
        log_level="info"
    )