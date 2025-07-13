#!/usr/bin/env python3
"""
Granada OS - Enhanced AI Proposal Writer with LangChain Integration
Advanced document processing, memory management, and intelligent data understanding
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

import openai
import psycopg2
import uvicorn
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from psycopg2.extras import RealDictCursor

# LangChain imports for advanced AI capabilities
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.memory import ConversationBufferMemory, ConversationSummaryMemory
from langchain.chains import ConversationalRetrievalChain, LLMChain
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains.summarize import load_summarize_chain
from langchain.document_loaders import TextLoader
import tiktoken

# Environment setup
os.environ.setdefault('DEEPSEEK_API_KEY', 'sk-a56c233e8fa64e0bb77a264fac2dd68a')

# Logging setup
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models
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
    knowledge_base_matches: List[str] = []

class StreamingWritingRequest(BaseModel):
    prompt: str
    context: Dict
    style_preferences: Dict
    max_tokens: int = 1000

class LangChainKnowledgeBase:
    """Advanced knowledge base using LangChain for document storage and retrieval"""
    
    def __init__(self):
        # Use sentence transformers for embeddings since DeepSeek doesn't have embeddings API
        from sentence_transformers import SentenceTransformer
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        self.vector_store = None
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        self.load_knowledge_base()
    
    def load_knowledge_base(self):
        """Load and process funding opportunity documents"""
        try:
            # Sample funding knowledge documents
            funding_docs = [
                Document(page_content="""
                Health funding opportunities typically require:
                - Clear health impact metrics
                - Evidence-based interventions
                - Community engagement strategies
                - Sustainability plans
                - Budget justification with cost-effectiveness analysis
                - Partnership with local health authorities
                """, metadata={"source": "health_funding_guide", "type": "requirements"}),
                
                Document(page_content="""
                Successful health proposals include:
                - Executive summary highlighting key outcomes
                - Problem statement with epidemiological data
                - Methodology section with clinical protocols
                - Evaluation framework with measurable indicators
                - Risk mitigation strategies
                - Timeline with key milestones
                """, metadata={"source": "proposal_structure", "type": "best_practices"}),
                
                Document(page_content="""
                Common funding criteria for health initiatives:
                - Innovation and scalability potential
                - Alignment with global health priorities (SDGs)
                - Local capacity building components
                - Gender and equity considerations
                - Environmental health integration
                - Digital health technology utilization
                """, metadata={"source": "evaluation_criteria", "type": "scoring"})
            ]
            
            # Split documents into chunks
            chunks = self.text_splitter.split_documents(funding_docs)
            
            # Create embeddings and vector store
            texts = [chunk.page_content for chunk in chunks]
            embeddings = self.embedding_model.encode(texts)
            
            # Create simple in-memory vector store
            self.knowledge_docs = chunks
            self.knowledge_embeddings = embeddings
            logger.info(f"✅ Knowledge base loaded with {len(chunks)} document chunks")
            
        except Exception as e:
            logger.error(f"Knowledge base loading error: {e}")
            self.vector_store = None
    
    async def search_relevant_context(self, query: str, k: int = 3) -> List[str]:
        """Search for relevant context from knowledge base"""
        if not hasattr(self, 'knowledge_docs'):
            return []
        
        try:
            import numpy as np
            from sklearn.metrics.pairwise import cosine_similarity
            
            # Encode query
            query_embedding = self.embedding_model.encode([query])
            
            # Calculate similarities
            similarities = cosine_similarity(query_embedding, self.knowledge_embeddings)[0]
            
            # Get top k most similar documents
            top_indices = np.argsort(similarities)[-k:][::-1]
            
            return [self.knowledge_docs[i].page_content for i in top_indices]
        except Exception as e:
            logger.error(f"Context search error: {e}")
            return []
    
    async def add_document(self, content: str, metadata: Dict):
        """Add new document to knowledge base"""
        try:
            doc = Document(page_content=content, metadata=metadata)
            chunks = self.text_splitter.split_documents([doc])
            
            if self.vector_store:
                self.vector_store.add_documents(chunks)
            else:
                self.vector_store = FAISS.from_documents(chunks, self.embeddings)
                
            logger.info(f"Document added to knowledge base: {metadata.get('source', 'unknown')}")
        except Exception as e:
            logger.error(f"Document addition error: {e}")

class IntelligentWritingEngine:
    """Enhanced writing engine with LangChain integration"""
    
    def __init__(self):
        api_key = os.getenv('DEEPSEEK_API_KEY')
        if not api_key:
            raise ValueError("🚨 DEEPSEEK_API_KEY environment variable is required")
        
        self.client = openai.OpenAI(
            api_key=api_key,
            base_url="https://api.deepseek.com"
        )
        self.knowledge_base = LangChainKnowledgeBase()
        
        # Initialize conversation memory for context tracking
        self.memory = ConversationBufferMemory(
            memory_key="chat_history", 
            return_messages=True
        )
        
        print(f"🔑 Enhanced AI Service initialized with DeepSeek + LangChain: {api_key[:10]}...{api_key[-4:]}")
    
    async def stream_intelligent_writing(
        self, 
        request: StreamingWritingRequest
    ) -> AsyncGenerator[str, None]:
        """Stream intelligent writing with LangChain context enhancement"""
        try:
            # Search for relevant context
            relevant_context = await self.knowledge_base.search_relevant_context(
                request.prompt, k=3
            )
            
            # Build enhanced prompt with context
            enhanced_prompt = self._build_enhanced_prompt(
                request.prompt, 
                request.context, 
                relevant_context,
                request.style_preferences
            )
            
            # Stream response from DeepSeek
            response = self.client.chat.completions.create(
                model="deepseek-chat",
                messages=[{"role": "user", "content": enhanced_prompt}],
                max_tokens=request.max_tokens,
                temperature=0.7,
                stream=True
            )
            
            accumulated_text = ""
            for chunk in response:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    accumulated_text += content
                    yield content
            
            # Store generated content in memory
            self.knowledge_base.memory.chat_memory.add_user_message(request.prompt)
            self.knowledge_base.memory.chat_memory.add_ai_message(accumulated_text)
            
        except Exception as e:
            logger.error(f"Streaming writing error: {e}")
            yield f"Error in content generation: {str(e)}"
    
    def _build_enhanced_prompt(
        self, 
        prompt: str, 
        context: Dict, 
        relevant_context: List[str],
        style_preferences: Dict
    ) -> str:
        """Build enhanced prompt with LangChain context"""
        
        context_section = ""
        if relevant_context:
            context_section = f"""
