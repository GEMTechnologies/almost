#!/usr/bin/env python3
"""
Start Python AI Service with proper environment setup
"""
import os
import sys
import subprocess
import time

def setup_environment():
    """Set up environment variables"""
    os.environ['DEEPSEEK_API_KEY'] = 'sk-a56c233e8fa64e0bb77a264fac2dd68a'
    
    # Check if DATABASE_URL exists, if not set a fallback
    if not os.getenv('DATABASE_URL'):
        print("⚠️ DATABASE_URL not found, service will run without database features")
    
    print(f"✅ DeepSeek API Key: {os.environ['DEEPSEEK_API_KEY'][:10]}...{os.environ['DEEPSEEK_API_KEY'][-4:]}")

def start_python_ai_service():
    """Start the Python AI service"""
    print("🐍 Starting Python AI Proposal Writer Service...")
    
    setup_environment()
    
    try:
        # Change to python_services directory and start
        os.chdir('/home/runner/workspace/python_services')
        
        # Start with uvicorn
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "ai_proposal_writer:app",
            "--host", "0.0.0.0",
            "--port", "8030",
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\n🛑 Python AI Service stopped")
    except Exception as e:
        print(f"❌ Error starting service: {e}")

if __name__ == "__main__":
    start_python_ai_service()