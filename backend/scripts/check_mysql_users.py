import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def check_users():
    database_url = "mysql+aiomysql://root:@localhost:3306/ai_career_hub"
    engine = create_async_engine(database_url)
    
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT email FROM users"))
            users = result.fetchall()
            print("Registered users in MySQL:")
            for user in users:
                print(user[0])
    except Exception as e:
        print(f"Error connecting to MySQL: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_users())
