import asyncio
import os
import sys
sys.path.append(os.getcwd())

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from models.experience import Experience
from models.education import Education
from models.skill import UserSkill

DATABASE_URL = "mysql+aiomysql://root:@localhost:3306/ai_career_hub"
engine = create_async_engine(DATABASE_URL)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def deduplicate():
    async with async_session() as session:
        # Deduplicate Experience
        res = await session.execute(select(Experience))
        items = res.scalars().all()
        seen = set()
        for item in items:
            key = (item.title, item.company, item.start_date)
            if key in seen:
                print(f"Deleting duplicate experience: {item.title} at {item.company}")
                await session.delete(item)
            else:
                seen.add(key)
        
        # Deduplicate Education
        res = await session.execute(select(Education))
        items = res.scalars().all()
        seen = set()
        for item in items:
            key = (item.institution, item.degree, item.field_of_study)
            if key in seen:
                print(f"Deleting duplicate education: {item.institution}")
                await session.delete(item)
            else:
                seen.add(key)

        # Deduplicate Skills
        res = await session.execute(select(UserSkill))
        items = res.scalars().all()
        seen = set()
        for item in items:
            key = (item.skill_id, item.profile_id)
            if key in seen:
                print(f"Deleting duplicate skill: {item.skill_id}")
                await session.delete(item)
            else:
                seen.add(key)
        
        await session.commit()
        print("Deduplication complete.")

if __name__ == "__main__":
    asyncio.run(deduplicate())
