import asyncio
import os
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import get_engine, Base
from sqlalchemy import text

async def check():
    engine = get_engine()
    print(f"Checking database at: {engine.url}")
    
    async with engine.connect() as conn:
        # Check tables
        result = await conn.execute(text("SHOW TABLES"))
        tables = [row[0] for row in result.fetchall()]
        print(f"Tables found: {', '.join(tables)}")
        
        required = ["users", "profiles", "experiences", "education", "skills"]
        missing = [t for t in required if t not in tables]
        
        if missing:
            print(f"CRITICAL: Missing tables: {', '.join(missing)}")
        else:
            print("All required tables are present.")

if __name__ == "__main__":
    asyncio.run(check())
