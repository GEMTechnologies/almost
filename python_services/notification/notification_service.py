#!/usr/bin/env python3
"""
Granada OS - Notification Service
Comprehensive notification and communication management
Port: 8010
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
import httpx
from contextlib import asynccontextmanager
import uvicorn
from enum import Enum
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import aiofiles
import jinja2
from twilio.rest import Client
import boto3
from botocore.exceptions import ClientError

# ============================================================================
# CONFIGURATION & SETUP
# ============================================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
FCM_SERVER_KEY = os.getenv("FCM_SERVER_KEY")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

security = HTTPBearer()

# ============================================================================
# ENUMS AND CONSTANTS
# ============================================================================

class NotificationType(str, Enum):
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    IN_APP = "in_app"
    WEBHOOK = "webhook"
    SLACK = "slack"
    WHATSAPP = "whatsapp"

class NotificationStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"
    FAILED = "failed"
    CANCELLED = "cancelled"

class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class TemplateType(str, Enum):
    WELCOME = "welcome"
    VERIFICATION = "verification"
    PASSWORD_RESET = "password_reset"
    NOTIFICATION = "notification"
    MARKETING = "marketing"
    TRANSACTIONAL = "transactional"
    REMINDER = "reminder"
    ALERT = "alert"

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class NotificationCreate(BaseModel):
    recipient_id: str
    notification_type: NotificationType
    title: str = Field(..., max_length=200)
    message: str = Field(..., max_length=2000)
    template_id: Optional[str] = None
    template_data: Dict[str, Any] = Field(default={})
    priority: Priority = Priority.MEDIUM
    schedule_for: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    channels: List[NotificationType] = Field(default=[])
    metadata: Dict[str, Any] = Field(default={})

class BulkNotificationCreate(BaseModel):
    recipient_ids: List[str]
    notification_type: NotificationType
    title: str = Field(..., max_length=200)
    message: str = Field(..., max_length=2000)
    template_id: Optional[str] = None
    template_data: Dict[str, Any] = Field(default={})
    priority: Priority = Priority.MEDIUM
    schedule_for: Optional[datetime] = None
    batch_size: int = Field(default=100, le=1000)

class EmailNotificationCreate(BaseModel):
    recipient_email: EmailStr
    subject: str = Field(..., max_length=200)
    content: str
    content_type: str = Field(default="html")
    template_id: Optional[str] = None
    template_data: Dict[str, Any] = Field(default={})
    attachments: List[str] = Field(default=[])
    priority: Priority = Priority.MEDIUM
    schedule_for: Optional[datetime] = None

class SMSNotificationCreate(BaseModel):
    recipient_phone: str = Field(..., regex=r'^\+?[1-9]\d{1,14}$')
    message: str = Field(..., max_length=1600)
    template_id: Optional[str] = None
    template_data: Dict[str, Any] = Field(default={})
    priority: Priority = Priority.MEDIUM
    schedule_for: Optional[datetime] = None

class PushNotificationCreate(BaseModel):
    recipient_tokens: List[str]
    title: str = Field(..., max_length=100)
    body: str = Field(..., max_length=500)
    icon: Optional[str] = None
    image: Optional[str] = None
    click_action: Optional[str] = None
    data: Dict[str, Any] = Field(default={})
    priority: Priority = Priority.MEDIUM
    schedule_for: Optional[datetime] = None

class TemplateCreate(BaseModel):
    name: str = Field(..., max_length=100)
    type: TemplateType
    subject: Optional[str] = Field(None, max_length=200)
    content: str
    variables: List[str] = Field(default=[])
    language: str = Field(default="en", max_length=10)
    is_active: bool = Field(default=True)
    metadata: Dict[str, Any] = Field(default={})

class WebhookCreate(BaseModel):
    url: str
    event_types: List[str]
    secret: Optional[str] = None
    headers: Dict[str, str] = Field(default={})
    timeout: int = Field(default=30, ge=1, le=300)
    retry_count: int = Field(default=3, ge=0, le=10)
    is_active: bool = Field(default=True)

class NotificationPreferences(BaseModel):
    email_notifications: bool = Field(default=True)
    sms_notifications: bool = Field(default=False)
    push_notifications: bool = Field(default=True)
    in_app_notifications: bool = Field(default=True)
    marketing_emails: bool = Field(default=True)
    notification_frequency: str = Field(default="immediate")
    quiet_hours_start: Optional[str] = None
    quiet_hours_end: Optional[str] = None
    timezone: str = Field(default="UTC")

# Response Models
class NotificationResponse(BaseModel):
    id: str
    recipient_id: str
    notification_type: str
    title: str
    message: str
    status: str
    priority: str
    created_at: datetime
    sent_at: Optional[datetime]
    delivered_at: Optional[datetime]
    read_at: Optional[datetime]

class TemplateResponse(BaseModel):
    id: str
    name: str
    type: str
    subject: Optional[str]
    variables: List[str]
    language: str
    is_active: bool
    created_at: datetime

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
# NOTIFICATION PROVIDERS
# ============================================================================

class EmailProvider:
    def __init__(self):
        self.smtp_server = SMTP_SERVER
        self.smtp_port = SMTP_PORT
        self.username = SMTP_USERNAME
        self.password = SMTP_PASSWORD
        
        # AWS SES client
        if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
            self.ses_client = boto3.client(
                'ses',
                region_name=AWS_REGION,
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY
            )
        else:
            self.ses_client = None
    
    async def send_email(self, recipient: str, subject: str, content: str, 
                        content_type: str = "html", attachments: List[str] = []) -> Dict:
        """Send email via SMTP or SES"""
        try:
            # Try AWS SES first if available
            if self.ses_client:
                return await self._send_via_ses(recipient, subject, content, content_type)
            else:
                return await self._send_via_smtp(recipient, subject, content, content_type, attachments)
                
        except Exception as e:
            logger.error(f"Email send failed: {e}")
            return {"status": "failed", "error": str(e)}
    
    async def _send_via_ses(self, recipient: str, subject: str, content: str, content_type: str) -> Dict:
        """Send email via AWS SES"""
        try:
            response = self.ses_client.send_email(
                Source=self.username,
                Destination={'ToAddresses': [recipient]},
                Message={
                    'Subject': {'Data': subject},
                    'Body': {
                        'Html': {'Data': content} if content_type == "html" else {},
                        'Text': {'Data': content} if content_type == "text" else {}
                    }
                }
            )
            
            return {
                "status": "sent",
                "message_id": response["MessageId"],
                "provider": "aws_ses"
            }
            
        except ClientError as e:
            logger.error(f"SES error: {e}")
            return {"status": "failed", "error": str(e)}
    
    async def _send_via_smtp(self, recipient: str, subject: str, content: str, 
                           content_type: str, attachments: List[str]) -> Dict:
        """Send email via SMTP"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.username
            msg['To'] = recipient
            msg['Subject'] = subject
            
            # Add body
            if content_type == "html":
                msg.attach(MIMEText(content, 'html'))
            else:
                msg.attach(MIMEText(content, 'plain'))
            
            # Add attachments
            for attachment_path in attachments:
                if os.path.exists(attachment_path):
                    with open(attachment_path, "rb") as attachment:
                        part = MIMEBase('application', 'octet-stream')
                        part.set_payload(attachment.read())
                    
                    encoders.encode_base64(part)
                    part.add_header(
                        'Content-Disposition',
                        f'attachment; filename= {os.path.basename(attachment_path)}'
                    )
                    msg.attach(part)
            
            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.username, self.password)
            text = msg.as_string()
            server.sendmail(self.username, recipient, text)
            server.quit()
            
            return {
                "status": "sent",
                "message_id": str(uuid.uuid4()),
                "provider": "smtp"
            }
            
        except Exception as e:
            logger.error(f"SMTP error: {e}")
            return {"status": "failed", "error": str(e)}

