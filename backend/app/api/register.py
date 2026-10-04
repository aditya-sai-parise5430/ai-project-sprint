"""
POST /register

Creates a new user, generates:
  - a unique referral code
  - a cryptographically random opaque passport token (stored as-is for MVP)
  - a deterministic project recommendation

Returns the opaque passport_token for use in /passport?token=...
"""
import secrets

from fastapi import APIRouter, BackgroundTasks, HTTPException, Request, status

from app.core.database import get_db
from app.models.user import RegisterRequest, RegisterResponse
from app.services.analytics import record_event
from app.services.matcher import match_project
from app.services.referral import generate_unique_referral_code, is_valid_referral_code
from app.data.projects import PROJECT_MAP

router = APIRouter()


@router.post("", response_model=RegisterResponse, status_code=201)
async def register(
    payload: RegisterRequest,
    request: Request,
    background_tasks: BackgroundTasks,
):
    db = get_db()

    # --- Duplicate email check ---
    existing = db.table("users").select("id", "passport_token", "referral_code", "project_id") \
        .eq("email", payload.email.lower()) \
        .execute()
    if existing.data:
        row = existing.data[0]
        project = PROJECT_MAP.get(row["project_id"], {})
        return RegisterResponse(
            passport_token=row["passport_token"],
            referral_code=row["referral_code"],
            project_id=row["project_id"],
            project_title=project.get("title", ""),
        )

    # --- Validate referred_by code ---
    referred_by: str | None = None
    if payload.referred_by:
        valid, _ = is_valid_referral_code(payload.referred_by.upper())
        if valid:
            referred_by = payload.referred_by.upper()

    # --- Generate referral code and opaque passport token ---
    referral_code = generate_unique_referral_code(payload.name)
    passport_token = secrets.token_urlsafe(32)  # 256-bit cryptographically random token

    # --- Determine source ---
    source = "referral" if referred_by else "organic"
    if payload.utm_source:
        source = f"utm_{payload.utm_source}"

    # --- Match project ---
    project_id = match_project(payload.ai_interest, payload.goal, payload.year)
    project = PROJECT_MAP[project_id]

    # --- Insert user ---
    try:
        db.table("users").insert({
            "name": payload.name.strip(),
            "email": payload.email.lower(),
            "college": payload.college.strip(),
            "year": payload.year,
            "ai_interest": payload.ai_interest,
            "goal": payload.goal,
            "referral_code": referral_code,
            "referred_by": referred_by,
            "project_id": project_id,
            "passport_token": passport_token,
            "source": source,
            "utm_source": payload.utm_source,
            "utm_medium": payload.utm_medium,
            "utm_campaign": payload.utm_campaign,
        }).execute()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {exc}",
        )

    # --- Record referral relationship ---
    if referred_by:
        try:
            # Get the new user's id
            new_user = db.table("users").select("id").eq("passport_token", passport_token).execute()
            if new_user.data:
                db.table("referrals").insert({
                    "referrer_code": referred_by,
                    "referee_id": new_user.data[0]["id"],
                }).execute()
        except Exception:
            pass  # Non-critical; do not block registration

    # --- Fire analytics (background) ---
    new_user_result = db.table("users").select("id").eq("passport_token", passport_token).execute()
    new_user_id = new_user_result.data[0]["id"] if new_user_result.data else None

    background_tasks.add_task(
        record_event,
        event_name="registration_completed",
        user_id=new_user_id,
        referral_code=referred_by,
        properties={"source": source, "project_id": project_id},
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    if referred_by:
        background_tasks.add_task(
            record_event,
            event_name="referral_registration",
            user_id=new_user_id,
            referral_code=referred_by,
            properties={"referrer_code": referred_by},
        )

    return RegisterResponse(
        passport_token=passport_token,
        referral_code=referral_code,
        project_id=project_id,
        project_title=project["title"],
    )
