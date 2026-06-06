import os
from typing import AsyncGenerator
from pydantic_settings import BaseSettings
from pydantic import Field
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

class Settings(BaseSettings):
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    JWT_SECRET_KEY: str = Field(..., env="JWT_SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=15, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=30, env="REFRESH_TOKEN_EXPIRE_DAYS")
    COOKIE_DOMAIN: str = Field(default=".example.com", env="COOKIE_DOMAIN")
    DEBUG: bool = Field(default=False, env="DEBUG")
    FRONTEND_ORIGIN: str = Field(default="http://localhost:3000", env="FRONTEND_ORIGIN")
    PAYFAST_MERCHANT_ID: str = Field(default="12345", env="PAYFAST_MERCHANT_ID")
    PAYFAST_SECURED_KEY: str = Field(default="abcde", env="PAYFAST_SECURED_KEY")
    PAYFAST_MODE: str = Field(default="test", env="PAYFAST_MODE")
    GEMINI_API_KEY: str = Field(default="", env="GEMINI_API_KEY")


    class Config:
        env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
        env_file_encoding = "utf-8"

# Create a singleton Settings instance
def get_settings() -> Settings:
    return Settings()

# Async DB engine and session factory
_engine: AsyncEngine | None = None
_SessionLocal: sessionmaker | None = None

def get_engine() -> AsyncEngine:
    global _engine
    if _engine is None:
        settings = get_settings()
        # For Neon/PostgreSQL, we often need SSL. 
        # If the URL doesn't have it, we can add it here or via connect_args.
        _engine = create_async_engine(
            settings.DATABASE_URL,
            echo=False,
            future=True,
            connect_args={"ssl": "require"} if "neon.tech" in settings.DATABASE_URL else {}
        )
    return _engine

def get_session_factory() -> sessionmaker:
    global _SessionLocal
    if _SessionLocal is None:
        engine = get_engine()
        _SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    return _SessionLocal

# Dependency for FastAPI routes
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async_session = get_session_factory()
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