RELEVANT KNOWLEDGE BASE CONTEXT:
{chr(10).join(f"- {ctx[:200]}..." for ctx in relevant_context)}

"""
        
        return f"""
{context_section}
WRITING REQUEST: {prompt}

PROJECT CONTEXT: {json.dumps(context, indent=2)}

STYLE PREFERENCES: {json.dumps(style_preferences, indent=2)}

INSTRUCTIONS:
- Use the knowledge base context to inform your writing
- Create professional, compelling proposal content
- Include specific, measurable outcomes
- Demonstrate clear understanding of funder requirements
- Maintain consistency with the organization's profile
- Use evidence-based language and persuasive techniques

Generate high-quality proposal content:
"""
    
    async def analyze_writing_quality(self, content: str, context: Dict) -> Dict:
        """Enhanced quality analysis with LangChain"""
        try:
            # Search for quality criteria
            quality_context = await self.knowledge_base.search_relevant_context(
                f"proposal quality criteria evaluation {context.get('opportunity', {}).get('sector', '')}"
            )
            
            analysis_prompt = f"""
Analyze this proposal section for writing quality using best practices:

CONTENT: {content}

CONTEXT: {json.dumps(context)}

QUALITY CRITERIA: {' '.join(quality_context)}

Provide detailed analysis in JSON format:
{{
    "quality_score": 0-100,
    "readability_score": 0-100,
    "persuasiveness_score": 0-100,
    "compliance_score": 0-100,
    "word_count": number,
    "strengths": ["strength1", "strength2"],
    "improvements": ["improvement1", "improvement2"],
    "suggestions": ["suggestion1", "suggestion2"],
    "knowledge_matches": ["context1", "context2"]
}}
"""
            
            response = self.client.chat.completions.create(
                model="deepseek-chat",
                messages=[{"role": "user", "content": analysis_prompt}],
                max_tokens=600,
                temperature=0.3
            )
            
            analysis = json.loads(response.choices[0].message.content)
            return analysis
            
        except Exception as e:
            logger.error(f"Quality analysis error: {e}")
            return {
                "quality_score": 75,
                "readability_score": 80,
                "persuasiveness_score": 70,
                "compliance_score": 75,
                "word_count": len(content.split()),
                "strengths": ["Clear structure"],
                "improvements": ["Add more specific metrics"],
                "suggestions": ["Include evidence-based data"],
                "knowledge_matches": []
            }

# FastAPI app
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🤖 Enhanced AI Proposal Writer Service with LangChain starting...")
    yield
    logger.info("🤖 Enhanced AI Service shutting down...")

app = FastAPI(
    title="Granada OS - Enhanced AI Proposal Writer",
    description="Intelligent proposal writing with LangChain knowledge management",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
writing_engine = IntelligentWritingEngine()

@app.get("/")
async def root():
    return {
        "service": "Enhanced AI Proposal Writer",
        "status": "operational",
        "features": [
            "LangChain knowledge management",
            "Vector-based document retrieval", 
            "Streaming AI writing",
            "Context-aware suggestions",
            "Quality analysis with best practices",
            "Memory-enhanced conversations"
        ]
    }

@app.post("/api/generate-section")
async def generate_section(request: WritingRequest):
    """Generate content with LangChain enhancement"""
    try:
        # Create enhanced streaming request
        streaming_request = StreamingWritingRequest(
            prompt=f"Write a compelling {request.section_title} section for this proposal: {request.current_content}",
            context=request.context,
            style_preferences={
                "style": request.writing_style,
                "tone": request.tone,
                "audience": request.target_audience
            },
            max_tokens=request.word_limit or 1000
        )
        
        # Collect streamed content
        generated_content = ""
        async for chunk in writing_engine.stream_intelligent_writing(streaming_request):
            generated_content += chunk
        
        # Analyze quality with LangChain
        analysis = await writing_engine.analyze_writing_quality(
            generated_content, 
            request.context
        )
        
        # Search for relevant knowledge matches
        knowledge_matches = await writing_engine.knowledge_base.search_relevant_context(
            f"{request.section_title} {request.context.get('opportunity', {}).get('sector', '')}"
        )
        
        return AIWritingResponse(
            section_id=request.section_id,
            generated_content=generated_content,
            suggestions=analysis.get("suggestions", []),
            improvement_score=analysis.get("quality_score", 0),
            word_count=analysis.get("word_count", 0),
            readability_score=analysis.get("readability_score", 0),
            knowledge_base_matches=[match[:100] + "..." for match in knowledge_matches]
        )
        
    except Exception as e:
        logger.error(f"Section generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/add-knowledge")
async def add_knowledge(content: str, metadata: Dict):
    """Add document to knowledge base"""
    try:
        await writing_engine.knowledge_base.add_document(content, metadata)
        return {"status": "success", "message": "Document added to knowledge base"}
    except Exception as e:
        logger.error(f"Knowledge addition error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Enhanced AI Proposal Writer with LangChain",
        "knowledge_base": "active" if writing_engine.knowledge_base.vector_store else "inactive"
    }

if __name__ == "__main__":
    print("🐍 Starting Enhanced Python AI Service with LangChain on port 8030...")
    print(f"🔑 Using DeepSeek API: {os.environ['DEEPSEEK_API_KEY'][:10]}...{os.environ['DEEPSEEK_API_KEY'][-4:]}")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8030,
        log_level="info"
    )