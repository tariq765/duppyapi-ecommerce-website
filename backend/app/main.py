import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routes import auth, products, orders
from .deps import get_settings
from .sync_service import sync_sanity_to_postgres

settings = get_settings()

app = FastAPI(title="E-commerce Auth API", debug=settings.DEBUG)

@app.on_event("startup")
async def startup_event():
    # Sync data from Sanity on startup
    print("Starting initial sync from Sanity...")
    await sync_sanity_to_postgres()
    print("Initial sync complete.")

# Allow frontend origin
origins = [
    settings.FRONTEND_ORIGIN,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory for uploads
static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static"))
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include routers
app.include_router(auth.router, prefix="/auth")
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(orders.router, prefix="/orders", tags=["orders"])

# Root endpoint for health check
@app.get("/")
async def root():
    return {"message": "Auth API is running"}

