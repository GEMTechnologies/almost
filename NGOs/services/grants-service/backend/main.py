#!/usr/bin/env python3
"""
Grants Service - Grant and funding opportunity management
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
import logging
from datetime import datetime

from service import GrantsService
from router import grants_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NGO Grants Service",
    description="Grant and funding opportunity management for NGO operations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(grants_router, prefix="/api/grants")

grants_service = GrantsService()

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Grants Service...")
    await grants_service.initialize()
    logger.info("Grants Service started successfully")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "grants", "timestamp": datetime.now()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)