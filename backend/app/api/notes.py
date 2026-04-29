import re
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.models import Note, Tag, NoteTagLink, Comment

router = APIRouter()


@router.post("/", response_model=Note)
def create_note(note: Note, session: Session = Depends(get_session)):
    """Saves a new note and auto-extracts #tags."""
    extracted_tags = set(re.findall(r"#(\w+)", note.content))

    session.add(note)
    session.commit()
    session.refresh(note)

    for tag_name in extracted_tags:
        clean_name = tag_name.lower()
        statement = select(Tag).where(Tag.name == clean_name)
        existing_tag = session.exec(statement).first()

        if not existing_tag:
            existing_tag = Tag(name=clean_name)
            session.add(existing_tag)
            session.commit()
            session.refresh(existing_tag)

        link = NoteTagLink(note_id=note.id, tag_id=existing_tag.id)
        session.add(link)

    session.commit()
    session.refresh(note)
    return note


@router.get("/")
def read_notes(
    tag: str = None,
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
):
    """Retrieves notes and neatly packages their tags and comments."""
    statement = select(Note).order_by(Note.created_at.desc())

    if tag:
        statement = statement.join(NoteTagLink).join(Tag).where(Tag.name == tag.lower())

    statement = statement.offset(skip).limit(limit)
    notes = session.exec(statement).all()

    # Package relationships manually for a clean React frontend experience
    result = []
    for note in notes:
        note_data = note.model_dump()
        note_data["tags"] = [t.name for t in note.tags]
        note_data["comments"] = [
            {"id": c.id, "content": c.content, "created_at": c.created_at}
            for c in note.comments
        ]
        result.append(note_data)

    return result


@router.post("/{note_id}/comments")
def add_comment_to_note(
    note_id: uuid.UUID, comment: Comment, session: Session = Depends(get_session)
):
    """Attaches a personal context comment to a specific note."""
    db_note = session.get(Note, note_id)
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    comment.note_id = note_id
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment
