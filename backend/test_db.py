import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def test_connect():
    dsn = os.getenv("DATABASE_URL")
    # remove postgresql+asyncpg:// prefix for asyncpg
    if dsn.startswith("postgresql+asyncpg://"):
        dsn = dsn.replace("postgresql+asyncpg://", "postgresql://")
    
    print(f"Testing connection with DSN: {dsn}")
    try:
        conn = await asyncpg.connect(dsn)
        print("Connected successfully!")
        await conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_connect())
