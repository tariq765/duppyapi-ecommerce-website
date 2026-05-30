import stripe
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ..deps import get_settings

router = APIRouter()
settings = get_settings()
stripe.api_key = settings.STRIPE_SECRET_KEY

class PaymentIntentRequest(BaseModel):
    amount: int  # Amount in cents
    currency: str = "usd"

@router.post("/create-payment-intent")
async def create_payment_intent(request: PaymentIntentRequest):
    try:
        intent = stripe.PaymentIntent.create(
            amount=request.amount,
            currency=request.currency,
            automatic_payment_methods={
                'enabled': True,
            },
        )
        return {
            "clientSecret": intent.client_secret
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/config")
async def get_config():
    return {
        "publishableKey": settings.STRIPE_PUBLISHABLE_KEY
    }
