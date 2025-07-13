#!/usr/bin/env python3
"""
Manual startup script for AI Proposal Writer with forced integration
"""
import os
import threading
import time
import uvicorn

# Force environment setup
os.environ['DEEPSEEK_API_KEY'] = 'sk-a56c233e8fa64e0bb77a264fac2dd68a'
os.environ['DATABASE_URL'] = os.getenv('DATABASE_URL', 'postgresql://localhost/granada')

def start_server():
    """Start the server in a thread"""
    print("🐍 PYTHON AI SERVICE STARTING ON PORT 8030...")
    print(f"🔑 Using DeepSeek API: {os.environ['DEEPSEEK_API_KEY'][:10]}...{os.environ['DEEPSEEK_API_KEY'][-4:]}")
    
    # Import and start the app
    from ai_proposal_writer import app
    
    uvicorn.run(
        app,
        host="0.0.0.0", 
        port=8030,
        log_level="info"
    )

if __name__ == "__main__":
    start_server()