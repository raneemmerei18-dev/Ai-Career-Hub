import asyncio
import os
import sys

# Ensure project root is on path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import init_db


if __name__ == "__main__":
    asyncio.run(init_db())
