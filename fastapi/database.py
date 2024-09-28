# database.py

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import MetaData

# Database connection details
POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "advcompro"
POSTGRES_HOST = "db"

# Define the async database URL for PostgreSQL
DATABASE_URL = f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}'

# Create an async engine to connect to the PostgreSQL database
async_engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# Metadata and Base model declaration
metadata = MetaData()
Base = declarative_base(metadata=metadata)

# Create an async session factory for handling database transactions
async_session = sessionmaker(
    bind=async_engine,
    expire_on_commit=False,
    class_=AsyncSession
)

# Dependency to get an async database session
async def get_db():
    async with async_session() as session:
        yield session

# Optional: Function to test database connectivity and table creation
async def test_db_connection():
    try:
        async with async_engine.begin() as conn:
            await conn.run_sync(metadata.create_all)
        print("Database connection test successful. Tables created successfully.")
    except Exception as e:
        print(f"Database connection error: {e}")
