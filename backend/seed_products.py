import asyncio
from app.deps import get_session_factory
from app.models import Product, Role, User
from app.auth import get_password_hash
from sqlalchemy import select

products_data = [
    {
        "title": "iPhone 15 Pro",
        "slug": "iphone-15-pro",
        "description": "Experience the ultimate iPhone with a titanium design, A17 Pro chip, and a versatile Pro camera system.",
        "price": 999.0,
        "discount_percentage": 5.0,
        "rating": 4.8,
        "stock": 50,
        "brand": "Apple",
        "category": "Smartphones",
        "main_image_url": "/static/uploads/iphone_15_pro.png",
        "gallery": ["/static/uploads/iphone_15_pro.png"]
    },
    {
        "title": "MacBook Pro 16-inch",
        "slug": "macbook-pro-16-inch",
        "description": "Supercharged by M3 Max, the 16-inch MacBook Pro delivers extreme performance and outstanding battery life.",
        "price": 2499.0,
        "discount_percentage": 8.0,
        "rating": 4.9,
        "stock": 15,
        "brand": "Apple",
        "category": "Laptops",
        "main_image_url": "/static/uploads/macbook_pro.png",
        "gallery": ["/static/uploads/macbook_pro.png"]
    },
    {
        "title": "AirPods Pro 2",
        "slug": "airpods-pro-2",
        "description": "Featuring up to 2x more Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio.",
        "price": 249.0,
        "discount_percentage": 10.0,
        "rating": 4.7,
        "stock": 120,
        "brand": "Apple",
        "category": "Audio",
        "main_image_url": "/static/uploads/airpods_pro.png",
        "gallery": ["/static/uploads/airpods_pro.png"]
    },
    {
        "title": "Apple Watch Ultra 2",
        "slug": "apple-watch-ultra-2",
        "description": "The most rugged and capable Apple Watch. Designed for outdoor adventures and supercharged workouts.",
        "price": 799.0,
        "discount_percentage": 0.0,
        "rating": 4.6,
        "stock": 30,
        "brand": "Apple",
        "category": "Wearables",
        "main_image_url": "/static/uploads/apple_watch.png",
        "gallery": ["/static/uploads/apple_watch.png"]
    }
]

async def seed_data():
    session_factory = get_session_factory()
    async with session_factory() as session:
        # Create Roles
        admin_role_result = await session.execute(select(Role).where(Role.name == "admin"))
        admin_role = admin_role_result.scalar_one_or_none()
        if not admin_role:
            admin_role = Role(name="admin")
            session.add(admin_role)
            await session.commit()
            await session.refresh(admin_role)
            
        user_role_result = await session.execute(select(Role).where(Role.name == "user"))
        user_role = user_role_result.scalar_one_or_none()
        if not user_role:
            user_role = Role(name="user")
            session.add(user_role)
            await session.commit()
            await session.refresh(user_role)

        # Create default Admin user if not exists
        admin_user_result = await session.execute(select(User).where(User.email == "admin@duppystore.com"))
        admin_user = admin_user_result.scalar_one_or_none()
        if not admin_user:
            admin_user = User(
                name="Admin User",
                email="admin@duppystore.com",
                password_hash=get_password_hash("Admin1234"),
                role_id=admin_role.id
            )
            session.add(admin_user)
            await session.commit()
            print("Default admin user created: admin@duppystore.com / Admin1234")

        # Create products
        for p_data in products_data:
            existing_prod = await session.execute(select(Product).where(Product.slug == p_data["slug"]))
            if not existing_prod.scalar_one_or_none():
                prod = Product(**p_data)
                session.add(prod)
                print(f"Added product: {p_data['title']}")
        await session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
