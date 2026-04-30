import os
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./kb.db")

# Added pool_pre_ping and pool_recycle to handle dropped NeonDB connections
engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,  # Tests the connection before using it
    pool_recycle=1800,  # Recycles connections older than 30 minutes
)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
