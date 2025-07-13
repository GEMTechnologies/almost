#!/usr/bin/env python3
"""
Granada OS - User Dashboard Service
Personalized user dashboard and analytics
Port: 8025
"""

from fastapi import FastAPI, HTTPException, Depends, Security, BackgroundTasks, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
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

# ============================================================================
# CONFIGURATION & SETUP
# ============================================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")
security = HTTPBearer()

# ============================================================================
# ENUMS AND CONSTANTS
# ============================================================================

class WidgetType(str, Enum):
    PROGRESS_TRACKER = "progress_tracker"
    OPPORTUNITIES = "opportunities"
    DEADLINES = "deadlines"
    ANALYTICS = "analytics"
    RECENT_ACTIVITY = "recent_activity"
    TEAM_UPDATES = "team_updates"
    NOTIFICATIONS = "notifications"
    QUICK_ACTIONS = "quick_actions"

class DashboardLayout(str, Enum):
    GRID = "grid"
    LIST = "list"
    COMPACT = "compact"
    DETAILED = "detailed"

class TimeRange(str, Enum):
    LAST_7_DAYS = "last_7_days"
    LAST_30_DAYS = "last_30_days"
    LAST_90_DAYS = "last_90_days"
    LAST_YEAR = "last_year"
    ALL_TIME = "all_time"

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class DashboardConfig(BaseModel):
    user_id: str
    layout: DashboardLayout = DashboardLayout.GRID
    widgets: List[Dict[str, Any]] = Field(default=[])
    theme: str = Field(default="light")
    auto_refresh: bool = Field(default=True)
    refresh_interval: int = Field(default=300, ge=60, le=3600)  # seconds
    timezone: str = Field(default="UTC")
    language: str = Field(default="en")

class WidgetConfig(BaseModel):
    widget_type: WidgetType
    position: Dict[str, int] = Field(default={"x": 0, "y": 0, "width": 4, "height": 3})
    settings: Dict[str, Any] = Field(default={})
    is_visible: bool = Field(default=True)
    refresh_rate: Optional[int] = Field(None, ge=30)

class AnalyticsQuery(BaseModel):
    metrics: List[str]
    time_range: TimeRange = TimeRange.LAST_30_DAYS
    filters: Dict[str, Any] = Field(default={})
    group_by: Optional[str] = None
    organization_id: Optional[str] = None

# Response Models
class DashboardData(BaseModel):
    user_id: str
    config: DashboardConfig
    widgets_data: Dict[str, Any]
    last_updated: datetime
    user_stats: Dict[str, Any]

class MetricData(BaseModel):
    name: str
    value: Union[int, float, str]
    previous_value: Optional[Union[int, float]] = None
    change_percentage: Optional[float] = None
    trend: Optional[str] = None  # "up", "down", "stable"
    formatted_value: Optional[str] = None

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
# DASHBOARD DATA AGGREGATOR
# ============================================================================

