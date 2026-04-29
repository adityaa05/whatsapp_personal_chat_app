from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.models import Tag

router = APIRouter()


@router.get("/", response_model=List[Tag])
def read_tags(session: Session = Depends(get_session)):
    """Retrieves a list of all unique tags in alphabetical order."""
    statement = select(Tag).order_by(Tag.name)
    tags = session.exec(statement).all()
    return tags
