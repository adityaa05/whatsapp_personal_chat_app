import re
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.models import Note, Tag, NoteTagLink

router = APIRouter()


@router.post("/", response_model=Note)
def create_note(note: Note, session: Session = Depends(get_session)):
    """Saves a new note and auto-extracts #tags."""

    # 1. Find all tags in the content (e.g., "#python", "#ideas")
    extracted_tags = set(re.findall(r"#(\w+)", note.content))

    # 2. Save the note first so it gets a UUID
    session.add(note)
    session.commit()
    session.refresh(note)

    # 3. Process the extracted tags
    for tag_name in extracted_tags:
        clean_name = tag_name.lower()

        # Check if the tag already exists in the database
        statement = select(Tag).where(Tag.name == clean_name)
        existing_tag = session.exec(statement).first()

        if not existing_tag:
            # Create it if it doesn't exist
            existing_tag = Tag(name=clean_name)
            session.add(existing_tag)
            session.commit()
            session.refresh(existing_tag)

        # 4. Link the Tag to the Note
        link = NoteTagLink(note_id=note.id, tag_id=existing_tag.id)
        session.add(link)

    session.commit()
    session.refresh(note)
    return note


@router.get("/", response_model=List[Note])
def read_notes(
    tag: str = None,
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
):
    """Retrieves notes, optionally filtered by a specific tag."""

    statement = select(Note).order_by(Note.created_at.desc())

    # If a tag is provided in the URL, filter the notes
    if tag:
        statement = statement.join(NoteTagLink).join(Tag).where(Tag.name == tag.lower())

    statement = statement.offset(skip).limit(limit)
    notes = session.exec(statement).all()
    return notes
