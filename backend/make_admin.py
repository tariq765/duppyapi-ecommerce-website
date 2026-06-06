import asyncio
import sys
from app.deps import get_session_factory
from app.models import Role, User
from sqlalchemy import select

async def make_admin(email: str):
    session_factory = get_session_factory()
    async with session_factory() as session:
        # Check if role exists
        admin_role_result = await session.execute(select(Role).where(Role.name == "admin"))
        admin_role = admin_role_result.scalar_one_or_none()
        
        if not admin_role:
            admin_role = Role(name="admin")
            session.add(admin_role)
            await session.commit()
            await session.refresh(admin_role)
            print("Created 'admin' role.")

        # Find user
        user_result = await session.execute(select(User).where(User.email == email))
        user = user_result.scalar_one_or_none()
        
        if not user:
            print(f"Error: User with email '{email}' not found.")
            return

        # Update role
        user.role_id = admin_role.id
        await session.commit()
        print(f"Success: User '{email}' is now an Admin!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python make_admin.py user@example.com")
    else:
        email = sys.argv[1]
        asyncio.run(make_admin(email))
