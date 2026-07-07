from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Handles connection pool management to our local MySQL instance
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Active workspace session instances for transaction control
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Context manager dependency ensuring isolated request transactions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        