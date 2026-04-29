from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.models import Tag
from app.api.auth import get_current_user  # Import the Bouncer

router = APIRouter()


# Notice we added the Depends(get_current_user) here
@router.get("/", response_model=List[Tag])
def read_tags(
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user),
):
    """Retrieves a list of all unique tags in alphabetical order."""
    statement = select(Tag).order_by(Tag.name)
    tags = session.exec(statement).all()
    return tags
