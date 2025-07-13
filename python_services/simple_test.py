#!/usr/bin/env python3
"""
Simple test to verify Python AI service can start
"""
import os
import uvicorn

# Set environment
os.environ['DEEPSEEK_API_KEY'] = 'sk-a56c233e8fa64e0bb77a264fac2dd68a'

def test_import():
    try:
        from ai_proposal_writer import app
        print("✅ Import successful")
        return app
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return None

def start_simple_server():
    app = test_import()
    if app:
        print("🚀 Starting server on port 8030...")
        uvicorn.run(app, host="127.0.0.1", port=8030, log_level="info")

if __name__ == "__main__":
    start_simple_server()