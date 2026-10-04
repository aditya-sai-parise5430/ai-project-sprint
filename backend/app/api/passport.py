"""
GET /passport/{token}

Looks up user by opaque passport_token.
Returns full dashboard payload.
"""
from fastapi import APIRouter, BackgroundTasks, HTTPException, status

from app.core.database import get_db
from app.core.config import settings
from app.data.projects import PROJECT_MAP
from app.services.referral import get_referral_count
from app.services.analytics import record_event

router = APIRouter()

MILESTONES = [1, 5, 10, 20]

WORKSHOP = {
    "title": "Build Your First AI Project in 60 Minutes",
    "date": "Coming Soon",
    "time": "6:00 PM IST",
    "platform": "Zoom",
    "join_link": "#",
}


def _compute_milestones(count: int) -> dict:
    achieved = [m for m in MILESTONES if count >= m]
    remaining = [m for m in MILESTONES if count < m]
    next_milestone = remaining[0] if remaining else None
    return {
        "current_count": count,
        "next_milestone": next_milestone,
        "achieved": achieved,
    }


@router.get("/{token}")
async def get_passport(token: str, background_tasks: BackgroundTasks):
    db = get_db()

    result = db.table("users").select(
        "id", "name", "email", "college", "year",
        "referral_code", "project_id", "created_at"
    ).eq("passport_token", token).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Passport not found. Please check your link.",
        )

    user = result.data[0]
    project_id = user["project_id"]
    project = PROJECT_MAP.get(project_id)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Project data not found.",
        )

    referral_count = get_referral_count(user["referral_code"])
    referral_link = f"{settings.FRONTEND_URL}/?ref={user['referral_code']}"

    background_tasks.add_task(
        record_event,
        event_name="referral_link_viewed",
        user_id=user["id"],
        referral_code=user["referral_code"],
    )

    return {
        "user": {
            "name": user["name"],
            "email": user["email"],
            "college": user["college"],
            "year": user["year"],
            "referral_code": user["referral_code"],
            "referral_link": referral_link,
            "referral_count": referral_count,
            "registered_at": user["created_at"],
        },
        "project": {
            "id": project["id"],
            "title": project["title"],
            "description": project["description"],
            "why_description": project["why_description"],
            "tech_stack": project["tech_stack"],
            "build_plan": project["build_plan"],
            "difficulty": project["difficulty"],
        },
        "workshop": WORKSHOP,
        "milestones": _compute_milestones(referral_count),
    }
