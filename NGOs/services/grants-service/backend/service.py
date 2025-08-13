#!/usr/bin/env python3
"""
Grants Service Implementation
"""

import logging
from typing import List, Dict, Optional
from datetime import datetime
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class Grant:
    id: str
    title: str
    organization: str
    amount: float
    currency: str
    deadline: datetime
    description: str
    requirements: List[str]
    status: str

@dataclass
class Application:
    id: str
    grant_id: str
    organization_id: str
    submitted_at: datetime
    status: str
    documents: List[str]

class GrantsService:
    def __init__(self):
        self.grants = []
        self.applications = []
        
    async def initialize(self):
        """Initialize grants service with sample data"""
        self.grants = [
            Grant(
                id="grant_001",
                title="Education Initiative Grant",
                organization="Global Education Foundation",
                amount=50000.0,
                currency="USD",
                deadline=datetime(2024, 6, 30),
                description="Supporting education initiatives in underserved communities",
                requirements=["Nonprofit status", "Education focus", "Community impact"],
                status="open"
            ),
            Grant(
                id="grant_002",
                title="Environmental Conservation Fund",
                organization="Green Future Initiative",
                amount=75000.0,
                currency="USD",
                deadline=datetime(2024, 8, 15),
                description="Conservation projects for environmental protection",
                requirements=["Environmental focus", "Measurable impact", "Local partnerships"],
                status="open"
            )
        ]
        logger.info("Grants service initialized with sample data")
    
    async def search_grants(self, query: str, filters: Dict = None) -> List[Grant]:
        """Search available grants"""
        results = self.grants
        
        if query:
            results = [g for g in results if query.lower() in g.title.lower() or 
                      query.lower() in g.description.lower()]
        
        if filters:
            if "max_amount" in filters:
                results = [g for g in results if g.amount <= filters["max_amount"]]
            if "organization" in filters:
                results = [g for g in results if filters["organization"].lower() in g.organization.lower()]
        
        return results
    
    async def get_grant(self, grant_id: str) -> Optional[Grant]:
        """Get specific grant details"""
        for grant in self.grants:
            if grant.id == grant_id:
                return grant
        return None
    
    async def submit_application(self, application_data: Dict) -> Application:
        """Submit grant application"""
        application = Application(
            id=f"app_{len(self.applications) + 1}",
            grant_id=application_data["grant_id"],
            organization_id=application_data["organization_id"],
            submitted_at=datetime.now(),
            status="submitted",
            documents=application_data.get("documents", [])
        )
        self.applications.append(application)
        return application
    
    async def get_applications(self, organization_id: str) -> List[Application]:
        """Get applications for an organization"""
        return [app for app in self.applications if app.organization_id == organization_id]
    
    async def get_application_status(self, application_id: str) -> Optional[Dict]:
        """Get application status and details"""
        for app in self.applications:
            if app.id == application_id:
                grant = await self.get_grant(app.grant_id)
                return {
                    "application": app,
                    "grant": grant,
                    "status_history": [
                        {"status": "submitted", "date": app.submitted_at, "notes": "Application received"}
                    ]
                }
        return None