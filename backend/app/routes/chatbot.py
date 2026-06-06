import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, Request, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from .. import crud, models, auth as auth_utils
from ..deps import get_db, get_settings

# Configure logging
logger = logging.getLogger("chatbot")

router = APIRouter()
settings = get_settings()

# Initialize Gemini API if key is present
gemini_available = False
try:
    if settings.GEMINI_API_KEY:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        gemini_available = True
        logger.info("Gemini API initialized successfully.")
    else:
        logger.warning("GEMINI_API_KEY not found. Chatbot will run in fallback mock mode.")
except Exception as e:
    logger.error(f"Error initializing Gemini API: {str(e)}")
    gemini_available = False

# Pydantic Schemas
class ChatMessage(BaseModel):
    role: str  # "user" or "model" (or "bot")
    content: str

class ChatQueryRequest(BaseModel):
    query: str
    history: Optional[List[ChatMessage]] = []

class ChatQueryResponse(BaseModel):
    response: str
    suggested_prompts: List[str]

# Static FAQs and Policies Context
STORE_FAQ_CONTEXT = """
DuppyStore FAQs & Policies:
1. Shipping Policy: Standard delivery takes 3-5 business days. Express delivery (available in selected cities in Pakistan) takes 1-2 business days. Currently, we only ship within Pakistan.
2. Return & Refund Policy: We offer a 7-day return policy for unused products in their original packaging. Customers must contact support to initiate a return.
3. Payment Methods: We accept Visa, Mastercard, American Express, PayPal, PayFast (online banking checkout), and Cash on Delivery (COD).
4. Order Cancellations: You can cancel your order within 2 hours of placing it by contacting our support team. Once the order is processed, it cannot be cancelled.
5. General Support: Customer support can be reached via the support page or by emailing support@duppystore.com.
"""

# Optional auth dependency to parse token if it exists
async def get_optional_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> Optional[models.User]:
    authorization: str = request.headers.get("Authorization")
    if not authorization:
        return None
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            return None
        payload = auth_utils.decode_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        return await crud.get_user_by_id(db, user_id)
    except Exception:
        return None

