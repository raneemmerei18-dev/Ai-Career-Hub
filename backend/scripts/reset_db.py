import asyncio
import os
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import get_engine, Base
from sqlalchemy import text

async def reset_db():
    engine = get_engine()
    print(f"Resetting database at: {engine.url}")
    
    async with engine.begin() as conn:
        # Use SQLAlchemy metadata drop_all for cross-database compatibility
        # In production migrations should be handled with Alembic
        await conn.run_sync(Base.metadata.drop_all)
        print("All tables dropped.")
    
    print("Database reset successful. Restart the server to recreate tables.")

if __name__ == "__main__":
    asyncio.run(reset_db())
