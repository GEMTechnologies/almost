#!/usr/bin/env python3
"""
Finance Service Implementation
"""

import asyncio
import logging
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class Transaction:
    id: str
    amount: float
    currency: str
    transaction_type: str
    description: str
    project_id: Optional[str]
    created_at: datetime

@dataclass
class Budget:
    id: str
    project_id: str
    total_amount: float
    allocated_amount: float
    spent_amount: float
    currency: str

class FinanceService:
    def __init__(self):
        self.transactions = []
        self.budgets = []
        
    async def initialize(self):
        """Initialize finance service"""
        logger.info("Finance service initialized")
    
    async def create_transaction(self, transaction_data: Dict) -> Transaction:
        """Create a new financial transaction"""
        transaction = Transaction(
            id=f"txn_{len(self.transactions) + 1}",
            amount=transaction_data["amount"],
            currency=transaction_data.get("currency", "USD"),
            transaction_type=transaction_data["type"],
            description=transaction_data["description"],
            project_id=transaction_data.get("project_id"),
            created_at=datetime.now()
        )
        self.transactions.append(transaction)
        return transaction
    
    async def get_transactions(self, organization_id: str, 
                             project_id: Optional[str] = None) -> List[Transaction]:
        """Get transactions for organization or project"""
        transactions = self.transactions
        if project_id:
            transactions = [t for t in transactions if t.project_id == project_id]
        return transactions
    
    async def create_budget(self, budget_data: Dict) -> Budget:
        """Create a project budget"""
        budget = Budget(
            id=f"budget_{len(self.budgets) + 1}",
            project_id=budget_data["project_id"],
            total_amount=budget_data["total_amount"],
            allocated_amount=budget_data.get("allocated_amount", 0),
            spent_amount=0,
            currency=budget_data.get("currency", "USD")
        )
        self.budgets.append(budget)
        return budget
    
    async def get_budget(self, project_id: str) -> Optional[Budget]:
        """Get budget for a project"""
        for budget in self.budgets:
            if budget.project_id == project_id:
                return budget
        return None
    
    async def generate_financial_report(self, organization_id: str, 
                                      period_start: datetime, 
                                      period_end: datetime) -> Dict:
        """Generate financial report for specified period"""
        relevant_transactions = [
            t for t in self.transactions 
            if period_start <= t.created_at <= period_end
        ]
        
        total_income = sum(t.amount for t in relevant_transactions if t.transaction_type == "income")
        total_expenses = sum(t.amount for t in relevant_transactions if t.transaction_type == "expense")
        
        return {
            "period_start": period_start,
            "period_end": period_end,
            "total_income": total_income,
            "total_expenses": total_expenses,
            "net_balance": total_income - total_expenses,
            "transaction_count": len(relevant_transactions),
            "transactions": relevant_transactions
        }