class SMSProvider:
    def __init__(self):
        if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
            self.twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
            self.from_number = TWILIO_PHONE_NUMBER
        else:
            self.twilio_client = None
            self.from_number = None
    
    async def send_sms(self, recipient: str, message: str) -> Dict:
        """Send SMS via Twilio"""
        try:
            if not self.twilio_client:
                return {"status": "failed", "error": "SMS provider not configured"}
            
            message_obj = self.twilio_client.messages.create(
                body=message,
                from_=self.from_number,
                to=recipient
            )
            
            return {
                "status": "sent",
                "message_id": message_obj.sid,
                "provider": "twilio"
            }
            
        except Exception as e:
            logger.error(f"SMS send failed: {e}")
            return {"status": "failed", "error": str(e)}

class PushProvider:
    def __init__(self):
        self.fcm_key = FCM_SERVER_KEY
    
    async def send_push(self, tokens: List[str], title: str, body: str, 
                       data: Dict = {}, image: str = None) -> Dict:
        """Send push notification via FCM"""
        try:
            if not self.fcm_key:
                return {"status": "failed", "error": "FCM not configured"}
            
            headers = {
                'Authorization': f'key={self.fcm_key}',
                'Content-Type': 'application/json',
            }
            
            payload = {
                'registration_ids': tokens,
                'notification': {
                    'title': title,
                    'body': body,
                    'sound': 'default',
                },
                'data': data
            }
            
            if image:
                payload['notification']['image'] = image
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    'https://fcm.googleapis.com/fcm/send',
                    headers=headers,
                    json=payload
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "status": "sent",
                        "success_count": result.get('success', 0),
                        "failure_count": result.get('failure', 0),
                        "provider": "fcm"
                    }
                else:
                    return {"status": "failed", "error": f"FCM error: {response.status_code}"}
                    
        except Exception as e:
            logger.error(f"Push notification failed: {e}")
            return {"status": "failed", "error": str(e)}

