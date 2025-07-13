"""
Granada OS Marketing Service
Advanced marketing automation and campaign management backend
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import requests
import sqlite3
import pandas as pd
from jinja2 import Template

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Campaign:
    id: str
    name: str
    type: str  # email, social, content, paid
    status: str  # draft, active, paused, completed
    reach: int
    engagement: float
    conversions: int
    budget: float
    spent: float
    start_date: str
    end_date: str
    target_audience: str
    platform: Optional[str] = None
    content: Optional[str] = None
    subject: Optional[str] = None
    cta: Optional[str] = None

@dataclass
class EmailTemplate:
    id: str
    name: str
    subject: str
    html_content: str
    text_content: str
    variables: List[str]
    category: str
    is_active: bool

@dataclass
class SocialPost:
    id: str
    content: str
    platforms: List[str]
    media_urls: List[str]
    scheduled_time: Optional[str]
    hashtags: List[str]
    status: str  # draft, scheduled, published

@dataclass
class LeadSegment:
    id: str
    name: str
    description: str
    criteria: Dict[str, Any]
    user_count: int

class MarketingService:
    def __init__(self):
        self.db_path = "marketing.db"
        self.init_database()
        
    def init_database(self):
        """Initialize marketing database tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Campaigns table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS campaigns (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                status TEXT NOT NULL,
                reach INTEGER DEFAULT 0,
                engagement REAL DEFAULT 0.0,
                conversions INTEGER DEFAULT 0,
                budget REAL DEFAULT 0.0,
                spent REAL DEFAULT 0.0,
                start_date TEXT,
                end_date TEXT,
                target_audience TEXT,
                platform TEXT,
                content TEXT,
                subject TEXT,
                cta TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Email templates table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS email_templates (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                subject TEXT NOT NULL,
                html_content TEXT,
                text_content TEXT,
                variables TEXT,
                category TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Social posts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS social_posts (
                id TEXT PRIMARY KEY,
                content TEXT NOT NULL,
                platforms TEXT,
                media_urls TEXT,
                scheduled_time TEXT,
                hashtags TEXT,
                status TEXT DEFAULT 'draft',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Lead segments table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS lead_segments (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                criteria TEXT,
                user_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Marketing metrics table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS marketing_metrics (
                id TEXT PRIMARY KEY,
                date TEXT NOT NULL,
                total_campaigns INTEGER DEFAULT 0,
                active_campaigns INTEGER DEFAULT 0,
                total_reach INTEGER DEFAULT 0,
                avg_engagement REAL DEFAULT 0.0,
                total_conversions INTEGER DEFAULT 0,
                total_budget REAL DEFAULT 0.0,
                total_spent REAL DEFAULT 0.0,
                email_open_rate REAL DEFAULT 0.0,
                email_click_rate REAL DEFAULT 0.0,
                social_engagement_rate REAL DEFAULT 0.0,
                website_traffic INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info("Marketing database initialized successfully")

    def create_campaign(self, campaign_data: Dict[str, Any]) -> Campaign:
        """Create a new marketing campaign"""
        try:
            campaign = Campaign(
                id=f"camp_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                name=campaign_data.get('name', ''),
                type=campaign_data.get('type', 'email'),
                status='draft',
                reach=0,
                engagement=0.0,
                conversions=0,
                budget=campaign_data.get('budget', 0.0),
                spent=0.0,
                start_date=campaign_data.get('start_date', ''),
                end_date=campaign_data.get('end_date', ''),
                target_audience=campaign_data.get('target_audience', ''),
                platform=campaign_data.get('platform'),
                content=campaign_data.get('content'),
                subject=campaign_data.get('subject'),
                cta=campaign_data.get('cta')
            )
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO campaigns (
                    id, name, type, status, budget, start_date, end_date,
                    target_audience, platform, content, subject, cta
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                campaign.id, campaign.name, campaign.type, campaign.status,
                campaign.budget, campaign.start_date, campaign.end_date,
                campaign.target_audience, campaign.platform, campaign.content,
                campaign.subject, campaign.cta
            ))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Created campaign: {campaign.id}")
            return campaign
            
        except Exception as e:
            logger.error(f"Error creating campaign: {e}")
            raise

    def get_campaigns(self) -> List[Campaign]:
        """Get all marketing campaigns"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT * FROM campaigns ORDER BY created_at DESC')
            rows = cursor.fetchall()
            conn.close()
            
            campaigns = []
            for row in rows:
                campaign = Campaign(
                    id=row[0], name=row[1], type=row[2], status=row[3],
                    reach=row[4], engagement=row[5], conversions=row[6],
                    budget=row[7], spent=row[8], start_date=row[9],
                    end_date=row[10], target_audience=row[11], platform=row[12],
                    content=row[13], subject=row[14], cta=row[15]
                )
                campaigns.append(campaign)
                
            return campaigns
            
        except Exception as e:
            logger.error(f"Error fetching campaigns: {e}")
            raise

    def update_campaign(self, campaign_id: str, updates: Dict[str, Any]) -> Campaign:
        """Update an existing campaign"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Build dynamic update query
            set_clauses = []
            values = []
            
            for key, value in updates.items():
                set_clauses.append(f"{key} = ?")
                values.append(value)
            
            values.append(campaign_id)
            
            query = f"UPDATE campaigns SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
            cursor.execute(query, values)
            
            conn.commit()
            conn.close()
            
            # Return updated campaign
            return self.get_campaign_by_id(campaign_id)
            
        except Exception as e:
            logger.error(f"Error updating campaign {campaign_id}: {e}")
            raise

    def get_campaign_by_id(self, campaign_id: str) -> Optional[Campaign]:
        """Get a campaign by ID"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT * FROM campaigns WHERE id = ?', (campaign_id,))
            row = cursor.fetchone()
            conn.close()
            
            if row:
                return Campaign(
                    id=row[0], name=row[1], type=row[2], status=row[3],
                    reach=row[4], engagement=row[5], conversions=row[6],
                    budget=row[7], spent=row[8], start_date=row[9],
                    end_date=row[10], target_audience=row[11], platform=row[12],
                    content=row[13], subject=row[14], cta=row[15]
                )
            return None
            
        except Exception as e:
            logger.error(f"Error fetching campaign {campaign_id}: {e}")
            raise

    def create_email_template(self, template_data: Dict[str, Any]) -> EmailTemplate:
        """Create a new email template"""
        try:
            template = EmailTemplate(
                id=f"tpl_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                name=template_data.get('name', ''),
                subject=template_data.get('subject', ''),
                html_content=template_data.get('html_content', ''),
                text_content=template_data.get('text_content', ''),
                variables=template_data.get('variables', []),
                category=template_data.get('category', 'general'),
                is_active=True
            )
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO email_templates (
                    id, name, subject, html_content, text_content,
                    variables, category, is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                template.id, template.name, template.subject,
                template.html_content, template.text_content,
                json.dumps(template.variables), template.category, template.is_active
            ))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Created email template: {template.id}")
            return template
            
        except Exception as e:
            logger.error(f"Error creating email template: {e}")
            raise

    def send_email_campaign(self, template_id: str, segment_id: str, 
                          subject: str, variables: Dict[str, str]) -> Dict[str, Any]:
        """Send an email campaign to a segment"""
        try:
            # Get template
            template = self.get_email_template_by_id(template_id)
            if not template:
                raise ValueError(f"Template {template_id} not found")
                
            # Get segment users
            segment = self.get_lead_segment_by_id(segment_id)
            if not segment:
                raise ValueError(f"Segment {segment_id} not found")
                
            # Get users matching segment criteria
            users = self.get_users_by_segment(segment.criteria)
            
            # Create campaign
            campaign_data = {
                'name': f"Email Campaign - {subject}",
                'type': 'email',
                'target_audience': segment.name,
                'subject': subject,
                'content': template.html_content
            }
            campaign = self.create_campaign(campaign_data)
            
            # Send emails (simulate for now)
            sent_count = 0
            for user in users:
                try:
                    # Render template with variables
                    html_template = Template(template.html_content)
                    rendered_html = html_template.render(**variables, user=user)
                    
                    # In production, integrate with email service (SendGrid, etc.)
                    self.send_email(user['email'], subject, rendered_html)
                    sent_count += 1
                    
                except Exception as e:
                    logger.error(f"Failed to send email to {user.get('email')}: {e}")
                    
            # Update campaign metrics
            self.update_campaign(campaign.id, {
                'status': 'active',
                'reach': sent_count
            })
            
            return {
                'campaign_id': campaign.id,
                'estimated_recipients': len(users),
                'sent_count': sent_count
            }
            
        except Exception as e:
            logger.error(f"Error sending email campaign: {e}")
            raise

    def send_email(self, to_email: str, subject: str, html_content: str):
        """Send individual email (placeholder - integrate with actual email service)"""
        # In production, integrate with SendGrid, AWS SES, etc.
        logger.info(f"Email sent to {to_email}: {subject}")
        
    def generate_marketing_content(self, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate marketing content using AI"""
        try:
            content_type = content_data.get('type', 'email')
            target_audience = content_data.get('target_audience', '')
            tone = content_data.get('tone', 'professional')
            objective = content_data.get('objective', '')
            key_points = content_data.get('key_points', [])
            platform = content_data.get('platform', '')
            
            # AI-powered content generation (integrate with your AI service)
            if content_type == 'email':
                return self.generate_email_content(target_audience, tone, objective, key_points)
            elif content_type == 'social':
                return self.generate_social_content(platform, tone, objective, key_points)
            elif content_type == 'blog':
                return self.generate_blog_content(target_audience, tone, objective, key_points)
            else:
                return self.generate_ad_content(platform, tone, objective, key_points)
                
        except Exception as e:
            logger.error(f"Error generating marketing content: {e}")
            raise

    def generate_email_content(self, audience: str, tone: str, objective: str, points: List[str]) -> Dict[str, Any]:
        """Generate email marketing content"""
        # Template-based content generation (replace with AI service)
        templates = {
            'professional': {
                'subject': f'Important Update for {audience}',
                'content': f'''
                <h2>Dear {audience} Community,</h2>
                
                <p>We hope this message finds you well. {objective}</p>
                
                <ul>
                ''' + ''.join([f'<li>{point}</li>' for point in points]) + '''
                </ul>
                
                <p>We appreciate your continued trust in Granada OS.</p>
                
                <p>Best regards,<br>The Granada OS Team</p>
                ''',
                'cta': 'Learn More'
            },
            'casual': {
                'subject': f'Hey {audience}! Something exciting...',
                'content': f'''
                <h2>Hi there! 👋</h2>
                
                <p>{objective}</p>
                
                <p>Here's what's new:</p>
                <ul>
                ''' + ''.join([f'<li>{point}</li>' for point in points]) + '''
                </ul>
                
                <p>Thanks for being awesome!</p>
                ''',
                'cta': 'Check It Out'
            }
        }
        
        template = templates.get(tone, templates['professional'])
        return template

    def generate_social_content(self, platform: str, tone: str, objective: str, points: List[str]) -> Dict[str, Any]:
        """Generate social media content"""
        content = f"{objective}\n\n"
        content += "\n".join([f"✅ {point}" for point in points])
        
        hashtags = ['#GranadaOS', '#FundingOpportunities', '#NGO', '#Grants']
        if 'student' in objective.lower():
            hashtags.extend(['#StudentFunding', '#Scholarships'])
        if 'proposal' in objective.lower():
            hashtags.extend(['#ProposalWriting', '#GrantWriting'])
            
        return {
            'content': content,
            'hashtags': hashtags,
            'cta': 'Visit our platform'
        }

    def get_marketing_metrics(self, timeframe: str = '30d') -> Dict[str, Any]:
        """Get comprehensive marketing metrics"""
        try:
            # Calculate date range
            days = int(timeframe.replace('d', ''))
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            
            conn = sqlite3.connect(self.db_path)
            
            # Get campaign metrics
            campaigns_df = pd.read_sql_query('''
                SELECT * FROM campaigns 
                WHERE created_at >= ? AND created_at <= ?
            ''', conn, params=[start_date.isoformat(), end_date.isoformat()])
            
            total_campaigns = len(campaigns_df)
            active_campaigns = len(campaigns_df[campaigns_df['status'] == 'active'])
            total_reach = campaigns_df['reach'].sum()
            avg_engagement = campaigns_df['engagement'].mean()
            total_conversions = campaigns_df['conversions'].sum()
            total_budget = campaigns_df['budget'].sum()
            total_spent = campaigns_df['spent'].sum()
            
            roi = (total_conversions * 100 / total_spent) if total_spent > 0 else 0
            
            conn.close()
            
            return {
                'total_campaigns': int(total_campaigns),
                'active_campaigns': int(active_campaigns),
                'total_reach': int(total_reach),
                'avg_engagement': float(avg_engagement) if not pd.isna(avg_engagement) else 0.0,
                'total_conversions': int(total_conversions),
                'total_budget': float(total_budget),
                'total_spent': float(total_spent),
                'roi': float(roi),
                'email_open_rate': 24.5,  # Mock data
                'email_click_rate': 3.2,   # Mock data
                'social_engagement_rate': 8.7,  # Mock data
                'website_traffic': 15420   # Mock data
            }
            
        except Exception as e:
            logger.error(f"Error getting marketing metrics: {e}")
            raise

    def get_email_template_by_id(self, template_id: str) -> Optional[EmailTemplate]:
        """Get email template by ID"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT * FROM email_templates WHERE id = ?', (template_id,))
            row = cursor.fetchone()
            conn.close()
            
            if row:
                return EmailTemplate(
                    id=row[0], name=row[1], subject=row[2],
                    html_content=row[3], text_content=row[4],
                    variables=json.loads(row[5]) if row[5] else [],
                    category=row[6], is_active=bool(row[7])
                )
            return None
            
        except Exception as e:
            logger.error(f"Error fetching email template {template_id}: {e}")
            raise

    def get_lead_segment_by_id(self, segment_id: str) -> Optional[LeadSegment]:
        """Get lead segment by ID"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT * FROM lead_segments WHERE id = ?', (segment_id,))
            row = cursor.fetchone()
            conn.close()
            
            if row:
                return LeadSegment(
                    id=row[0], name=row[1], description=row[2],
                    criteria=json.loads(row[3]) if row[3] else {},
                    user_count=row[4]
                )
            return None
            
        except Exception as e:
            logger.error(f"Error fetching lead segment {segment_id}: {e}")
            raise

    def get_users_by_segment(self, criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get users matching segment criteria (mock implementation)"""
        # In production, query your user database with the criteria
        mock_users = [
            {'id': '1', 'email': 'user1@example.com', 'name': 'User 1', 'type': 'ngo'},
            {'id': '2', 'email': 'user2@example.com', 'name': 'User 2', 'type': 'student'},
            {'id': '3', 'email': 'user3@example.com', 'name': 'User 3', 'type': 'business'},
        ]
        return mock_users

# Global service instance
marketing_service = MarketingService()