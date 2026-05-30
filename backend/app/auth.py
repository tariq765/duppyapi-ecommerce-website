import json
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from jose import JWTError, jwt
from fastapi import Response, HTTPException, status
import bcrypt
from .deps import get_settings

# ----- Password utilities -----
def get_password_hash(password: str) -> str:
    """Hash a plain password using bcrypt."""
    # Salt is automatically generated and included in the hash
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a stored hash."""
    pwd_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)

# ----- JWT utilities -----
def _create_jwt_token(data: Dict[str, Any], expires_delta: timedelta) -> str:
    settings = get_settings()
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def create_access_token(user_id: str, role: str, expires_delta: Optional[timedelta] = None) -> str:
    settings = get_settings()
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return _create_jwt_token({"sub": user_id, "role": role}, expires_delta)

def decode_token(token: str) -> Dict[str, Any]:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=["HS256"])
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e

# ----- Cookie utilities -----
def set_cookie(
    response: Response,
    name: str,
    value: str,
    max_age: int,
    httponly: bool = True,
    secure: Optional[bool] = None,
    samesite: str = "lax",
) -> None:
    """Set an HttpOnly cookie with proper security flags."""
    settings = get_settings()
    
    # If secure is not specified, disable it in DEBUG mode for localhost
    if secure is None:
        secure = not settings.DEBUG

    response.set_cookie(
        key=name,
        value=value,
        max_age=max_age,
        domain=settings.COOKIE_DOMAIN if settings.COOKIE_DOMAIN != "localhost" else None,
        path="/",
        httponly=httponly,
        secure=secure,
        samesite=samesite,
    )

def delete_cookie(response: Response, name: str) -> None:
    """Delete a cookie by setting it to an empty value and immediate expiry."""
    settings = get_settings()
    response.delete_cookie(key=name, domain=settings.COOKIE_DOMAIN, path="/")
