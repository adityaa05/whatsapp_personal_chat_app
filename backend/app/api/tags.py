from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from app.db.session import get_session
from app.models.models import Tag
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[Tag])
def read_tags(
    session: Session = Depends(get_session), user: str = Depends(get_current_user)
):
    return session.exec(select(Tag).order_by(Tag.name)).all()
