"""
Auth service — password hashing and JWT handling.

Kept stateless: no DB access here. The route layer handles DB lookups
and calls into this service for crypto operations only.
"""

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
_ALGORITHM = "HS256"
_TOKEN_EXPIRE_DAYS = 7


class AuthService:
    def hash_password(self, password: str) -> str:
        return _pwd_context.hash(password)

    def verify_password(self, plain: str, hashed: str) -> bool:
        return _pwd_context.verify(plain, hashed)

    def create_token(self, user_id: int) -> str:
        expire = datetime.now(timezone.utc) + timedelta(days=_TOKEN_EXPIRE_DAYS)
        payload = {"sub": str(user_id), "exp": expire}
        return jwt.encode(payload, settings.secret_key, algorithm=_ALGORITHM)

    def decode_token(self, token: str) -> int | None:
        """Returns user_id if token is valid, None otherwise."""
        try:
            payload = jwt.decode(token, settings.secret_key, algorithms=[_ALGORITHM])
            return int(payload["sub"])
        except (JWTError, KeyError, ValueError):
            return None


auth_service = AuthService()