class DashboardDataAggregator:
    def __init__(self):
        pass
    
    async def get_user_dashboard_data(self, user_id: str, config: DashboardConfig) -> Dict:
        """Aggregate all dashboard data for user"""
        widgets_data = {}
        
        for widget_config in config.widgets:
            widget_type = widget_config.get("widget_type")
            widget_settings = widget_config.get("settings", {})
            
            try:
                if widget_type == WidgetType.PROGRESS_TRACKER:
                    widgets_data["progress_tracker"] = await self._get_progress_data(user_id, widget_settings)
                elif widget_type == WidgetType.OPPORTUNITIES:
                    widgets_data["opportunities"] = await self._get_opportunities_data(user_id, widget_settings)
                elif widget_type == WidgetType.DEADLINES:
                    widgets_data["deadlines"] = await self._get_deadlines_data(user_id, widget_settings)
                elif widget_type == WidgetType.ANALYTICS:
                    widgets_data["analytics"] = await self._get_analytics_data(user_id, widget_settings)
                elif widget_type == WidgetType.RECENT_ACTIVITY:
                    widgets_data["recent_activity"] = await self._get_activity_data(user_id, widget_settings)
                elif widget_type == WidgetType.TEAM_UPDATES:
                    widgets_data["team_updates"] = await self._get_team_updates(user_id, widget_settings)
                elif widget_type == WidgetType.NOTIFICATIONS:
                    widgets_data["notifications"] = await self._get_notifications(user_id, widget_settings)
                elif widget_type == WidgetType.QUICK_ACTIONS:
                    widgets_data["quick_actions"] = await self._get_quick_actions(user_id, widget_settings)
                    
            except Exception as e:
                logger.error(f"Error loading widget {widget_type}: {e}")
                widgets_data[widget_type] = {"error": "Failed to load data"}
        
        return widgets_data
    
    async def _get_progress_data(self, user_id: str, settings: Dict) -> Dict:
        """Get user progress tracking data"""
        async with db_manager.get_connection() as conn:
            # Get active proposals
            proposals = await conn.fetch("""
                SELECT status, progress_percentage, deadline
                FROM proposals 
                WHERE created_by = $1 AND status != 'archived'
                ORDER BY created_at DESC
                LIMIT 10
            """, user_id)
            
            # Calculate progress metrics
            total_proposals = len(proposals)
            completed_proposals = sum(1 for p in proposals if p['status'] == 'completed')
            avg_progress = sum(p['progress_percentage'] for p in proposals) / max(total_proposals, 1)
            
            upcoming_deadlines = sum(
                1 for p in proposals 
                if p['deadline'] and p['deadline'] > datetime.utcnow() 
                and p['deadline'] <= datetime.utcnow() + timedelta(days=7)
            )
            
            return {
                "total_proposals": total_proposals,
                "completed_proposals": completed_proposals,
                "completion_rate": (completed_proposals / max(total_proposals, 1)) * 100,
                "average_progress": avg_progress,
                "upcoming_deadlines": upcoming_deadlines,
                "proposals": [dict(p) for p in proposals]
            }
    
    async def _get_opportunities_data(self, user_id: str, settings: Dict) -> Dict:
        """Get funding opportunities data"""
        async with db_manager.get_connection() as conn:
            limit = settings.get("limit", 5)
            
            # Get matched opportunities
            opportunities = await conn.fetch("""
                SELECT fo.id, fo.title, fo.funder_name, fo.amount, fo.application_deadline,
                       fo.sectors, om.match_score
                FROM funding_opportunities fo
                JOIN opportunity_matches om ON fo.id = om.opportunity_id
                WHERE om.user_id = $1 AND fo.status = 'open'
                ORDER BY om.match_score DESC
                LIMIT $2
            """, user_id, limit)
            
            # Get new opportunities (last 7 days)
            new_opportunities = await conn.fetchval("""
                SELECT COUNT(*) FROM funding_opportunities
                WHERE created_at >= NOW() - INTERVAL '7 days'
                AND status = 'open'
            """)
            
            return {
                "matched_opportunities": [dict(opp) for opp in opportunities],
                "new_opportunities_count": new_opportunities,
                "total_available": len(opportunities)
            }
    
    async def _get_deadlines_data(self, user_id: str, settings: Dict) -> Dict:
        """Get upcoming deadlines"""
        async with db_manager.get_connection() as conn:
            days_ahead = settings.get("days_ahead", 30)
            
            # Proposal deadlines
            proposal_deadlines = await conn.fetch("""
                SELECT id, title, deadline, status
                FROM proposals
                WHERE created_by = $1 
                AND deadline BETWEEN NOW() AND NOW() + INTERVAL '%s days'
                AND status NOT IN ('completed', 'submitted', 'archived')
                ORDER BY deadline ASC
            """ % days_ahead, user_id)
            
            # Opportunity deadlines
            opportunity_deadlines = await conn.fetch("""
                SELECT fo.id, fo.title, fo.funder_name, fo.application_deadline
                FROM funding_opportunities fo
                JOIN opportunity_matches om ON fo.id = om.opportunity_id
                WHERE om.user_id = $1
                AND fo.application_deadline BETWEEN NOW() AND NOW() + INTERVAL '%s days'
                AND fo.status = 'open'
                ORDER BY fo.application_deadline ASC
            """ % days_ahead, user_id)
            
            return {
                "proposal_deadlines": [dict(d) for d in proposal_deadlines],
                "opportunity_deadlines": [dict(d) for d in opportunity_deadlines],
                "total_upcoming": len(proposal_deadlines) + len(opportunity_deadlines)
            }
    
    async def _get_analytics_data(self, user_id: str, settings: Dict) -> Dict:
        """Get user analytics data"""
        async with db_manager.get_connection() as conn:
            time_range = settings.get("time_range", "last_30_days")
            
            # Convert time range to SQL interval
            intervals = {
                "last_7_days": "7 days",
                "last_30_days": "30 days",
                "last_90_days": "90 days",
                "last_year": "365 days"
            }
            interval = intervals.get(time_range, "30 days")
            
            # Get various metrics
            metrics = await conn.fetchrow(f"""
                SELECT 
                    COUNT(DISTINCT p.id) as proposals_created,
                    COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) as proposals_completed,
                    COUNT(DISTINCT om.opportunity_id) as opportunities_matched,
                    AVG(p.progress_percentage) as avg_progress,
                    SUM(p.requested_amount) as total_requested_funding
                FROM proposals p
                LEFT JOIN opportunity_matches om ON om.user_id = p.created_by
                WHERE p.created_by = $1
                AND p.created_at >= NOW() - INTERVAL '{interval}'
            """, user_id)
            
            return dict(metrics) if metrics else {}
    
    async def _get_activity_data(self, user_id: str, settings: Dict) -> Dict:
        """Get recent activity data"""
        async with db_manager.get_connection() as conn:
            limit = settings.get("limit", 10)
            
            # Get recent activities (simplified)
            activities = await conn.fetch("""
                SELECT 'proposal' as type, title as description, created_at as timestamp
                FROM proposals
                WHERE created_by = $1
                UNION ALL
                SELECT 'opportunity' as type, 
                       'New opportunity match: ' || fo.title as description,
                       om.created_at as timestamp
                FROM opportunity_matches om
                JOIN funding_opportunities fo ON om.opportunity_id = fo.id
                WHERE om.user_id = $1
                ORDER BY timestamp DESC
                LIMIT $2
            """, user_id, limit)
            
            return {
                "activities": [dict(activity) for activity in activities]
            }
    
    async def _get_team_updates(self, user_id: str, settings: Dict) -> Dict:
        """Get team updates for user's organizations"""
        async with db_manager.get_connection() as conn:
            # Get organizations user belongs to
            organizations = await conn.fetch("""
                SELECT o.id, o.name
                FROM organizations o
                JOIN organization_members om ON o.id = om.organization_id
                WHERE om.user_id = $1
            """, user_id)
            
            updates = []
            for org in organizations:
                # Get recent team activities
                team_activities = await conn.fetch("""
                    SELECT om.user_id, u.name, om.created_at, 'joined' as action
                    FROM organization_members om
                    JOIN users u ON om.user_id = u.id
                    WHERE om.organization_id = $1
                    AND om.created_at >= NOW() - INTERVAL '7 days'
                    ORDER BY om.created_at DESC
                    LIMIT 5
                """, org['id'])
                
                for activity in team_activities:
                    updates.append({
                        "organization": org['name'],
                        "user": activity['name'],
                        "action": activity['action'],
                        "timestamp": activity['created_at']
                    })
            
            return {"updates": updates}
    
    async def _get_notifications(self, user_id: str, settings: Dict) -> Dict:
        """Get user notifications"""
        async with db_manager.get_connection() as conn:
            limit = settings.get("limit", 5)
            
            notifications = await conn.fetch("""
                SELECT title, message, created_at, is_read
                FROM notifications
                WHERE recipient_id = $1
                ORDER BY created_at DESC
                LIMIT $2
            """, user_id, limit)
            
            unread_count = await conn.fetchval("""
                SELECT COUNT(*) FROM notifications
                WHERE recipient_id = $1 AND is_read = false
            """, user_id)
            
            return {
                "notifications": [dict(n) for n in notifications],
                "unread_count": unread_count
            }
    
    async def _get_quick_actions(self, user_id: str, settings: Dict) -> Dict:
        """Get personalized quick actions"""
        actions = [
            {
                "id": "create_proposal",
                "title": "Create New Proposal",
                "description": "Start writing a new funding proposal",
                "icon": "file-plus",
                "url": "/proposals/new",
                "priority": 1
            },
            {
                "id": "search_opportunities",
                "title": "Find Opportunities",
                "description": "Search for new funding opportunities",
                "icon": "search",
                "url": "/opportunities",
                "priority": 2
            },
            {
                "id": "update_profile",
                "title": "Update Organization Profile",
                "description": "Keep your organization information current",
                "icon": "building",
                "url": "/organization/profile",
                "priority": 3
            }
        ]
        
        return {"actions": actions}

