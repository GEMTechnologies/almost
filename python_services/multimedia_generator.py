"""
Granada OS - Advanced Multimedia Content Generator Service
Creates professional charts, illustrations, infographics, and visual elements for proposals
Port: 8040
"""

import asyncio
import json
import os
import base64
from io import BytesIO
from datetime import datetime
from typing import Dict, List, Optional, Any
import logging

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Advanced visualization libraries
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Circle, Rectangle, Polygon
import seaborn as sns
import numpy as np
import pandas as pd
from PIL import Image, ImageDraw, ImageFont
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import plotly.io as pio

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure matplotlib for headless operation
plt.switch_backend('Agg')
sns.set_style("whitegrid")
plt.style.use('seaborn-v0_8')

class MultimediaRequest(BaseModel):
    content_type: str  # 'chart', 'infographic', 'illustration', 'diagram', 'table'
    data: Dict[str, Any]
    style_preferences: Dict[str, str] = {}
    proposal_context: Dict[str, Any] = {}
    organization_branding: Dict[str, str] = {}

class MultimediaResponse(BaseModel):
    success: bool
    content_type: str
    image_data: str  # base64 encoded
    html_embed: Optional[str] = None
    description: str
    metadata: Dict[str, Any] = {}

class AdvancedMultimediaGenerator:
    """Advanced multimedia content generator with professional styling"""
    
    def __init__(self):
        self.setup_styling()
        
    def setup_styling(self):
        """Setup professional color schemes and fonts"""
        self.color_schemes = {
            'professional': ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#3F7D20'],
            'healthcare': ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
            'education': ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'],
            'agriculture': ['#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF5722'],
            'technology': ['#3F51B5', '#2196F3', '#00BCD4', '#009688', '#4CAF50'],
            'default': ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
        }
        
        self.font_sizes = {
            'title': 16,
            'subtitle': 14,
            'body': 12,
            'caption': 10
        }

    async def generate_professional_chart(self, request: MultimediaRequest) -> MultimediaResponse:
        """Generate professional charts with advanced styling"""
        try:
            data = request.data
            chart_type = data.get('chart_type', 'bar')
            title = data.get('title', 'Chart')
            
            # Get color scheme based on sector
            sector = request.proposal_context.get('sector', 'default').lower()
            colors = self.color_schemes.get(sector, self.color_schemes['default'])
            
            fig, ax = plt.subplots(figsize=(12, 8))
            
            if chart_type == 'budget_breakdown':
                return await self._create_budget_chart(data, colors, fig, ax)
            elif chart_type == 'timeline':
                return await self._create_timeline_chart(data, colors, fig, ax)
            elif chart_type == 'impact_metrics':
                return await self._create_impact_metrics(data, colors, fig, ax)
            elif chart_type == 'comparison':
                return await self._create_comparison_chart(data, colors, fig, ax)
            elif chart_type == 'progress_tracker':
                return await self._create_progress_tracker(data, colors, fig, ax)
            else:
                return await self._create_default_chart(data, colors, fig, ax)
                
        except Exception as e:
            logger.error(f"Chart generation failed: {e}")
            raise HTTPException(status_code=500, detail=f"Chart generation failed: {str(e)}")

    async def _create_budget_chart(self, data: Dict, colors: List[str], fig, ax) -> MultimediaResponse:
        """Create professional budget breakdown chart"""
        categories = data.get('categories', ['Personnel', 'Equipment', 'Operations', 'Overhead'])
        amounts = data.get('amounts', [45000, 25000, 20000, 10000])
        
        # Create pie chart with professional styling
        wedges, texts, autotexts = ax.pie(amounts, labels=categories, colors=colors,
                                         autopct='%1.1f%%', startangle=90,
                                         wedgeprops=dict(width=0.5, edgecolor='white', linewidth=2))
        
        # Style the text
        for autotext in autotexts:
            autotext.set_color('white')
            autotext.set_fontweight('bold')
            autotext.set_fontsize(12)
        
        ax.set_title('Project Budget Breakdown', fontsize=16, fontweight='bold', pad=20)
        
        # Add total budget annotation
        total = sum(amounts)
        ax.text(0, 0, f'Total\n${total:,}', ha='center', va='center', 
                fontsize=14, fontweight='bold', 
                bbox=dict(boxstyle="round,pad=0.3", facecolor='lightgray', alpha=0.7))
        
        plt.tight_layout()
        
        # Convert to base64
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight', 
                   facecolor='white', edgecolor='none')
        buffer.seek(0)
        image_data = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        
        return MultimediaResponse(
            success=True,
            content_type="budget_chart",
            image_data=image_data,
            description=f"Professional budget breakdown showing {len(categories)} categories totaling ${total:,}",
            metadata={"total_budget": total, "categories": len(categories)}
        )

    async def _create_timeline_chart(self, data: Dict, colors: List[str], fig, ax) -> MultimediaResponse:
        """Create project timeline chart"""
        milestones = data.get('milestones', [
            {'name': 'Project Start', 'date': '2024-01-01', 'duration': 0},
            {'name': 'Phase 1 Complete', 'date': '2024-03-01', 'duration': 60},
            {'name': 'Mid-term Review', 'date': '2024-06-01', 'duration': 90},
            {'name': 'Phase 2 Complete', 'date': '2024-09-01', 'duration': 120},
            {'name': 'Project End', 'date': '2024-12-01', 'duration': 150}
        ])
        
        # Create timeline
        y_pos = range(len(milestones))
        durations = [m['duration'] for m in milestones]
        names = [m['name'] for m in milestones]
        
        bars = ax.barh(y_pos, durations, color=colors[:len(milestones)], alpha=0.8)
        
        # Add milestone markers
        for i, bar in enumerate(bars):
            width = bar.get_width()
            ax.text(width + 2, bar.get_y() + bar.get_height()/2, 
                   f'{width} days', ha='left', va='center', fontweight='bold')
        
        ax.set_yticks(y_pos)
        ax.set_yticklabels(names)
        ax.set_xlabel('Days from Project Start', fontweight='bold')
        ax.set_title('Project Timeline & Milestones', fontsize=16, fontweight='bold', pad=20)
        
        plt.tight_layout()
        
        # Convert to base64
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        buffer.seek(0)
        image_data = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        
        return MultimediaResponse(
            success=True,
            content_type="timeline_chart",
            image_data=image_data,
            description=f"Project timeline with {len(milestones)} key milestones",
            metadata={"milestones": len(milestones), "total_duration": max(durations)}
        )

    async def _create_impact_metrics(self, data: Dict, colors: List[str], fig, ax) -> MultimediaResponse:
        """Create impact metrics visualization"""
        metrics = data.get('metrics', [
            {'name': 'Beneficiaries Reached', 'current': 8500, 'target': 10000},
            {'name': 'Communities Served', 'current': 45, 'target': 50},
            {'name': 'Programs Launched', 'current': 12, 'target': 15},
            {'name': 'Success Rate', 'current': 87, 'target': 90}
        ])
        
        x = range(len(metrics))
        current_values = [m['current'] for m in metrics]
        target_values = [m['target'] for m in metrics]
        labels = [m['name'] for m in metrics]
        
        width = 0.35
        x_pos = np.arange(len(labels))
        
        bars1 = ax.bar(x_pos - width/2, current_values, width, label='Current', 
                      color=colors[0], alpha=0.8)
        bars2 = ax.bar(x_pos + width/2, target_values, width, label='Target', 
                      color=colors[1], alpha=0.8)
        
        # Add value labels on bars
        for bar in bars1:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + height*0.01,
                   f'{int(height):,}', ha='center', va='bottom', fontweight='bold')
        
        for bar in bars2:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + height*0.01,
                   f'{int(height):,}', ha='center', va='bottom', fontweight='bold')
        
        ax.set_xlabel('Impact Metrics', fontweight='bold')
        ax.set_ylabel('Values', fontweight='bold')
        ax.set_title('Project Impact Metrics: Current vs Target', fontsize=16, fontweight='bold', pad=20)
        ax.set_xticks(x_pos)
        ax.set_xticklabels(labels, rotation=45, ha='right')
        ax.legend()
        
        plt.tight_layout()
        
        # Convert to base64
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        buffer.seek(0)
        image_data = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        
        return MultimediaResponse(
            success=True,
            content_type="impact_metrics",
            image_data=image_data,
            description=f"Impact metrics comparison showing progress toward {len(metrics)} key targets",
            metadata={"metrics_count": len(metrics)}
        )

    async def generate_professional_infographic(self, request: MultimediaRequest) -> MultimediaResponse:
        """Generate professional infographic elements"""
        try:
            data = request.data
            infographic_type = data.get('type', 'process_flow')
            
            if infographic_type == 'process_flow':
                return await self._create_process_flow(data, request)
            elif infographic_type == 'statistics_display':
                return await self._create_statistics_display(data, request)
            elif infographic_type == 'organizational_chart':
                return await self._create_org_chart(data, request)
            else:
                return await self._create_default_infographic(data, request)
                
        except Exception as e:
            logger.error(f"Infographic generation failed: {e}")
            raise HTTPException(status_code=500, detail=f"Infographic generation failed: {str(e)}")

    async def _create_process_flow(self, data: Dict, request: MultimediaRequest) -> MultimediaResponse:
        """Create process flow diagram"""
        steps = data.get('steps', [
            'Needs Assessment', 'Program Design', 'Implementation', 
            'Monitoring', 'Evaluation', 'Sustainability'
        ])
        
        fig, ax = plt.subplots(figsize=(14, 8))
        
        # Get colors
        sector = request.proposal_context.get('sector', 'default').lower()
        colors = self.color_schemes.get(sector, self.color_schemes['default'])
        
        # Create flow diagram
        step_width = 1.5
        step_height = 0.8
        spacing = 0.5
        
        total_width = len(steps) * (step_width + spacing) - spacing
        start_x = -total_width / 2
        
        for i, step in enumerate(steps):
            x = start_x + i * (step_width + spacing)
            y = 0
            
            # Create rounded rectangle
            box = FancyBboxPatch((x, y), step_width, step_height,
                               boxstyle="round,pad=0.1",
                               facecolor=colors[i % len(colors)],
                               edgecolor='darkgray',
                               linewidth=2)
            ax.add_patch(box)
            
            # Add text
            ax.text(x + step_width/2, y + step_height/2, step,
                   ha='center', va='center', fontweight='bold',
                   fontsize=10, color='white', wrap=True)
            
            # Add arrow to next step
            if i < len(steps) - 1:
                arrow_start_x = x + step_width + 0.05
                arrow_end_x = x + step_width + spacing - 0.05
                ax.annotate('', xy=(arrow_end_x, y + step_height/2),
                           xytext=(arrow_start_x, y + step_height/2),
                           arrowprops=dict(arrowstyle='->', lw=3, color='darkgray'))
        
        ax.set_xlim(start_x - 0.5, start_x + total_width + 0.5)
        ax.set_ylim(-0.5, step_height + 0.5)
        ax.set_aspect('equal')
        ax.axis('off')
        ax.set_title('Project Implementation Process Flow', 
                    fontsize=16, fontweight='bold', pad=20)
        
        plt.tight_layout()
        
        # Convert to base64
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight',
                   facecolor='white', edgecolor='none')
        buffer.seek(0)
        image_data = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        
        return MultimediaResponse(
            success=True,
            content_type="process_flow",
            image_data=image_data,
            description=f"Process flow diagram with {len(steps)} implementation steps",
            metadata={"steps_count": len(steps)}
        )

    async def generate_professional_table(self, request: MultimediaRequest) -> MultimediaResponse:
        """Generate professional HTML tables with styling"""
        try:
            data = request.data
            headers = data.get('headers', ['Item', 'Description', 'Amount'])
            rows = data.get('rows', [])
            title = data.get('title', 'Project Details')
            
            # Generate HTML table with professional styling
            html_content = f"""
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px;">
                <h3 style="color: #2E86AB; border-bottom: 3px solid #2E86AB; padding-bottom: 10px; margin-bottom: 20px;">
                    {title}
                </h3>
                <table style="width: 100%; border-collapse: collapse; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <thead>
                        <tr style="background: linear-gradient(135deg, #2E86AB, #A23B72);">
                            {''.join([f'<th style="padding: 15px; text-align: left; color: white; font-weight: bold; border: 1px solid #ddd;">{header}</th>' for header in headers])}
                        </tr>
                    </thead>
                    <tbody>
            """
            
            for i, row in enumerate(rows):
                bg_color = "#f8f9fa" if i % 2 == 0 else "white"
                html_content += f'<tr style="background-color: {bg_color}; transition: background-color 0.3s;">'
                for cell in row:
                    html_content += f'<td style="padding: 12px; border: 1px solid #ddd; color: #333;">{cell}</td>'
                html_content += '</tr>'
            
            html_content += """
                    </tbody>
                </table>
            </div>
            """
            
            return MultimediaResponse(
                success=True,
                content_type="professional_table",
                image_data="",
                html_embed=html_content,
                description=f"Professional table with {len(headers)} columns and {len(rows)} rows",
                metadata={"columns": len(headers), "rows": len(rows)}
            )
            
        except Exception as e:
            logger.error(f"Table generation failed: {e}")
            raise HTTPException(status_code=500, detail=f"Table generation failed: {str(e)}")

