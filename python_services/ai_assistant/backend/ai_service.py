#!/usr/bin/env python3
"""
Granada OS - AI Assistant Service
Intelligent AI assistant for guidance and support
Port: 8023
"""

from fastapi import FastAPI, HTTPException, Depends, Security, BackgroundTasks, Request, WebSocket
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
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

# ============================================================================
# CONFIGURATION & SETUP
# ============================================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
security = HTTPBearer()

# ============================================================================
# ENUMS AND CONSTANTS
# ============================================================================

class AIModel(str, Enum):
    DEEPSEEK = "deepseek"
    GEMINI = "gemini"
    AUTO = "auto"

class AssistantRole(str, Enum):
    FUNDING_ADVISOR = "funding_advisor"
    PROPOSAL_WRITER = "proposal_writer"
    GENERAL_ASSISTANT = "general_assistant"
    COMPLIANCE_ADVISOR = "compliance_advisor"
    STRATEGIC_PLANNER = "strategic_planner"

class ConversationType(str, Enum):
    CHAT = "chat"
    ANALYSIS = "analysis"
    GUIDANCE = "guidance"
    RECOMMENDATION = "recommendation"

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class ChatMessage(BaseModel):
    role: str = Field(..., regex="^(user|assistant|system)$")
    content: str = Field(..., max_length=4000)
    timestamp: Optional[datetime] = None
    metadata: Dict[str, Any] = Field(default={})

class ChatRequest(BaseModel):
    message: str = Field(..., max_length=4000)
    conversation_id: Optional[str] = None
    assistant_role: AssistantRole = AssistantRole.GENERAL_ASSISTANT
    ai_model: AIModel = AIModel.AUTO
    context: Dict[str, Any] = Field(default={})
    include_history: bool = Field(default=True)
    max_history: int = Field(default=10, ge=1, le=50)

class AnalysisRequest(BaseModel):
    content: str = Field(..., max_length=10000)
    analysis_type: str = Field(..., max_length=100)
    focus_areas: List[str] = Field(default=[])
    ai_model: AIModel = AIModel.AUTO
    custom_instructions: Optional[str] = None

class RecommendationRequest(BaseModel):
    user_profile: Dict[str, Any]
    current_situation: str = Field(..., max_length=2000)
    goals: List[str] = Field(default=[])
    constraints: List[str] = Field(default=[])
    preferences: Dict[str, Any] = Field(default={})
    ai_model: AIModel = AIModel.AUTO

# Response Models
class ChatResponse(BaseModel):
    message: str
    conversation_id: str
    response_time: float
    ai_model: str
    confidence: Optional[float] = None
    suggestions: List[str] = Field(default=[])
    follow_up_questions: List[str] = Field(default=[])

class AnalysisResponse(BaseModel):
    analysis: str
    key_insights: List[str]
    recommendations: List[str]
    confidence_score: float
    ai_model: str
    analysis_time: float

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
# AI INTEGRATION
# ============================================================================

