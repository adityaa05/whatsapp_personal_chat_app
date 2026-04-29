from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import create_db_and_tables
from app.api import notes, tags, auth


# Run this function before the server starts taking requests
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="Whatsapp Personal Notes App APIs",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow your React frontend (which will run on localhost:5173 with Bun) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect the notes router
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])
app.include_router(tags.router, prefix="/api/tags", tags=["Tags"])


@app.get("/")
def read_root():
    return {"message": "Whatsapp Personal Notes App API is running"}
