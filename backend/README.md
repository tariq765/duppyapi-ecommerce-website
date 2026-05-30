# E-commerce Auth Backend (FastAPI)

## Setup & Running (Roman Urdu)

### 1. Requirements Install Karein
Pehle ensure karein ke aap `backend` folder ke andar hain, phir ye command chalayein:
```powershell
pip install -r requirements.txt
```

### 2. Backend Server Run Karein
Backend server chalane ke liye niche wala command use karein:
```powershell
python -m uvicorn app.main:app --reload
http://127.0.0.1:8000 
```
Yeh server `http://127.0.0.1:8000 ` par chalay ga.

---

## Technical Details (English)

### Features:
- JWT Authentication (Access & Refresh Tokens)
- Secure Password Hashing with Bcrypt
- PostgreSQL with SQLAlchemy (Async)
- Role-based Access Control (RBAC)

### Environment Variables:
Make sure you have a `.env` file in the `backend` directory with the following:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `JWT_SECRET_KEY`: A secure random string.
- `FRONTEND_ORIGIN`: `http://localhost:3000` (for CORS).

### Fixed Issues:
- Added missing `datetime` import in auth routes.
- Standardized all time comparisons to UTC (Timezone-aware).
- Fixed frontend-to-backend error handling in `AuthContext`.
