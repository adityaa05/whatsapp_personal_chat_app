import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, or_
from typing import Optional
from app.db.session import get_session
from app.models.models import Note, Comment
from app.api.auth import get_current_user

router = APIRouter()


def serialize_note(note):
    d = note.dict()
    d["comments"] = [
        {"id": str(c.id), "content": c.content, "created_at": c.created_at.isoformat()}
        for c in sorted(note.comments, key=lambda x: x.created_at)
    ]
    d["id"] = str(d["id"])
    d["created_at"] = note.created_at.isoformat()
    return d


@router.post("/")
def create_note(
    note: Note,
    session: Session = Depends(get_session),
    user: str = Depends(get_current_user),
):
    session.add(note)
    session.commit()
    session.refresh(note)
    return serialize_note(note)


@router.get("/")
def read_notes(
    q: Optional[str] = None,
    pinned: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
    user: str = Depends(get_current_user),
):
    stmt = select(Note)

    if q:
        stmt = stmt.outerjoin(Comment).where(
            or_(Note.content.ilike(f"%{q}%"), Comment.content.ilike(f"%{q}%"))
        )

    if pinned is not None:
        stmt = stmt.where(Note.is_pinned == pinned)

    # Pinned first, then newest
    stmt = stmt.order_by(Note.is_pinned.desc(), Note.created_at.desc())
    stmt = stmt.offset(skip).limit(limit)

    notes = session.exec(stmt).unique().all()
    return [serialize_note(n) for n in notes]


@router.patch("/{note_id}/pin")
def toggle_pin(
    note_id: uuid.UUID,
    session: Session = Depends(get_session),
    user: str = Depends(get_current_user),
):
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    note.is_pinned = not note.is_pinned
    session.add(note)
    session.commit()
    session.refresh(note)
    return serialize_note(note)


@router.delete("/{note_id}")
def delete_note(
    note_id: uuid.UUID,
    session: Session = Depends(get_session),
    user: str = Depends(get_current_user),
):
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    session.delete(note)
    session.commit()
    return {"deleted": True}


@router.post("/{note_id}/comments")
def add_comment(
    note_id: uuid.UUID,
    comment: Comment,
    session: Session = Depends(get_session),
    user: str = Depends(get_current_user),
):
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    comment.note_id = note_id
    session.add(comment)
    session.commit()
    session.refresh(comment)

    return {
        "id": str(comment.id),
        "content": comment.content,
        "created_at": comment.created_at.isoformat(),
    }


@router.delete("/{note_id}/comments/{comment_id}")
def delete_comment(
    note_id: uuid.UUID,
    comment_id: uuid.UUID,
    session: Session = Depends(get_session),
    user: str = Depends(get_current_user),
):
    comment = session.get(Comment, comment_id)
    if not comment or comment.note_id != note_id:
        raise HTTPException(status_code=404, detail="Comment not found")

    session.delete(comment)
    session.commit()
    return {"deleted": True}
