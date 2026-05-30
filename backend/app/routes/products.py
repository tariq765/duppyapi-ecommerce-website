import os
import shutil
import uuid
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from .. import crud, models, schemas
from ..deps import get_db
from .auth import get_current_user, get_current_admin
from ..sync_service import sync_sanity_to_postgres

router = APIRouter()

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "static", "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/", response_model=list[schemas.ProductResponseSchema])
async def list_products(
    db: Annotated[AsyncSession, Depends(get_db)],
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None
):
    products = await crud.get_products(db, skip=skip, limit=limit, search=search)
    return products

@router.get("/{slug}", response_model=schemas.ProductResponseSchema)
async def get_product_by_slug(
    slug: str,
    db: Annotated[AsyncSession, Depends(get_db)]
):
    product = await crud.get_product_by_slug(db, slug=slug)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

@router.post("/", response_model=schemas.ProductResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_new_product(
    product_in: schemas.ProductCreateSchema,
    db: Annotated[AsyncSession, Depends(get_db)],
    admin: Annotated[models.User, Depends(get_current_admin)]
):
    # Check if slug already exists
    existing = await crud.get_product_by_slug(db, slug=product_in.slug)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product with this slug already exists"
        )
    product = await crud.create_product(db, product_in)
    return product

@router.put("/{product_id}", response_model=schemas.ProductResponseSchema)
async def update_existing_product(
    product_id: int,
    product_in: schemas.ProductUpdateSchema,
    db: Annotated[AsyncSession, Depends(get_db)],
    admin: Annotated[models.User, Depends(get_current_admin)]
):
    product = await crud.update_product(db, product_id=product_id, product_in=product_in)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_product(
    product_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    admin: Annotated[models.User, Depends(get_current_admin)]
):
    success = await crud.delete_product(db, product_id=product_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return None

@router.post("/upload-image")
async def upload_product_image(
    file: UploadFile = File(...),
    admin: models.User = Depends(get_current_admin)
):
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format. Allowed: jpg, jpeg, png, webp, gif"
        )
    
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )
        
    return {"url": f"/static/uploads/{unique_filename}"}

@router.post("/sync")
async def trigger_sync():
    result = await sync_sanity_to_postgres()
    if result.get("status") == "error":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result.get("message")
        )
    return result
