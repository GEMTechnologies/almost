# Granada Models - NGO Database Models

A comprehensive data model package for the Granada OS NGO Management System.

## Overview

This package provides standardized data models for NGO operations including:
- Financial management and transactions
- Project planning and tracking
- Proposal management and reviews
- User management and permissions

## Models

### Finance Models
- `Transaction`: Financial transactions with approval workflow
- `Budget`: Project budget management with allocation tracking
- `FinancialReport`: Comprehensive financial reporting

### Project Models
- `Project`: Core project information with status tracking
- `ProjectMilestone`: Project milestone management
- `ProjectActivity`: Activity tracking and outcomes

### Proposal Models
- `Proposal`: Grant proposal management with review workflow
- `ProposalDocument`: Document versioning and storage
- `ProposalReview`: Review process and scoring

### User Models
- `NGOUser`: User account management with role-based access
- `UserProfile`: Extended user profile information
- `UserPermission`: Granular permission management
- `UserSession`: Session tracking and security

## Installation

```bash
pip install -e .
```

## Usage

```python
from granada_models import Proposal, Project, Transaction
from granada_models.finance import TransactionType, TransactionStatus

# Create a new transaction
transaction = Transaction(
    id="txn_001",
    amount=1000.0,
    currency="USD",
    transaction_type=TransactionType.GRANT,
    status=TransactionStatus.PENDING,
    description="Initial grant funding",
    category="funding",
    project_id="proj_001",
    created_at=datetime.now(),
    updated_at=datetime.now(),
    created_by="user_001",
    approved_by=None,
    metadata={}
)
```

## Requirements

- Python 3.8+
- dataclasses (built-in for Python 3.7+)
- typing (built-in for Python 3.5+)

## License

Copyright © 2025 Granada OS Team. All rights reserved.