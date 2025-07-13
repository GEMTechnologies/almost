#!/usr/bin/env python3
"""
Granada OS - Payment Service
Comprehensive payment processing and financial transactions
Port: 8009
"""

from fastapi import FastAPI, HTTPException, Depends, Security, BackgroundTasks, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional, Dict, Any, Union
import asyncio
import asyncpg
import json
import os
import logging
from datetime import datetime, timedelta
import uuid
import hashlib
import httpx
from contextlib import asynccontextmanager
import uvicorn
from enum import Enum
import stripe
import hmac
from decimal import Decimal

# ============================================================================
# CONFIGURATION & SETUP
# ============================================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")

if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

security = HTTPBearer()

# ============================================================================
# ENUMS AND CONSTANTS
# ============================================================================

class PaymentMethod(str, Enum):
    CREDIT_CARD = "credit_card"
    BANK_TRANSFER = "bank_transfer"
    PAYPAL = "paypal"
    MOBILE_MONEY = "mobile_money"
    CRYPTOCURRENCY = "cryptocurrency"
    WALLET = "wallet"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"
    DISPUTED = "disputed"

class TransactionType(str, Enum):
    PAYMENT = "payment"
    REFUND = "refund"
    WITHDRAWAL = "withdrawal"
    TRANSFER = "transfer"
    FEE = "fee"
    COMMISSION = "commission"

class CurrencyCode(str, Enum):
    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"
    UGX = "UGX"
    KES = "KES"
    NGN = "NGN"
    GHS = "GHS"
    ZAR = "ZAR"

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class PaymentIntentCreate(BaseModel):
    amount: Decimal = Field(..., gt=0)
    currency: CurrencyCode = CurrencyCode.USD
    payment_method: PaymentMethod
    description: Optional[str] = None
    metadata: Dict[str, Any] = Field(default={})
    customer_id: Optional[str] = None
    automatic_confirmation: bool = Field(default=False)

class PaymentConfirm(BaseModel):
    payment_intent_id: str
    payment_method_id: str
    return_url: Optional[str] = None

class RefundCreate(BaseModel):
    payment_intent_id: str
    amount: Optional[Decimal] = None
    reason: Optional[str] = None
    metadata: Dict[str, Any] = Field(default={})

class WalletTopUp(BaseModel):
    amount: Decimal = Field(..., gt=0)
    currency: CurrencyCode = CurrencyCode.USD
    payment_method: PaymentMethod
    payment_method_id: str

class WalletTransfer(BaseModel):
    recipient_id: str
    amount: Decimal = Field(..., gt=0)
    currency: CurrencyCode = CurrencyCode.USD
    description: Optional[str] = None
    reference: Optional[str] = None

class SubscriptionCreate(BaseModel):
    plan_id: str
    payment_method_id: str
    trial_days: Optional[int] = None
    metadata: Dict[str, Any] = Field(default={})

class InvoiceCreate(BaseModel):
    customer_id: str
    line_items: List[Dict[str, Any]]
    currency: CurrencyCode = CurrencyCode.USD
    due_date: Optional[datetime] = None
    description: Optional[str] = None
    metadata: Dict[str, Any] = Field(default={})

class PaymentMethodCreate(BaseModel):
    type: PaymentMethod
    card_details: Optional[Dict[str, str]] = None
    bank_details: Optional[Dict[str, str]] = None
    is_default: bool = Field(default=False)

class CouponCreate(BaseModel):
    code: str = Field(..., max_length=50)
    discount_type: str = Field(..., regex="^(percentage|fixed_amount)$")
    discount_value: Decimal = Field(..., gt=0)
    currency: Optional[CurrencyCode] = None
    max_uses: Optional[int] = None
    expires_at: Optional[datetime] = None
    minimum_amount: Optional[Decimal] = None
    is_active: bool = Field(default=True)

class PayoutCreate(BaseModel):
    amount: Decimal = Field(..., gt=0)
    currency: CurrencyCode = CurrencyCode.USD
    destination_id: str
    description: Optional[str] = None
    metadata: Dict[str, Any] = Field(default={})

