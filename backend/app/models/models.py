import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel


# link table - many to many relationships
# a note can have many tags, and a tag can belong to many notes.
class NoteTagLink(SQLModel, table=True):
    note_id: Optional[uuid.UUID] = Field(
        default=None, foreign_key="note.id", primary_key=True
    )
    tag_id: Optional[uuid.UUID] = Field(
        default=None, foreign_key="tag.id", primary_key=True
    )


# main tables


class Tag(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True, unique=True)

    # Links back to the Note model
    notes: List["Note"] = Relationship(back_populates="tags", link_model=NoteTagLink)


class Note(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    content: str  # The raw Markdown/text you paste
    type: str = Field(default="text")  # Categorization: text, code, link, etc.
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships mapping to other tables
    tags: List[Tag] = Relationship(back_populates="notes", link_model=NoteTagLink)

    # FIX: Using sa_relationship_kwargs for cascade deletion in SQLModel 0.0.14
    comments: List["Comment"] = Relationship(
        back_populates="note", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )


class Comment(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    note_id: uuid.UUID = Field(foreign_key="note.id")
    content: str  # Your personal thoughts/context regarding the note
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Links back to the parent Note
    note: Note = Relationship(back_populates="comments")
