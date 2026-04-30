import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel


class Note(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    content: str
    type: str = Field(default="text")
    is_pinned: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    comments: List["Comment"] = Relationship(
        back_populates="note", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )


class Comment(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    note_id: uuid.UUID = Field(foreign_key="note.id")
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    note: Note = Relationship(back_populates="comments")
