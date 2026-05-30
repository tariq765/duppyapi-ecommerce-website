from datetime import datetime, timedelta, timezone
import hashlib
import secrets
from typing import Optional

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from . import models, schemas
from .auth import get_password_hash, verify_password

from sqlalchemy.orm import selectinload

# ----- User CRUD -----
# ... rest of file (I will use replace for the specific lines)
async def get_user_by_email(db: AsyncSession, email: str) -> Optional[models.User]:
    result = await db.execute(
        select(models.User)
        .where(models.User.email == email)
        .options(selectinload(models.User.role))
    )
    return result.scalar_one_or_none()

async def get_user_by_id(db: AsyncSession, user_id: str) -> Optional[models.User]:
    result = await db.execute(
        select(models.User)
        .where(models.User.id == user_id)
        .options(selectinload(models.User.role))
    )
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, user_in: schemas.UserCreateSchema) -> models.User:
    # Hash password using bcrypt directly
    password_hash = get_password_hash(user_in.password)
    # Assign default role "user"
    role_result = await db.execute(select(models.Role).where(models.Role.name == "user"))
    role = role_result.scalar_one_or_none()
    if not role:
        # create the role if missing
        role = models.Role(name="user")
        db.add(role)
        await db.commit()
        await db.refresh(role)
    db_user = models.User(
        name=user_in.name,
        email=user_in.email,
        password_hash=password_hash,
        role_id=role.id,
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user, attribute_names=["role"])
    return db_user

# ----- Refresh Token CRUD -----
def _hash_token(token: str) -> str:
    # Store a hash of the token in DB for extra security
    return hashlib.sha256(token.encode()).hexdigest()

async def create_refresh_token(db: AsyncSession, user_id: str, expires_delta: Optional[timedelta] = None) -> str:
    token = secrets.token_urlsafe(32)
    token_hash = _hash_token(token)
    expires_at = datetime.now(timezone.utc) + (expires_delta or timedelta(days=30))
    db_token = models.RefreshToken(
        user_id=user_id,
        token_hash=token_hash,
        expires_at=expires_at,
        revoked=False,
    )
    db.add(db_token)
    await db.commit()
    await db.refresh(db_token)
    return token

async def get_refresh_token(db: AsyncSession, token: str) -> Optional[models.RefreshToken]:
    token_hash = _hash_token(token)
    result = await db.execute(select(models.RefreshToken).where(models.RefreshToken.token_hash == token_hash))
    return result.scalar_one_or_none()

async def revoke_refresh_token(db: AsyncSession, token: str) -> None:
    token_hash = _hash_token(token)
    await db.execute(update(models.RefreshToken).where(models.RefreshToken.token_hash == token_hash).values(revoked=True))
    await db.commit()

# ----- Role CRUD -----
async def get_role_by_name(db: AsyncSession, name: str) -> Optional[models.Role]:
    result = await db.execute(select(models.Role).where(models.Role.name == name))
    return result.scalar_one_or_none()

async def list_roles(db: AsyncSession):
    result = await db.execute(select(models.Role))
    return result.scalars().all()

# ----- Product CRUD -----
async def get_product(db: AsyncSession, product_id: int) -> Optional[models.Product]:
    result = await db.execute(select(models.Product).where(models.Product.id == product_id))
    return result.scalar_one_or_none()

async def get_product_by_slug(db: AsyncSession, slug: str) -> Optional[models.Product]:
    result = await db.execute(select(models.Product).where(models.Product.slug == slug))
    return result.scalar_one_or_none()

async def get_products(db: AsyncSession, skip: int = 0, limit: int = 100, search: Optional[str] = None) -> list[models.Product]:
    query = select(models.Product).offset(skip).limit(limit).order_by(models.Product.id.desc())
    if search:
        search_filter = f"%{search}%"
        query = query.where(
            (models.Product.title.ilike(search_filter)) | 
            (models.Product.description.ilike(search_filter)) |
            (models.Product.brand.ilike(search_filter)) |
            (models.Product.category.ilike(search_filter))
        )
    result = await db.execute(query)
    return list(result.scalars().all())

async def create_product(db: AsyncSession, product_in: schemas.ProductCreateSchema) -> models.Product:
    db_product = models.Product(
        title=product_in.title,
        slug=product_in.slug,
        description=product_in.description,
        price=product_in.price,
        discount_percentage=product_in.discount_percentage,
        rating=product_in.rating,
        stock=product_in.stock,
        brand=product_in.brand,
        category=product_in.category,
        main_image_url=product_in.main_image_url,
        gallery=product_in.gallery,
    )
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    return db_product

async def update_product(db: AsyncSession, product_id: int, product_in: schemas.ProductUpdateSchema) -> Optional[models.Product]:
    db_product = await get_product(db, product_id)
    if not db_product:
        return None
    
    update_data = product_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    return db_product

async def delete_product(db: AsyncSession, product_id: int) -> bool:
    db_product = await get_product(db, product_id)
    if not db_product:
        return False
    await db.delete(db_product)
    await db.commit()
    return True

