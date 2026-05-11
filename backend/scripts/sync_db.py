import asyncio
import sys
import os
from sqlalchemy import text

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import get_engine, Base
from models import user, profile, skill, experience, education, project, certification, language, target_career, resume, cover_letter, job, job_match, interview, learning_path, notification, subscription, audit_log

async def sync_db():
    engine = get_engine()
    print(f"Connecting to {engine.url}...")
    
    async with engine.begin() as conn:
        # Drop problematic tables to recreate them with the correct schema
        # We'll drop subscriptions since we know it's out of sync
        print("Dropping subscriptions table...")
        await conn.run_sync(lambda sync_conn: sync_conn.execute(text("DROP TABLE IF EXISTS subscriptions")))
        
        # Create all tables (this will skip existing ones and create missing ones)
        print("Creating all tables from models...")
        await conn.run_sync(Base.metadata.create_all)
        
    print("Database synchronization complete.")

if __name__ == "__main__":
    asyncio.run(sync_db())
