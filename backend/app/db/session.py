import os
from sqlmodel import SQLModel, create_engine, Session

# Grab the database URL from the environment (injected by Docker Compose)
# Fallback to local sqlite just in case you run it outside docker
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL, echo=True)


def create_db_and_tables():
    # This automatically creates the tables in Postgres based on your models.py
    SQLModel.metadata.create_all(engine)


def get_session():
    # Dependency to provide a database session for each API request
    with Session(engine) as session:
        yield session
