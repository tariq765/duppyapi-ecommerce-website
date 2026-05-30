from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from .. import models, schemas, crud
from ..deps import get_db, get_settings
from .auth import get_current_user, get_current_admin

router = APIRouter()
settings = get_settings()

@router.get("/admin/all", response_model=list)
async def list_all_orders_admin(
    db: Annotated[AsyncSession, Depends(get_db)],
    admin: Annotated[models.User, Depends(get_current_admin)]
):
    from sqlalchemy import select
    from sqlalchemy.orm import selectinload
    
    result = await db.execute(
        select(models.Order)
        .options(
            selectinload(models.Order.items).selectinload(models.OrderItem.product),
            selectinload(models.Order.user)
        )
        .order_by(models.Order.created_at.desc())
    )
    orders = result.scalars().all()
    
    output = []
    for order in orders:
        output.append({
            "id": order.id,
            "user_name": order.user.name,
            "user_email": order.user.email,
            "total_amount": order.total_amount,
            "status": order.status,
            "payment_method": order.payment_method,
            "shipping_address": order.shipping_address,
            "created_at": order.created_at.isoformat(),
            "items": [
                {
                    "product_title": item.product.title,
                    "quantity": item.quantity,
                    "price": item.price
                } for item in order.items
            ]
        })
    return output

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    total_amount: float
    shipping_address: dict
    payment_method: str = "payfast" # payfast or cod

@router.post("/", response_model=dict)
async def create_order(
    order_in: OrderCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[models.User, Depends(get_current_user)]
):
    # 1. Create the Order in DB
    db_order = models.Order(
        user_id=current_user.id,
        total_amount=order_in.total_amount,
        shipping_address=order_in.shipping_address,
        payment_method=order_in.payment_method,
        status="pending"
    )
    db.add(db_order)
    await db.flush() # Get the order ID

    # 2. Create Order Items
    for item in order_in.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_item)
    
    await db.commit()
    await db.refresh(db_order)

    # 3. If COD, return success immediately
    if order_in.payment_method == "cod":
        return {
            "status": "success",
            "message": "Order placed successfully via Cash on Delivery",
            "order_id": db_order.id,
            "redirect_url": "/order-success"
        }

    # 4. If PayFast, generate the redirect URL
    # For now, we simulate the PayFast redirection. 
    # In a real PayFast setup, you'd build a POST form or call their API.
    payfast_url = "https://ipguat.payfast.com.pk/global/api/payment/pay" if settings.PAYFAST_MODE == "test" else "https://ipg.payfast.com.pk/global/api/payment/pay"
    
    # PayFast parameters (Simplified)
    params = {
        "merchant_id": settings.PAYFAST_MERCHANT_ID,
        "secured_key": settings.PAYFAST_SECURED_KEY,
        "basket_id": db_order.id,
        "txnamount": str(db_order.total_amount),
        "customer_email": current_user.email,
        "success_url": f"{settings.FRONTEND_ORIGIN}/payment/success",
        "failure_url": f"{settings.FRONTEND_ORIGIN}/payment/failure",
        "checkout_url": payfast_url
    }

    # In a real implementation, you would generate a signature/checksum here.
    # return the data needed for the frontend to submit the form
    return {
        "status": "pending",
        "order_id": db_order.id,
        "payment_method": "payfast",
        "payfast_params": params
    }

@router.get("/{order_id}", response_model=dict)
async def get_order_details(
    order_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[models.User, Depends(get_current_user)]
):
    from sqlalchemy import select
    from sqlalchemy.orm import selectinload
    
    result = await db.execute(
        select(models.Order)
        .where(models.Order.id == order_id, models.Order.user_id == current_user.id)
        .options(selectinload(models.Order.items).selectinload(models.OrderItem.product))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {
        "id": order.id,
        "total_amount": order.total_amount,
        "status": order.status,
        "payment_method": order.payment_method,
        "items": [
            {
                "product_title": item.product.title,
                "quantity": item.quantity,
                "price": item.price
            } for item in order.items
        ]
    }