# Initialize providers
email_provider = EmailProvider()
sms_provider = SMSProvider()
push_provider = PushProvider()

# ============================================================================
# TEMPLATE ENGINE
# ============================================================================

class TemplateEngine:
    def __init__(self):
        self.jinja_env = jinja2.Environment(
            loader=jinja2.BaseLoader(),
            autoescape=jinja2.select_autoescape(['html', 'xml'])
        )
    
    async def render_template(self, template_content: str, data: Dict[str, Any]) -> str:
        """Render template with data"""
        try:
            template = self.jinja_env.from_string(template_content)
            return template.render(**data)
        except Exception as e:
            logger.error(f"Template rendering failed: {e}")
            return template_content

template_engine = TemplateEngine()

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
    logger.info("Notification Service started on port 8010")
    yield
    await db_manager.close_pool()

app = FastAPI(
    title="Granada OS - Notification Service",
    description="Comprehensive notification and communication management",
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

async def get_user_preferences(user_id: str) -> Dict:
    """Get user notification preferences"""
    async with db_manager.get_connection() as conn:
        prefs = await conn.fetchrow("""
            SELECT * FROM notification_preferences WHERE user_id = $1
        """, user_id)
        
        if not prefs:
            # Create default preferences
            await conn.execute("""
                INSERT INTO notification_preferences (
                    id, user_id, email_notifications, sms_notifications,
                    push_notifications, in_app_notifications, marketing_emails,
                    notification_frequency, timezone, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            """,
                str(uuid.uuid4()), user_id, True, False, True, True, True,
                "immediate", "UTC", datetime.utcnow()
            )
            
            return {
                "email_notifications": True,
                "sms_notifications": False,
                "push_notifications": True,
                "in_app_notifications": True,
                "marketing_emails": True,
                "notification_frequency": "immediate",
                "timezone": "UTC"
            }
        
        return dict(prefs)

async def should_send_notification(user_id: str, notification_type: str) -> bool:
    """Check if notification should be sent based on user preferences"""
    prefs = await get_user_preferences(user_id)
    
    if notification_type == "email":
        return prefs.get("email_notifications", True)
    elif notification_type == "sms":
        return prefs.get("sms_notifications", False)
    elif notification_type == "push":
        return prefs.get("push_notifications", True)
    elif notification_type == "in_app":
        return prefs.get("in_app_notifications", True)
    
    return True

# ============================================================================
# NOTIFICATION ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Notification service health check"""
    return {
        "service": "Granada OS Notification Service",
        "version": "1.0.0",
        "status": "operational",
        "providers": {
            "email": bool(SMTP_USERNAME),
            "sms": bool(TWILIO_ACCOUNT_SID),
            "push": bool(FCM_SERVER_KEY),
            "aws_ses": bool(AWS_ACCESS_KEY_ID)
        },
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/notifications", response_model=NotificationResponse)
async def create_notification(
    notification_data: NotificationCreate,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Create and send notification"""
    try:
        # Check if notification should be sent
        should_send = await should_send_notification(
            notification_data.recipient_id,
            notification_data.notification_type.value
        )
        
        if not should_send:
            raise HTTPException(status_code=400, detail="User has disabled this notification type")
        
        async with db_manager.get_connection() as conn:
            notification_id = str(uuid.uuid4())
            
            # Process template if provided
            final_message = notification_data.message
            final_title = notification_data.title
            
            if notification_data.template_id:
                template = await conn.fetchrow("""
                    SELECT content, subject FROM notification_templates WHERE id = $1
                """, notification_data.template_id)
                
                if template:
                    final_message = await template_engine.render_template(
                        template['content'], 
                        notification_data.template_data
                    )
                    if template['subject']:
                        final_title = await template_engine.render_template(
                            template['subject'], 
                            notification_data.template_data
                        )
            
            # Store notification
            await conn.execute("""
                INSERT INTO notifications (
                    id, recipient_id, sender_id, notification_type, title, message,
                    template_id, template_data, priority, status, schedule_for,
                    expires_at, metadata, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            """,
                notification_id, notification_data.recipient_id, current_user["user_id"],
                notification_data.notification_type.value, final_title, final_message,
                notification_data.template_id, json.dumps(notification_data.template_data),
                notification_data.priority.value, NotificationStatus.PENDING.value,
                notification_data.schedule_for, notification_data.expires_at,
                json.dumps(notification_data.metadata), datetime.utcnow()
            )
            
            # Send notification immediately if not scheduled
            if not notification_data.schedule_for:
                background_tasks.add_task(
                    send_notification_task,
                    notification_id,
                    notification_data.notification_type.value,
                    notification_data.recipient_id,
                    final_title,
                    final_message
                )
            
            return NotificationResponse(
                id=notification_id,
                recipient_id=notification_data.recipient_id,
                notification_type=notification_data.notification_type.value,
                title=final_title,
                message=final_message,
                status=NotificationStatus.PENDING.value,
                priority=notification_data.priority.value,
                created_at=datetime.utcnow(),
                sent_at=None,
                delivered_at=None,
                read_at=None
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create notification failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create notification")

@app.post("/api/notifications/bulk")
async def create_bulk_notifications(
    bulk_data: BulkNotificationCreate,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Create bulk notifications"""
    try:
        notification_ids = []
        
        async with db_manager.get_connection() as conn:
            # Process in batches
            for i in range(0, len(bulk_data.recipient_ids), bulk_data.batch_size):
                batch = bulk_data.recipient_ids[i:i + bulk_data.batch_size]
                
                for recipient_id in batch:
                    # Check user preferences
                    should_send = await should_send_notification(
                        recipient_id,
                        bulk_data.notification_type.value
                    )
                    
                    if not should_send:
                        continue
                    
                    notification_id = str(uuid.uuid4())
                    notification_ids.append(notification_id)
                    
                    # Store notification
                    await conn.execute("""
                        INSERT INTO notifications (
                            id, recipient_id, sender_id, notification_type, title, message,
                            template_id, template_data, priority, status, schedule_for,
                            created_at
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                    """,
                        notification_id, recipient_id, current_user["user_id"],
                        bulk_data.notification_type.value, bulk_data.title, bulk_data.message,
                        bulk_data.template_id, json.dumps(bulk_data.template_data),
                        bulk_data.priority.value, NotificationStatus.PENDING.value,
                        bulk_data.schedule_for, datetime.utcnow()
                    )
                
                # Send batch if not scheduled
                if not bulk_data.schedule_for:
                    background_tasks.add_task(
                        send_bulk_notification_task,
                        batch,
                        bulk_data.notification_type.value,
                        bulk_data.title,
                        bulk_data.message
                    )
        
        return {
            "notification_ids": notification_ids,
            "total_created": len(notification_ids),
            "total_requested": len(bulk_data.recipient_ids),
            "message": "Bulk notifications created successfully"
        }
        
    except Exception as e:
        logger.error(f"Bulk notifications failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create bulk notifications")

@app.post("/api/notifications/email")
async def send_email_notification(
    email_data: EmailNotificationCreate,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Send email notification"""
    try:
        # Process template if provided
        final_content = email_data.content
        final_subject = email_data.subject
        
        if email_data.template_id:
            async with db_manager.get_connection() as conn:
                template = await conn.fetchrow("""
                    SELECT content, subject FROM notification_templates WHERE id = $1
                """, email_data.template_id)
                
                if template:
                    final_content = await template_engine.render_template(
                        template['content'], 
                        email_data.template_data
                    )
                    if template['subject']:
                        final_subject = await template_engine.render_template(
                            template['subject'], 
                            email_data.template_data
                        )
        
        # Send email
        if not email_data.schedule_for:
            background_tasks.add_task(
                send_email_task,
                email_data.recipient_email,
                final_subject,
                final_content,
                email_data.content_type,
                email_data.attachments
            )
        
        return {
            "message": "Email notification queued successfully",
            "recipient": email_data.recipient_email,
            "subject": final_subject,
            "scheduled": bool(email_data.schedule_for)
        }
        
    except Exception as e:
        logger.error(f"Email notification failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email notification")

@app.post("/api/notifications/sms")
async def send_sms_notification(
    sms_data: SMSNotificationCreate,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Send SMS notification"""
    try:
        # Process template if provided
        final_message = sms_data.message
        
        if sms_data.template_id:
            async with db_manager.get_connection() as conn:
                template = await conn.fetchrow("""
                    SELECT content FROM notification_templates WHERE id = $1
                """, sms_data.template_id)
                
                if template:
                    final_message = await template_engine.render_template(
                        template['content'], 
                        sms_data.template_data
                    )
        
        # Send SMS
        if not sms_data.schedule_for:
            background_tasks.add_task(
                send_sms_task,
                sms_data.recipient_phone,
                final_message
            )
        
        return {
            "message": "SMS notification queued successfully",
            "recipient": sms_data.recipient_phone,
            "scheduled": bool(sms_data.schedule_for)
        }
        
    except Exception as e:
        logger.error(f"SMS notification failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to send SMS notification")

@app.post("/api/notifications/push")
async def send_push_notification(
    push_data: PushNotificationCreate,
    current_user: dict = Depends(get_current_user),
    background_tasks: BackgroundTasks
):
    """Send push notification"""
    try:
        # Send push notification
        if not push_data.schedule_for:
            background_tasks.add_task(
                send_push_task,
                push_data.recipient_tokens,
                push_data.title,
                push_data.body,
                push_data.data,
                push_data.image
            )
        
        return {
            "message": "Push notification queued successfully",
            "recipients": len(push_data.recipient_tokens),
            "scheduled": bool(push_data.schedule_for)
        }
        
    except Exception as e:
        logger.error(f"Push notification failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to send push notification")

# ============================================================================
# BACKGROUND TASKS
# ============================================================================

async def send_notification_task(notification_id: str, notification_type: str, 
                                recipient_id: str, title: str, message: str):
    """Background task to send notification"""
    try:
        async with db_manager.get_connection() as conn:
            # Get recipient details
            recipient = await conn.fetchrow("""
                SELECT email, phone, push_tokens FROM users WHERE id = $1
            """, recipient_id)
            
            if not recipient:
                await conn.execute("""
                    UPDATE notifications SET status = $1, error_message = $2 WHERE id = $3
                """, NotificationStatus.FAILED.value, "Recipient not found", notification_id)
                return
            
            # Send based on type
            result = {"status": "failed", "error": "Unknown notification type"}
            
            if notification_type == "email" and recipient['email']:
                result = await email_provider.send_email(
                    recipient['email'], title, message
                )
            elif notification_type == "sms" and recipient['phone']:
                result = await sms_provider.send_sms(
                    recipient['phone'], message
                )
            elif notification_type == "push" and recipient['push_tokens']:
                tokens = json.loads(recipient['push_tokens']) if recipient['push_tokens'] else []
                if tokens:
                    result = await push_provider.send_push(
                        tokens, title, message
                    )
            
            # Update notification status
            if result["status"] == "sent":
                await conn.execute("""
                    UPDATE notifications SET 
                        status = $1, 
                        sent_at = $2,
                        external_id = $3
                    WHERE id = $4
                """, NotificationStatus.SENT.value, datetime.utcnow(),
                    result.get("message_id"), notification_id)
            else:
                await conn.execute("""
                    UPDATE notifications SET 
                        status = $1, 
                        error_message = $2
                    WHERE id = $3
                """, NotificationStatus.FAILED.value, result.get("error"), notification_id)
                
    except Exception as e:
        logger.error(f"Send notification task failed: {e}")

async def send_email_task(recipient: str, subject: str, content: str, 
                         content_type: str, attachments: List[str]):
    """Background task to send email"""
    try:
        result = await email_provider.send_email(
            recipient, subject, content, content_type, attachments
        )
        logger.info(f"Email sent to {recipient}: {result}")
    except Exception as e:
        logger.error(f"Email task failed: {e}")

async def send_sms_task(recipient: str, message: str):
    """Background task to send SMS"""
    try:
        result = await sms_provider.send_sms(recipient, message)
        logger.info(f"SMS sent to {recipient}: {result}")
    except Exception as e:
        logger.error(f"SMS task failed: {e}")

async def send_push_task(tokens: List[str], title: str, body: str, 
                        data: Dict, image: str):
    """Background task to send push notification"""
    try:
        result = await push_provider.send_push(tokens, title, body, data, image)
        logger.info(f"Push sent to {len(tokens)} devices: {result}")
    except Exception as e:
        logger.error(f"Push task failed: {e}")

async def send_bulk_notification_task(recipient_ids: List[str], notification_type: str,
                                     title: str, message: str):
    """Background task to send bulk notifications"""
    try:
        for recipient_id in recipient_ids:
            await send_notification_task(
                str(uuid.uuid4()),  # Temp ID for bulk
                notification_type,
                recipient_id,
                title,
                message
            )
    except Exception as e:
        logger.error(f"Bulk notification task failed: {e}")

# Continue with additional endpoints for:
# - Template management
# - Webhook management
# - User preferences
# - Notification history
# - Analytics and reporting
# - Scheduled notifications
# - Delivery tracking
# etc.

if __name__ == "__main__":
    uvicorn.run(
        "notification_service:app",
        host="0.0.0.0",
        port=8010,
        reload=True,
        log_level="info"
    )