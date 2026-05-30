from datetime import datetime, timedelta, timezone
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import OAuth2PasswordBearer

from .. import crud, models, schemas, auth as auth_utils
from ..deps import get_db

router = APIRouter()

# OAuth2 scheme expects Authorization: Bearer <token>
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ----- Helper dependencies -----
async def get_current_user(
    db: Annotated[AsyncSession, Depends(get_db)],
    token: Annotated[str, Depends(oauth2_scheme)],
) -> models.User:
    payload = auth_utils.decode_token(token)
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = await crud.get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

async def get_current_admin(
    current_user: Annotated[models.User, Depends(get_current_user)]
) -> models.User:
    if current_user.role.name != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges"
        )
    return current_user

# ----- Auth endpoints -----
@router.post("/signup", response_model=schemas.UserResponseSchema, status_code=status.HTTP_201_CREATED)
async def signup(user_in: schemas.UserCreateSchema, db: Annotated["AsyncSession", Depends(get_db)]):
    existing_user = await crud.get_user_by_email(db, user_in.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user = await crud.create_user(db, user_in)
    return user

@router.post("/login", response_model=schemas.TokenSchema)
async def login(
    response: Response,
    form_data: schemas.UserLoginSchema,
    db: Annotated["AsyncSession", Depends(get_db)],
    request: Request,
):
    # Authenticate user
    user = await crud.get_user_by_email(db, form_data.email)
    if not user or not auth_utils.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    # Create tokens
    access_token = auth_utils.create_access_token(user.id, user.role.name)
    refresh_token = await crud.create_refresh_token(
        db, user.id, expires_delta=timedelta(days=30)
    )

    # Set HttpOnly cookie for refresh token
    max_age = 30 * 24 * 60 * 60  # 30 days in seconds
    auth_utils.set_cookie(response, name="refresh_token", value=refresh_token, max_age=max_age)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(response: Response, request: Request, db: Annotated["AsyncSession", Depends(get_db)]):
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token:
        await crud.revoke_refresh_token(db, refresh_token)
    auth_utils.delete_cookie(response, name="refresh_token")
    return {"msg": "Logged out"}

@router.post("/refresh", response_model=schemas.TokenSchema)
async def refresh_token(response: Response, request: Request, db: Annotated["AsyncSession", Depends(get_db)]):
    # Read refresh token from HttpOnly cookie
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")
    token_obj = await crud.get_refresh_token(db, refresh_token)
    if not token_obj or token_obj.revoked or token_obj.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    # Issue new access token (rotate refresh token optionally)
    user = await crud.get_user_by_id(db, token_obj.user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    access_token = auth_utils.create_access_token(user.id, user.role.name)

    # Optional: rotate refresh token for extra security
    await crud.revoke_refresh_token(db, refresh_token)
    new_refresh = await crud.create_refresh_token(db, user.id, expires_delta=timedelta(days=30))
    max_age = 30 * 24 * 60 * 60
    auth_utils.set_cookie(response, name="refresh_token", value=new_refresh, max_age=max_age)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserResponseSchema)
async def read_me(current_user: models.User = Depends(get_current_user)):
    return current_user