@router.post("/query", response_model=ChatQueryResponse)
async def query_chatbot(
    payload: ChatQueryRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_current_user)
):
    query = payload.query
    history = payload.history or []

    # 1. Retrieve Product Context from database
    # Perform a search for products matching the user's query
    matching_products = await crud.get_products(db, limit=10, search=query)
    
    # If no matching products were found, retrieve a default list of featured products
    if not matching_products:
        matching_products = await crud.get_products(db, limit=6)

    # Format products context
    product_context = ""
    if matching_products:
        product_context = "=== AVAILABLE PRODUCTS ===\n"
        for p in matching_products:
            discount_text = f" ({p.discount_percentage}% off)" if p.discount_percentage > 0 else ""
            stock_text = f"In Stock ({p.stock} left)" if p.stock > 0 else "OUT OF STOCK"
            product_context += (
                f"- Name: {p.title}\n"
                f"  Category: {p.category} | Brand: {p.brand}\n"
                f"  Price: ${p.price}{discount_text}\n"
                f"  Availability: {stock_text}\n"
                f"  Details: {p.description}\n"
                f"  Link Slug: {p.slug}\n\n"
            )
    else:
        product_context = "=== AVAILABLE PRODUCTS ===\nNo products currently available in the database.\n"

    # 2. Retrieve User Orders Context
    user_context = "=== USER PROFILE ===\nStatus: Guest User (Not Logged In)\n"
    if current_user:
        # Fetch user orders with their items and products
        result = await db.execute(
            select(models.Order)
            .where(models.Order.user_id == current_user.id)
            .options(selectinload(models.Order.items).selectinload(models.OrderItem.product))
            .order_by(models.Order.created_at.desc())
            .limit(3)
        )
        orders = result.scalars().all()
        
        user_context = f"=== USER PROFILE ===\nName: {current_user.name}\nEmail: {current_user.email}\nStatus: Logged In\n\nRecent Orders:\n"
        if orders:
            for idx, o in enumerate(orders, 1):
                items_desc = ", ".join([f"{item.product.title} (x{item.quantity})" for item in o.items])
                user_context += (
                    f"Order #{idx}:\n"
                    f"  ID: {o.id}\n"
                    f"  Status: {o.status}\n"
                    f"  Total: ${o.total_amount}\n"
                    f"  Items: {items_desc}\n"
                    f"  Date: {o.created_at.strftime('%Y-%m-%d %H:%M')}\n\n"
                )
        else:
            user_context += "No orders placed yet.\n"

    # 3. Format Conversation History
    history_context = ""
    if history:
        history_context = "=== CONVERSATION HISTORY ===\n"
        for msg in history:
            role = "User" if msg.role == "user" else "Assistant"
            history_context += f"{role}: {msg.content}\n"
        history_context += "\n"

    # 4. Construct System Instructions & Prompt
    system_instructions = (
        "You are 'DuppyBot', a helpful, highly knowledgeable, and premium AI sales assistant for DuppyStore, an e-commerce website.\n"
        "Your goal is to guide users to buy products, answer their queries about items, track their orders, and explain store policies.\n\n"
        "CRITICAL INSTRUCTIONS:\n"
        "- Respond in a natural, polite, and conversational mix of Roman Urdu and English (Hinglish/Urdu), or full English if the user asks in English.\n"
        "- ONLY recommend products and policies that exist in the context provided below. DO NOT make up fake products, details, or prices.\n"
        "- If a product is out of stock (stock = 0), suggest a similar alternative and explain that it's currently out of stock.\n"
        "- If the user asks about order status, refer to their 'Recent Orders' section in the context. If they are not logged in, explain that they must sign in to see their orders.\n"
        "- Be friendly, concise, and helpful. Format product recommendations with bold titles and prices (e.g. **iPhone 15 Pro** - $999) to make them stand out.\n"
    )

    full_prompt = (
        f"{system_instructions}\n"
        f"=== CONTEXT DATA ===\n"
        f"{user_context}\n"
        f"{STORE_FAQ_CONTEXT}\n"
        f"{product_context}\n"
        f"{history_context}"
        f"User Query: {query}\n"
        f"Assistant Response (DuppyBot):"
    )

    # 5. Call Gemini API or Fallback
    bot_response = ""
    if gemini_available:
        try:
            import google.generativeai as genai
            model = genai.GenerativeModel('gemini-2.5-flash')
            # Generate the response
            # We can use generation_config to limit tokens and control creativity
            response = model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=800,
                    temperature=0.7
                )
            )
            bot_response = response.text.strip()
        except Exception as e:
            logger.error(f"Gemini API execution error: {str(e)}")
            bot_response = get_fallback_response(query, current_user, matching_products)
    else:
        bot_response = get_fallback_response(query, current_user, matching_products)

    # Dynamic suggested prompts based on the context
    suggested = [
        "What are the latest laptops available?",
        "Are there any discounts?",
        "What is your return policy?"
    ]
    if current_user:
        suggested.append("Track my recent order")
    else:
        suggested.append("How do I create an account?")

    return ChatQueryResponse(
        response=bot_response,
        suggested_prompts=suggested[:3]
    )

def get_fallback_response(query: str, user: Optional[models.User], products: List[models.Product]) -> str:
    """
    Fallback method to generate a sensible rule-based Urdu/English response 
    when the Gemini API is not configured or fails.
    """
    q_lower = query.lower()
    
    # Greet user
    user_name = user.name if user else "guest"
    welcome = f"Hello {user_name}! " if user else "Hello! "
    
    # 1. Check if user is asking about order tracking
    if any(k in q_lower for k in ["order", "track", "delivery", "shipping", "parsal", "kahan"]):
        if not user:
            return welcome + "Apne order ko track karne ke liye pehle login karein. Login karne ke baad aap yahan apne order ka status dekh sakte hain."
        return welcome + "Hum standard delivery 3-5 din me aur express delivery 1-2 din me poore Pakistan me deliver karte hain. Apne dynamic order status ke liye please humari support team se rabta karein ya setting update karein."
        
    # 2. Check for policies
    if any(k in q_lower for k in ["return", "refund", "replace", "wapis", "policy"]):
        return welcome + "Humare paas 7-day return policy hai unused products ke liye jo original packaging me hon. Return start karne ke liye support page par contact karein."

    if any(k in q_lower for k in ["pay", "payment", "paisa", "cash", "cod"]):
        return welcome + "Hum Visa, Mastercard, American Express, PayPal, PayFast aur Cash on Delivery (COD) accept karte hain."

    # 3. Product recommendation fallback
    if products:
        product_list = "\n".join([f"- **{p.title}** - ${p.price} ({p.category})" for p in products[:3]])
        return welcome + f"Humare paas ye products available hain:\n{product_list}\n\n*Note: Mera AI module abhi offline mode par chal raha hai (Gemini API Key missing hai), to me general details hi de sakta hoon.*"

    return welcome + "DuppyStore support bot me khushamdeed! Main products, orders aur store policies ke mutabiq aapki help kar sakta hoon. *Note: AI service is currently running in fallback mode.*"
