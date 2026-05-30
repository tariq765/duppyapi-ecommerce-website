import asyncio
from app.deps import get_engine, get_settings
from app.models import Base

async def init_db():
    settings = get_settings()
    print(f"Using DATABASE_URL: {settings.DATABASE_URL}")
    engine = get_engine()
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created successfully!")

if __name__ == "__main__":
    asyncio.run(init_db())
