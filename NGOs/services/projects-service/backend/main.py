#!/usr/bin/env python3
"""
Projects Service - Project management for NGO operations
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
import logging
from datetime import datetime

from service import ProjectsService
from router import projects_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NGO Projects Service",
    description="Project management and tracking for NGO operations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects_router, prefix="/api/projects")

projects_service = ProjectsService()

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Projects Service...")
    await projects_service.initialize()
    logger.info("Projects Service started successfully")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "projects", "timestamp": datetime.now()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)