from pydantic import BaseModel, EmailStr, field_validator
from typing import Literal, Optional


VALID_YEARS = Literal["1st", "2nd", "3rd", "Final"]
VALID_AI_INTEREST = Literal["NLP", "CV", "ML", "Automation", "Other"]
VALID_GOAL = Literal["Placement", "Internship", "Learning", "Startup"]


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    college: str
    year: VALID_YEARS
    ai_interest: VALID_AI_INTEREST
    goal: VALID_GOAL
    referred_by: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None

    @field_validator("name", "college")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field cannot be empty")
        return v.strip()


class RegisterResponse(BaseModel):
    success: bool = True
    passport_token: str
    referral_code: str
    project_id: str
    project_title: str


class LoginRequest(BaseModel):
    email: EmailStr


class LoginResponse(BaseModel):
    success: bool
    passport_token: Optional[str] = None
    message: str = ""
