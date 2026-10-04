"""
GET /projects  — public project library
GET /validate-ref/{code}  — referral code validation
"""
from fastapi import APIRouter
from app.data.projects import PROJECTS
from app.services.referral import is_valid_referral_code

router = APIRouter()


@router.get("/projects")
async def list_projects():
    """Return the full project library (public)."""
    return {"projects": PROJECTS}


@router.get("/validate-ref/{code}")
async def validate_ref(code: str):
    """Check if a referral code exists and return the referrer's first name."""
    valid, name = is_valid_referral_code(code.upper())
    if valid and name:
        first_name = name.split()[0]
        return {"valid": True, "name": first_name}
    return {"valid": False}
