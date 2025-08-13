#!/usr/bin/env python3
"""
AI Supervisor Service - Main Application
Provides intelligent monitoring and guidance for NGO operations
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Dict, Optional
import asyncio
import logging
from datetime import datetime

from monitors.grant_monitor import GrantMonitor
from monitors.project_monitor import ProjectMonitor
from reasoning_engine.gemini_client import GeminiClient

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="NGO AI Supervisor Service",
    description="Intelligent monitoring and guidance for NGO operations",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
grant_monitor = GrantMonitor()
project_monitor = ProjectMonitor()
ai_client = GeminiClient()

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Starting AI Supervisor Service...")
    await ai_client.initialize()
    logger.info("AI Supervisor Service started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down AI Supervisor Service...")
    await ai_client.cleanup()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ai-supervisor", "timestamp": datetime.now()}

@app.get("/api/insights")
async def get_insights(organization_id: str):
    """Get AI-generated insights for an organization"""
    try:
        # Gather data from monitors
        grant_data = await grant_monitor.get_organization_data(organization_id)
        project_data = await project_monitor.get_organization_data(organization_id)
        
        # Generate insights using AI
        insights = await ai_client.generate_insights({
            "grants": grant_data,
            "projects": project_data,
            "organization_id": organization_id
        })
        
        return {"insights": insights, "timestamp": datetime.now()}
    except Exception as e:
        logger.error(f"Error generating insights: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate insights")

@app.get("/api/recommendations")
async def get_recommendations(organization_id: str, context: str = "general"):
    """Get AI recommendations for organization improvement"""
    try:
        recommendations = await ai_client.get_recommendations(organization_id, context)
        return {"recommendations": recommendations, "timestamp": datetime.now()}
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get recommendations")

@app.post("/api/analyze/proposal")
async def analyze_proposal(proposal_data: Dict):
    """Analyze a proposal for quality and improvement suggestions"""
    try:
        analysis = await ai_client.analyze_proposal(proposal_data)
        return {"analysis": analysis, "timestamp": datetime.now()}
    except Exception as e:
        logger.error(f"Error analyzing proposal: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze proposal")

@app.post("/api/analyze/project")
async def analyze_project(project_data: Dict):
    """Analyze project progress and provide recommendations"""
    try:
        analysis = await ai_client.analyze_project(project_data)
        return {"analysis": analysis, "timestamp": datetime.now()}
    except Exception as e:
        logger.error(f"Error analyzing project: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze project")

@app.get("/api/alerts")
async def get_alerts(organization_id: str):
    """Get active alerts and warnings for organization"""
    try:
        grant_alerts = await grant_monitor.get_alerts(organization_id)
        project_alerts = await project_monitor.get_alerts(organization_id)
        
        all_alerts = grant_alerts + project_alerts
        return {"alerts": all_alerts, "count": len(all_alerts), "timestamp": datetime.now()}
    except Exception as e:
        logger.error(f"Error getting alerts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get alerts")

@app.post("/api/monitor/start")
async def start_monitoring(background_tasks: BackgroundTasks, organization_id: str):
    """Start continuous monitoring for an organization"""
    try:
        background_tasks.add_task(grant_monitor.start_monitoring, organization_id)
        background_tasks.add_task(project_monitor.start_monitoring, organization_id)
        return {"message": "Monitoring started", "organization_id": organization_id}
    except Exception as e:
        logger.error(f"Error starting monitoring: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to start monitoring")

@app.post("/api/monitor/stop")
async def stop_monitoring(organization_id: str):
    """Stop monitoring for an organization"""
    try:
        await grant_monitor.stop_monitoring(organization_id)
        await project_monitor.stop_monitoring(organization_id)
        return {"message": "Monitoring stopped", "organization_id": organization_id}
    except Exception as e:
        logger.error(f"Error stopping monitoring: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to stop monitoring")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)