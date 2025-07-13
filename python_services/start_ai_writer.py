#!/usr/bin/env python3
"""
Start the AI Proposal Writer Service
"""

import subprocess
import sys
import os
import signal
import time

def signal_handler(sig, frame):
    print("\n🛑 Shutting down AI Proposal Writer Service...")
    sys.exit(0)

def start_ai_writer():
    """Start the AI proposal writer service"""
    print("🤖 Starting Granada OS AI Proposal Writer Service on port 8030...")
    
    # Register signal handler
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        # Change to the python_services directory
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        
        # Start the service
        process = subprocess.Popen([
            sys.executable, "-m", "uvicorn", 
            "ai_proposal_writer:app",
            "--host", "0.0.0.0",
            "--port", "8030",
            "--reload",
            "--log-level", "info"
        ])
        
        print("✅ AI Proposal Writer Service started successfully!")
        print("🔗 WebSocket endpoint: ws://localhost:8030/ws/stream-writing/{client_id}")
        print("📊 Health check: http://localhost:8030/health")
        print("📚 API docs: http://localhost:8030/docs")
        print("\nPress Ctrl+C to stop the service")
        
        # Wait for the process
        process.wait()
        
    except KeyboardInterrupt:
        print("\n🛑 Service stopped by user")
        if 'process' in locals():
            process.terminate()
    except Exception as e:
        print(f"❌ Error starting AI Proposal Writer Service: {e}")
        sys.exit(1)

if __name__ == "__main__":
    start_ai_writer()