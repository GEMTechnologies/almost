# Finance Models for NGO Management System
from dataclasses import dataclass
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

class TransactionType(Enum):
    INCOME = "income"
    EXPENSE = "expense"
    TRANSFER = "transfer"
    GRANT = "grant"
    DONATION = "donation"

class TransactionStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"

@dataclass
class Transaction:
    id: str
    amount: float
    currency: str
    transaction_type: TransactionType
    status: TransactionStatus
    description: str
    category: str
    project_id: Optional[str]
    created_at: datetime
    updated_at: datetime
    created_by: str
    approved_by: Optional[str]
    metadata: Dict

@dataclass
class Budget:
    id: str
    project_id: str
    name: str
    total_amount: float
    allocated_amount: float
    spent_amount: float
    currency: str
    categories: List[Dict]
    created_at: datetime
    updated_at: datetime
    created_by: str

@dataclass
class FinancialReport:
    id: str
    title: str
    report_type: str
    period_start: datetime
    period_end: datetime
    total_income: float
    total_expenses: float
    net_balance: float
    currency: str
    transactions: List[Transaction]
    generated_at: datetime
    generated_by: str