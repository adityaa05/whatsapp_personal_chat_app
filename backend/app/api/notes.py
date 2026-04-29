from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.models import Note

router = APIRouter()


@router.post("/", response_model=Note)
def create_note(note: Note, session: Session = Depends(get_session)):
    """Saves a new note (Markdown/text snippet) to the database."""
    session.add(note)
    session.commit()
    session.refresh(note)
    return note


@router.get("/", response_model=List[Note])
def read_notes(
    skip: int = 0, limit: int = 100, session: Session = Depends(get_session)
):
    """Retrieves a list of notes, newest first."""
    # Order by creation date descending so your newest scratchpad entries are on top
    statement = select(Note).order_by(Note.created_at.desc()).offset(skip).limit(limit)
    notes = session.exec(statement).all()
    return notes
