"""
Fire-and-forget analytics event persistence.
Errors are silently swallowed so analytics never blocks the main flow.
"""
import logging
from app.core.database import get_db

logger = logging.getLogger(__name__)


def record_event(
    event_name: str,
    session_id: str | None = None,
    user_id: str | None = None,
    referral_code: str | None = None,
    properties: dict | None = None,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> None:
    try:
        db = get_db()
        db.table("events").insert({
            "event_name": event_name,
            "session_id": session_id,
            "user_id": user_id,
            "referral_code": referral_code,
            "properties": properties or {},
            "ip_address": ip_address,
            "user_agent": user_agent,
        }).execute()
    except Exception as exc:
        logger.warning("Failed to record event %s: %s", event_name, exc)
