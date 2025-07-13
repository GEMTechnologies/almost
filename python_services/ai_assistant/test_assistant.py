#!/usr/bin/env python3
"""
Test script for Granada OS AI Assistant Service
Demonstrates intelligent guidance and support capabilities
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, Any, List

class AIAssistantDemo:
    def __init__(self):
        self.conversations = {}
        self.conversation_count = 0
        self.available_roles = [
            "funding_advisor", "proposal_writer", "general_assistant", 
            "compliance_advisor", "strategic_planner"
        ]
    
    async def create_conversation(self, user_id: str, assistant_role: str) -> str:
        """Create new conversation"""
        conv_id = f"conv_{self.conversation_count + 1}"
        self.conversation_count += 1
        
        self.conversations[conv_id] = {
            "id": conv_id,
            "user_id": user_id,
            "assistant_role": assistant_role,
            "messages": [],
            "created_at": datetime.utcnow().isoformat()
        }
        
        print(f"✓ Created conversation {conv_id} with {assistant_role} assistant")
        return conv_id
    
    async def chat_with_assistant(self, conv_id: str, user_message: str) -> Dict:
        """Simulate AI assistant response"""
        conversation = self.conversations.get(conv_id)
        if not conversation:
            return {"error": "Conversation not found"}
        
        # Add user message
        conversation["messages"].append({
            "role": "user",
            "content": user_message,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Generate AI response based on assistant role
        assistant_role = conversation["assistant_role"]
        ai_response = await self._generate_response(assistant_role, user_message, conversation["messages"])
        
        # Add assistant response
        conversation["messages"].append({
            "role": "assistant",
            "content": ai_response["content"],
            "timestamp": datetime.utcnow().isoformat(),
            "confidence": ai_response["confidence"],
            "model": ai_response["model"]
        })
        
        print(f"💬 {assistant_role}: {ai_response['content'][:100]}...")
        
        return {
            "message": ai_response["content"],
            "conversation_id": conv_id,
            "response_time": ai_response["response_time"],
            "ai_model": ai_response["model"],
            "confidence": ai_response["confidence"],
            "suggestions": ai_response["suggestions"],
            "follow_up_questions": ai_response["follow_up_questions"]
        }
    
    async def _generate_response(self, assistant_role: str, user_message: str, history: List) -> Dict:
        """Generate contextual AI response"""
        responses = {
            "funding_advisor": {
                "finding funding": "I recommend starting with foundation databases like Foundation Directory Online, government grant portals like Grants.gov, and corporate social responsibility programs. Focus on funders whose mission aligns with your organization's work.",
                "grant writing": "Successful grant writing starts with thoroughly understanding the funder's priorities. Create a compelling narrative that connects your organization's mission to their goals, and always include measurable outcomes.",
                "donor relations": "Building strong donor relationships requires consistent communication, transparency in reporting, and demonstrating clear impact. Consider creating a donor stewardship plan with regular updates.",
                "default": "As your funding advisor, I can help you identify opportunities, develop funding strategies, and build sustainable revenue streams. What specific funding challenges are you facing?"
            },
            "proposal_writer": {
                "executive summary": "Your executive summary should be compelling and concise, highlighting your organization's credibility, the problem you're addressing, your solution, and the expected impact. Think of it as your elevator pitch.",
                "budget": "Create a detailed budget that's realistic and well-justified. Include personnel costs, program expenses, administrative overhead, and any matching funds. Make sure every line item supports your project goals.",
                "evaluation": "Develop both formative and summative evaluation plans. Include specific metrics, data collection methods, and timelines. Show how you'll measure both outputs and outcomes.",
                "default": "I specialize in crafting compelling proposals that win funding. I can help with narrative development, budget planning, and ensuring your proposal meets all funder requirements."
            },
            "compliance_advisor": {
                "regulations": "Staying compliant requires understanding applicable laws, maintaining proper documentation, implementing internal controls, and conducting regular audits. What specific compliance area concerns you?",
                "reporting": "Establish systematic reporting processes with clear deadlines, responsible parties, and quality controls. Use templates and checklists to ensure consistency.",
                "governance": "Strong governance includes diverse board composition, clear policies, regular meetings, and transparent decision-making processes. Consider conducting a governance assessment.",
                "default": "I help organizations maintain compliance with regulations and best practices. This includes governance, reporting, risk management, and audit preparation."
            },
            "strategic_planner": {
                "strategic planning": "Effective strategic planning involves stakeholder engagement, environmental scanning, SWOT analysis, goal setting, and implementation planning. Consider a 3-5 year horizon with annual reviews.",
                "sustainability": "Develop multiple revenue streams, build reserves, invest in capacity building, and create systems for continuous improvement. Sustainability requires both financial and operational resilience.",
                "growth": "Scale thoughtfully by strengthening your core operations first, then expanding services or geographic reach. Ensure your infrastructure can support growth.",
                "default": "I help organizations develop and implement strategic plans that ensure long-term sustainability and impact. What strategic challenges are you navigating?"
            },
            "general_assistant": {
                "default": "I'm here to provide comprehensive support across all aspects of organizational development and funding. Whether you need help with strategy, operations, or specific projects, I can guide you through the process."
            }
        }
        
        # Find best response based on keywords in user message
        role_responses = responses.get(assistant_role, responses["general_assistant"])
        
        best_response = None
        for keyword, response in role_responses.items():
            if keyword.lower() in user_message.lower():
                best_response = response
                break
        
        if not best_response:
            best_response = role_responses.get("default", role_responses[list(role_responses.keys())[0]])
        
        # Generate suggestions and follow-up questions
        suggestions = self._generate_suggestions(assistant_role, user_message)
        follow_ups = self._generate_follow_ups(assistant_role)
        
        return {
            "content": best_response,
            "confidence": 0.85,
            "model": "deepseek" if len(user_message) > 50 else "gemini",
            "response_time": 0.8,
            "suggestions": suggestions,
            "follow_up_questions": follow_ups
        }
    
    def _generate_suggestions(self, role: str, message: str) -> List[str]:
        """Generate actionable suggestions"""
        suggestion_map = {
            "funding_advisor": [
                "Research foundation databases for relevant opportunities",
                "Create a funding calendar with application deadlines",
                "Develop a case for support document"
            ],
            "proposal_writer": [
                "Review funder guidelines before writing",
                "Create an outline before drafting",
                "Include letters of support from partners"
            ],
            "compliance_advisor": [
                "Conduct regular compliance audits",
                "Maintain documentation systems",
                "Stay updated on regulatory changes"
            ],
            "strategic_planner": [
                "Engage stakeholders in planning process",
                "Set SMART goals with measurable outcomes",
                "Develop implementation timelines"
            ]
        }
        
        return suggestion_map.get(role, ["Consider breaking down your goals into smaller steps"])
    
    def _generate_follow_ups(self, role: str) -> List[str]:
        """Generate follow-up questions"""
        followup_map = {
            "funding_advisor": [
                "What is your organization's annual budget range?",
                "Which sectors does your work focus on?",
                "Have you applied for grants before?"
            ],
            "proposal_writer": [
                "What type of proposal are you working on?",
                "What's your target funding amount?",
                "When is your application deadline?"
            ],
            "compliance_advisor": [
                "Which regulatory frameworks apply to your organization?",
                "When was your last compliance review?",
                "Do you have current policies in place?"
            ],
            "strategic_planner": [
                "What are your organization's top priorities?",
                "What challenges are you currently facing?",
                "What does success look like for you?"
            ]
        }
        
        return followup_map.get(role, ["How can I help you achieve your goals?"])
    
    async def analyze_content(self, content: str, analysis_type: str) -> Dict:
        """Demonstrate content analysis capability"""
        analysis_results = {
            "proposal_review": {
                "analysis": "This proposal demonstrates strong alignment with funder priorities and includes compelling evidence of need. The methodology is sound, but the evaluation plan could be more detailed.",
                "key_insights": [
                    "Strong problem statement with supporting data",
                    "Clear project activities and timeline", 
                    "Budget appears realistic and well-justified",
                    "Evaluation section needs strengthening"
                ],
                "recommendations": [
                    "Add specific metrics for measuring success",
                    "Include more details on data collection methods",
                    "Consider adding a logic model"
                ],
                "confidence_score": 0.88
            },
            "funding_landscape": {
                "analysis": "The funding landscape for this sector shows strong growth in private foundation giving, with increasing interest in collaborative funding approaches and capacity building support.",
                "key_insights": [
                    "Foundation giving up 12% in this sector",
                    "Trend toward multi-year funding commitments",
                    "Growing emphasis on equity and inclusion"
                ],
                "recommendations": [
                    "Target foundations with proven interest in your cause area",
                    "Develop collaborative funding strategies",
                    "Emphasize equity outcomes in proposals"
                ],
                "confidence_score": 0.92
            }
        }
        
        result = analysis_results.get(analysis_type, {
            "analysis": f"Comprehensive analysis of {analysis_type} content completed.",
            "key_insights": ["Analysis methodology applied", "Patterns identified", "Trends assessed"],
            "recommendations": ["Review findings", "Implement suggestions", "Monitor progress"],
            "confidence_score": 0.75
        })
        
        print(f"📊 Analyzed {analysis_type}: {result['confidence_score']:.1%} confidence")
        return result
    
    def get_service_status(self) -> Dict:
        """Get AI assistant service status"""
        return {
            "service": "Granada OS AI Assistant Service",
            "version": "1.0.0",
            "status": "operational",
            "capabilities": [
                "Intelligent chat assistance",
                "Content analysis", 
                "Personalized recommendations",
                "Multi-model AI support",
                "Conversation management",
                "Context-aware responses"
            ],
            "assistant_roles": self.available_roles,
            "ai_models": {
                "deepseek": True,
                "gemini": True
            },
            "statistics": {
                "active_conversations": len(self.conversations),
                "total_messages": sum(len(conv["messages"]) for conv in self.conversations.values())
            },
            "timestamp": datetime.utcnow().isoformat()
        }

async def main():
    """Run AI assistant service demonstration"""
    print("🤖 Granada OS AI Assistant Service Demo")
    print("=" * 50)
    
    assistant = AIAssistantDemo()
    
    # Show service status
    status = assistant.get_service_status()
    print(f"Service Status: {status['status'].upper()}")
    print(f"Assistant Roles: {len(status['assistant_roles'])} available")
    print(f"AI Models: {', '.join([model for model, available in status['ai_models'].items() if available])}")
    print()
    
    # Demo different assistant roles
    print("1. Testing Different Assistant Roles...")
    
    # Funding Advisor Demo
    conv1 = await assistant.create_conversation("user_123", "funding_advisor")
    await assistant.chat_with_assistant(conv1, "I need help finding funding for our community health program")
    
    # Proposal Writer Demo  
    conv2 = await assistant.create_conversation("user_123", "proposal_writer")
    await assistant.chat_with_assistant(conv2, "How should I structure my executive summary?")
    
    # Strategic Planner Demo
    conv3 = await assistant.create_conversation("user_123", "strategic_planner")
    await assistant.chat_with_assistant(conv3, "We need help developing a 3-year strategic plan")
    print()
    
    # Content Analysis Demo
    print("2. Testing Content Analysis...")
    await assistant.analyze_content("Sample proposal content for health initiative...", "proposal_review")
    await assistant.analyze_content("Current funding trends in health sector...", "funding_landscape")
    print()
    
    # Multi-turn conversation demo
    print("3. Multi-turn Conversation Demo...")
    response = await assistant.chat_with_assistant(conv1, "What foundation databases do you recommend?")
    print(f"Suggestions: {', '.join(response['suggestions'][:2])}")
    print(f"Follow-ups: {response['follow_up_questions'][0]}")
    print()
    
    # Final statistics
    final_status = assistant.get_service_status()
    print("Final Statistics:")
    print(f"• Active Conversations: {final_status['statistics']['active_conversations']}")
    print(f"• Total Messages: {final_status['statistics']['total_messages']}")
    print(f"• Assistant Roles Used: {len([conv for conv in assistant.conversations.values()])}")
    print()
    
    print("✅ AI Assistant Service Demo Complete!")
    print("Ready to provide intelligent guidance across all funding activities.")

if __name__ == "__main__":
    asyncio.run(main())