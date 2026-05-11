#!/usr/bin/env python
"""Database bootstrap script for AI Career Hub backend models."""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "backend"))


async def run_migration():
    """Create all tables using SQLAlchemy metadata."""
    try:
        from core.database import init_db, get_engine
        from sqlalchemy import text

        print("Connecting to database...")
        await init_db()
        print("Schema bootstrap completed from SQLAlchemy models.")

        engine = get_engine()
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            print(f"Connection check: {result.scalar_one()}")
        return True
    except Exception as e:
        print(f"Migration failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("AI Career Hub - Database Migration")
    print("=" * 60)

    success = asyncio.run(run_migration())

    print("=" * 60)
    if success:
        print("Migration successful.")
        print("Next: cd backend && uvicorn main:app --reload")
    else:
        print("Migration failed. Check the error messages above.")
    print("=" * 60)

    sys.exit(0 if success else 1)
