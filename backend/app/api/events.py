from fastapi import APIRouter, Request, BackgroundTasks
from app.models.event import EventRequest
from app.services.analytics import record_event

router = APIRouter()


@router.post("", status_code=202)
async def fire_event(
    payload: EventRequest,
    request: Request,
    background_tasks: BackgroundTasks,
):
    """
    Fire-and-forget analytics event endpoint.
    Always returns 202 Accepted immediately.
    """
    background_tasks.add_task(
        record_event,
        event_name=payload.event_name,
        session_id=payload.session_id,
        user_id=payload.user_id,
        referral_code=payload.referral_code,
        properties=payload.properties,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    return {"ok": True}
