# User Models for NGO Management System
from dataclasses import dataclass
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

class UserRole(Enum):
    ADMIN = "admin"
    PROJECT_MANAGER = "project_manager"
    FINANCE_OFFICER = "finance_officer"
    PROGRAM_OFFICER = "program_officer"
    VOLUNTEER = "volunteer"
    BOARD_MEMBER = "board_member"

class UserStatus(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING = "pending"

@dataclass
class NGOUser:
    id: str
    username: str
    email: str
    password_hash: str
    first_name: str
    last_name: str
    role: UserRole
    status: UserStatus
    phone: Optional[str]
    department: Optional[str]
    hire_date: Optional[datetime]
    last_login: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    metadata: Dict

@dataclass
class UserProfile:
    id: str
    user_id: str
    bio: Optional[str]
    skills: List[str]
    certifications: List[str]
    languages: List[str]
    experience_years: int
    education: List[Dict]
    social_links: Dict
    profile_picture: Optional[str]
    created_at: datetime
    updated_at: datetime

@dataclass
class UserPermission:
    id: str
    user_id: str
    resource: str
    action: str
    granted_by: str
    granted_at: datetime
    expires_at: Optional[datetime]
    metadata: Dict

@dataclass
class UserSession:
    id: str
    user_id: str
    session_token: str
    ip_address: str
    user_agent: str
    created_at: datetime
    expires_at: datetime
    is_active: bool