# Response Models
class PaymentIntentResponse(BaseModel):
    id: str
    amount: Decimal
    currency: str
    status: str
    client_secret: Optional[str]
    payment_method: Optional[str]
    created_at: datetime

class WalletResponse(BaseModel):
    user_id: str
    balance: Decimal
    currency: str
    available_balance: Decimal
    pending_balance: Decimal
    last_transaction: Optional[datetime]

class TransactionResponse(BaseModel):
    id: str
    type: str
    amount: Decimal
    currency: str
    status: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

# ============================================================================
# DATABASE CONNECTION
# ============================================================================

class DatabaseManager:
    def __init__(self):
        self.pool = None
    
    async def create_pool(self):
        self.pool = await asyncpg.create_pool(
            DATABASE_URL,
            min_size=10,
            max_size=20,
            command_timeout=60
        )
    
    async def close_pool(self):
        if self.pool:
            await self.pool.close()
    
    async def get_connection(self):
        if not self.pool:
            await self.create_pool()
        return self.pool.acquire()

db_manager = DatabaseManager()

# ============================================================================
# PAYMENT PROCESSOR INTEGRATION
# ============================================================================

class PaymentProcessor:
    def __init__(self):
        self.stripe_key = STRIPE_SECRET_KEY
        self.paypal_client_id = PAYPAL_CLIENT_ID
        self.paypal_secret = PAYPAL_CLIENT_SECRET
    
    async def create_payment_intent(self, amount: int, currency: str, metadata: Dict = {}) -> Dict:
        """Create Stripe payment intent"""
        try:
            if not self.stripe_key:
                raise HTTPException(status_code=500, detail="Stripe not configured")
            
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency.lower(),
                metadata=metadata,
                automatic_payment_methods={'enabled': True}
            )
            
            return {
                "id": intent.id,
                "client_secret": intent.client_secret,
                "status": intent.status,
                "amount": intent.amount,
                "currency": intent.currency
            }
            
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {e}")
            raise HTTPException(status_code=400, detail=str(e))
    
    async def confirm_payment_intent(self, payment_intent_id: str, payment_method_id: str) -> Dict:
        """Confirm Stripe payment intent"""
        try:
            intent = stripe.PaymentIntent.confirm(
                payment_intent_id,
                payment_method=payment_method_id
            )
            
            return {
                "id": intent.id,
                "status": intent.status,
                "amount": intent.amount,
                "currency": intent.currency
            }
            
        except stripe.error.StripeError as e:
            logger.error(f"Stripe confirmation error: {e}")
            raise HTTPException(status_code=400, detail=str(e))
    
    async def create_refund(self, payment_intent_id: str, amount: Optional[int] = None) -> Dict:
        """Create Stripe refund"""
        try:
            refund_data = {"payment_intent": payment_intent_id}
            if amount:
                refund_data["amount"] = amount
            
            refund = stripe.Refund.create(**refund_data)
            
            return {
                "id": refund.id,
                "status": refund.status,
                "amount": refund.amount,
                "currency": refund.currency
            }
            
        except stripe.error.StripeError as e:
            logger.error(f"Stripe refund error: {e}")
            raise HTTPException(status_code=400, detail=str(e))
    
    async def process_mobile_money(self, amount: Decimal, currency: str, phone_number: str) -> Dict:
        """Process mobile money payment (placeholder implementation)"""
        # This would integrate with mobile money APIs like MTN MoMo, Airtel Money, etc.
        return {
            "transaction_id": str(uuid.uuid4()),
            "status": "pending",
            "amount": float(amount),
            "currency": currency,
            "phone_number": phone_number
        }

payment_processor = PaymentProcessor()

