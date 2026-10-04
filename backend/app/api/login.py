"""
POST /login — "Find My Passport" (MVP Option A)

Looks up user by email and returns the passport_token directly.
No email infrastructure; intentionally lightweight for 48-hour prototype.
"""
from fastapi import APIRouter, HTTPException, status
from app.core.database import get_db
from app.models.user import LoginRequest, LoginResponse

router = APIRouter()


@router.post("", response_model=LoginResponse)
async def login(payload: LoginRequest):
    db = get_db()

    result = db.table("users").select("passport_token").eq("email", payload.email.lower()).execute()

    if not result.data:
        return LoginResponse(
            success=False,
            message="No registration found for this email address.",
        )

    return LoginResponse(
        success=True,
        passport_token=result.data[0]["passport_token"],
        message="Found your passport!",
    )
