# Project Models for NGO Management System
from dataclasses import dataclass
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

class ProjectStatus(Enum):
    PLANNING = "planning"
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class MilestoneStatus(Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    OVERDUE = "overdue"

@dataclass
class Project:
    id: str
    name: str
    description: str
    status: ProjectStatus
    start_date: datetime
    end_date: Optional[datetime]
    budget: float
    currency: str
    location: str
    beneficiaries: int
    team_members: List[str]
    created_at: datetime
    updated_at: datetime
    created_by: str
    metadata: Dict

@dataclass
class ProjectMilestone:
    id: str
    project_id: str
    title: str
    description: str
    status: MilestoneStatus
    due_date: datetime
    completion_date: Optional[datetime]
    assigned_to: List[str]
    deliverables: List[str]
    progress_percentage: int
    created_at: datetime
    updated_at: datetime

@dataclass
class ProjectActivity:
    id: str
    project_id: str
    activity_type: str
    title: str
    description: str
    date: datetime
    location: str
    participants: int
    cost: float
    currency: str
    outcomes: List[str]
    created_by: str
    created_at: datetime