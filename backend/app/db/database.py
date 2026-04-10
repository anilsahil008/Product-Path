"""
Async SQLAlchemy engine and session factory.

Why async (aiosqlite) instead of sync SQLAlchemy?
FastAPI runs on an async event loop. Sync DB calls inside async route handlers
would block the loop and kill throughput. aiosqlite gives us a proper async
driver so all DB I/O is non-blocking.

Why SQLite for now?
Zero-setup, file-based, perfect for single-server deployments and development.
Swapping to Postgres later requires only changing DATABASE_URL and the driver.
"""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

DATABASE_URL = "sqlite+aiosqlite:///./chatpm.db"

engine = create_async_engine(
    DATABASE_URL,
    echo=False,           # set True to log SQL in development
    connect_args={"check_same_thread": False},
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,  # keep ORM objects usable after commit
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency — yields one session per request, always closes it."""
    async with AsyncSessionLocal() as session:
        yield session


async def init_db() -> None:
    """Create all tables on startup. Safe to call repeatedly (CREATE IF NOT EXISTS)."""
    # Import here to ensure models are registered on Base.metadata before create_all
    import app.db.models  # noqa: F401
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
