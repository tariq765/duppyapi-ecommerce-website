from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, validator

class RoleSchema(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class UserCreateSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)

    @validator("password")
    def password_complexity(cls, v: str) -> str:
        # Basic complexity: at least one number and one letter
        if not any(c.isdigit() for c in v) or not any(c.isalpha() for c in v):
            raise ValueError("Password must contain letters and numbers")
        return v

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

class UserResponseSchema(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: RoleSchema
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: str  # user id
    exp: int
    role: str

class RefreshTokenCreateSchema(BaseModel):
    # Empty schema – refresh token is read from HttpOnly cookie
    pass

class ProductCreateSchema(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    slug: str = Field(..., min_length=2, max_length=255)
    description: str = Field(..., min_length=1, max_length=1000)
    price: float = Field(..., ge=0.0)
    discount_percentage: Optional[float] = Field(default=0.0, ge=0.0, le=100.0)
    rating: Optional[float] = Field(default=5.0, ge=0.0, le=5.0)
    stock: int = Field(..., ge=0)
    brand: Optional[str] = Field(default=None, max_length=100)
    category: Optional[str] = Field(default=None, max_length=100)
    main_image_url: str = Field(..., max_length=500)
    gallery: Optional[list[str]] = Field(default=[])

class ProductUpdateSchema(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=255)
    slug: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = Field(None, min_length=1, max_length=1000)
    price: Optional[float] = Field(None, ge=0.0)
    discount_percentage: Optional[float] = Field(None, ge=0.0, le=100.0)
    rating: Optional[float] = Field(None, ge=0.0, le=5.0)
    stock: Optional[int] = Field(None, ge=0)
    brand: Optional[str] = Field(None, max_length=100)
    category: Optional[str] = Field(None, max_length=100)
    main_image_url: Optional[str] = Field(None, max_length=500)
    gallery: Optional[list[str]] = Field(None)

class ProductResponseSchema(BaseModel):
    id: int
    title: str
    slug: str
    description: str
    price: float
    discount_percentage: float
    rating: float
    stock: int
    brand: Optional[str] = None
    category: Optional[str] = None
    main_image_url: str
    gallery: Optional[list[str]] = []
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