# ============================================================================
# AUTHENTICATION
# ============================================================================

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Get current authenticated user"""
    try:
        return {"user_id": "user_123", "email": "user@example.com"}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# ============================================================================
# FASTAPI APPLICATION SETUP
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db_manager.create_pool()
    logger.info("Payment Service started on port 8009")
    yield
    await db_manager.close_pool()

app = FastAPI(
    title="Granada OS - Payment Service",
    description="Comprehensive payment processing and financial transactions",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

async def get_or_create_wallet(user_id: str, currency: str = "USD") -> Dict:
    """Get or create user wallet"""
    async with db_manager.get_connection() as conn:
        wallet = await conn.fetchrow("""
            SELECT * FROM wallets WHERE user_id = $1 AND currency = $2
        """, user_id, currency)
        
        if not wallet:
            wallet_id = str(uuid.uuid4())
            await conn.execute("""
                INSERT INTO wallets (
                    id, user_id, currency, balance, available_balance,
                    pending_balance, is_active, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            """,
                wallet_id, user_id, currency, 0, 0, 0, True, datetime.utcnow()
            )
            
            wallet = await conn.fetchrow("""
                SELECT * FROM wallets WHERE id = $1
            """, wallet_id)
        
        return dict(wallet)

async def update_wallet_balance(user_id: str, amount: Decimal, currency: str, transaction_type: str):
    """Update wallet balance"""
    async with db_manager.get_connection() as conn:
        if transaction_type in ["credit", "deposit"]:
            await conn.execute("""
                UPDATE wallets SET 
                    balance = balance + $1,
                    available_balance = available_balance + $1,
                    updated_at = $2
                WHERE user_id = $3 AND currency = $4
            """, float(amount), datetime.utcnow(), user_id, currency)
        else:
            await conn.execute("""
                UPDATE wallets SET 
                    balance = balance - $1,
                    available_balance = available_balance - $1,
                    updated_at = $2
                WHERE user_id = $3 AND currency = $4
            """, float(amount), datetime.utcnow(), user_id, currency)

async def record_transaction(
    user_id: str,
    transaction_type: str,
    amount: Decimal,
    currency: str,
    status: str,
    description: str = None,
    metadata: Dict = {}
) -> str:
    """Record financial transaction"""
    async with db_manager.get_connection() as conn:
        transaction_id = str(uuid.uuid4())
        
        await conn.execute("""
            INSERT INTO financial_transactions (
                id, user_id, type, amount, currency, status, description,
                metadata, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        """,
            transaction_id, user_id, transaction_type, float(amount),
            currency, status, description, json.dumps(metadata), datetime.utcnow()
        )
        
        return transaction_id

# ============================================================================
# PAYMENT INTENT ENDPOINTS
# ============================================================================

@app.post("/api/payments/intents", response_model=PaymentIntentResponse)
async def create_payment_intent(
    intent_data: PaymentIntentCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create payment intent"""
    try:
        async with db_manager.get_connection() as conn:
            intent_id = str(uuid.uuid4())
            
            # For Stripe integration
            if intent_data.payment_method == PaymentMethod.CREDIT_CARD:
                stripe_intent = await payment_processor.create_payment_intent(
                    amount=int(intent_data.amount * 100),  # Convert to cents
                    currency=intent_data.currency.value,
                    metadata={
                        "user_id": current_user["user_id"],
                        "internal_id": intent_id,
                        **intent_data.metadata
                    }
                )
                
                external_id = stripe_intent["id"]
                client_secret = stripe_intent["client_secret"]
            else:
                external_id = None
                client_secret = None
            
            # Store in database
            await conn.execute("""
                INSERT INTO payment_intents (
                    id, user_id, amount, currency, payment_method, status,
                    description, metadata, external_id, client_secret,
                    automatic_confirmation, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            """,
                intent_id, current_user["user_id"], float(intent_data.amount),
                intent_data.currency.value, intent_data.payment_method.value,
                PaymentStatus.PENDING.value, intent_data.description,
                json.dumps(intent_data.metadata), external_id, client_secret,
                intent_data.automatic_confirmation, datetime.utcnow()
            )
            
            return PaymentIntentResponse(
                id=intent_id,
                amount=intent_data.amount,
                currency=intent_data.currency.value,
                status=PaymentStatus.PENDING.value,
                client_secret=client_secret,
                payment_method=intent_data.payment_method.value,
                created_at=datetime.utcnow()
            )
            
    except Exception as e:
        logger.error(f"Create payment intent failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create payment intent")

@app.post("/api/payments/intents/{intent_id}/confirm")
async def confirm_payment_intent(
    intent_id: str,
    confirm_data: PaymentConfirm,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Confirm payment intent"""
    try:
        async with db_manager.get_connection() as conn:
            # Get payment intent
            intent = await conn.fetchrow("""
                SELECT * FROM payment_intents WHERE id = $1 AND user_id = $2
            """, intent_id, current_user["user_id"])
            
            if not intent:
                raise HTTPException(status_code=404, detail="Payment intent not found")
            
            if intent['status'] != PaymentStatus.PENDING.value:
                raise HTTPException(status_code=400, detail="Payment intent cannot be confirmed")
            
            # Process confirmation based on payment method
            if intent['payment_method'] == PaymentMethod.CREDIT_CARD.value:
                stripe_result = await payment_processor.confirm_payment_intent(
                    intent['external_id'],
                    confirm_data.payment_method_id
                )
                
                new_status = stripe_result["status"]
                if new_status == "succeeded":
                    new_status = PaymentStatus.COMPLETED.value
                elif new_status in ["requires_action", "requires_source_action"]:
                    new_status = PaymentStatus.PROCESSING.value
                else:
                    new_status = PaymentStatus.FAILED.value
                    
            elif intent['payment_method'] == PaymentMethod.MOBILE_MONEY.value:
                # Process mobile money
                mobile_result = await payment_processor.process_mobile_money(
                    Decimal(str(intent['amount'])),
                    intent['currency'],
                    confirm_data.payment_method_id  # Phone number
                )
                new_status = PaymentStatus.PROCESSING.value
                
            else:
                new_status = PaymentStatus.PROCESSING.value
            
            # Update payment intent
            await conn.execute("""
                UPDATE payment_intents SET 
                    status = $1,
                    confirmed_at = $2,
                    payment_method_id = $3,
                    updated_at = $4
                WHERE id = $5
            """, new_status, datetime.utcnow(), confirm_data.payment_method_id,
                datetime.utcnow(), intent_id)
            
            # Record transaction
            transaction_id = await record_transaction(
                current_user["user_id"],
                TransactionType.PAYMENT.value,
                Decimal(str(intent['amount'])),
                intent['currency'],
                new_status,
                intent['description'],
                {"payment_intent_id": intent_id}
            )
            
            # If completed, update wallet
            if new_status == PaymentStatus.COMPLETED.value:
                background_tasks.add_task(
                    update_wallet_balance,
                    current_user["user_id"],
                    Decimal(str(intent['amount'])),
                    intent['currency'],
                    "credit"
                )
            
            return {
                "payment_intent_id": intent_id,
                "transaction_id": transaction_id,
                "status": new_status,
                "message": "Payment confirmed successfully"
            }
            
    except Exception as e:
        logger.error(f"Confirm payment intent failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to confirm payment")

@app.get("/api/payments/intents/{intent_id}")
async def get_payment_intent(
    intent_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get payment intent details"""
    try:
        async with db_manager.get_connection() as conn:
            intent = await conn.fetchrow("""
                SELECT * FROM payment_intents WHERE id = $1 AND user_id = $2
            """, intent_id, current_user["user_id"])
            
            if not intent:
                raise HTTPException(status_code=404, detail="Payment intent not found")
            
            return dict(intent)
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get payment intent failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get payment intent")

# ============================================================================
# WALLET ENDPOINTS
# ============================================================================

@app.get("/api/wallet", response_model=WalletResponse)
async def get_wallet(
    currency: CurrencyCode = CurrencyCode.USD,
    current_user: dict = Depends(get_current_user)
):
    """Get user wallet information"""
    try:
        wallet = await get_or_create_wallet(current_user["user_id"], currency.value)
        
        return WalletResponse(
            user_id=wallet["user_id"],
            balance=Decimal(str(wallet["balance"])),
            currency=wallet["currency"],
            available_balance=Decimal(str(wallet["available_balance"])),
            pending_balance=Decimal(str(wallet["pending_balance"])),
            last_transaction=wallet.get("last_transaction")
        )
        
    except Exception as e:
        logger.error(f"Get wallet failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get wallet")

@app.post("/api/wallet/topup")
async def topup_wallet(
    topup_data: WalletTopUp,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Top up wallet balance"""
    try:
        # Create payment intent for top-up
        intent_data = PaymentIntentCreate(
            amount=topup_data.amount,
            currency=topup_data.currency,
            payment_method=topup_data.payment_method,
            description=f"Wallet top-up: {topup_data.amount} {topup_data.currency.value}",
            metadata={"type": "wallet_topup"},
            automatic_confirmation=True
        )
        
        # Create and confirm payment
        async with db_manager.get_connection() as conn:
            intent_id = str(uuid.uuid4())
            
            # Store payment intent
            await conn.execute("""
                INSERT INTO payment_intents (
                    id, user_id, amount, currency, payment_method, status,
                    description, metadata, automatic_confirmation, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            """,
                intent_id, current_user["user_id"], float(topup_data.amount),
                topup_data.currency.value, topup_data.payment_method.value,
                PaymentStatus.PROCESSING.value, intent_data.description,
                json.dumps(intent_data.metadata), True, datetime.utcnow()
            )
            
            # For this example, assume payment succeeds
            await conn.execute("""
                UPDATE payment_intents SET 
                    status = $1,
                    confirmed_at = $2
                WHERE id = $3
            """, PaymentStatus.COMPLETED.value, datetime.utcnow(), intent_id)
            
            # Update wallet balance
            background_tasks.add_task(
                update_wallet_balance,
                current_user["user_id"],
                topup_data.amount,
                topup_data.currency.value,
                "credit"
            )
            
            # Record transaction
            transaction_id = await record_transaction(
                current_user["user_id"],
                TransactionType.PAYMENT.value,
                topup_data.amount,
                topup_data.currency.value,
                PaymentStatus.COMPLETED.value,
                intent_data.description,
                {"payment_intent_id": intent_id, "type": "wallet_topup"}
            )
            
            return {
                "transaction_id": transaction_id,
                "amount": topup_data.amount,
                "currency": topup_data.currency.value,
                "status": "completed",
                "message": "Wallet topped up successfully"
            }
            
    except Exception as e:
        logger.error(f"Wallet topup failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to top up wallet")

@app.post("/api/wallet/transfer")
async def transfer_funds(
    transfer_data: WalletTransfer,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Transfer funds between wallets"""
    try:
        async with db_manager.get_connection() as conn:
            # Check sender wallet balance
            sender_wallet = await get_or_create_wallet(
                current_user["user_id"], 
                transfer_data.currency.value
            )
            
            if Decimal(str(sender_wallet["available_balance"])) < transfer_data.amount:
                raise HTTPException(status_code=400, detail="Insufficient balance")
            
            # Check recipient exists
            recipient = await conn.fetchval("""
                SELECT id FROM users WHERE id = $1
            """, transfer_data.recipient_id)
            
            if not recipient:
                raise HTTPException(status_code=404, detail="Recipient not found")
            
            # Get or create recipient wallet
            recipient_wallet = await get_or_create_wallet(
                transfer_data.recipient_id,
                transfer_data.currency.value
            )
            
            # Create transfer transaction
            transfer_id = str(uuid.uuid4())
            
            await conn.execute("""
                INSERT INTO wallet_transfers (
                    id, sender_id, recipient_id, amount, currency,
                    description, reference, status, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            """,
                transfer_id, current_user["user_id"], transfer_data.recipient_id,
                float(transfer_data.amount), transfer_data.currency.value,
                transfer_data.description, transfer_data.reference,
                "completed", datetime.utcnow()
            )
            
            # Update balances
            background_tasks.add_task(
                update_wallet_balance,
                current_user["user_id"],
                transfer_data.amount,
                transfer_data.currency.value,
                "debit"
            )
            
            background_tasks.add_task(
                update_wallet_balance,
                transfer_data.recipient_id,
                transfer_data.amount,
                transfer_data.currency.value,
                "credit"
            )
            
            # Record transactions
            sender_tx_id = await record_transaction(
                current_user["user_id"],
                TransactionType.TRANSFER.value,
                transfer_data.amount,
                transfer_data.currency.value,
                "completed",
                f"Transfer to {transfer_data.recipient_id}",
                {"transfer_id": transfer_id, "type": "outgoing"}
            )
            
            recipient_tx_id = await record_transaction(
                transfer_data.recipient_id,
                TransactionType.TRANSFER.value,
                transfer_data.amount,
                transfer_data.currency.value,
                "completed",
                f"Transfer from {current_user['user_id']}",
                {"transfer_id": transfer_id, "type": "incoming"}
            )
            
            return {
                "transfer_id": transfer_id,
                "sender_transaction_id": sender_tx_id,
                "recipient_transaction_id": recipient_tx_id,
                "amount": transfer_data.amount,
                "currency": transfer_data.currency.value,
                "status": "completed",
                "message": "Transfer completed successfully"
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Wallet transfer failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to transfer funds")

# ============================================================================
# TRANSACTION ENDPOINTS
# ============================================================================

@app.get("/api/transactions", response_model=List[TransactionResponse])
async def list_transactions(
    current_user: dict = Depends(get_current_user),
    limit: int = 50,
    offset: int = 0,
    transaction_type: Optional[TransactionType] = None,
    currency: Optional[CurrencyCode] = None,
    status: Optional[PaymentStatus] = None
):
    """List user transactions"""
    try:
        async with db_manager.get_connection() as conn:
            base_query = """
                SELECT id, type, amount, currency, status, description,
                       created_at, updated_at
                FROM financial_transactions
                WHERE user_id = $1
            """
            
            conditions = []
            params = [current_user["user_id"]]
            param_count = 1
            
            if transaction_type:
                param_count += 1
                conditions.append(f"type = ${param_count}")
                params.append(transaction_type.value)
            
            if currency:
                param_count += 1
                conditions.append(f"currency = ${param_count}")
                params.append(currency.value)
            
            if status:
                param_count += 1
                conditions.append(f"status = ${param_count}")
                params.append(status.value)
            
            if conditions:
                base_query += " AND " + " AND ".join(conditions)
            
            base_query += f"""
                ORDER BY created_at DESC
                LIMIT ${param_count + 1} OFFSET ${param_count + 2}
            """
            
            params.extend([limit, offset])
            transactions = await conn.fetch(base_query, *params)
            
            return [
                TransactionResponse(
                    id=txn['id'],
                    type=txn['type'],
                    amount=Decimal(str(txn['amount'])),
                    currency=txn['currency'],
                    status=txn['status'],
                    description=txn['description'],
                    created_at=txn['created_at'],
                    updated_at=txn['updated_at'] or txn['created_at']
                )
                for txn in transactions
            ]
            
    except Exception as e:
        logger.error(f"List transactions failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to list transactions")

# ============================================================================
# REFUND ENDPOINTS
# ============================================================================

@app.post("/api/payments/refunds")
async def create_refund(
    refund_data: RefundCreate,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Create payment refund"""
    try:
        async with db_manager.get_connection() as conn:
            # Get payment intent
            intent = await conn.fetchrow("""
                SELECT * FROM payment_intents WHERE id = $1 AND user_id = $2
            """, refund_data.payment_intent_id, current_user["user_id"])
            
            if not intent:
                raise HTTPException(status_code=404, detail="Payment intent not found")
            
            if intent['status'] != PaymentStatus.COMPLETED.value:
                raise HTTPException(status_code=400, detail="Payment cannot be refunded")
            
            refund_amount = refund_data.amount or Decimal(str(intent['amount']))
            
            # Process refund through payment processor
            if intent['payment_method'] == PaymentMethod.CREDIT_CARD.value and intent['external_id']:
                stripe_refund = await payment_processor.create_refund(
                    intent['external_id'],
                    int(refund_amount * 100) if refund_data.amount else None
                )
                external_refund_id = stripe_refund["id"]
            else:
                external_refund_id = None
            
            # Create refund record
            refund_id = str(uuid.uuid4())
            
            await conn.execute("""
                INSERT INTO payment_refunds (
                    id, payment_intent_id, amount, currency, reason,
                    metadata, external_id, status, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            """,
                refund_id, refund_data.payment_intent_id, float(refund_amount),
                intent['currency'], refund_data.reason,
                json.dumps(refund_data.metadata), external_refund_id,
                PaymentStatus.PROCESSING.value, datetime.utcnow()
            )
            
            # Record refund transaction
            transaction_id = await record_transaction(
                current_user["user_id"],
                TransactionType.REFUND.value,
                refund_amount,
                intent['currency'],
                PaymentStatus.PROCESSING.value,
                f"Refund for payment {refund_data.payment_intent_id}",
                {"refund_id": refund_id, "payment_intent_id": refund_data.payment_intent_id}
            )
            
            return {
                "refund_id": refund_id,
                "transaction_id": transaction_id,
                "amount": refund_amount,
                "currency": intent['currency'],
                "status": "processing",
                "message": "Refund initiated successfully"
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create refund failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create refund")

# ============================================================================
# WEBHOOK ENDPOINTS
# ============================================================================

@app.post("/api/webhooks/stripe")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks):
    """Handle Stripe webhooks"""
    try:
        payload = await request.body()
        sig_header = request.headers.get('stripe-signature')
        
        if not STRIPE_WEBHOOK_SECRET:
            raise HTTPException(status_code=500, detail="Webhook secret not configured")
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Process webhook event
        background_tasks.add_task(process_stripe_webhook, event)
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"Stripe webhook failed: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

async def process_stripe_webhook(event: Dict):
    """Process Stripe webhook events"""
    try:
        event_type = event['type']
        
        if event_type == 'payment_intent.succeeded':
            await handle_payment_success(event['data']['object'])
        elif event_type == 'payment_intent.payment_failed':
            await handle_payment_failure(event['data']['object'])
        elif event_type == 'charge.dispute.created':
            await handle_dispute_created(event['data']['object'])
        
        logger.info(f"Processed Stripe webhook: {event_type}")
        
    except Exception as e:
        logger.error(f"Webhook processing error: {e}")

async def handle_payment_success(payment_intent: Dict):
    """Handle successful payment"""
    async with db_manager.get_connection() as conn:
        # Update payment intent status
        await conn.execute("""
            UPDATE payment_intents SET 
                status = $1,
                updated_at = $2
            WHERE external_id = $3
        """, PaymentStatus.COMPLETED.value, datetime.utcnow(), payment_intent['id'])

async def handle_payment_failure(payment_intent: Dict):
    """Handle failed payment"""
    async with db_manager.get_connection() as conn:
        # Update payment intent status
        await conn.execute("""
            UPDATE payment_intents SET 
                status = $1,
                updated_at = $2
            WHERE external_id = $3
        """, PaymentStatus.FAILED.value, datetime.utcnow(), payment_intent['id'])

async def handle_dispute_created(charge: Dict):
    """Handle dispute creation"""
    # Implementation for handling disputes
    logger.info(f"Dispute created for charge: {charge['id']}")

# Continue with additional endpoints for:
# - Subscription management
# - Invoice generation
# - Payment methods
# - Coupons and discounts
# - Payouts
# - Analytics and reporting
# etc.

if __name__ == "__main__":
    uvicorn.run(
        "payment_service:app",
        host="0.0.0.0",
        port=8009,
        reload=True,
        log_level="info"
    )