dashboard_aggregator = DashboardDataAggregator()

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
    logger.info("User Dashboard Service started on port 8025")
    yield
    await db_manager.close_pool()

app = FastAPI(
    title="Granada OS - User Dashboard Service",
    description="Personalized user dashboard and analytics",
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
# DASHBOARD ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """User dashboard service health check"""
    return {
        "service": "Granada OS User Dashboard Service",
        "version": "1.0.0",
        "status": "operational",
        "features": [
            "Personalized dashboard",
            "Real-time widgets",
            "Progress tracking",
            "Analytics visualization",
            "Customizable layouts",
            "Activity monitoring"
        ],
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/dashboard", response_model=DashboardData)
async def get_user_dashboard(
    current_user: dict = Depends(get_current_user)
):
    """Get user's complete dashboard data"""
    try:
        async with db_manager.get_connection() as conn:
            # Get user's dashboard configuration
            config_row = await conn.fetchrow("""
                SELECT config FROM user_dashboard_configs 
                WHERE user_id = $1
            """, current_user["user_id"])
            
            if config_row:
                config_data = config_row['config']
                config = DashboardConfig(**config_data)
            else:
                # Create default configuration
                config = DashboardConfig(
                    user_id=current_user["user_id"],
                    widgets=[
                        {"widget_type": "progress_tracker", "position": {"x": 0, "y": 0, "width": 6, "height": 4}},
                        {"widget_type": "opportunities", "position": {"x": 6, "y": 0, "width": 6, "height": 4}},
                        {"widget_type": "deadlines", "position": {"x": 0, "y": 4, "width": 4, "height": 3}},
                        {"widget_type": "analytics", "position": {"x": 4, "y": 4, "width": 4, "height": 3}},
                        {"widget_type": "recent_activity", "position": {"x": 8, "y": 4, "width": 4, "height": 3}}
                    ]
                )
                
                # Save default configuration
                await conn.execute("""
                    INSERT INTO user_dashboard_configs (id, user_id, config, created_at)
                    VALUES ($1, $2, $3, $4)
                """, str(uuid.uuid4()), current_user["user_id"], 
                    config.dict(), datetime.utcnow())
            
            # Get widgets data
            widgets_data = await dashboard_aggregator.get_user_dashboard_data(
                current_user["user_id"], config
            )
            
            # Get user stats
            user_stats = await conn.fetchrow("""
                SELECT 
                    COUNT(DISTINCT p.id) as total_proposals,
                    COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) as completed_proposals,
                    COUNT(DISTINCT om.opportunity_id) as matched_opportunities,
                    MAX(p.created_at) as last_activity
                FROM proposals p
                LEFT JOIN opportunity_matches om ON om.user_id = p.created_by
                WHERE p.created_by = $1
            """, current_user["user_id"])
            
            return DashboardData(
                user_id=current_user["user_id"],
                config=config,
                widgets_data=widgets_data,
                last_updated=datetime.utcnow(),
                user_stats=dict(user_stats) if user_stats else {}
            )
            
    except Exception as e:
        logger.error(f"Get dashboard failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to load dashboard")

@app.put("/api/dashboard/config")
async def update_dashboard_config(
    config: DashboardConfig,
    current_user: dict = Depends(get_current_user)
):
    """Update user's dashboard configuration"""
    try:
        async with db_manager.get_connection() as conn:
            await conn.execute("""
                UPDATE user_dashboard_configs 
                SET config = $1, updated_at = $2
                WHERE user_id = $3
            """, config.dict(), datetime.utcnow(), current_user["user_id"])
            
            return {"message": "Dashboard configuration updated successfully"}
            
    except Exception as e:
        logger.error(f"Update dashboard config failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to update configuration")

@app.get("/api/dashboard/widget/{widget_type}")
async def get_widget_data(
    widget_type: WidgetType,
    current_user: dict = Depends(get_current_user),
    settings: str = None
):
    """Get data for a specific widget"""
    try:
        widget_settings = json.loads(settings) if settings else {}
        
        if widget_type == WidgetType.PROGRESS_TRACKER:
            data = await dashboard_aggregator._get_progress_data(current_user["user_id"], widget_settings)
        elif widget_type == WidgetType.OPPORTUNITIES:
            data = await dashboard_aggregator._get_opportunities_data(current_user["user_id"], widget_settings)
        elif widget_type == WidgetType.DEADLINES:
            data = await dashboard_aggregator._get_deadlines_data(current_user["user_id"], widget_settings)
        elif widget_type == WidgetType.ANALYTICS:
            data = await dashboard_aggregator._get_analytics_data(current_user["user_id"], widget_settings)
        elif widget_type == WidgetType.RECENT_ACTIVITY:
            data = await dashboard_aggregator._get_activity_data(current_user["user_id"], widget_settings)
        else:
            raise HTTPException(status_code=400, detail="Invalid widget type")
        
        return {
            "widget_type": widget_type,
            "data": data,
            "last_updated": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Get widget data failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to load widget data")

@app.post("/api/dashboard/analytics")
async def get_custom_analytics(
    query: AnalyticsQuery,
    current_user: dict = Depends(get_current_user)
):
    """Get custom analytics data"""
    try:
        async with db_manager.get_connection() as conn:
            # Build time range filter
            time_filters = {
                TimeRange.LAST_7_DAYS: "7 days",
                TimeRange.LAST_30_DAYS: "30 days", 
                TimeRange.LAST_90_DAYS: "90 days",
                TimeRange.LAST_YEAR: "365 days"
            }
            
            interval = time_filters.get(query.time_range, "30 days")
            
            metrics_data = {}
            
            for metric in query.metrics:
                if metric == "proposals_created":
                    value = await conn.fetchval(f"""
                        SELECT COUNT(*) FROM proposals
                        WHERE created_by = $1 
                        AND created_at >= NOW() - INTERVAL '{interval}'
                    """, current_user["user_id"])
                    
                elif metric == "completion_rate":
                    completed = await conn.fetchval(f"""
                        SELECT COUNT(*) FROM proposals
                        WHERE created_by = $1 AND status = 'completed'
                        AND created_at >= NOW() - INTERVAL '{interval}'
                    """, current_user["user_id"])
                    
                    total = await conn.fetchval(f"""
                        SELECT COUNT(*) FROM proposals
                        WHERE created_by = $1
                        AND created_at >= NOW() - INTERVAL '{interval}'
                    """, current_user["user_id"])
                    
                    value = (completed / max(total, 1)) * 100
                
                else:
                    value = 0  # Default for unknown metrics
                
                metrics_data[metric] = MetricData(
                    name=metric,
                    value=value,
                    formatted_value=f"{value:.1f}%" if "rate" in metric else str(value)
                )
            
            return {
                "metrics": metrics_data,
                "time_range": query.time_range,
                "generated_at": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        logger.error(f"Get custom analytics failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate analytics")

if __name__ == "__main__":
    uvicorn.run(
        "dashboard_service:app",
        host="0.0.0.0",
        port=8025,
        reload=True,
        log_level="info"
    )