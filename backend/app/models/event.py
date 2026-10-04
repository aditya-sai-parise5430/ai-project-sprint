from pydantic import BaseModel
from typing import Optional


class EventRequest(BaseModel):
    event_name: str
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    referral_code: Optional[str] = None
    properties: Optional[dict] = None
