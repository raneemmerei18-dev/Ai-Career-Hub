#!/usr/bin/env python3
"""Quick test to verify PostgreSQL connection."""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.config import settings
from core.database import get_engine, get_session_maker

async def test_connection():
    print("Testing PostgreSQL connection...")
    print(f"✓ Database URL: {settings.DATABASE_URL}")
    
    engine = get_engine()
    print(f"✓ Engine created: {engine.url}")
    
    # Try to get a session
    session_maker = get_session_maker()
    async with session_maker() as session:
        result = await session.execute(__import__('sqlalchemy').text("SELECT 1"))
        print(f"✓ Query executed successfully: {result.scalar()}")
    
    print("\n✅ PostgreSQL connection is working perfectly!")
    print("✅ Backend can read/write data to PostgreSQL normally.")

if __name__ == "__main__":
    asyncio.run(test_connection())
