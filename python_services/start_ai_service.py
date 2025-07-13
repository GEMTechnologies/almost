#!/usr/bin/env python3
"""
Start the Python AI Proposal Writer Service with proper environment setup
"""
import os
import sys
import subprocess

def start_ai_service():
    """Start the AI service with DeepSeek API key"""
    print("🐍 Starting Python AI Proposal Writer Service...")
    
    # Set environment variables
    os.environ['DEEPSEEK_API_KEY'] = 'sk-a56c233e8fa64e0bb77a264fac2dd68a'
    
    # Verify environment
    if not os.getenv('DEEPSEEK_API_KEY'):
        print("❌ DEEPSEEK_API_KEY not set!")
        sys.exit(1)
    
    print(f"✅ DeepSeek API Key configured: {os.getenv('DEEPSEEK_API_KEY')[:10]}...{os.getenv('DEEPSEEK_API_KEY')[-4:]}")
    
    # Start the service
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "ai_proposal_writer:app", 
            "--host", "0.0.0.0", 
            "--port", "8030",
            "--reload"
        ], cwd="/home/runner/workspace/python_services")
    except KeyboardInterrupt:
        print("\n🛑 AI Service stopped")

if __name__ == "__main__":
    start_ai_service()