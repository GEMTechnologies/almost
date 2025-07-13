#!/usr/bin/env python3
"""
Force start Python AI service on port 8030
"""
import os
import sys
import uvicorn
import asyncio

# Set environment variables
os.environ['DEEPSEEK_API_KEY'] = 'sk-a56c233e8fa64e0bb77a264fac2dd68a'
print(f"🔑 DeepSeek API Key set: {os.environ['DEEPSEEK_API_KEY'][:10]}...{os.environ['DEEPSEEK_API_KEY'][-4:]}")

def main():
    """Force start the AI service"""
    print("🐍 FORCE STARTING Python AI Service on port 8030...")
    
    try:
        # Import the app
        from ai_proposal_writer import app
        print("✅ App imported successfully")
        
        # Start uvicorn with detailed config
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8030,
            log_level="info",
            access_log=True,
            reload=False  # Disable reload to prevent issues
        )
    except Exception as e:
        print(f"❌ Error starting service: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()