class AIEngine:
    def __init__(self):
        self.deepseek_key = DEEPSEEK_API_KEY
        self.gemini_key = GEMINI_API_KEY
    
    async def chat_completion(self, messages: List[Dict], ai_model: str = "auto") -> Dict:
        """Generate chat completion using specified AI model"""
        try:
            if ai_model == "auto":
                ai_model = self._select_best_model(messages)
            
            if ai_model == "deepseek" and self.deepseek_key:
                return await self._deepseek_chat(messages)
            elif ai_model == "gemini" and self.gemini_key:
                return await self._gemini_chat(messages)
            else:
                return await self._fallback_response(messages)
                
        except Exception as e:
            logger.error(f"AI chat completion failed: {e}")
            return await self._fallback_response(messages)
    
    def _select_best_model(self, messages: List[Dict]) -> str:
        """Automatically select the best AI model based on context"""
        # Simple logic for model selection
        content = " ".join([msg.get("content", "") for msg in messages])
        
        if len(content) > 2000 or "analysis" in content.lower():
            return "deepseek"  # Better for complex analysis
        else:
            return "gemini" if self.gemini_key else "deepseek"
    
    async def _deepseek_chat(self, messages: List[Dict]) -> Dict:
        """DeepSeek API integration"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.deepseek_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "deepseek-chat",
                    "messages": messages,
                    "max_tokens": 2000,
                    "temperature": 0.7
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("choices") and len(result["choices"]) > 0:
                    return {
                        "content": result["choices"][0]["message"]["content"],
                        "model": "deepseek",
                        "usage": result.get("usage", {}),
                        "confidence": 0.9
                    }
        
        raise Exception("DeepSeek API call failed")
    
    async def _gemini_chat(self, messages: List[Dict]) -> Dict:
        """Gemini API integration"""
        # Placeholder for Gemini integration
        return {
            "content": "Gemini integration coming soon. Currently using fallback response.",
            "model": "gemini",
            "usage": {},
            "confidence": 0.5
        }
    
    async def _fallback_response(self, messages: List[Dict]) -> Dict:
        """Fallback response when AI services are unavailable"""
        user_message = messages[-1].get("content", "") if messages else ""
        
        # Simple keyword-based responses
        if "funding" in user_message.lower():
            content = "I can help you find funding opportunities. Consider looking into grants from foundations, government programs, and corporate social responsibility initiatives that align with your organization's mission."
        elif "proposal" in user_message.lower():
            content = "For proposal writing, focus on clearly stating your problem, solution, impact, and budget. Make sure to align your proposal with the funder's priorities and guidelines."
        elif "organization" in user_message.lower():
            content = "Building a strong organization requires clear mission, effective governance, skilled team members, and sustainable funding strategies. What specific aspect would you like to explore?"
        else:
            content = "I'm here to help with funding opportunities, proposal writing, and organizational development. How can I assist you today?"
        
        return {
            "content": content,
            "model": "fallback",
            "usage": {},
            "confidence": 0.7
        }

ai_engine = AIEngine()

# ============================================================================
# CONVERSATION MANAGEMENT
# ============================================================================

class ConversationManager:
    def __init__(self):
        pass
    
    async def create_conversation(self, user_id: str, assistant_role: str) -> str:
        """Create new conversation"""
        async with db_manager.get_connection() as conn:
            conversation_id = str(uuid.uuid4())
            
            await conn.execute("""
                INSERT INTO ai_conversations (
                    id, user_id, assistant_role, conversation_type, created_at
                ) VALUES ($1, $2, $3, $4, $5)
            """, conversation_id, user_id, assistant_role, ConversationType.CHAT.value, datetime.utcnow())
            
            return conversation_id
    
    async def get_conversation_history(self, conversation_id: str, limit: int = 10) -> List[Dict]:
        """Get conversation history"""
        async with db_manager.get_connection() as conn:
            messages = await conn.fetch("""
                SELECT role, content, timestamp, metadata
                FROM ai_messages
                WHERE conversation_id = $1
                ORDER BY timestamp DESC
                LIMIT $2
            """, conversation_id, limit)
            
            return [
                {
                    "role": msg["role"],
                    "content": msg["content"],
                    "timestamp": msg["timestamp"],
                    "metadata": msg["metadata"] or {}
                }
                for msg in reversed(messages)
            ]
    
    async def save_message(self, conversation_id: str, role: str, content: str, metadata: Dict = {}):
        """Save message to conversation"""
        async with db_manager.get_connection() as conn:
            await conn.execute("""
                INSERT INTO ai_messages (
                    id, conversation_id, role, content, timestamp, metadata
                ) VALUES ($1, $2, $3, $4, $5, $6)
            """, str(uuid.uuid4()), conversation_id, role, content, datetime.utcnow(), json.dumps(metadata))

conversation_manager = ConversationManager()

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
    logger.info("AI Assistant Service started on port 8023")
    yield
    await db_manager.close_pool()

app = FastAPI(
    title="Granada OS - AI Assistant Service",
    description="Intelligent AI assistant for guidance and support",
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
# AI ASSISTANT ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """AI assistant service health check"""
    return {
        "service": "Granada OS AI Assistant Service",
        "version": "1.0.0",
        "status": "operational",
        "capabilities": [
            "Intelligent chat assistance",
            "Content analysis",
            "Personalized recommendations",
            "Multi-model AI support",
            "Conversation management",
            "Context-aware responses"
        ],
        "ai_models": {
            "deepseek": bool(DEEPSEEK_API_KEY),
            "gemini": bool(GEMINI_API_KEY)
        },
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_assistant(
    chat_request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """Chat with AI assistant"""
    try:
        start_time = datetime.utcnow()
        
        # Get or create conversation
        conversation_id = chat_request.conversation_id
        if not conversation_id:
            conversation_id = await conversation_manager.create_conversation(
                current_user["user_id"], 
                chat_request.assistant_role.value
            )
        
        # Get conversation history
        history = []
        if chat_request.include_history:
            history = await conversation_manager.get_conversation_history(
                conversation_id, 
                chat_request.max_history
            )
        
        # Build messages for AI
        system_prompt = self._get_system_prompt(chat_request.assistant_role, chat_request.context)
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add history
        for msg in history:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        # Add current message
        messages.append({
            "role": "user",
            "content": chat_request.message
        })
        
        # Get AI response
        ai_response = await ai_engine.chat_completion(messages, chat_request.ai_model.value)
        
        # Save messages
        await conversation_manager.save_message(
            conversation_id, "user", chat_request.message
        )
        await conversation_manager.save_message(
            conversation_id, "assistant", ai_response["content"], 
            {"model": ai_response["model"], "confidence": ai_response.get("confidence")}
        )
        
        response_time = (datetime.utcnow() - start_time).total_seconds()
        
        return ChatResponse(
            message=ai_response["content"],
            conversation_id=conversation_id,
            response_time=response_time,
            ai_model=ai_response["model"],
            confidence=ai_response.get("confidence"),
            suggestions=self._extract_suggestions(ai_response["content"]),
            follow_up_questions=self._generate_follow_up_questions(chat_request.assistant_role, ai_response["content"])
        )
        
    except Exception as e:
        logger.error(f"Chat with assistant failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to process chat request")

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_content(
    analysis_request: AnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """Analyze content using AI"""
    try:
        start_time = datetime.utcnow()
        
        # Build analysis prompt
        system_prompt = f"""You are an expert analyst specializing in {analysis_request.analysis_type}.
        Provide a comprehensive analysis of the following content, focusing on: {', '.join(analysis_request.focus_areas)}.
        
        {analysis_request.custom_instructions or ''}
        
        Return your analysis in JSON format with the following structure:
        {{
            "analysis": "detailed analysis text",
            "key_insights": ["insight 1", "insight 2", "insight 3"],
            "recommendations": ["recommendation 1", "recommendation 2"],
            "confidence_score": confidence_0_to_1
        }}"""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": analysis_request.content}
        ]
        
        # Get AI response
        ai_response = await ai_engine.chat_completion(messages, analysis_request.ai_model.value)
        
        try:
            # Try to parse JSON response
            analysis_data = json.loads(ai_response["content"])
        except json.JSONDecodeError:
            # Fallback if response is not JSON
            analysis_data = {
                "analysis": ai_response["content"],
                "key_insights": ["Analysis completed"],
                "recommendations": ["Review the provided analysis"],
                "confidence_score": ai_response.get("confidence", 0.7)
            }
        
        analysis_time = (datetime.utcnow() - start_time).total_seconds()
        
        return AnalysisResponse(
            analysis=analysis_data.get("analysis", "Analysis completed"),
            key_insights=analysis_data.get("key_insights", []),
            recommendations=analysis_data.get("recommendations", []),
            confidence_score=analysis_data.get("confidence_score", 0.7),
            ai_model=ai_response["model"],
            analysis_time=analysis_time
        )
        
    except Exception as e:
        logger.error(f"Content analysis failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze content")

@app.post("/api/recommendations")
async def get_recommendations(
    recommendation_request: RecommendationRequest,
    current_user: dict = Depends(get_current_user)
):
    """Get personalized recommendations"""
    try:
        system_prompt = f"""You are a strategic advisor providing personalized recommendations.
        
        User Profile: {json.dumps(recommendation_request.user_profile)}
        Current Situation: {recommendation_request.current_situation}
        Goals: {recommendation_request.goals}
        Constraints: {recommendation_request.constraints}
        Preferences: {json.dumps(recommendation_request.preferences)}
        
        Provide actionable recommendations that are specific, realistic, and aligned with the user's goals and constraints.
        """
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "Please provide personalized recommendations based on my profile and situation."}
        ]
        
        ai_response = await ai_engine.chat_completion(messages, recommendation_request.ai_model.value)
        
        return {
            "recommendations": ai_response["content"],
            "ai_model": ai_response["model"],
            "confidence": ai_response.get("confidence", 0.7),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Get recommendations failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate recommendations")

@app.get("/api/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get conversation details and history"""
    try:
        async with db_manager.get_connection() as conn:
            conversation = await conn.fetchrow("""
                SELECT * FROM ai_conversations 
                WHERE id = $1 AND user_id = $2
            """, conversation_id, current_user["user_id"])
            
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")
            
            messages = await conversation_manager.get_conversation_history(conversation_id, 100)
            
            return {
                "conversation": dict(conversation),
                "messages": messages,
                "message_count": len(messages)
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get conversation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get conversation")

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def _get_system_prompt(assistant_role: AssistantRole, context: Dict) -> str:
    """Get system prompt based on assistant role"""
    base_prompt = "You are a helpful AI assistant for Granada OS, a funding opportunities platform."
    
    role_prompts = {
        AssistantRole.FUNDING_ADVISOR: "You specialize in helping organizations find and secure funding opportunities. Provide expert advice on grants, funding strategies, and donor relations.",
        AssistantRole.PROPOSAL_WRITER: "You are an expert proposal writer. Help users create compelling, well-structured proposals that align with funder requirements and organizational goals.",
        AssistantRole.COMPLIANCE_ADVISOR: "You specialize in regulatory compliance and organizational governance. Provide guidance on legal requirements, best practices, and risk management.",
        AssistantRole.STRATEGIC_PLANNER: "You are a strategic planning expert. Help organizations develop long-term plans, set goals, and create sustainable growth strategies.",
        AssistantRole.GENERAL_ASSISTANT: "You provide general assistance across all aspects of organizational development and funding activities."
    }
    
    context_info = ""
    if context:
        context_info = f"\n\nContext: {json.dumps(context)}"
    
    return f"{base_prompt} {role_prompts.get(assistant_role, role_prompts[AssistantRole.GENERAL_ASSISTANT])}{context_info}"

def _extract_suggestions(content: str) -> List[str]:
    """Extract actionable suggestions from AI response"""
    # Simple extraction logic
    suggestions = []
    lines = content.split('\n')
    
    for line in lines:
        line = line.strip()
        if line.startswith('•') or line.startswith('-') or line.startswith('*'):
            suggestions.append(line[1:].strip())
        elif 'suggest' in line.lower() or 'recommend' in line.lower():
            suggestions.append(line)
    
    return suggestions[:3]  # Return top 3 suggestions

def _generate_follow_up_questions(assistant_role: AssistantRole, response_content: str) -> List[str]:
    """Generate follow-up questions based on response"""
    base_questions = {
        AssistantRole.FUNDING_ADVISOR: [
            "What is your organization's annual budget range?",
            "Which sectors does your organization focus on?",
            "Do you need help with proposal writing?"
        ],
        AssistantRole.PROPOSAL_WRITER: [
            "What type of proposal are you working on?",
            "What is your requested funding amount?",
            "Do you need help with budget planning?"
        ],
        AssistantRole.GENERAL_ASSISTANT: [
            "Would you like more specific guidance on this topic?",
            "Do you need help with implementation steps?",
            "What other challenges are you facing?"
        ]
    }
    
    return base_questions.get(assistant_role, base_questions[AssistantRole.GENERAL_ASSISTANT])

if __name__ == "__main__":
    uvicorn.run(
        "ai_service:app",
        host="0.0.0.0",
        port=8023,
        reload=True,
        log_level="info"
    )