# Initialize FastAPI app
app = FastAPI(title="Granada OS - Multimedia Generator Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize multimedia generator
multimedia_generator = AdvancedMultimediaGenerator()

@app.get("/")
async def root():
    """Multimedia generator service health check"""
    return {
        "service": "Granada OS Multimedia Generator",
        "status": "operational",
        "version": "1.0.0",
        "capabilities": [
            "Professional Charts", 
            "Infographics", 
            "Process Diagrams",
            "Impact Visualizations",
            "Professional Tables",
            "Timeline Charts"
        ],
        "timestamp": datetime.now().isoformat()
    }

@app.post("/generate/chart")
async def generate_chart(request: MultimediaRequest):
    """Generate professional charts"""
    return await multimedia_generator.generate_professional_chart(request)

@app.post("/generate/infographic")
async def generate_infographic(request: MultimediaRequest):
    """Generate professional infographics"""
    return await multimedia_generator.generate_professional_infographic(request)

@app.post("/generate/table")
async def generate_table(request: MultimediaRequest):
    """Generate professional tables"""
    return await multimedia_generator.generate_professional_table(request)

@app.get("/health")
async def health_check():
    """Service health check"""
    return {"status": "healthy", "service": "multimedia_generator", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    uvicorn.run(
        "multimedia_generator:app",
        host="0.0.0.0",
        port=8040,
        reload=True,
        log_level="info"
    )