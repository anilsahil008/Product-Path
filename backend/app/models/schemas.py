from pydantic import BaseModel, Field
from typing import Literal
import uuid


# ── Chat ─────────────────────────────────────────────────────────────────────

class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    message: str = Field(..., min_length=1, max_length=32000)
    mode: str = Field(default="pm")


class HistoryResponse(BaseModel):
    session_id: str
    messages: list[Message]


class SessionDeleteResponse(BaseModel):
    session_id: str
    deleted: bool


# ── Auth ──────────────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    email: str
    password: str = Field(..., min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    token: str
    user: UserResponse
