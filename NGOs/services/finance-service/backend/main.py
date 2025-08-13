#!/usr/bin/env python3
"""
Finance Service - Financial management for NGO operations
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Dict, Optional
import logging
from datetime import datetime
from pydantic import BaseModel

from service import FinanceService
from router import finance_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NGO Finance Service",
    description="Financial management and reporting for NGO operations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(finance_router, prefix="/api/finance")

# Initialize service
finance_service = FinanceService()

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Finance Service...")
    await finance_service.initialize()
    logger.info("Finance Service started successfully")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "finance", "timestamp": datetime.now()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)