import asyncio
import os
import sys

# Add the current directory to sys.path to import models
sys.path.append(os.getcwd())

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from core.config import settings
from core.database import get_database_url
from models.profile import Profile
from models.user import User
from models.experience import Experience
from models.education import Education
from models.skill import UserSkill

DATABASE_URL = get_database_url()
engine = create_async_engine(DATABASE_URL)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def check():
    async with async_session() as session:
        # Check profiles
        result = await session.execute(select(Profile.user_id, func.count(Profile.id)).group_by(Profile.user_id).having(func.count(Profile.id) > 1))
        dups = result.all()
        print(f"Duplicate Profiles (user_id, count): {dups}")

        # Check total counts
        res = await session.execute(select(func.count(Profile.id)))
        print(f"Total Profiles: {res.scalar()}")
        
        res = await session.execute(select(func.count(Experience.id)))
        print(f"Total Experiences: {res.scalar()}")

        res = await session.execute(select(func.count(Education.id)))
        print(f"Total Education: {res.scalar()}")

        res = await session.execute(select(func.count(UserSkill.id)))
        print(f"Total UserSkills: {res.scalar()}")

if __name__ == "__main__":
    asyncio.run(check())
