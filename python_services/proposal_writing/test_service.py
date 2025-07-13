#!/usr/bin/env python3
"""
Test script for Granada OS Proposal Writing Service
Demonstrates core functionality without full database setup
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, Any

class ProposalDemo:
    def __init__(self):
        self.proposals = []
        self.templates = {}
        self.ai_models = ["deepseek", "gemini"]
    
    async def create_proposal(self, proposal_data: Dict[str, Any]) -> Dict:
        """Demo proposal creation"""
        proposal_id = f"prop_{len(self.proposals) + 1}"
        
        proposal = {
            "id": proposal_id,
            "title": proposal_data.get("title", "New Funding Proposal"),
            "organization": proposal_data.get("organization", "Sample Organization"),
            "funding_opportunity": proposal_data.get("funding_opportunity", "Sample Grant"),
            "requested_amount": proposal_data.get("requested_amount", 50000),
            "status": "draft",
            "progress_percentage": 0,
            "sections": [],
            "created_at": datetime.utcnow().isoformat(),
            "last_modified": datetime.utcnow().isoformat()
        }
        
        self.proposals.append(proposal)
        print(f"✓ Created proposal: {proposal['title']} (ID: {proposal_id})")
        return proposal
    
    async def generate_section_ai(self, proposal_id: str, section_type: str, ai_model: str = "deepseek") -> Dict:
        """Demo AI section generation"""
        sections_content = {
            "executive_summary": {
                "title": "Executive Summary",
                "content": f"""
                Our organization is requesting ${50000:,} to implement a transformative project 
                that will directly benefit underserved communities. This initiative aligns perfectly 
                with the funder's mission and demonstrates measurable impact through evidence-based 
                approaches.
                
                Key Highlights:
                • Proven track record of successful project delivery
                • Strong community partnerships and stakeholder engagement
                • Sustainable funding model with long-term impact
                • Comprehensive evaluation and monitoring framework
                """,
                "word_count": 95,
                "ai_confidence": 0.92
            },
            "project_description": {
                "title": "Project Description",
                "content": f"""
                Project Overview:
                This innovative initiative addresses critical gaps in community services through 
                a comprehensive, evidence-based approach. Our project will establish sustainable 
                programs that create lasting positive change.
                
                Implementation Strategy:
                1. Community needs assessment and stakeholder engagement
                2. Program design and pilot implementation
                3. Full-scale rollout with continuous monitoring
                4. Impact evaluation and knowledge sharing
                
                Target Beneficiaries:
                • Primary: 500 direct beneficiaries
                • Secondary: 2,000 indirect community members
                • Focus on underrepresented populations
                """,
                "word_count": 125,
                "ai_confidence": 0.89
            },
            "budget": {
                "title": "Budget Summary",
                "content": f"""
                Total Project Budget: ${50000:,}
                
                Budget Breakdown:
                • Personnel (60%): ${30000:,}
                • Program Activities (25%): ${12500:,}
                • Equipment & Supplies (10%): ${5000:,}
                • Administrative Costs (5%): ${2500:,}
                
                Cost-Effectiveness:
                Cost per direct beneficiary: ${50000/500:,.2f}
                This represents exceptional value compared to similar programs.
                """,
                "word_count": 75,
                "ai_confidence": 0.95
            }
        }
        
        section_data = sections_content.get(section_type, {
            "title": section_type.replace("_", " ").title(),
            "content": f"AI-generated content for {section_type} section.",
            "word_count": 25,
            "ai_confidence": 0.75
        })
        
        # Find and update proposal
        for proposal in self.proposals:
            if proposal["id"] == proposal_id:
                proposal["sections"].append({
                    "section_type": section_type,
                    **section_data,
                    "ai_model": ai_model,
                    "generated_at": datetime.utcnow().isoformat()
                })
                proposal["progress_percentage"] = min(100, len(proposal["sections"]) * 25)
                proposal["last_modified"] = datetime.utcnow().isoformat()
                break
        
        print(f"✓ Generated {section_type} section using {ai_model} (confidence: {section_data['ai_confidence']:.1%})")
        return section_data
    
    async def export_proposal(self, proposal_id: str, format_type: str = "markdown") -> str:
        """Demo proposal export"""
        proposal = next((p for p in self.proposals if p["id"] == proposal_id), None)
        
        if not proposal:
            return "Proposal not found"
        
        if format_type == "markdown":
            content = f"""# {proposal['title']}

**Organization:** {proposal['organization']}
**Funding Opportunity:** {proposal['funding_opportunity']}
**Requested Amount:** ${proposal['requested_amount']:,}
**Status:** {proposal['status'].title()}
**Progress:** {proposal['progress_percentage']}%

---

"""
            for section in proposal['sections']:
                content += f"## {section['title']}\n\n{section['content']}\n\n"
                content += f"*Generated by {section['ai_model']} on {section['generated_at'][:10]}*\n\n---\n\n"
        
        print(f"✓ Exported proposal as {format_type.upper()} ({len(content)} characters)")
        return content
    
    def get_service_status(self) -> Dict:
        """Get service status and capabilities"""
        return {
            "service": "Granada OS Proposal Writing Service",
            "version": "1.0.0",
            "status": "operational",
            "features": [
                "AI-powered content generation",
                "Multi-format export (PDF, DOCX, Markdown)",
                "Collaborative editing",
                "Template management",
                "Progress tracking",
                "Review and approval workflow"
            ],
            "ai_models": {
                "deepseek": True,
                "gemini": True
            },
            "statistics": {
                "total_proposals": len(self.proposals),
                "total_sections": sum(len(p["sections"]) for p in self.proposals)
            },
            "timestamp": datetime.utcnow().isoformat()
        }

async def main():
    """Run proposal service demonstration"""
    print("🚀 Granada OS Proposal Writing Service Demo")
    print("=" * 50)
    
    demo = ProposalDemo()
    
    # Show service status
    status = demo.get_service_status()
    print(f"Service Status: {status['status'].upper()}")
    print(f"AI Models Available: {', '.join(status['ai_models'].keys())}")
    print(f"Features: {len(status['features'])} available")
    print()
    
    # Create a sample proposal
    print("1. Creating New Proposal...")
    proposal_data = {
        "title": "Community Health Initiative Grant Proposal",
        "organization": "Health for All Foundation",
        "funding_opportunity": "Community Health Innovation Fund",
        "requested_amount": 75000
    }
    
    proposal = await demo.create_proposal(proposal_data)
    print()
    
    # Generate AI sections
    print("2. Generating AI Content...")
    sections = ["executive_summary", "project_description", "budget"]
    
    for section in sections:
        await demo.generate_section_ai(proposal["id"], section, "deepseek")
    print()
    
    # Export proposal
    print("3. Exporting Proposal...")
    exported_content = await demo.export_proposal(proposal["id"], "markdown")
    
    # Show final stats
    final_status = demo.get_service_status()
    print(f"Final Statistics:")
    print(f"• Total Proposals: {final_status['statistics']['total_proposals']}")
    print(f"• Total Sections: {final_status['statistics']['total_sections']}")
    print(f"• Proposal Progress: {proposal['progress_percentage']}%")
    print()
    
    print("✅ Proposal Writing Service Demo Complete!")
    print()
    print("Preview of Generated Proposal:")
    print("-" * 30)
    print(exported_content[:500] + "..." if len(exported_content) > 500 else exported_content)

if __name__ == "__main__":
    asyncio.run(main())