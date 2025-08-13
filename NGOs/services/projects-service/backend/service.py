#!/usr/bin/env python3
"""
Projects Service Implementation
"""

import logging
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class Project:
    id: str
    name: str
    description: str
    status: str
    start_date: datetime
    end_date: Optional[datetime]
    budget: float
    spent: float
    team_members: List[str]
    milestones: List[Dict]

class ProjectsService:
    def __init__(self):
        self.projects = []
        
    async def initialize(self):
        """Initialize projects service with sample data"""
        self.projects = [
            Project(
                id="proj_001",
                name="Community Education Program",
                description="Literacy program for rural communities",
                status="active",
                start_date=datetime(2024, 1, 1),
                end_date=datetime(2024, 12, 31),
                budget=25000.0,
                spent=8500.0,
                team_members=["john_doe", "jane_smith", "mike_wilson"],
                milestones=[
                    {"id": "m1", "title": "Curriculum Development", "status": "completed", "due_date": "2024-02-15"},
                    {"id": "m2", "title": "Teacher Training", "status": "in_progress", "due_date": "2024-04-30"},
                    {"id": "m3", "title": "Program Launch", "status": "pending", "due_date": "2024-06-01"}
                ]
            ),
            Project(
                id="proj_002",
                name="Clean Water Initiative",
                description="Water well construction in remote areas",
                status="planning",
                start_date=datetime(2024, 3, 1),
                end_date=datetime(2024, 11, 30),
                budget=40000.0,
                spent=2000.0,
                team_members=["sarah_jones", "david_brown"],
                milestones=[
                    {"id": "m1", "title": "Site Survey", "status": "in_progress", "due_date": "2024-03-31"},
                    {"id": "m2", "title": "Permits & Approvals", "status": "pending", "due_date": "2024-05-15"},
                    {"id": "m3", "title": "Construction", "status": "pending", "due_date": "2024-09-30"}
                ]
            )
        ]
        logger.info("Projects service initialized with sample data")
    
    async def get_projects(self, organization_id: str) -> List[Project]:
        """Get all projects for an organization"""
        return self.projects
    
    async def get_project(self, project_id: str) -> Optional[Project]:
        """Get specific project details"""
        for project in self.projects:
            if project.id == project_id:
                return project
        return None
    
    async def create_project(self, project_data: Dict) -> Project:
        """Create a new project"""
        project = Project(
            id=f"proj_{len(self.projects) + 1:03d}",
            name=project_data["name"],
            description=project_data["description"],
            status="planning",
            start_date=datetime.fromisoformat(project_data["start_date"]),
            end_date=datetime.fromisoformat(project_data["end_date"]) if project_data.get("end_date") else None,
            budget=project_data["budget"],
            spent=0.0,
            team_members=project_data.get("team_members", []),
            milestones=project_data.get("milestones", [])
        )
        self.projects.append(project)
        return project
    
    async def update_project_status(self, project_id: str, status: str) -> Optional[Project]:
        """Update project status"""
        for project in self.projects:
            if project.id == project_id:
                project.status = status
                return project
        return None
    
    async def add_milestone(self, project_id: str, milestone_data: Dict) -> Optional[Dict]:
        """Add milestone to project"""
        for project in self.projects:
            if project.id == project_id:
                milestone = {
                    "id": f"m{len(project.milestones) + 1}",
                    "title": milestone_data["title"],
                    "status": "pending",
                    "due_date": milestone_data["due_date"]
                }
                project.milestones.append(milestone)
                return milestone
        return None
    
    async def update_milestone(self, project_id: str, milestone_id: str, status: str) -> Optional[Dict]:
        """Update milestone status"""
        for project in self.projects:
            if project.id == project_id:
                for milestone in project.milestones:
                    if milestone["id"] == milestone_id:
                        milestone["status"] = status
                        return milestone
        return None