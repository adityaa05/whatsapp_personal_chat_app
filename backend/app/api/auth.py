import os
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from app.core.security import create_access_token, SECRET_KEY, ALGORITHM

router = APIRouter()

# Tells FastAPI where the login route is
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

# Pull your master credentials from the .env file
ROOT_USER = os.getenv("ROOT_USER", "adityaa05")
ROOT_PASSWORD = os.getenv("ROOT_PASSWORD", "secret")


@router.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Verifies your master password and hands out a JWT pass."""
    if form_data.username != ROOT_USER or form_data.password != ROOT_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}


def get_current_user(token: str = Depends(oauth2_scheme)):
    """The Bouncer: Add this to any route you want to protect."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
            )
        return username
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )
