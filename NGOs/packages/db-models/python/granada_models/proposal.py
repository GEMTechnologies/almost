# Proposal Models for NGO Management System
from dataclasses import dataclass
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

class ProposalStatus(Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    FUNDED = "funded"

class DocumentType(Enum):
    PROPOSAL = "proposal"
    BUDGET = "budget"
    TIMELINE = "timeline"
    APPENDIX = "appendix"
    SUPPORTING_DOC = "supporting_doc"

@dataclass
class Proposal:
    id: str
    title: str
    description: str
    status: ProposalStatus
    funding_amount: float
    currency: str
    deadline: datetime
    organization: str
    contact_person: str
    contact_email: str
    project_duration: int  # in months
    target_beneficiaries: int
    objectives: List[str]
    activities: List[Dict]
    budget_breakdown: Dict
    expected_outcomes: List[str]
    submitted_at: Optional[datetime]
    reviewed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    created_by: str
    metadata: Dict

@dataclass
class ProposalDocument:
    id: str
    proposal_id: str
    document_type: DocumentType
    filename: str
    file_path: str
    file_size: int
    version: str
    description: str
    uploaded_at: datetime
    uploaded_by: str
    metadata: Dict

@dataclass
class ProposalReview:
    id: str
    proposal_id: str
    reviewer_id: str
    score: float
    comments: str
    recommendations: List[str]
    strengths: List[str]
    weaknesses: List[str]
    decision: str
    reviewed_at: datetime
    metadata: Dict