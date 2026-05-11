import asyncio
import os
import sys
sys.path.append(os.getcwd())

from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from models.experience import Experience

DATABASE_URL = "mysql+aiomysql://root:@localhost:3306/ai_career_hub"
engine = create_async_engine(DATABASE_URL)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def check():
    async with async_session() as session:
        result = await session.execute(select(Experience.title, Experience.company))
        items = result.all()
        for item in items:
            print(f"{item.title} at {item.company}")

if __name__ == "__main__":
    asyncio.run(check())
